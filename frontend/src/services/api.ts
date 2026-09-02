// API Service Module for Crediário System
// Base URL uses relative path so Vite dev proxy handles it seamlessly (LAN, localhost, and tunnels)
export const API_BASE_URL = '';

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  referencias?: string | null;
  criadoEm?: string;
}

export type CategoriaProduto = 'MOVEIS' | 'VARIEDADES';

export interface Produto {
  id: number;
  nome: string;
  descricao?: string | null;
  preco: number | string;
  categoria: CategoriaProduto;
}

export interface ItemVendaItem {
  id?: number;
  vendaId?: number;
  produtoId: number;
  quantidade: number;
  valorUnitario: number | string;
  subtotal: number | string;
  produto?: Produto;
}

export interface Parcela {
  id: number;
  vendaId: number;
  cobradorId: number;
  numero: number;
  valor: number | string;
  valorPago?: number | string | null;
  dataVencimento: string;
  dataPagamento?: string | null;
  status: 'PENDENTE' | 'PAGA' | 'ATRASADA' | 'PARCIAL';
  observacao?: string | null;
  ultimoContatoEm?: string | null;
  cobrador?: {
    id: number;
    nome: string;
    email: string;
  };
  venda?: {
    id: number;
    valorTotal: number | string;
    numParcelas: number;
    cliente: Cliente;
    produto?: Produto;
    itens?: ItemVendaItem[];
  };
}

export interface CobrancaDetalheItem {
  id: number;
  clienteId: number;
  clienteNome: string;
  clienteTelefone: string;
  valorPago: number;
  produtoNome: string;
  detalhes: string;
  dataPagamento: string;
  criadoEm: string;
}

export interface VendaDetalheItem {
  id: number;
  clienteId: number;
  clienteNome: string;
  clienteTelefone: string;
  nomeProduto: string;
  itensDesc: string;
  condicao: string;
  valorTotal: number;
  dataVenda: string;
}

export interface PrestacaoContasDia {
  totalVendido: number;
  totalVendidoMoveis: number;
  totalVendidoVariedades: number;
  totalCobrado: number;
  qtdVendas: number;
  qtdCobrancas: number;
  cobrancasDetalhes?: CobrancaDetalheItem[];
  vendasDetalhes?: VendaDetalheItem[];
}

export interface SaldoDevedorCliente {
  cliente: Cliente;
  saldoDevedorTotal: number;
  totalParcelasEmAberto: number;
  parcelasEmAtraso: number;
}

export interface UsuarioItem {
  id: number;
  nome: string;
  email: string;
  perfil: 'GERENTE' | 'VENDEDOR_COBRADOR';
  ativo: boolean;
  criadoEm?: string;
}

export interface RelatorioMensalItem {
  funcionario: {
    id: number;
    nome: string;
    email: string;
  };
  totalVendido: number;
  totalVendidoMoveis: number;
  totalVendidoVariedades: number;
  totalCobrado: number;
  parcelasEmAtraso: number;
}

export interface VendaItem {
  id: number;
  clienteId: number;
  vendedorId: number;
  produtoId?: number;
  produto?: Produto;
  valorTotal: number | string;
  valorEntrada?: number | string | null;
  numParcelas: number;
  dataVenda: string;
  cliente?: Cliente;
  vendedor?: { id: number; nome: string; email: string };
  itens?: ItemVendaItem[];
  parcelas?: Parcela[];
}

// Helper to make authenticated requests to backend REST API
async function fetchWithAuth(endpoint: string, token: string | null, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || data.message || 'Erro ao comunicar com o servidor');
  }

  return data;
}

// 1. GET /parcelas
export async function getParcelas(token: string | null): Promise<Parcela[]> {
  return await fetchWithAuth('/parcelas', token);
}

// 2. PATCH /parcelas/:id/pagamento
export async function registrarPagamentoAPI(
  id: number,
  valorPago: number,
  dataPagamento?: string,
  token: string | null = null
): Promise<Parcela> {
  return await fetchWithAuth(`/parcelas/${id}/pagamento`, token, {
    method: 'PATCH',
    body: JSON.stringify({ valorPago, dataPagamento }),
  });
}

// 3. PATCH /parcelas/:id/observacao
export async function registrarObservacaoAPI(
  id: number,
  observacao: string,
  token: string | null = null
): Promise<Parcela> {
  return await fetchWithAuth(`/parcelas/${id}/observacao`, token, {
    method: 'PATCH',
    body: JSON.stringify({ observacao }),
  });
}

