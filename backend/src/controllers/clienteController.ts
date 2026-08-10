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
        vendas: {
          include: {
            produto: true,
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

    // Busca parcelas em aberto (PENDENTE, ATRASADA, PARCIAL) das vendas deste cliente
    const parcelasEmAberto = await prisma.parcela.findMany({
      where: {
        venda: { clienteId: clienteId },
        status: { in: [StatusParcela.PENDENTE, StatusParcela.ATRASADA, StatusParcela.PARCIAL] }
      }
    });

    let saldoDevedorTotal = 0;

    for (const p of parcelasEmAberto) {
      const valorParcela = Number(p.valor);
      const valorPago = p.valorPago ? Number(p.valorPago) : 0;
      const remanescente = valorParcela - valorPago;
      if (remanescente > 0) {
        saldoDevedorTotal += remanescente;
      }
    }

    res.json({
      clienteId: cliente.id,
      nome: cliente.nome,
      saldoDevedor: Math.round(saldoDevedorTotal * 100) / 100,
      totalParcelasEmAberto: parcelasEmAberto.length
    });
  } catch (error) {
    console.error('Erro ao obter saldo devedor:', error);
    res.status(500).json({ erro: 'Erro interno ao calcular saldo devedor do cliente.' });
  }
};
