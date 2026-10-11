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
    const usuario = req.usuario!;
    const isGerente = usuario.perfil === 'GERENTE';

    const ondeFiltro = isGerente
      ? {}
      : {
          vendas: {
            some: {
              OR: [
                { vendedorId: usuario.id },
                { parcelas: { some: { cobradorId: usuario.id } } }
              ]
            }
          }
        };

    const clientes = await prisma.cliente.findMany({
      where: ondeFiltro,
      orderBy: { nome: 'asc' },
      include: {
        vendas: {
          where: isGerente
            ? undefined
            : {
                OR: [
                  { vendedorId: usuario.id },
                  { parcelas: { some: { cobradorId: usuario.id } } }
                ]
              },
          select: {
            id: true,
            parcelas: {
              select: {
                id: true,
                status: true,
                valor: true,
                valorPago: true,
              }
            }
          }
        }
      }
    });

    const clientesComStatus = clientes.map(c => {
      const totalVendas = c.vendas.length;
      let parcelasEmAberto = 0;
      let saldoDevedor = 0;

      for (const v of c.vendas) {
        for (const p of v.parcelas) {
          const vOriginal = Number(p.valor);
          const vPago = p.valorPago ? Number(p.valorPago) : 0;
          if (p.status !== StatusParcela.PAGA) {
            parcelasEmAberto++;
            saldoDevedor += Math.max(0, vOriginal - vPago);
          }
        }
      }

      // Cliente quitado: já possui compras/dívidas no sistema e finalizou todas as parcelas (saldo = 0)
      const quitado = totalVendas > 0 && parcelasEmAberto === 0;

      const { vendas, ...clienteSemVendas } = c;
      return {
        ...clienteSemVendas,
        totalVendas,
        parcelasEmAberto,
        saldoDevedor: Math.round(saldoDevedor * 100) / 100,
        quitado
      };
    });

    res.json(clientesComStatus);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ erro: 'Erro interno ao listar clientes.' });
  }
};

export const obterClientePorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const isGerente = usuario.perfil === 'GERENTE';
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const clienteId = parseInt(idStr, 10);

    if (isNaN(clienteId)) {
      res.status(400).json({ erro: 'ID de cliente inválido.' });
      return;
    }

    if (!isGerente) {
      const temPermissao = await prisma.cliente.findFirst({
        where: {
          id: clienteId,
          vendas: {
            some: {
              OR: [
                { vendedorId: usuario.id },
                { parcelas: { some: { cobradorId: usuario.id } } }
              ]
            }
          }
        }
      });

      if (!temPermissao) {
        res.status(403).json({ erro: 'Acesso negado: este cliente não pertence à sua carteira.' });
        return;
      }
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        pagamentos: {
          where: isGerente ? undefined : { cobradorId: usuario.id },
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
          where: isGerente
            ? undefined
            : {
                OR: [
                  { vendedorId: usuario.id },
                  { parcelas: { some: { cobradorId: usuario.id } } }
                ]
              },
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
    const usuario = req.usuario!;
    const isGerente = usuario.perfil === 'GERENTE';
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const clienteId = parseInt(idStr, 10);

    if (isNaN(clienteId)) {
      res.status(400).json({ erro: 'ID de cliente inválido.' });
      return;
    }

    if (!isGerente) {
      const temPermissao = await prisma.cliente.findFirst({
        where: {
          id: clienteId,
          vendas: {
            some: {
              OR: [
                { vendedorId: usuario.id },
                { parcelas: { some: { cobradorId: usuario.id } } }
              ]
            }
          }
        }
      });

      if (!temPermissao) {
        res.status(403).json({ erro: 'Acesso negado: este cliente não pertence à sua carteira.' });
        return;
      }
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });

    if (!cliente) {
      res.status(404).json({ erro: 'Cliente não encontrado.' });
      return;
    }

    // Busca parcelas de vendas deste cliente (filtradas para o vendedor/cobrador caso não seja gerente)
    const todasParcelas = await prisma.parcela.findMany({
      where: {
        venda: {
          clienteId: clienteId,
          ...(isGerente ? {} : {
            OR: [
              { vendedorId: usuario.id },
              { parcelas: { some: { cobradorId: usuario.id } } }
            ]
          })
        },
        ...(isGerente ? {} : { cobradorId: usuario.id })
      }
    });

    let totalOriginal = 0;
    let totalPago = 0;
    let parcelasAbertoCount = 0;
    let parcelasAtrasoCount = 0;
    const agora = new Date();
    const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0, 0);

    for (const p of todasParcelas) {
      const vOriginal = Number(p.valor);
      const vPago = p.valorPago ? Number(p.valorPago) : 0;

      totalOriginal += vOriginal;
      totalPago += vPago;

      if (p.status !== StatusParcela.PAGA) {
        parcelasAbertoCount++;
        const dVenc = new Date(p.dataVencimento);
        const vencInicio = new Date(dVenc.getFullYear(), dVenc.getMonth(), dVenc.getDate(), 0, 0, 0, 0);
        if (vencInicio < inicioHoje || p.status === StatusParcela.ATRASADA) {
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

export const atualizarCliente = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.usuario!;
    const isGerente = usuario.perfil === 'GERENTE';
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const clienteId = parseInt(idStr, 10);

    if (isNaN(clienteId)) {
      res.status(400).json({ erro: 'ID de cliente inválido.' });
      return;
    }

    if (!isGerente) {
      const temPermissao = await prisma.cliente.findFirst({
        where: {
          id: clienteId,
          vendas: {
            some: {
              OR: [
                { vendedorId: usuario.id },
                { parcelas: { some: { cobradorId: usuario.id } } }
              ]
            }
          }
        }
      });

      if (!temPermissao) {
        res.status(403).json({ erro: 'Acesso negado: este cliente não pertence à sua carteira.' });
        return;
      }
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      res.status(404).json({ erro: 'Cliente não encontrado.' });
      return;
    }

    const { nome, telefone, endereco, referencias } = req.body;
    const dados: any = {};

    if (nome !== undefined && typeof nome === 'string' && nome.trim()) dados.nome = nome.trim();
    if (telefone !== undefined && typeof telefone === 'string') dados.telefone = telefone.trim();
    if (endereco !== undefined && typeof endereco === 'string' && endereco.trim()) dados.endereco = endereco.trim();
    if (referencias !== undefined) dados.referencias = referencias ? String(referencias).trim() : null;

    if (Object.keys(dados).length === 0) {
      res.status(400).json({ erro: 'Nenhum campo válido foi enviado para atualização.' });
      return;
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: { id: clienteId },
      data: dados
    });

    res.json(clienteAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar dados do cliente.' });
  }
};