// 4. GET /clientes
export async function getClientes(token: string | null): Promise<Cliente[]> {
  return await fetchWithAuth('/clientes', token);
}

// 5. POST /clientes
export async function criarClienteAPI(
  clienteData: { nome: string; telefone: string; endereco: string; referencias?: string },
  token: string | null = null
): Promise<Cliente> {
  return await fetchWithAuth('/clientes', token, {
    method: 'POST',
    body: JSON.stringify(clienteData),
  });
}

// 6. GET /clientes/:id/saldo
export async function getSaldoCliente(id: number, token: string | null): Promise<SaldoDevedorCliente> {
  return await fetchWithAuth(`/clientes/${id}/saldo`, token);
}

// 6.1 GET /clientes/:id (Dados completos + Histórico de Vendas)
export async function getClientePorId(id: number, token: string | null): Promise<any> {
  return await fetchWithAuth(`/clientes/${id}`, token);
}

// 7. GET /produtos
export async function getProdutos(token: string | null): Promise<Produto[]> {
  return await fetchWithAuth('/produtos', token);
}

// 8. POST /vendas
export async function criarVendaAPI(
  vendaData: {
    clienteId?: number | string;
    novoCliente?: {
      nome: string;
      rua?: string;
      numero?: string;
      bairro?: string;
      telefone?: string;
      referencias?: string;
    };
    itens?: Array<{ produtoId?: number; nome?: string; quantidade: number; valorUnitario?: number }>;
    nomeProduto?: string;
    valorProduto?: number;
    valorEntrada?: number;
    numParcelas: number;
    periodicidade?: 'MENSAL' | 'QUINZENAL' | 'SEMANAL';
    primeiroVencimento?: string;
    dataVenda?: string;
    tipoVenda?: 'MOVEIS' | 'VARIEDADES';
  },
  token: string | null = null
) {
  return await fetchWithAuth('/vendas', token, {
    method: 'POST',
    body: JSON.stringify(vendaData),
  });
}

// 9. GET /prestacao-contas/dia
export async function getPrestacaoContasDia(token: string | null, dataIso?: string): Promise<PrestacaoContasDia> {
  const endpoint = dataIso ? `/prestacao-contas/dia?data=${dataIso}` : '/prestacao-contas/dia';
  return await fetchWithAuth(endpoint, token);
}

// 10. GET /usuarios
export async function getUsuarios(token: string | null): Promise<UsuarioItem[]> {
  return await fetchWithAuth('/usuarios', token);
}

// 11. POST /usuarios
export async function criarUsuarioAPI(
  usuarioData: { nome: string; email: string; senha: string; perfil: 'GERENTE' | 'VENDEDOR_COBRADOR' },
  token: string | null = null
): Promise<UsuarioItem> {
  return await fetchWithAuth('/usuarios', token, {
    method: 'POST',
    body: JSON.stringify(usuarioData),
  });
}

// 12. GET /prestacao-contas/dia/:usuarioId
export async function getPrestacaoContasFuncionarioDia(
  usuarioId: number,
  token: string | null,
  dataIso?: string
): Promise<PrestacaoContasDia> {
  const endpoint = dataIso
    ? `/prestacao-contas/dia/${usuarioId}?data=${dataIso}`
    : `/prestacao-contas/dia/${usuarioId}`;
  return await fetchWithAuth(endpoint, token);
}

// 13. GET /relatorios/mensal
export async function getRelatorioMensal(
  mes?: number,
  ano?: number,
  token: string | null = null
): Promise<RelatorioMensalItem[]> {
  let endpoint = '/relatorios/mensal';
  if (mes && ano) {
    endpoint += `?mes=${mes}&ano=${ano}`;
  }
  const data = await fetchWithAuth(endpoint, token);
  return data.consolidadoPorFuncionario || data;
}

// 14. GET /vendas
export async function getVendas(
  dataInicio?: string,
  dataFim?: string,
  token: string | null = null
): Promise<VendaItem[]> {
  let endpoint = '/vendas';
  const params = new URLSearchParams();
  if (dataInicio) params.append('dataInicio', dataInicio);
  if (dataFim) params.append('dataFim', dataFim);
  if (params.toString()) endpoint += `?${params.toString()}`;

  return await fetchWithAuth(endpoint, token);
}

// 15. GET /vendas/:id
export async function getVendaPorId(id: number, token: string | null): Promise<VendaItem> {
  return await fetchWithAuth(`/vendas/${id}`, token);
}

