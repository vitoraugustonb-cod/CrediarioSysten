import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';

/**
 * Função auxiliar que calcula o total vendido (separado por MOVEIS e VARIEDADES) e o total cobrado
 */
async function calcularPrestacaoContasDia(usuarioId: number, dataIso: string) {
  const inicioDia = new Date(`${dataIso}T00:00:00.000Z`);
  const fimDia = new Date(`${dataIso}T23:59:59.999Z`);

  // 1. Vendas do dia com os seus itens e produtos
  const vendasDia = await prisma.venda.findMany({
    where: {
      vendedorId: usuarioId,
      dataVenda: {
        gte: inicioDia,
        lte: fimDia
      }
    },
    include: {
      itens: {
        include: {
          produto: true
        }
      }
    }
  });

  let totalVendidoMoveis = 0;
  let totalVendidoVariedades = 0;
  let totalVendido = 0;

  for (const venda of vendasDia) {
    totalVendido += Number(venda.valorTotal);
    for (const item of venda.itens) {
      const sub = Number(item.subtotal);
      if (item.produto?.categoria === 'VARIEDADES') {
        totalVendidoVariedades += sub;
      } else {
        totalVendidoMoveis += sub;
      }
    }
  }

  // 2. Total cobrado no dia (soma de valorPago das parcelas pagas/parciais naquele dia)
  const parcelasCobradasDia = await prisma.parcela.findMany({
    where: {
      cobradorId: usuarioId,
      status: { in: [StatusParcela.PAGA, StatusParcela.PARCIAL] },
      dataPagamento: {
        gte: inicioDia,
        lte: fimDia
      }
    }
  });

  const totalCobrado = parcelasCobradasDia.reduce((acc, p) => acc + (p.valorPago ? Number(p.valorPago) : 0), 0);

  return {
    totalVendido: Math.round(totalVendido * 100) / 100,
    totalVendidoMoveis: Math.round(totalVendidoMoveis * 100) / 100,
    totalVendidoVariedades: Math.round(totalVendidoVariedades * 100) / 100,
    totalCobrado: Math.round(totalCobrado * 100) / 100,
    qtdVendas: vendasDia.length,
    qtdCobrancas: parcelasCobradasDia.length
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
