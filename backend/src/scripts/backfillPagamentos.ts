import { prisma } from '../lib/prisma';

async function backfill() {
  console.log('🔄 Iniciando backfill de pagamentos históricos...');

  // 1. Limpa tabela pagamentos para repopular limpo
  await prisma.pagamento.deleteMany({});

  // 2. Busca todas as auditorias de pagamento
  const auditorias = await prisma.auditoria.findMany({
    where: { acao: 'PAGAMENTO_REGISTRADO' },
    include: {
      parcela: {
        include: {
          venda: true
        }
      }
    },
    orderBy: { criadoEm: 'asc' }
  });

  const parcelasComPagamento = new Set<number>();

  for (const aud of auditorias) {
    if (!aud.parcela) continue;

    // Extrai valor do texto "Pagamento de R$ 600 registrado."
    const match = aud.detalhes?.match(/Pagamento de R\$\s*([\d,.]+)\s*registrado/i);
    const valor = match ? parseFloat(match[1].replace(',', '.')) : Number(aud.parcela.valorPago || aud.parcela.valor);

    const dataPagamento = aud.parcela.dataPagamento || aud.criadoEm;

    await prisma.pagamento.create({
      data: {
        vendaId: aud.parcela.vendaId,
        clienteId: aud.parcela.venda.clienteId,
        cobradorId: aud.usuarioId || aud.parcela.cobradorId,
        parcelaId: aud.parcela.id,
        valorPago: valor,
        dataPagamento: dataPagamento,
        detalhes: `Parcela #${aud.parcela.numero}`,
        criadoEm: aud.criadoEm
      }
    });

    parcelasComPagamento.add(aud.parcela.id);
    console.log(`✅ Pagamento inserido da auditoria #${aud.id}: R$ ${valor} na Parcela #${aud.parcela.numero} (Venda #${aud.parcela.vendaId})`);
  }

  // 3. Verifica se há parcelas pagas antigas que não estavam na auditoria
  const parcelasPagas = await prisma.parcela.findMany({
    where: {
      status: { in: ['PAGA', 'PARCIAL'] },
      id: { notIn: Array.from(parcelasComPagamento) },
      dataPagamento: { not: null }
    },
    include: { venda: true }
  });

  for (const p of parcelasPagas) {
    const valor = Number(p.valorPago || p.valor);
    if (valor <= 0) continue;

    await prisma.pagamento.create({
      data: {
        vendaId: p.vendaId,
        clienteId: p.venda.clienteId,
        cobradorId: p.cobradorId,
        parcelaId: p.id,
        valorPago: valor,
        dataPagamento: p.dataPagamento!,
        detalhes: `Parcela #${p.numero}`,
        criadoEm: p.dataPagamento!
      }
    });
    console.log(`✅ Pagamento inserido da parcela #${p.id}: R$ ${valor} (Venda #${p.vendaId})`);
  }

  console.log('🎉 Backfill concluído com sucesso!');
}

backfill()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
