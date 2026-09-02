import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';

/**
 * Função auxiliar que calcula o total vendido (separado por MOVEIS e VARIEDADES) e o total cobrado
 */
async function calcularPrestacaoContasDia(usuarioId: number, dataIso: string) {
  const inicioDia = new Date(`${dataIso}T00:00:00.000Z`);
  const fimDia = new Date(`${dataIso}T23:59:59.999Z`);

  // 1. Vendas do dia com os seus itens, produtos e cliente
  const vendasDia = await prisma.venda.findMany({
    where: {
      vendedorId: usuarioId,
      dataVenda: {
        gte: inicioDia,
        lte: fimDia
      }
    },
    include: {
      cliente: true,
      itens: {
        include: {
          produto: true
        }
      },
      parcelas: {
        orderBy: { numero: 'asc' }
      }
    },
    orderBy: { id: 'desc' }
  });

  let totalVendidoMoveis = 0;
  let totalVendidoVariedades = 0;
  let totalVendido = 0;

  const vendasDetalhes = vendasDia.map(v => {
    const totalVenda = Number(v.valorTotal);
    totalVendido += totalVenda;

    const itensNomes = v.itens.map(i => `${i.quantidade}x ${i.produto?.nome || 'Item'}`).join(', ');
    const nomeProdutoPrincipal = v.itens.map(i => i.produto?.nome).filter(Boolean).join(', ') || 'Produto';

    // Usa o tipoVenda da venda (não a categoria do produto), pois os produtos
    // são criados automaticamente e sempre têm categoria MOVEIS por padrão.
    if (v.tipoVenda === 'VARIEDADES') {
      totalVendidoVariedades += totalVenda;
    } else {
      totalVendidoMoveis += totalVenda;
    }

    const valEntrada = Number(v.valorEntrada || 0);
    const parcelasInfo = v.parcelas?.length 
      ? `${v.parcelas.length}x R$ ${Number(v.parcelas[0].valor).toFixed(2)}` 
      : '';
    const condicao = valEntrada > 0 
      ? `Entrada R$ ${valEntrada.toFixed(2)}${parcelasInfo ? ` + ${parcelasInfo}` : ''}`
      : parcelasInfo || 'À vista';

    return {
      id: v.id,
      clienteId: v.clienteId,
      clienteNome: v.cliente?.nome || 'Cliente não identificado',
      clienteTelefone: v.cliente?.telefone || '',
      nomeProduto: nomeProdutoPrincipal,
      itensDesc: itensNomes,
      condicao,
      valorTotal: totalVenda,
      dataVenda: v.dataVenda
    };
  });

  // 2. Pagamentos recebidos no dia (busca da tabela Pagamento para garantir fidelidade das transações)
  const pagamentosDia = await prisma.pagamento.findMany({
    where: {
      cobradorId: usuarioId,
      dataPagamento: {
        gte: inicioDia,
        lte: fimDia
      }
    },
    include: {
      cliente: true,
      venda: {
        include: {
          itens: {
            include: {
              produto: true
            }
          }
        }
      }
    },
    orderBy: { id: 'desc' }
  });

  let totalCobrado = 0;
  const cobrancasDetalhes = pagamentosDia.map(p => {
    const valPago = Number(p.valorPago);
    totalCobrado += valPago;

    const nomesItens = p.venda?.itens?.map(i => i.produto?.nome).filter(Boolean).join(', ');
    const produtoNome = nomesItens || `Venda #${p.vendaId}`;

    return {
      id: p.id,
      clienteId: p.clienteId,
      clienteNome: p.cliente?.nome || 'Cliente não identificado',
      clienteTelefone: p.cliente?.telefone || '',
      valorPago: valPago,
      produtoNome,
      detalhes: p.detalhes || '',
      dataPagamento: p.dataPagamento,
      criadoEm: p.criadoEm
    };
  });

  // Fallback caso seja dia legado sem registros na tabela Pagamento:
  if (pagamentosDia.length === 0) {
    const parcelasLegadas = await prisma.parcela.findMany({
      where: {
        cobradorId: usuarioId,
        status: { in: [StatusParcela.PAGA, StatusParcela.PARCIAL] },
        dataPagamento: {
          gte: inicioDia,
          lte: fimDia
        }
      },
      include: {
        venda: {
          include: {
            cliente: true,
            itens: { include: { produto: true } }
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    for (const parc of parcelasLegadas) {
      const val = parc.valorPago ? Number(parc.valorPago) : 0;
      totalCobrado += val;
      const nomes = parc.venda?.itens?.map(i => i.produto?.nome).filter(Boolean).join(', ') || `Venda #${parc.vendaId}`;
      cobrancasDetalhes.push({
        id: parc.id,
        clienteId: parc.venda?.clienteId || 0,
        clienteNome: parc.venda?.cliente?.nome || 'Cliente',
        clienteTelefone: parc.venda?.cliente?.telefone || '',
        valorPago: val,
        produtoNome: nomes,
        detalhes: `Parcela #${parc.numero}`,
        dataPagamento: parc.dataPagamento || new Date(),
        criadoEm: parc.dataPagamento || new Date()
      });
    }
  }

  return {
    totalVendido: Math.round(totalVendido * 100) / 100,
    totalVendidoMoveis: Math.round(totalVendidoMoveis * 100) / 100,
    totalVendidoVariedades: Math.round(totalVendidoVariedades * 100) / 100,
    totalCobrado: Math.round(totalCobrado * 100) / 100,
    qtdVendas: vendasDetalhes.length,
    qtdCobrancas: cobrancasDetalhes.length,
    vendasDetalhes,
    cobrancasDetalhes
  };
}

export const obterPrestacaoContasProprioDia = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const { data } = req.query;

    const dataIso = typeof data === 'string' && data.trim() !== ''
      ? data.trim()
      : new Date().toISOString().substring(0, 10);

    const resumo = await calcularPrestacaoContasDia(usuario.id, dataIso);

    res.json({
      usuarioId: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
      data: dataIso,
      ...resumo
    });
  } catch (error) {
    console.error('Erro na prestação de contas do próprio dia:', error);
    res.status(500).json({ erro: 'Erro interno ao calcular prestação de contas diária.' });
  }
};

export const obterPrestacaoContasFuncionarioDia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuarioId: idParam } = req.params;
    const idStr = Array.isArray(idParam) ? idParam[0] : idParam;
    const usuarioAlvoId = parseInt(idStr, 10);
    const usuarioLogado = req.usuario!;

    if (isNaN(usuarioAlvoId)) {
      res.status(400).json({ erro: 'ID de usuário inválido.' });
      return;
    }

    if (usuarioLogado.perfil !== 'GERENTE' && usuarioLogado.id !== usuarioAlvoId) {
      res.status(403).json({ erro: 'Acesso negado: Apenas o Gerente pode consultar a prestação de contas de outros funcionários.' });
      return;
    }

    const funcionario = await prisma.usuario.findUnique({
      where: { id: usuarioAlvoId },
      select: { id: true, nome: true, email: true, perfil: true }
    });

    if (!funcionario) {
      res.status(404).json({ erro: 'Funcionário não encontrado.' });
      return;
    }

    const { data } = req.query;
    const dataIso = typeof data === 'string' && data.trim() !== ''
      ? data.trim()
      : new Date().toISOString().substring(0, 10);

    const resumo = await calcularPrestacaoContasDia(funcionario.id, dataIso);

    res.json({
      usuario: funcionario,
      data: dataIso,
      ...resumo
    });
  } catch (error) {
    console.error('Erro na prestação de contas por funcionário:', error);
    res.status(500).json({ erro: 'Erro interno ao calcular prestação de contas por funcionário.' });
  }
};
