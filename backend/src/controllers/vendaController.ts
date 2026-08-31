import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';

export const registrarVenda = async (req: Request, res: Response): Promise<void> => {
  try {
    const vendedorId = req.usuario!.id;

    const { 
      clienteId, 
      novoCliente, 
      itens, 
      produtoId, 
      quantidade, 
      valorEntrada, 
      numParcelas, 
      periodicidade, 
      primeiroVencimento, 
      dataVenda 
    } = req.body;

    const numParcelasInt = parseInt(numParcelas, 10);
    if (isNaN(numParcelasInt) || numParcelasInt <= 0) {
      res.status(400).json({ erro: 'numParcelas deve ser um número inteiro maior que zero.' });
      return;
    }

    // 1. Resolve Cliente (existente ou cria novo instantaneamente)
    let finalClienteId: number;

    if (clienteId && clienteId !== 'novo') {
      finalClienteId = parseInt(clienteId, 10);
      const clienteExistente = await prisma.cliente.findUnique({
        where: { id: finalClienteId }
      });
      if (!clienteExistente) {
        res.status(404).json({ erro: 'Cliente não encontrado.' });
        return;
      }
    } else {
      const nome = novoCliente?.nome || req.body.clienteNome || req.body.nome;
      const rua = novoCliente?.rua || req.body.rua || '';
      const numero = novoCliente?.numero || req.body.numero || '';
      const bairro = novoCliente?.bairro || req.body.bairro || '';
      const telefone = novoCliente?.telefone || req.body.telefone || 'S/N';
      const referencias = novoCliente?.referencias || req.body.referencias || '';

      if (!nome || typeof nome !== 'string' || !nome.trim()) {
        res.status(400).json({ erro: 'Selecione um cliente existente ou preencha o Nome do Cliente.' });
        return;
      }

      const partesEndereco = [rua.trim(), numero ? `Nº ${numero.trim()}` : '', bairro ? `Bairro ${bairro.trim()}` : ''].filter(Boolean);
      const enderecoCompleto = partesEndereco.length > 0 ? partesEndereco.join(', ') : 'Endereço não informado';

      const novoClienteCriado = await prisma.cliente.create({
        data: {
          nome: nome.trim(),
          telefone: telefone.trim() || 'S/N',
          endereco: enderecoCompleto,
          referencias: referencias ? referencias.trim() : null
        }
      });
      finalClienteId = novoClienteCriado.id;
    }

    // 2. Suporte para lista de itens (com nome ou id) ou produto único avulso
    let listaItensInput: Array<{ produtoId?: number; nome?: string; quantidade: number; valorUnitario?: number }> = [];

    if (Array.isArray(itens) && itens.length > 0) {
      listaItensInput = itens.map((item: any) => ({
        produtoId: item.produtoId ? parseInt(item.produtoId, 10) : undefined,
        nome: item.nome || item.nomeProduto || undefined,
        quantidade: item.quantidade ? parseInt(item.quantidade, 10) : 1,
        valorUnitario: item.valorUnitario ? parseFloat(item.valorUnitario) : (item.valor ? parseFloat(item.valor) : undefined)
      }));
    } else if (req.body.nomeProduto || req.body.nome) {
      listaItensInput = [{
        nome: req.body.nomeProduto || req.body.nome,
        quantidade: quantidade ? parseInt(quantidade, 10) : 1,
        valorUnitario: req.body.valorProduto ? parseFloat(req.body.valorProduto) : (req.body.valorUnitario ? parseFloat(req.body.valorUnitario) : 0)
      }];
    } else if (produtoId) {
      listaItensInput = [{
        produtoId: parseInt(produtoId, 10),
        quantidade: quantidade ? parseInt(quantidade, 10) : 1,
        valorUnitario: req.body.valorUnitario ? parseFloat(req.body.valorUnitario) : undefined
      }];
    } else {
      res.status(400).json({
        erro: 'Informe o Nome e Valor do Produto vendido.'
      });
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
      let prodId = item.produtoId;
      let unitPrice = item.valorUnitario || 0;

      if (prodId && !isNaN(prodId)) {
        const prodExistente = await prisma.produto.findUnique({ where: { id: prodId } });
        if (prodExistente) {
          if (!unitPrice || unitPrice <= 0) unitPrice = Number(prodExistente.preco);
        } else {
          prodId = undefined;
        }
      }

      if (!prodId) {
        const nomeProd = item.nome && item.nome.trim() ? item.nome.trim() : 'Produto Diversos';
        let prodEncontrado = await prisma.produto.findFirst({ where: { nome: nomeProd } });

        if (!prodEncontrado) {
          prodEncontrado = await prisma.produto.create({
            data: {
              nome: nomeProd,
              preco: unitPrice > 0 ? unitPrice : 100,
              categoria: 'MOVEIS'
            }
          });
        }
        prodId = prodEncontrado.id;
        if (!unitPrice || unitPrice <= 0) unitPrice = Number(prodEncontrado.preco);
      }

      const qtd = item.quantidade > 0 ? item.quantidade : 1;
      const subtotalNum = Math.round((unitPrice * qtd) * 100) / 100;
      valorTotalCalculado += subtotalNum;

      itensParaCriar.push({
        produtoId: prodId,
        quantidade: qtd,
        valorUnitario: unitPrice,
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

    // 3. Definir multiplicador de frequência (Mensal = 1x, Quinzenal = 2x/mês, Semanal = 4x/mês)
    const periodicidadeNormalizada = (periodicidade || 'MENSAL').toString().toUpperCase();
    const multiplicador = periodicidadeNormalizada === 'SEMANAL' ? 4 : periodicidadeNormalizada === 'QUINZENAL' ? 2 : 1;
    const numParcelasEfetivas = numParcelasInt * multiplicador;

    // Valor financiado que será dividido nas parcelas efetivas
    const valorFinanciado = valorTotalNum - valorEntradaNum;
    const baseParcela = Math.floor((valorFinanciado / numParcelasEfetivas) * 100) / 100;
    const restoCentavos = Math.round((valorFinanciado - (baseParcela * numParcelasEfetivas)) * 100) / 100;

    // Transação atômica de criação de Venda, ItemVenda e Parcelas
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Criar Venda
      const venda = await tx.venda.create({
        data: {
          clienteId: finalClienteId,
          vendedorId: vendedorId,
          valorTotal: valorTotalNum,
          valorEntrada: valorEntradaNum > 0 ? valorEntradaNum : null,
          numParcelas: numParcelasEfetivas,
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

      // 3. Gerar o carnê de parcelas (MENSAL, QUINZENAL ou SEMANAL)
      const parcelasParaCriar = [];

      let baseVencimentoDate: Date;
      if (primeiroVencimento && typeof primeiroVencimento === 'string' && primeiroVencimento.includes('-')) {
        const [yyyy, mm, dd] = primeiroVencimento.split('-').map(Number);
        baseVencimentoDate = new Date(yyyy, mm - 1, dd);
      } else {
        baseVencimentoDate = new Date(dataVendaBase);
        if (periodicidadeNormalizada === 'SEMANAL') {
          baseVencimentoDate.setDate(baseVencimentoDate.getDate() + 7);
        } else if (periodicidadeNormalizada === 'QUINZENAL') {
          baseVencimentoDate.setDate(baseVencimentoDate.getDate() + 15);
        } else {
          baseVencimentoDate.setMonth(baseVencimentoDate.getMonth() + 1);
        }
      }

      for (let i = 1; i <= numParcelasEfetivas; i++) {
        const dataVencimento = new Date(baseVencimentoDate);
        if (i > 1) {
          if (periodicidadeNormalizada === 'SEMANAL') {
            dataVencimento.setDate(dataVencimento.getDate() + (i - 1) * 7);
          } else if (periodicidadeNormalizada === 'QUINZENAL') {
            dataVencimento.setDate(dataVencimento.getDate() + (i - 1) * 15);
          } else {
            // MENSAL
            dataVencimento.setMonth(dataVencimento.getMonth() + (i - 1));
          }
        }

        const valorParcela = i === numParcelasEfetivas ? baseParcela + restoCentavos : baseParcela;

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

// Retorna data de hoje no fuso local Brasil (YYYY-MM-DD)
function getHojeLocalVendasStr(): string {
  const agora = new Date();
  const localOffsetMs = 3 * 60 * 60 * 1000;
  const dataBR = new Date(agora.getTime() - localOffsetMs);
  return dataBR.toISOString().substring(0, 10);
}

/**
 * GET /vendas/dias-fechados
 * Retorna as datas anteriores ao dia atual que possuem vendas fechadas
 */
export const listarDiasFechadosVendas = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const hojeStr = getHojeLocalVendasStr();

    const filtroVendedor = usuario.perfil === 'GERENTE' 
      ? {} 
      : { vendedorId: usuario.id };

    const vendas = await prisma.venda.findMany({
      where: filtroVendedor,
      orderBy: { dataVenda: 'desc' }
    });

    const mapaDias = new Map<string, { data: string; totalVendido: number; qtdVendas: number }>();

    for (const v of vendas) {
      const dataIso = typeof v.dataVenda === 'string'
        ? v.dataVenda.split('T')[0]
        : v.dataVenda.toISOString().split('T')[0];

      // Regra: Não exibe o dia atual (o extrato do dia só fecha após o dia finalizar)
      if (dataIso >= hojeStr) {
        continue;
      }

      const val = Number(v.valorTotal);

      if (!mapaDias.has(dataIso)) {
        mapaDias.set(dataIso, {
          data: dataIso,
          totalVendido: val,
          qtdVendas: 1
        });
      } else {
        const item = mapaDias.get(dataIso)!;
        item.totalVendido += val;
        item.qtdVendas += 1;
      }
    }

    const listaDias = Array.from(mapaDias.values()).map(d => ({
      ...d,
      totalVendido: Math.round(d.totalVendido * 100) / 100
    })).sort((a, b) => b.data.localeCompare(a.data));

    res.json(listaDias);
  } catch (error) {
    console.error('Erro ao listar dias fechados de vendas:', error);
    res.status(500).json({ erro: 'Erro interno ao consultar histórico de vendas fechadas.' });
  }
};

/**
 * GET /vendas/extrato-dia?data=YYYY-MM-DD
 * Retorna o extrato detalhado de vendas de um dia específico para exibição em tabela estilo Excel
 */
export const obterExtratoDiaVendas = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const { data } = req.query;

    if (!data || typeof data !== 'string') {
      res.status(400).json({ erro: 'A data do extrato é obrigatória no formato YYYY-MM-DD.' });
      return;
    }

    const dataIso = data.trim().split('T')[0];
    const hojeStr = getHojeLocalVendasStr();

    if (dataIso >= hojeStr) {
      res.status(400).json({ 
        erro: 'O extrato de vendas do dia atual ainda está em andamento e só fica disponível após o fechamento do dia. Acompanhe o dia de hoje na aba Resumo Dia.' 
      });
      return;
    }

    const filtroVendedor = usuario.perfil === 'GERENTE' 
      ? {} 
      : { vendedorId: usuario.id };

    const inicioDia = new Date(`${dataIso}T00:00:00.000Z`);
    const fimDia = new Date(`${dataIso}T23:59:59.999Z`);

    const vendas = await prisma.venda.findMany({
      where: {
        ...filtroVendedor,
        dataVenda: {
          gte: inicioDia,
          lte: fimDia
        }
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            endereco: true
          }
        },
        itens: {
          include: {
            produto: true
          }
        },
        parcelas: {
          orderBy: { numero: 'asc' }
        },
        vendedor: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    const itensExtrato = vendas.map((v, index) => {
      const itensDesc = v.itens?.map(i => `${i.quantidade}x ${i.produto?.nome || 'Item'}`).join(', ') || 'Produtos';
      
      const valEntrada = Number(v.valorEntrada || 0);
      const parcelasInfo = v.parcelas?.length 
        ? `${v.parcelas.length}x R$ ${Number(v.parcelas[0].valor).toFixed(2)}`
        : '';
      const condicao = valEntrada > 0 
        ? `Entrada R$ ${valEntrada.toFixed(2)}${parcelasInfo ? ` + ${parcelasInfo}` : ''}`
        : parcelasInfo || 'À vista';

      return {
        ordem: index + 1,
        id: v.id,
        clienteId: v.clienteId,
        clienteNome: v.cliente?.nome || 'Cliente não identificado',
        clienteTelefone: v.cliente?.telefone || '',
        clienteEndereco: v.cliente?.endereco || '',
        itens: itensDesc,
        condicao,
        valorEntrada: valEntrada,
        numParcelas: v.parcelas?.length || 0,
        valorTotal: Number(v.valorTotal),
        dataVenda: v.dataVenda,
        criadoEm: v.criadoEm
      };
    });

    const totalVendido = itensExtrato.reduce((acc, item) => acc + item.valorTotal, 0);

    res.json({
      data: dataIso,
      totalVendido: Math.round(totalVendido * 100) / 100,
      qtdVendas: itensExtrato.length,
      itens: itensExtrato
    });
  } catch (error) {
    console.error('Erro ao obter extrato de vendas do dia:', error);
    res.status(500).json({ erro: 'Erro interno ao consultar extrato diário de vendas.' });
  }
};

