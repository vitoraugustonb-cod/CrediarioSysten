import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';

/**
 * RF17: Função auxiliar que atualiza automaticamente no banco todas as parcelas
 * pendentes/parciais cuja data de vencimento seja anterior ao dia atual.
 */
export const atualizarStatusParcelasAtrasadas = async (): Promise<void> => {
  const agora = new Date();
  await prisma.parcela.updateMany({
    where: {
      status: { in: [StatusParcela.PENDENTE, StatusParcela.PARCIAL] },
      dataVencimento: { lt: agora }
    },
    data: {
      status: StatusParcela.ATRASADA
    }
  });
};

/**
 * RF11: Visualizar lista de clientes com parcelas em aberto ou em atraso (GET /parcelas)
 */
export const listarParcelas = async (req: Request, res: Response): Promise<void> => {
  try {
    await atualizarStatusParcelasAtrasadas();

    const usuario = req.usuario!;

    const cobradorFiltro = usuario.perfil === 'GERENTE'
      ? {}
      : { cobradorId: usuario.id };

    const parcelas = await prisma.parcela.findMany({
      where: {
        ...cobradorFiltro,
        status: { in: [StatusParcela.PENDENTE, StatusParcela.ATRASADA, StatusParcela.PARCIAL] }
      },
      include: {
        cobrador: { select: { id: true, nome: true, email: true } },
        venda: {
          include: {
            cliente: true,
            itens: { include: { produto: true } }
          }
        }
      },
      orderBy: { dataVencimento: 'asc' }
    });

    res.json(parcelas);
  } catch (error) {
    console.error('Erro ao listar parcelas:', error);
    res.status(500).json({ erro: 'Erro interno ao listar parcelas para cobrança.' });
  }
};

/**
 * RF15: Histórico próprio de cobranças por período (GET /parcelas/historico)
 */
export const listarHistoricoParcelas = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const { dataInicio, dataFim } = req.query;

    const cobradorFiltro = usuario.perfil === 'GERENTE'
      ? {}
      : { cobradorId: usuario.id };

    const filtroPagamento: any = {};
    if (dataInicio && typeof dataInicio === 'string') {
      filtroPagamento.gte = new Date(`${dataInicio}T00:00:00.000Z`);
    }
    if (dataFim && typeof dataFim === 'string') {
      filtroPagamento.lte = new Date(`${dataFim}T23:59:59.999Z`);
    }

    const parcelas = await prisma.parcela.findMany({
      where: {
        ...cobradorFiltro,
        status: { in: [StatusParcela.PAGA, StatusParcela.PARCIAL] },
        dataPagamento: Object.keys(filtroPagamento).length > 0 ? filtroPagamento : { not: null }
      },
      include: {
        cobrador: { select: { id: true, nome: true, email: true } },
        venda: {
          include: {
            cliente: true,
            itens: { include: { produto: true } }
          }
        }
      },
      orderBy: { dataPagamento: 'desc' }
    });

    res.json(parcelas);
  } catch (error) {
    console.error('Erro ao listar histórico de parcelas:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar histórico de parcelas.' });
  }
};

/**
 * RF12: Registrar recebimento de parcela (PATCH /parcelas/:id/pagamento)
 */