// 16. PATCH /parcelas/:id/ajuste (GERENTE only)
export async function ajustarParcelaAPI(
  id: number,
  valor?: number,
  dataVencimento?: string,
  motivo?: string,
  token: string | null = null
): Promise<Parcela> {
  return await fetchWithAuth(`/parcelas/${id}/ajuste`, token, {
    method: 'PATCH',
    body: JSON.stringify({ valor, dataVencimento, motivo }),
  });
}

// 17. POST /produtos
export async function criarProdutoAPI(
  produtoData: { nome: string; descricao?: string; preco: number; categoria?: CategoriaProduto },
  token: string | null = null
): Promise<Produto> {
  return await fetchWithAuth('/produtos', token, {
    method: 'POST',
    body: JSON.stringify(produtoData),
  });
}

// 18. Histórico de Dias Fechados & Extrato Diário
export interface DiaFechadoItem {
  data: string; // YYYY-MM-DD
  totalCobrado: number;
  qtdPagamentos: number;
}

export interface ExtratoDiaItem {
  ordem: number;
  id: number;
  clienteId: number;
  clienteNome: string;
  clienteTelefone: string;
  clienteEndereco: string;
  vendaId: number;
  parcelaId: number | null;
  produto: string;
  detalhes: string;
  valorPago: number;
  dataPagamento: string;
  criadoEm: string;
}

export interface ExtratoDiaResponse {
  data: string;
  totalCobrado: number;
  qtdPagamentos: number;
  itens: ExtratoDiaItem[];
}

export async function getHistoricoDiasFechados(token: string | null): Promise<DiaFechadoItem[]> {
  return await fetchWithAuth('/pagamentos/dias-fechados', token);
}

export async function getExtratoDia(dataIso: string, token: string | null): Promise<ExtratoDiaResponse> {
  return await fetchWithAuth(`/pagamentos/extrato-dia?data=${dataIso}`, token);
}

// 19. Histórico de Vendas Dias Fechados & Extrato Diário de Vendas
export interface DiaFechadoVendasItem {
  data: string; // YYYY-MM-DD
  totalVendido: number;
  totalVendidoMoveis: number;
  totalVendidoVariedades: number;
  qtdVendas: number;
  qtdVendasMoveis: number;
  qtdVendasVariedades: number;
}

export interface ExtratoDiaVendasItem {
  ordem: number;
  id: number;
  clienteId: number;
  clienteNome: string;
  clienteTelefone: string;
  clienteEndereco: string;
  itens: string;
  condicao: string;
  valorEntrada: number;
  numParcelas: number;
  valorTotal: number;
  tipoVenda: 'MOVEIS' | 'VARIEDADES';
  dataVenda: string;
  criadoEm: string;
}

export interface ExtratoDiaVendasResponse {
  data: string;
  totalVendido: number;
  totalMoveis: number;
  totalVariedades: number;
  qtdVendas: number;
  itens: ExtratoDiaVendasItem[];
}

export async function getHistoricoVendasDiasFechados(token: string | null): Promise<DiaFechadoVendasItem[]> {
  return await fetchWithAuth('/vendas/dias-fechados', token);
}

export async function getExtratoVendasDia(dataIso: string, token: string | null): Promise<ExtratoDiaVendasResponse> {
  return await fetchWithAuth(`/vendas/extrato-dia?data=${dataIso}`, token);
}

// 20. PATCH /clientes/:id — Atualizar dados do cliente
export async function atualizarClienteAPI(
  id: number,
  dados: { nome?: string; telefone?: string; endereco?: string; referencias?: string | null },
  token: string | null = null
): Promise<Cliente> {
  return await fetchWithAuth(`/clientes/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  });
}

// 21. PATCH /parcelas/:id/data-vencimento — Alterar data de vencimento de parcela
export async function alterarDataVencimentoParcelaAPI(
  id: number,
  dataVencimento: string,
  token: string | null = null
): Promise<Parcela> {
  return await fetchWithAuth(`/parcelas/${id}/data-vencimento`, token, {
    method: 'PATCH',
    body: JSON.stringify({ dataVencimento }),
  });
}

// 22. PATCH /parcelas/:id/contato — Registrar data e hora de contato no WhatsApp
export async function registrarContatoParcelaAPI(
  id: number,
  token: string | null = null
): Promise<Parcela> {
  return await fetchWithAuth(`/parcelas/${id}/contato`, token, {
    method: 'PATCH',
  });
}

