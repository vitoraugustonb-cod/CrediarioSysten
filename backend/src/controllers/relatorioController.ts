import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';
import { atualizarStatusParcelasAtrasadas } from './parcelaController.js';

export const relatorioMensalConsolidado = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioLogado = req.usuario!;

    if (usuarioLogado.perfil !== 'GERENTE') {
      res.status(403).json({ erro: 'Acesso negado: Apenas o GERENTE tem acesso aos relatórios mensais consolidados.' });
      return;
    }

    await atualizarStatusParcelasAtrasadas();

    const agora = new Date();
    const mesQuery = req.query.mes ? parseInt(req.query.mes as string, 10) : agora.getMonth() + 1;
    const anoQuery = req.query.ano ? parseInt(req.query.ano as string, 10) : agora.getFullYear();

    if (isNaN(mesQuery) || mesQuery < 1 || mesQuery > 12) {
      res.status(400).json({ erro: 'Mês inválido. Deve ser um número entre 1 e 12.' });
      return;
    }

    if (isNaN(anoQuery) || anoQuery < 2000 || anoQuery > 2100) {
      res.status(400).json({ erro: 'Ano inválido.' });
      return;
    }

    const inicioMes = new Date(Date.UTC(anoQuery, mesQuery - 1, 1, 0, 0, 0));
    const fimMes = new Date(Date.UTC(anoQuery, mesQuery, 0, 23, 59, 59, 999));

    const funcionarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, perfil: true },
      orderBy: { nome: 'asc' }
    });

    const consolidado = [];

    for (const f of funcionarios) {
      // Vendas do mês com itens e produtos
      const vendasMes = await prisma.venda.findMany({
        where: {
          vendedorId: f.id,
          dataVenda: {
            gte: inicioMes,
            lte: fimMes
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

      for (const v of vendasMes) {
        totalVendido += Number(v.valorTotal);
        for (const item of v.itens) {
          const sub = Number(item.subtotal);
          if (item.produto?.categoria === 'VARIEDADES') {
            totalVendidoVariedades += sub;
          } else {
            totalVendidoMoveis += sub;
          }
        }
      }

      // Total Cobrado pelo funcionário no mês
      const cobrancasMes = await prisma.parcela.findMany({
        where: {
          cobradorId: f.id,
          status: { in: [StatusParcela.PAGA, StatusParcela.PARCIAL] },
          dataPagamento: {
            gte: inicioMes,
            lte: fimMes
          }
        }
      });
      const totalCobrado = cobrancasMes.reduce((acc, p) => acc + (p.valorPago ? Number(p.valorPago) : 0), 0);

      // Quantidade de parcelas em atraso sob responsabilidade do funcionário
      const parcelasEmAtraso = await prisma.parcela.count({
        where: {
          cobradorId: f.id,
          status: StatusParcela.ATRASADA
        }
      });

      consolidado.push({
        funcionario: {
          id: f.id,
          nome: f.nome,
          email: f.email,
          perfil: f.perfil
        },
        totalVendido: Math.round(totalVendido * 100) / 100,
        totalVendidoMoveis: Math.round(totalVendidoMoveis * 100) / 100,
        totalVendidoVariedades: Math.round(totalVendidoVariedades * 100) / 100,
        totalCobrado: Math.round(totalCobrado * 100) / 100,
        parcelasEmAtraso
      });
    }

    res.json({
      mes: mesQuery,
      ano: anoQuery,
      consolidadoPorFuncionario: consolidado
    });
  } catch (error) {
    console.error('Erro no relatório mensal consolidado:', error);
    res.status(500).json({ erro: 'Erro interno ao gerar relatório mensal consolidado.' });
  }
};