export const registrarPagamento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const parcelaId = parseInt(idStr, 10);
    const usuario = req.usuario!;

    if (isNaN(parcelaId)) {
      res.status(400).json({ erro: 'ID de parcela inválido.' });
      return;
    }

    const { valorPago, dataPagamento } = req.body;

    if (valorPago === undefined || valorPago === null) {
      res.status(400).json({ erro: 'O valorPago é obrigatório.' });
      return;
    }

    const valorPagoNum = parseFloat(valorPago);
    if (isNaN(valorPagoNum) || valorPagoNum <= 0) {
      res.status(400).json({ erro: 'valorPago deve ser um número maior que zero.' });
      return;
    }

    const parcela = await prisma.parcela.findUnique({
      where: { id: parcelaId }
    });

    if (!parcela) {
      res.status(404).json({ erro: 'Parcela não encontrada.' });
      return;
    }

    if (usuario.perfil !== 'GERENTE' && parcela.cobradorId !== usuario.id) {
      res.status(403).json({
        erro: 'Acesso negado: Apenas o cobrador responsável por esta parcela ou um Gerente podem registrar pagamentos.'
      });
      return;
    }

    const dataPagamentoFinal = dataPagamento ? new Date(dataPagamento) : new Date();

    const resultado = await prisma.$transaction(async (tx) => {
      // Valor da parcela atual e o que ja havia sido pago nela
      const valorParcelaNum = Number(parcela.valor);
      const valorJaPago = parcela.valorPago ? Number(parcela.valorPago) : 0;
      const faltaQuitarAtual = Math.max(0, valorParcelaNum - valorJaPago);

      let valorParaEstaParcela = 0;
      let excedente = 0;

      if (valorPagoNum >= faltaQuitarAtual) {
        valorParaEstaParcela = valorParcelaNum; // completa a parcela
        excedente = valorPagoNum - faltaQuitarAtual;
      } else {
        valorParaEstaParcela = valorJaPago + valorPagoNum;
        excedente = 0;
      }

      const novoStatusAtual: StatusParcela = valorParaEstaParcela >= valorParcelaNum
        ? StatusParcela.PAGA
        : StatusParcela.PARCIAL;

      // 1. Atualizar a parcela principal clicada
      const parcelaAtualizada = await tx.parcela.update({
        where: { id: parcelaId },
        data: {
          valorPago: valorParaEstaParcela,
          dataPagamento: dataPagamentoFinal,
          status: novoStatusAtual
        },
        include: {
          cobrador: { select: { id: true, nome: true, email: true } },
          venda: { include: { cliente: true, itens: { include: { produto: true } } } }
        }
      });

      // 2. Se houver excedente (pagamento maior que a parcela), abater das proximas parcelas
      if (excedente > 0) {
        const proximasParcelas = await tx.parcela.findMany({
          where: {
            vendaId: parcela.vendaId,
            numero: { gt: parcela.numero },
            status: { in: [StatusParcela.PENDENTE, StatusParcela.PARCIAL, StatusParcela.ATRASADA] }
          },
          orderBy: { numero: 'asc' }
        });

        for (const pNext of proximasParcelas) {
          if (excedente <= 0) break;

          const vNextValor = Number(pNext.valor);
          const vNextJaPago = pNext.valorPago ? Number(pNext.valorPago) : 0;
          const faltaNext = Math.max(0, vNextValor - vNextJaPago);

          let abatimentoNext = 0;
          let statusNext: StatusParcela = pNext.status;

          if (excedente >= faltaNext) {
            abatimentoNext = vNextValor;
            statusNext = StatusParcela.PAGA;
            excedente -= faltaNext;
          } else {
            abatimentoNext = vNextJaPago + excedente;
            statusNext = StatusParcela.PARCIAL;
            excedente = 0;
          }

          await tx.parcela.update({
            where: { id: pNext.id },
            data: {
              valorPago: abatimentoNext,
              dataPagamento: dataPagamentoFinal,
              status: statusNext
            }
          });
        }
      }

      await tx.auditoria.create({
        data: {
          parcelaId: parcelaId,
          usuarioId: usuario.id,
          acao: 'PAGAMENTO_REGISTRADO',
          detalhes: `Pagamento de R$ ${valorPagoNum} registrado.`
        }
      });

      return parcelaAtualizada;
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao registrar pagamento:', error);
    res.status(500).json({ erro: 'Erro interno ao registrar pagamento.' });
  }
};

/**
 * RF13: Registrar observações de cobrança (PATCH /parcelas/:id/observacao)
 */
