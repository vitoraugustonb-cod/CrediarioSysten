import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PerfilUsuario } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export const criarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      res.status(400).json({ erro: 'Nome, e-mail, senha e perfil são obrigatórios.' });
      return;
    }

    if (!Object.values(PerfilUsuario).includes(perfil)) {
      res.status(400).json({ erro: 'Perfil inválido. Deve ser GERENTE ou VENDEDOR_COBRADOR.' });
      return;
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      res.status(400).json({ erro: 'Já existe um usuário cadastrado com este e-mail.' });
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        perfil,
        ativo: true
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        criadoEm: true
      }
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ erro: 'Erro interno ao criar usuário.' });
  }
};
