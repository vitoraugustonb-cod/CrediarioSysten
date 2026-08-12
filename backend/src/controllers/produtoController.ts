import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { CategoriaProduto } from '@prisma/client';

export const criarProduto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, descricao, preco, categoria } = req.body;

    if (!nome || preco === undefined || preco === null) {
      res.status(400).json({ erro: 'Nome e preço são obrigatórios.' });
      return;
    }

    const precoNumero = parseFloat(preco);
    if (isNaN(precoNumero) || precoNumero <= 0) {
      res.status(400).json({ erro: 'Preço deve ser um número maior que zero.' });
      return;
    }

    const categoriaFinal: CategoriaProduto = (categoria === 'VARIEDADES')
      ? CategoriaProduto.VARIEDADES
      : CategoriaProduto.MOVEIS;

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao: descricao || null,
        preco: precoNumero,
        categoria: categoriaFinal
      }
    });

    res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ erro: 'Erro interno ao cadastrar produto.' });
  }
};

export const listarProdutos = async (req: Request, res: Response): Promise<void> => {
  try {
    const produtos = await prisma.produto.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ erro: 'Erro interno ao listar produtos.' });
  }
};
