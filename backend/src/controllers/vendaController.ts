import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';

export const registrarVenda = async (req: Request, res: Response): Promise<void> => {
  try {
    // 🔒 REQUISITO OBRIGATÓRIO DE SEGURANÇA:
    // O vendedorId é extraído EXCLUSIVAMENTE do token JWT do usuário autenticado (req.usuario.id).
    // Qualquer parâmetro 'vendedorId' que venha no req.body é ignorado por segurança.
    const vendedorId = req.usuario!.id;

    const { clienteId, produtoId, valorTotal, valorEntrada, numParcelas, dataVenda } = req.body;

    if (!clienteId || !produtoId || valorTotal === undefined || !numParcelas) {
      res.status(400).json({
        erro: 'clienteId, produtoId, valorTotal e numParcelas são obrigatórios.'
      });
      return;
    }

    const numParcelasInt = parseInt(numParcelas, 10);
    if (isNaN(numParcelasInt) || numParcelasInt <= 0) {
      res.status(400).json({ erro: 'numParcelas deve ser um número inteiro maior que zero.' });
      return;
    }

    const valorTotalNum = parseFloat(valorTotal);
    const valorEntradaNum = valorEntrada ? parseFloat(valorEntrada) : 0;

    if (isNaN(valorTotalNum) || valorTotalNum <= 0) {
      res.status(400).json({ erro: 'valorTotal deve ser um número válido maior que zero.' });
      return;
    }

    if (isNaN(valorEntradaNum) || valorEntradaNum < 0 || valorEntradaNum >= valorTotalNum) {
      res.status(400).json({ erro: 'valorEntrada deve ser maior ou igual a zero e menor que o valorTotal.' });
      return;
    }

    // Valida existência do cliente e do produto
    const clienteExistente = await prisma.cliente.findUnique({ where: { id: parseInt(clienteId, 10) } });
    if (!clienteExistente) {
      res.status(404).json({ erro: 'Cliente não encontrado.' });
      return;
    }

    const produtoExistente = await prisma.produto.findUnique({ where: { id: parseInt(produtoId, 10) } });
    if (!produtoExistente) {
      res.status(404).json({ erro: 'Produto não encontrado.' });
      return;
    }

    const dataVendaBase = dataVenda ? new Date(dataVenda) : new Date();

    // Valor financiado que será dividido nas parcelas
    const valorFinanciado = valorTotalNum - valorEntradaNum;
    const baseParcela = Math.floor((valorFinanciado / numParcelasInt) * 100) / 100;
    const restoCentavos = Math.round((valorFinanciado - (baseParcela * numParcelasInt)) * 100) / 100;

    // Executa a criação da venda e das parcelas em uma transação atômica
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Cria o registro da Venda vinculando ao vendedorId do TOKEN JWT
      const venda = await tx.venda.create({
        data: {
          clienteId: parseInt(clienteId, 10),
          produtoId: parseInt(produtoId, 10),
          vendedorId: vendedorId, // 🔒 Fonte segura via JWT
          valorTotal: valorTotalNum,
          valorEntrada: valorEntradaNum > 0 ? valorEntradaNum : null,
          numParcelas: numParcelasInt,
          dataVenda: dataVendaBase
        }
      });

      // 2. Gerar o carnê de parcelas (RF09 & RF10)
      const parcelasParaCriar = [];

      for (let i = 1; i <= numParcelasInt; i++) {
        // Vencimento mensal (i meses após a data da venda)
        const dataVencimento = new Date(dataVendaBase);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);

        // A última parcela recebe os centavos residuais de arredondamento
        const valorParcela = i === numParcelasInt ? baseParcela + restoCentavos : baseParcela;

        parcelasParaCriar.push({
          vendaId: venda.id,
          cobradorId: vendedorId, // RF10: mesmo vendedorId da venda
          numero: i,
          valor: valorParcela,
          dataVencimento,
          status: StatusParcela.PENDENTE
        });
      }

      await tx.parcela.createMany({
        data: parcelasParaCriar
      });

      // Retorna a venda completa criada com suas parcelas
      return await tx.venda.findUnique({
        where: { id: venda.id },
        include: {
          cliente: true,
          produto: true,
          vendedor: { select: { id: true, nome: true, email: true, perfil: true } },
          parcelas: { orderBy: { numero: 'asc' } }
        }
      });
    });

    res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro ao registrar venda:', error);
    res.status(500).json({ erro: 'Erro interno ao registrar venda.' });
  }
};

/**
 * GET /vendas (com suporte aos filtros por período dataInicio e dataFim - RF15)
 */
export const listarVendas = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const { dataInicio, dataFim } = req.query;

    // Filtro por Usuário (GERENTE vê todas; VENDEDOR_COBRADOR vê apenas as suas)
    const ondeFiltro: any = usuario.perfil === 'GERENTE'
      ? {}
      : { vendedorId: usuario.id };

    // RF15: Filtro por Período em dataVenda
    if (dataInicio || dataFim) {
      ondeFiltro.dataVenda = {};
      if (dataInicio && typeof dataInicio === 'string') {
        ondeFiltro.dataVenda.gte = new Date(`${dataInicio}T00:00:00.000Z`);
      }
      if (dataFim && typeof dataFim === 'string') {
        ondeFiltro.dataVenda.lte = new Date(`${dataFim}T23:59:59.999Z`);
      }
    }

    const vendas = await prisma.venda.findMany({
      where: ondeFiltro,
      include: {
        cliente: true,
        produto: true,
        vendedor: { select: { id: true, nome: true, email: true, perfil: true } },
        parcelas: { orderBy: { numero: 'asc' } }
      },
      orderBy: { dataVenda: 'desc' }
    });

    res.json(vendas);
  } catch (error) {
    console.error('Erro ao listar vendas:', error);
    res.status(500).json({ erro: 'Erro interno ao listar vendas.' });
  }
};

export const obterVendaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const vendaId = parseInt(idStr, 10);
    const usuario = req.usuario!;

    if (isNaN(vendaId)) {
      res.status(400).json({ erro: 'ID de venda inválido.' });
      return;
    }

    const venda = await prisma.venda.findUnique({
      where: { id: vendaId },
      include: {
        cliente: true,
        produto: true,
        vendedor: { select: { id: true, nome: true, email: true, perfil: true } },
        parcelas: { orderBy: { numero: 'asc' } }
      }
    });

    if (!venda) {
      res.status(404).json({ erro: 'Venda não encontrada.' });
      return;
    }

    // Regra de segurança: VENDEDOR_COBRADOR só pode visualizar suas próprias vendas
    if (usuario.perfil !== 'GERENTE' && venda.vendedorId !== usuario.id) {
      res.status(403).json({ erro: 'Acesso negado: você não tem permissão para visualizar esta venda.' });
      return;
    }

    res.json(venda);
  } catch (error) {
    console.error('Erro ao obter venda:', error);
    res.status(500).json({ erro: 'Erro interno ao obter detalhes da venda.' });
  }
};
