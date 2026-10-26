import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';

/**
 * RF17: Função auxiliar que atualiza automaticamente no banco todas as parcelas
 * pendentes/parciais cuja data de vencimento seja anterior ao dia atual.
 */
export const atualizarStatusParcelasAtrasadas = async (): Promise<void> => {
  const agora = new Date();
  // Início do dia de hoje no fuso local do servidor
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0);

  await prisma.parcela.updateMany({
    where: {
      status: { in: [StatusParcela.PENDENTE, StatusParcela.PARCIAL] },
      dataVencimento: { lt: inicioHoje }
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
      where: { id: parcelaId },
      include: { venda: true }
    });

    if (!parcela) {
      res.status(404).json({ erro: 'Parcela não encontrada.' });
      return;
    }

    const dataPagamentoFinal = dataPagamento
      ? new Date(`${typeof dataPagamento === 'string' ? dataPagamento.split('T')[0] : dataPagamento.toISOString().split('T')[0]}T12:00:00.000Z`)
      : new Date();

    const resultado = await prisma.$transaction(async (tx) => {
      // Valor da parcela atual e o que ja havia sido pago nela
      const valorParcelaNum = Number(parcela.valor);
      const valorJaPago = parcela.valorPago ? Number(parcela.valorPago) : 0;
      const faltaQuitarAtual = Math.max(0, valorParcelaNum - valorJaPago);

      let valorParaEstaParcela = 0;
      let excedente = 0;
      let diferencaNaoPaga = 0;
      let proximaParcelaAlvo: any = null;

      if (valorPagoNum >= faltaQuitarAtual) {
        valorParaEstaParcela = valorParcelaNum; // completa a parcela
        excedente = Math.round((valorPagoNum - faltaQuitarAtual) * 100) / 100;
      } else {
        // PAGAMENTO PARCIAL:
        // O cliente pagou menos do que o valor total/restante da parcela.
        // A parcela é quitada hoje com o valor pago para que o cliente saia da rota de cobrança de hoje,
        // e a diferença restante é transferida automaticamente para a próxima parcela.
        diferencaNaoPaga = Math.round((faltaQuitarAtual - valorPagoNum) * 100) / 100;
        valorParaEstaParcela = Math.round((valorJaPago + valorPagoNum) * 100) / 100;
        excedente = 0;
      }

      // Se houver diferença não paga (pagamento parcial), transfere para a próxima parcela
      if (diferencaNaoPaga > 0) {
        const proximaParcela = await tx.parcela.findFirst({
          where: {
            vendaId: parcela.vendaId,
            numero: { gt: parcela.numero },
            status: { in: [StatusParcela.PENDENTE, StatusParcela.PARCIAL, StatusParcela.ATRASADA] }
          },
          orderBy: { numero: 'asc' }
        });

        if (proximaParcela) {
          proximaParcelaAlvo = proximaParcela;
          const vNextOriginal = Number(proximaParcela.valor);
          const novoValorNext = Math.round((vNextOriginal + diferencaNaoPaga) * 100) / 100;
          const obsAntiga = proximaParcela.observacao ? `${proximaParcela.observacao} | ` : '';
          const novaObsNext = `${obsAntiga}+R$ ${diferencaNaoPaga.toFixed(2)} transferido da Parcela #${parcela.numero} (restante não pago)`;

          await tx.parcela.update({
            where: { id: proximaParcela.id },
            data: {
              valor: novoValorNext,
              observacao: novaObsNext
            }
          });

          await tx.auditoria.create({
            data: {
              parcelaId: proximaParcela.id,
              usuarioId: usuario.id,
              acao: 'VALOR_TRANSFERIDO_PARCELA_ANTERIOR',
              detalhes: `Recebeu acréscimo de R$ ${diferencaNaoPaga.toFixed(2)} transferido da Parcela #${parcela.numero}. Novo valor: R$ ${novoValorNext.toFixed(2)}.`
            }
          });
        } else {
          // Última parcela da venda: gera a próxima parcela para comportar o saldo restante
          const todasParcelas = await tx.parcela.findMany({
            where: { vendaId: parcela.vendaId },
            orderBy: { numero: 'asc' }
          });

          let diasIntervalo = 30; // Padrão mensal
          if (todasParcelas.length >= 2) {
            const pPenultima = todasParcelas[todasParcelas.length - 2];
            const pUltima = todasParcelas[todasParcelas.length - 1];
            const diffMs = pUltima.dataVencimento.getTime() - pPenultima.dataVencimento.getTime();
            const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));
            if (diffDias > 0) {
              diasIntervalo = diffDias;
            }
          }

          const novaDataVencimento = new Date(parcela.dataVencimento);
          novaDataVencimento.setDate(novaDataVencimento.getDate() + diasIntervalo);

          const novoNumero = parcela.numero + 1;
          const novaParcelaCriada = await tx.parcela.create({
            data: {
              vendaId: parcela.vendaId,
              cobradorId: parcela.cobradorId || usuario.id,
              numero: novoNumero,
              valor: diferencaNaoPaga,
              status: StatusParcela.PENDENTE,
              dataVencimento: novaDataVencimento,
              observacao: `Gerada automaticamente: R$ ${diferencaNaoPaga.toFixed(2)} transferido da Parcela #${parcela.numero} (restante não pago)`
            }
          });

          await tx.venda.update({
            where: { id: parcela.vendaId },
            data: { numParcelas: { increment: 1 } }
          });

          await tx.auditoria.create({
            data: {
              parcelaId: novaParcelaCriada.id,
              usuarioId: usuario.id,
              acao: 'NOVA_PARCELA_CRIADA_TRANSFERENCIA',
              detalhes: `Parcela #${novoNumero} criada com valor de R$ ${diferencaNaoPaga.toFixed(2)} transferido da Parcela #${parcela.numero}.`
            }
          });

          proximaParcelaAlvo = novaParcelaCriada;
        }
      }

      // Parcela atual é quitada hoje com o valor efetivamente pago
      const novoStatusAtual: StatusParcela = StatusParcela.PAGA;
      const novoValorParcela: number = diferencaNaoPaga > 0 ? valorParaEstaParcela : valorParcelaNum;

      const obsAtualAntiga = parcela.observacao ? `${parcela.observacao} | ` : '';
      const novaObsAtual = diferencaNaoPaga > 0
        ? `${obsAtualAntiga}Quitada com pagamento parcial de R$ ${valorPagoNum.toFixed(2)} (R$ ${diferencaNaoPaga.toFixed(2)} transferido para a Parcela #${proximaParcelaAlvo?.numero})`
        : parcela.observacao;

      // 1. Atualizar a parcela principal clicada (atribuindo cobradorId ao usuario que recebeu o pagamento)
      const parcelaAtualizada = await tx.parcela.update({
        where: { id: parcelaId },
        data: {
          cobradorId: usuario.id,
          valor: novoValorParcela,
          valorPago: valorParaEstaParcela,
          dataPagamento: dataPagamentoFinal,
          status: novoStatusAtual,
          observacao: novaObsAtual
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
              cobradorId: usuario.id,
              valorPago: abatimentoNext,
              dataPagamento: dataPagamentoFinal,
              status: statusNext
            }
          });
        }
      }

      // 3. Registrar a transação histórica real e imutável de pagamento
      const vencimentoStr = parcela.dataVencimento.toISOString().substring(0, 10);
      const pagamentoStr = dataPagamentoFinal.toISOString().substring(0, 10);
      const isAdiantado = vencimentoStr > pagamentoStr;

      const [anoV, mesV, diaV] = vencimentoStr.split('-');
      const vencBR = `${diaV}/${mesV}/${anoV}`;

      const prefixoAdiantado = isAdiantado ? `[Adiantamento] ` : '';
      let detalhesTexto = '';

      if (diferencaNaoPaga > 0) {
        detalhesTexto = `${prefixoAdiantado}Pagamento parcial de R$ ${valorPagoNum.toFixed(2)} na Parcela #${parcela.numero} (Venc: ${vencBR}). Parcela quitada e restante de R$ ${diferencaNaoPaga.toFixed(2)} transferido para a Parcela #${proximaParcelaAlvo?.numero}.`;
      } else if (excedente > 0) {
        detalhesTexto = `${prefixoAdiantado}Quitou Parcela #${parcela.numero} (Venc: ${vencBR}) e adiantou excedente de R$ ${excedente.toFixed(2)}`;
      } else if (isAdiantado) {
        detalhesTexto = `Pagamento Adiantado de R$ ${valorPagoNum.toFixed(2)} na Parcela #${parcela.numero} (Venc: ${vencBR})`;
      } else {
        detalhesTexto = `Pagamento de R$ ${valorPagoNum.toFixed(2)} na Parcela #${parcela.numero}`;
      }

      await tx.pagamento.create({
        data: {
          vendaId: parcela.vendaId,
          clienteId: parcela.venda.clienteId,
          cobradorId: usuario.id,
          parcelaId: parcela.id,
          valorPago: valorPagoNum,
          dataPagamento: dataPagamentoFinal,
          detalhes: detalhesTexto
        }
      });

      await tx.auditoria.create({
        data: {
          parcelaId: parcelaId,
          usuarioId: usuario.id,
          acao: diferencaNaoPaga > 0
            ? 'PAGAMENTO_PARCIAL_COM_TRANSFERENCIA'
            : isAdiantado
              ? 'PAGAMENTO_ADIANTADO_REGISTRADO'
              : 'PAGAMENTO_REGISTRADO',
          detalhes: `${detalhesTexto}. Registrado pelo cobrador.`
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

/**
 * PATCH /parcelas/:id/data-vencimento
 * Altera apenas a data de vencimento de uma parcela em aberto.
 * Acessível a qualquer usuário autenticado (vendedor/cobrador).
 */
export const alterarDataVencimentoParcela = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const parcelaId = parseInt(idStr, 10);

    if (isNaN(parcelaId)) {
      res.status(400).json({ erro: 'ID de parcela inválido.' });
      return;
    }

    const rawData = req.body.dataVencimento || req.body.novaDataVencimento;

    if (!rawData || typeof rawData !== 'string') {
      res.status(400).json({ erro: 'A nova data de vencimento é obrigatória.' });
      return;
    }

    let novaData: Date;
    const datePart = rawData.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [yyyy, mm, dd] = datePart.split('-').map(Number);
      novaData = new Date(yyyy, mm - 1, dd, 12, 0, 0);
    } else {
      novaData = new Date(rawData);
    }

    if (isNaN(novaData.getTime())) {
      res.status(400).json({ erro: 'Data de vencimento inválida. Use o formato YYYY-MM-DD.' });
      return;
    }

    const parcela = await prisma.parcela.findUnique({ where: { id: parcelaId } });
    if (!parcela) {
      res.status(404).json({ erro: 'Parcela não encontrada.' });
      return;
    }

    if (parcela.status === StatusParcela.PAGA) {
      res.status(400).json({ erro: 'Não é possível alterar a data de uma parcela já paga.' });
      return;
    }

    const agora = new Date();
    const hojeInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
    const vencInicio = new Date(novaData.getFullYear(), novaData.getMonth(), novaData.getDate()).getTime();

    let novoStatus = parcela.status;
    if (vencInicio < hojeInicio && parcela.status === StatusParcela.PENDENTE) {
      novoStatus = StatusParcela.ATRASADA;
    } else if (vencInicio >= hojeInicio && parcela.status === StatusParcela.ATRASADA) {
      novoStatus = StatusParcela.PENDENTE;
    }

    const parcelaAtualizada = await prisma.parcela.update({
      where: { id: parcelaId },
      data: {
        dataVencimento: novaData,
        status: novoStatus
      }
    });

    res.json(parcelaAtualizada);
  } catch (error) {
    console.error('Erro ao alterar data de vencimento da parcela:', error);
    res.status(500).json({ erro: 'Erro interno ao alterar data de vencimento.' });
  }
};

/**
 * PATCH /parcelas/:id/contato
 * Registra o timestamp do contato (WhatsApp) realizado com o cliente desta parcela.
 */
export const registrarContatoParcela = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const parcelaId = parseInt(idStr, 10);

    if (isNaN(parcelaId)) {
      res.status(400).json({ erro: 'ID de parcela inválido.' });
      return;
    }

    const parcela = await prisma.parcela.findUnique({ where: { id: parcelaId } });
    if (!parcela) {
      res.status(404).json({ erro: 'Parcela não encontrada.' });
      return;
    }

    const agora = new Date();
    const parcelaAtualizada = await prisma.parcela.update({
      where: { id: parcelaId },
      data: {
        ultimoContatoEm: agora
      }
    });

    res.json(parcelaAtualizada);
  } catch (error) {
    console.error('Erro ao registrar contato da parcela:', error);
    res.status(500).json({ erro: 'Erro interno ao registrar contato da parcela.' });
  }
};
