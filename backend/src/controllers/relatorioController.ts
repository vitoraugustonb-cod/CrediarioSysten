import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';
import { atualizarStatusParcelasAtrasadas } from './parcelaController.js';

/**
 * RF05: Relatórios mensais consolidados (GERENTE)
 * GET /relatorios/mensal?mes=MM&ano=YYYY
 */
export const relatorioMensalConsolidado = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioLogado = req.usuario!;

    if (usuarioLogado.perfil !== 'GERENTE') {
      res.status(403).json({ erro: 'Acesso negado: Apenas o GERENTE tem acesso aos relatórios mensais consolidados.' });
      return;
    }

    // 1. Atualiza atrasos no banco (RF17)
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

    // Busca todos os funcionários ativos
    const funcionarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, perfil: true },
      orderBy: { nome: 'asc' }
    });

    const consolidado = [];

    for (const f of funcionarios) {
      // 1. Total Vendido pelo funcionário no mês
      const vendasMes = await prisma.venda.findMany({
        where: {
          vendedorId: f.id,
          dataVenda: {
            gte: inicioMes,
            lte: fimMes
          }
        }
      });
      const totalVendido = vendasMes.reduce((acc, v) => acc + Number(v.valorTotal), 0);

      // 2. Total Cobrado pelo funcionário no mês
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

      // 3. Quantidade de parcelas em atraso atualmente sob responsabilidade do funcionário
      const qtdParcelasAtrasadas = await prisma.parcela.count({
        where: {
          cobradorId: f.id,
          status: StatusParcela.ATRASADA
        }
      });

      consolidado.push({
        usuarioId: f.id,
        nome: f.nome,
        email: f.email,
        perfil: f.perfil,
        totalVendido: Math.round(totalVendido * 100) / 100,
        totalCobrado: Math.round(totalCobrado * 100) / 100,
        qtdParcelasAtrasadas
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
