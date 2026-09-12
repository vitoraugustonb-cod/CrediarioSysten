import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').trim().toLowerCase(),
  senha: z.string().min(1, 'A senha é obrigatória')
});

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').trim(),
  email: z.string().email('E-mail inválido').trim().toLowerCase(),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  perfil: z.enum(['GERENTE', 'VENDEDOR_COBRADOR'], {
    message: 'Perfil deve ser GERENTE ou VENDEDOR_COBRADOR'
  })
});

export const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').trim().optional(),
  email: z.string().email('E-mail inválido').trim().toLowerCase().optional(),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').optional(),
  perfil: z.enum(['GERENTE', 'VENDEDOR_COBRADOR']).optional(),
  ativo: z.boolean().optional()
});

export const criarClienteSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório').trim(),
  telefone: z.string().min(8, 'Telefone válido é obrigatório').trim(),
  endereco: z.string().min(3, 'Endereço é obrigatório').trim(),
  referencias: z.string().optional().nullable()
});

export const atualizarClienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').trim().optional(),
  telefone: z.string().min(8, 'Telefone deve ter pelo menos 8 dígitos').trim().optional(),
  endereco: z.string().min(3, 'Endereço deve ter pelo menos 3 caracteres').trim().optional(),
  referencias: z.string().optional().nullable()
});

export const criarProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome do produto é obrigatório').trim(),
  descricao: z.string().optional().nullable(),
  preco: z.union([
    z.number().positive('Preço deve ser maior que zero'),
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Formato de preço inválido')
  ]).transform((v) => (typeof v === 'string' ? parseFloat(v) : v)),
  categoria: z.enum(['MOVEIS', 'VARIEDADES']).default('MOVEIS')
});

export const atualizarProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome do produto é obrigatório').trim().optional(),
  descricao: z.string().optional().nullable(),
  preco: z.union([
    z.number().positive('Preço deve ser maior que zero'),
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Formato de preço inválido')
  ]).transform((v) => (typeof v === 'string' ? parseFloat(v) : v)).optional(),
  categoria: z.enum(['MOVEIS', 'VARIEDADES']).optional()
});

export const itemVendaSchema = z.object({
  produtoId: z.number().int().positive('ID do produto inválido'),
  quantidade: z.number().int().positive('Quantidade deve ser pelo menos 1'),
  valorUnitario: z.number().positive('Valor unitário deve ser maior que zero'),
  subtotal: z.number().positive('Subtotal deve ser maior que zero')
});

export const parcelaInputSchema = z.object({
  numero: z.number().int().positive('Número da parcela inválido'),
  valor: z.number().positive('Valor da parcela deve ser maior que zero'),
  dataVencimento: z.string().min(1, 'Data de vencimento é obrigatória')
});

export const criarVendaSchema = z.object({
  clienteId: z.number().int().positive('Cliente inválido'),
  valorTotal: z.number().positive('Valor total deve ser maior que zero'),
  valorEntrada: z.number().nonnegative('Valor de entrada não pode ser negativo').optional().nullable(),
  numParcelas: z.number().int().positive('Número de parcelas deve ser no mínimo 1'),
  tipoVenda: z.enum(['MOVEIS', 'VARIEDADES']).default('MOVEIS'),
  dataVenda: z.string().optional().nullable(),
  itens: z.array(itemVendaSchema).min(1, 'A venda precisa conter pelo menos um item'),
  parcelas: z.array(parcelaInputSchema).optional()
});

export const registrarPagamentoSchema = z.object({
  valorPago: z.union([
    z.number().positive('Valor pago deve ser maior que zero'),
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Formato de valor inválido')
  ]).transform((v) => (typeof v === 'string' ? parseFloat(v) : v)),
  dataPagamento: z.string().optional().nullable()
});

export const ajustarParcelaSchema = z.object({
  novoValor: z.number().positive('Novo valor deve ser maior que zero'),
  motivo: z.string().min(3, 'Motivo do ajuste é obrigatório').trim()
});

export const alterarVencimentoSchema = z.object({
  novaDataVencimento: z.string().min(1, 'Nova data de vencimento é obrigatória'),
  motivo: z.string().optional().nullable()
});

export const observacaoSchema = z.object({
  observacao: z.string().max(500, 'Observação pode ter no máximo 500 caracteres').trim()
});
