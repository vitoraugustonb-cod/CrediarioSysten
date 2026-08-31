import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { StatusParcela } from '@prisma/client';

export const criarCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, telefone, endereco, referencias } = req.body;

    if (!nome || !telefone || !endereco) {
      res.status(400).json({ erro: 'Nome, telefone e endereço são obrigatórios.' });
      return;
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        endereco,
        referencias: referencias || null
      }
    });

    res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao cadastrar cliente.' });
  }
};

export const listarClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ erro: 'Erro interno ao listar clientes.' });
  }
};

export const obterClientePorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const clienteId = parseInt(idStr, 10);

    if (isNaN(clienteId)) {
      res.status(400).json({ erro: 'ID de cliente inválido.' });
      return;
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        pagamentos: {
          include: {
            cobrador: { select: { id: true, nome: true, email: true } },
            venda: {
              include: {
                itens: { include: { produto: true } }
              }
            }
          },
          orderBy: [
            { dataPagamento: 'desc' },
            { id: 'desc' }
          ]
        },
        vendas: {
          include: {
            itens: { include: { produto: true } },
            parcelas: true
          },
          orderBy: { dataVenda: 'desc' }
        }
      }
    });

    if (!cliente) {
      res.status(404).json({ erro: 'Cliente não encontrado.' });
      return;
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao obter cliente.' });
  }
};

/**
 * RF19: Saldo devedor total de um cliente (GET /clientes/:id/saldo)
 */
export const obterSaldoDevedorCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const clienteId = parseInt(idStr, 10);

    if (isNaN(clienteId)) {
      res.status(400).json({ erro: 'ID de cliente inválido.' });
      return;
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });

    if (!cliente) {
      res.status(404).json({ erro: 'Cliente não encontrado.' });
      return;
    }

    // Busca TODAS as parcelas de TODAS as vendas deste cliente para calculo de saldo exato
    const todasParcelas = await prisma.parcela.findMany({
      where: {
        venda: { clienteId: clienteId }
      }
    });

    let totalOriginal = 0;
    let totalPago = 0;
    let parcelasAbertoCount = 0;
    let parcelasAtrasoCount = 0;
    const agora = new Date();

    for (const p of todasParcelas) {
      const vOriginal = Number(p.valor);
      const vPago = p.valorPago ? Number(p.valorPago) : 0;
      
      totalOriginal += vOriginal;
      totalPago += vPago;

      if (p.status !== StatusParcela.PAGA) {
        parcelasAbertoCount++;
        if (p.dataVencimento < agora || p.status === StatusParcela.ATRASADA) {
          parcelasAtrasoCount++;
        }
      }
    }

    const saldoDevedorCalculado = Math.max(0, totalOriginal - totalPago);
    const saldoFinal = Math.round(saldoDevedorCalculado * 100) / 100;

    res.json({
      cliente,
      clienteId: cliente.id,
      nome: cliente.nome,
      saldoDevedor: saldoFinal,
      saldoDevedorTotal: saldoFinal,
      totalParcelasEmAberto: parcelasAbertoCount,
      parcelasEmAtraso: parcelasAtrasoCount
    });
  } catch (error) {
    console.error('Erro ao obter saldo devedor:', error);
    res.status(500).json({ erro: 'Erro interno ao calcular saldo devedor do cliente.' });
  }
};