export const registrarObservacao = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const parcelaId = parseInt(idStr, 10);
    const usuario = req.usuario!;

    if (isNaN(parcelaId)) {
      res.status(400).json({ erro: 'ID de parcela inválido.' });
      return;
    }

    const { observacao } = req.body;

    if (!observacao || typeof observacao !== 'string' || observacao.trim() === '') {
      res.status(400).json({ erro: 'A observação é obrigatória.' });
      return;
    }

    const parcela = await prisma.parcela.findUnique({
      where: { id: parcelaId }
    });

    if (!parcela) {
      res.status(404).json({ erro: 'Parcela não encontrada.' });
      return;
    }

    if (usuario.perfil !== 'GERENTE' && parcela.cobradorId !== usuario.id) {
      res.status(403).json({
        erro: 'Acesso negado: Apenas o cobrador responsável por esta parcela ou um Gerente podem adicionar observações.'
      });
      return;
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const parcelaAtualizada = await tx.parcela.update({
        where: { id: parcelaId },
        data: {
          observacao: observacao.trim()
        },
        include: {
          cobrador: { select: { id: true, nome: true, email: true } },
          venda: { include: { cliente: true, itens: { include: { produto: true } } } }
        }
      });

      await tx.auditoria.create({
        data: {
          parcelaId: parcelaId,
          usuarioId: usuario.id,
          acao: 'OBSERVACAO_REGISTRADA',
          detalhes: `Observação adicionada: "${observacao.trim()}"`
        }
      });

      return parcelaAtualizada;
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao registrar observação:', error);
    res.status(500).json({ erro: 'Erro interno ao registrar observação.' });
  }
};

/**
 * RF06: Ajuste manual em parcela (GERENTE) (PATCH /parcelas/:id/ajuste)
 */
export const ajustarParcela = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const parcelaId = parseInt(idStr, 10);
    const usuario = req.usuario!;

    // Requisito: Exclusivo de GERENTE
    if (usuario.perfil !== 'GERENTE') {
      res.status(403).json({ erro: 'Acesso negado: Apenas o GERENTE pode realizar ajustes manuais em parcelas.' });
      return;
    }

    if (isNaN(parcelaId)) {
      res.status(400).json({ erro: 'ID de parcela inválido.' });
      return;
    }

    const { valor, dataVencimento, motivo } = req.body;

    if (!motivo || typeof motivo !== 'string' || motivo.trim() === '') {
      res.status(400).json({ erro: 'O motivo do ajuste é obrigatório.' });
      return;
    }

    const parcela = await prisma.parcela.findUnique({
      where: { id: parcelaId }
    });

    if (!parcela) {
      res.status(404).json({ erro: 'Parcela não encontrada.' });
      return;
    }

    const dadosAtualizacao: any = {};
    const detalhesAuditoria: string[] = [`Motivo: "${motivo.trim()}"`];

    if (valor !== undefined && valor !== null) {
      const valorNovo = parseFloat(valor);
      if (isNaN(valorNovo) || valorNovo <= 0) {
        res.status(400).json({ erro: 'valor deve ser um número maior que zero.' });
        return;
      }
      dadosAtualizacao.valor = valorNovo;
      detalhesAuditoria.push(`Valor alterado de R$ ${parcela.valor} para R$ ${valorNovo}.`);
    }

    if (dataVencimento) {
      const vencimentoNovo = new Date(dataVencimento);
      if (isNaN(vencimentoNovo.getTime())) {
        res.status(400).json({ erro: 'dataVencimento deve ser uma data válida.' });
        return;
      }
      dadosAtualizacao.dataVencimento = vencimentoNovo;
      detalhesAuditoria.push(`Vencimento alterado de ${parcela.dataVencimento.toISOString().substring(0, 10)} para ${vencimentoNovo.toISOString().substring(0, 10)}.`);
    }

    if (Object.keys(dadosAtualizacao).length === 0) {
      res.status(400).json({ erro: 'Forneça pelo menos um dos campos (valor ou dataVencimento) para realizar o ajuste.' });
      return;
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const parcelaAtualizada = await tx.parcela.update({
        where: { id: parcelaId },
        data: dadosAtualizacao,
        include: {
          cobrador: { select: { id: true, nome: true, email: true } },
          venda: { include: { cliente: true, itens: { include: { produto: true } } } }
        }
      });

      await tx.auditoria.create({
        data: {
          parcelaId: parcelaId,
          usuarioId: usuario.id,
          acao: 'AJUSTE_MANUAL_RENEGOCIACAO',
          detalhes: detalhesAuditoria.join(' | ')
        }
      });

      return parcelaAtualizada;
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao ajustar parcela:', error);
    res.status(500).json({ erro: 'Erro interno ao realizar ajuste manual na parcela.' });
  }
};
