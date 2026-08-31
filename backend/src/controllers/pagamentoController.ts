import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

// Retorna data de hoje no fuso local Brasil (YYYY-MM-DD)
function getHojeLocalStr(): string {
  const agora = new Date();
  // Fuso -3h Brasil
  const localOffsetMs = 3 * 60 * 60 * 1000;
  const dataBR = new Date(agora.getTime() - localOffsetMs);
  return dataBR.toISOString().substring(0, 10);
}

/**
 * GET /pagamentos/dias-fechados
 * Retorna as datas anteriores ao dia atual que possuem recebimentos de cobrança fechados
 */
export const listarDiasFechados = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const hojeStr = getHojeLocalStr();

    const filtroCobrador = usuario.perfil === 'GERENTE' 
      ? {} 
      : { cobradorId: usuario.id };

    // Busca todos os pagamentos do cobrador
    const pagamentos = await prisma.pagamento.findMany({
      where: filtroCobrador,
      orderBy: { dataPagamento: 'desc' }
    });

    // Agrupa por dia (YYYY-MM-DD)
    const mapaDias = new Map<string, { data: string; totalCobrado: number; qtdPagamentos: number }>();

    for (const p of pagamentos) {
      const dataIso = typeof p.dataPagamento === 'string'
        ? p.dataPagamento.split('T')[0]
        : p.dataPagamento.toISOString().split('T')[0];

      // Regra: Não exibe o dia atual (o extrato do dia só fecha após o dia finalizar)
      if (dataIso >= hojeStr) {
        continue;
      }

      const val = Number(p.valorPago);

      if (!mapaDias.has(dataIso)) {
        mapaDias.set(dataIso, {
          data: dataIso,
          totalCobrado: val,
          qtdPagamentos: 1
        });
      } else {
        const item = mapaDias.get(dataIso)!;
        item.totalCobrado += val;
        item.qtdPagamentos += 1;
      }
    }

    // Ordena do dia mais recente para o mais antigo
    const listaDias = Array.from(mapaDias.values()).map(d => ({
      ...d,
      totalCobrado: Math.round(d.totalCobrado * 100) / 100
    })).sort((a, b) => b.data.localeCompare(a.data));

    res.json(listaDias);
  } catch (error) {
    console.error('Erro ao listar dias fechados:', error);
    res.status(500).json({ erro: 'Erro interno ao consultar histórico de dias fechados.' });
  }
};

/**
 * GET /pagamentos/extrato-dia?data=YYYY-MM-DD
 * Retorna o extrato detalhado de um dia específico para exibição em tabela estilo Excel
 */
export const obterExtratoDia = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const { data } = req.query;

    if (!data || typeof data !== 'string') {
      res.status(400).json({ erro: 'A data do extrato é obrigatória no formato YYYY-MM-DD.' });
      return;
    }

    const dataIso = data.trim().split('T')[0];
    const hojeStr = getHojeLocalStr();

    // Bloqueia consulta do dia atual com mensagem explicativa
    if (dataIso >= hojeStr) {
      res.status(400).json({ 
        erro: 'O extrato do dia atual ainda está em andamento e só fica disponível após o fechamento do dia. Acompanhe o dia de hoje na aba Resumo Dia.' 
      });
      return;
    }

    const filtroCobrador = usuario.perfil === 'GERENTE' 
      ? {} 
      : { cobradorId: usuario.id };

    const inicioDia = new Date(`${dataIso}T00:00:00.000Z`);
    const fimDia = new Date(`${dataIso}T23:59:59.999Z`);

    const pagamentos = await prisma.pagamento.findMany({
      where: {
        ...filtroCobrador,
        dataPagamento: {
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
        venda: {
          include: {
            itens: {
              include: {
                produto: true
              }
            }
          }
        },
        cobrador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    const itensExtrato = pagamentos.map((p, index) => {
      const nomesItens = p.venda?.itens?.map(i => i.produto?.nome).filter(Boolean).join(', ');
      const produtoDesc = nomesItens || `Venda #${p.vendaId}`;

      return {
        ordem: index + 1,
        id: p.id,
        clienteId: p.clienteId,
        clienteNome: p.cliente?.nome || 'Cliente não identificado',
        clienteTelefone: p.cliente?.telefone || '',
        clienteEndereco: p.cliente?.endereco || '',
        vendaId: p.vendaId,
        parcelaId: p.parcelaId,
        produto: produtoDesc,
        detalhes: p.detalhes || '',
        valorPago: Number(p.valorPago),
        dataPagamento: p.dataPagamento,
        criadoEm: p.criadoEm
      };
    });

    const totalCobrado = itensExtrato.reduce((acc, item) => acc + item.valorPago, 0);

    res.json({
      data: dataIso,
      totalCobrado: Math.round(totalCobrado * 100) / 100,
      qtdPagamentos: itensExtrato.length,
      itens: itensExtrato
    });
  } catch (error) {
    console.error('Erro ao obter extrato do dia:', error);
    res.status(500).json({ erro: 'Erro interno ao consultar extrato diário.' });
  }
};
