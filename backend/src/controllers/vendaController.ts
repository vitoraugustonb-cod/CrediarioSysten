import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';

export const registrarVenda = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendedorId = req.usuario!.id;

    const { clienteId, itens, produtoId, quantidade, valorEntrada, numParcelas, dataVenda } = req.body;

    if (!clienteId || !numParcelas) {
      res.status(400).json({
        erro: 'clienteId e numParcelas são obrigatórios.'
      });
      return;
    }

    // Suporte tanto para o formato novo (itens array) quanto para o formato legado (produtoId único)
    let listaItensInput: Array<{ produtoId: number; quantidade: number }> = [];

    if (Array.isArray(itens) && itens.length > 0) {
      listaItensInput = itens.map((item: any) => ({
        produtoId: parseInt(item.produtoId, 10),
        quantidade: item.quantidade ? parseInt(item.quantidade, 10) : 1
      }));
    } else if (produtoId) {
      listaItensInput = [{
        produtoId: parseInt(produtoId, 10),
        quantidade: quantidade ? parseInt(quantidade, 10) : 1
      }];
    } else {
      res.status(400).json({
        erro: 'É necessário informar ao menos um produto no campo "itens".'
      });
      return;
    }

    const numParcelasInt = parseInt(numParcelas, 10);
    if (isNaN(numParcelasInt) || numParcelasInt <= 0) {
      res.status(400).json({ erro: 'numParcelas deve ser um número inteiro maior que zero.' });
      return;
    }

    // Valida existência do cliente
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: parseInt(clienteId, 10) }
    });
    if (!clienteExistente) {
      res.status(404).json({ erro: 'Cliente não encontrado.' });
      return;
    }

    interface ItemParaCriar {
      produtoId: number;
      quantidade: number;
      valorUnitario: number;
      subtotal: number;
    }

    // Processa os produtos e calcula subtotais e valorTotal da venda
    const itensParaCriar: ItemParaCriar[] = [];
    let valorTotalCalculado = 0;

    for (const item of listaItensInput) {
      if (isNaN(item.produtoId) || item.quantidade <= 0) {
        res.status(400).json({ erro: 'Item de venda inválido: produtoId e quantidade devem ser válidos.' });
        return;
      }

      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId }
      });

      if (!produto) {
        res.status(404).json({ erro: `Produto com ID ${item.produtoId} não encontrado.` });
        return;
      }

      const valorUnitarioNum = Number(produto.preco);
      const subtotalNum = Math.round((valorUnitarioNum * item.quantidade) * 100) / 100;
      valorTotalCalculado += subtotalNum;

      itensParaCriar.push({
        produtoId: produto.id,
        quantidade: item.quantidade,
        valorUnitario: valorUnitarioNum,
        subtotal: subtotalNum
      });
    }

    const valorTotalNum = Math.round(valorTotalCalculado * 100) / 100;
    const valorEntradaNum = valorEntrada ? parseFloat(valorEntrada) : 0;

    if (isNaN(valorEntradaNum) || valorEntradaNum < 0 || valorEntradaNum >= valorTotalNum) {
      res.status(400).json({ erro: 'valorEntrada deve ser maior ou igual a zero e menor que o valorTotal.' });
      return;
    }

    const dataVendaBase = dataVenda ? new Date(dataVenda) : new Date();

    // Valor financiado que será dividido nas parcelas
    const valorFinanciado = valorTotalNum - valorEntradaNum;
    const baseParcela = Math.floor((valorFinanciado / numParcelasInt) * 100) / 100;
    const restoCentavos = Math.round((valorFinanciado - (baseParcela * numParcelasInt)) * 100) / 100;

    // Transação atômica de criação de Venda, ItemVenda e Parcelas
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Criar Venda
      const venda = await tx.venda.create({
        data: {
          clienteId: parseInt(clienteId, 10),
          vendedorId: vendedorId,
          valorTotal: valorTotalNum,
          valorEntrada: valorEntradaNum > 0 ? valorEntradaNum : null,
          numParcelas: numParcelasInt,
          dataVenda: dataVendaBase
        }
      });

      // 2. Criar os itens da venda (ItemVenda)
      for (const item of itensParaCriar) {
        await tx.itemVenda.create({
          data: {
            vendaId: venda.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            subtotal: item.subtotal
          }
        });
      }

      // 3. Gerar o carnê de parcelas
      const parcelasParaCriar = [];
      for (let i = 1; i <= numParcelasInt; i++) {
        const dataVencimento = new Date(dataVendaBase);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);

        const valorParcela = i === numParcelasInt ? baseParcela + restoCentavos : baseParcela;

        parcelasParaCriar.push({
          vendaId: venda.id,
          cobradorId: vendedorId,
          numero: i,
          valor: valorParcela,
          dataVencimento,
          status: StatusParcela.PENDENTE
        });
      }

      await tx.parcela.createMany({
        data: parcelasParaCriar
      });

      // Retorna a venda completa criada com seus itens e parcelas
      return await tx.venda.findUnique({
        where: { id: venda.id },
        include: {
          cliente: true,
          vendedor: { select: { id: true, nome: true, email: true, perfil: true } },
          itens: {
            include: {
              produto: { select: { id: true, nome: true, descricao: true, preco: true, categoria: true } }
            }
          },
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

export const listarVendas = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const { dataInicio, dataFim } = req.query;

    const ondeFiltro: any = usuario.perfil === 'GERENTE'
      ? {}
      : { vendedorId: usuario.id };

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
        vendedor: { select: { id: true, nome: true, email: true, perfil: true } },
        itens: {
          include: {
            produto: { select: { id: true, nome: true, descricao: true, preco: true, categoria: true } }
          }
        },
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
        vendedor: { select: { id: true, nome: true, email: true, perfil: true } },
        itens: {
          include: {
            produto: { select: { id: true, nome: true, descricao: true, preco: true, categoria: true } }
          }
        },
        parcelas: { orderBy: { numero: 'asc' } }
      }
    });

    if (!venda) {
      res.status(404).json({ erro: 'Venda não encontrada.' });
      return;
    }

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
