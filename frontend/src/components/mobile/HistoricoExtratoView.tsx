import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Calendar, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  ArrowLeft, 
  Clock, 
  Search, 
  Copy, 
  Check, 
  Receipt,
  AlertCircle,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getHistoricoDiasFechados, 
  getExtratoDia, 
  type DiaFechadoItem, 
  type ExtratoDiaResponse 
} from '../../services/api';

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const NOMES_MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function getMesAnoLabel(chaveAnoMes: string): string {
  const [ano, mes] = chaveAnoMes.split('-').map(Number);
  const nomeMes = NOMES_MESES[mes - 1] || '';
  return `${nomeMes} de ${ano}`;
}

// Formata data YYYY-MM-DD para texto por extenso (ex: "Domingo, 30 de Ago de 2026")
function formatarDataCompleta(dataIso: string): string {
  if (!dataIso) return 'Data não informada';
  const match = dataIso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dataIso;

  const [, ano, mes, dia] = match;
  const d = new Date(Number(ano), Number(mes) - 1, Number(dia));

  const nomeDia = DIAS_SEMANA[d.getDay()] || '';
  const nomeMes = NOMES_MESES_ABREV[d.getMonth()] || '';

  return `${nomeDia}, ${dia} de ${nomeMes} de ${ano}`;
}

function formatarDataCurta(dataIso: string): string {
  if (!dataIso) return '';
  const match = dataIso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dataIso;
  const [, ano, mes, dia] = match;
  return `${dia}/${mes}/${ano}`;
}

interface GrupoMesCobranca {
  chave: string; // YYYY-MM
  label: string; // "Setembro de 2026"
  totalCobrado: number;
  qtdPagamentos: number;
  dias: DiaFechadoItem[];
}

export const HistoricoExtratoView: React.FC = () => {
  const { token } = useAuth();

  const [diasFechados, setDiasFechados] = useState<DiaFechadoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Meses expandidos (chave YYYY-MM -> boolean)
  const [mesesExpandidos, setMesesExpandidos] = useState<Record<string, boolean>>({});

  // Extrato selecionado
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [extrato, setExtrato] = useState<ExtratoDiaResponse | null>(null);
  const [loadingExtrato, setLoadingExtrato] = useState<boolean>(false);
  const [copiadoDia, setCopiadoDia] = useState<boolean>(false);
  const [copiadoMesChave, setCopiadoMesChave] = useState<string | null>(null);

  const carregarDias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getHistoricoDiasFechados(token);
      setDiasFechados(dados);
      
      // Abre todos os meses por padrão
      const initialExpand: Record<string, boolean> = {};
      dados.forEach(d => {
        const chaveMes = d.data.substring(0, 7);
        initialExpand[chaveMes] = true;
      });
      setMesesExpandidos(initialExpand);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar histórico de datas fechadas.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    carregarDias();
  }, [carregarDias]);

  const toggleMes = (chave: string) => {
    setMesesExpandidos(prev => ({
      ...prev,
      [chave]: !prev[chave]
    }));
  };

  const abrirExtrato = async (dataIso: string) => {
    setDiaSelecionado(dataIso);
    setLoadingExtrato(true);
    setExtrato(null);
    setError(null);
    try {
      const dados = await getExtratoDia(dataIso, token);
      setExtrato(dados);
    } catch (err: any) {
      setError(err.message || 'Erro ao abrir extrato do dia.');
    } finally {
      setLoadingExtrato(false);
    }
  };

  const voltarParaLista = () => {
    setDiaSelecionado(null);
    setExtrato(null);
    setError(null);
  };

  const copiarResumoDiaWhatsApp = () => {
    if (!extrato) return;
    const dataStr = formatarDataCurta(extrato.data);
    let texto = `📊 *EXTRATO DE COBRANÇA - ${dataStr}*\n`;
    texto += `----------------------------------------\n`;
    extrato.itens.forEach(item => {
      texto += `${item.ordem}. *${item.clienteNome}*: R$ ${item.valorPago.toFixed(2)} (${item.produto})\n`;
    });
    texto += `----------------------------------------\n`;
    texto += `💰 *TOTAL COBRADO:* R$ ${extrato.totalCobrado.toFixed(2)}\n`;
    texto += `📦 *Qtd. Pagamentos:* ${extrato.qtdPagamentos}\n`;

    navigator.clipboard.writeText(texto);
    setCopiadoDia(true);
    setTimeout(() => setCopiadoDia(false), 2500);
  };

  const copiarResumoMesWhatsApp = (grupo: GrupoMesCobranca, e: React.MouseEvent) => {
    e.stopPropagation();
    let texto = `📅 *PRESTAÇÃO DE CONTAS - ${grupo.label.toUpperCase()}*\n`;
    texto += `----------------------------------------\n`;
    grupo.dias.forEach(d => {
      texto += `• ${formatarDataCurta(d.data)}: R$ ${d.totalCobrado.toFixed(2)} (${d.qtdPagamentos} cobr.)\n`;
    });
    texto += `----------------------------------------\n`;
    texto += `💰 *TOTAL DO MÊS:* R$ ${grupo.totalCobrado.toFixed(2)}\n`;
    texto += `📦 *Total de Cobranças:* ${grupo.qtdPagamentos}\n`;
    texto += `📆 *Dias Trabalhados:* ${grupo.dias.length}\n`;

    navigator.clipboard.writeText(texto);
    setCopiadoMesChave(grupo.chave);
    setTimeout(() => setCopiadoMesChave(null), 2500);
  };

  // 1. Filtragem por termo de busca
  const diasFiltrados = useMemo(() => {
    return diasFechados.filter(d => {
      const dataFormatada = formatarDataCompleta(d.data).toLowerCase();
      const dataCurta = formatarDataCurta(d.data);
      const chaveMes = d.data.substring(0, 7);
      const labelMes = getMesAnoLabel(chaveMes).toLowerCase();
      const termo = busca.toLowerCase();
      return dataFormatada.includes(termo) || dataCurta.includes(termo) || labelMes.includes(termo);
    });
  }, [diasFechados, busca]);

  // 2. Agrupamento por mês
  const gruposMeses = useMemo(() => {
    const mapa = new Map<string, GrupoMesCobranca>();

    for (const d of diasFiltrados) {
      const chave = d.data.substring(0, 7); // "YYYY-MM"
      if (!mapa.has(chave)) {
        mapa.set(chave, {
          chave,
          label: getMesAnoLabel(chave),
          totalCobrado: Number(d.totalCobrado),
          qtdPagamentos: Number(d.qtdPagamentos),
          dias: [d]
        });
      } else {
        const g = mapa.get(chave)!;
        g.totalCobrado += Number(d.totalCobrado);
        g.qtdPagamentos += Number(d.qtdPagamentos);
        g.dias.push(d);
      }
    }

    return Array.from(mapa.values()).sort((a, b) => b.chave.localeCompare(a.chave));
  }, [diasFiltrados]);

  // Total acumulado geral exibido
  const totalGeralCobrado = useMemo(() => {
    return gruposMeses.reduce((acc, g) => acc + g.totalCobrado, 0);
  }, [gruposMeses]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* -------------------------------------------------------------------------- */}
      {/* MODO 1: EXTRATO DETALHADO DO DIA (ESTILO TABELA EXCEL) */}
      {/* -------------------------------------------------------------------------- */}
      {diaSelecionado ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Bar com Botão Voltar e Ações */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={voltarParaLista}
              className="touch-target"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <ArrowLeft size={18} />
              <span>Voltar para Meses</span>
            </button>

            {extrato && (
              <button
                onClick={copiarResumoDiaWhatsApp}
                title="Copiar texto para WhatsApp"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: copiadoDia ? '#166534' : 'var(--primary-800)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                {copiadoDia ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiadoDia ? 'Copiado!' : 'Copiar Resumo'}</span>
              </button>
            )}
          </div>

          {/* Cabeçalho do Extrato Fechado */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#166534',
                  backgroundColor: '#DCFCE7',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Extrato Fechado
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {extrato ? `${extrato.qtdPagamentos} pagamentos realizados` : ''}
              </span>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)', margin: '4px 0 0 0' }}>
              {formatarDataCompleta(diaSelecionado)}
            </h2>
          </div>

          {/* Estado de Carregamento ou Erro */}
          {loadingExtrato && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '8px' }}>
                <Clock size={28} />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Carregando extrato do dia...</p>
            </div>
          )}

          {error && (
            <div style={{ padding: '16px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', color: '#B91C1C', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          {/* TABELA ESTILO PLANILHA */}
          {extrato && !loadingExtrato && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #CBD5E1',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #020617'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700 }}>
                  <FileSpreadsheet size={18} color="#60A5FA" />
                  <span>EXTRATO DE COBRANÇAS DO DIA</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {formatarDataCurta(extrato.data)}
                </span>
              </div>

              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: '0.84rem'
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                      <th style={{ padding: '10px 8px', width: '36px', textAlign: 'center', color: '#475569', fontWeight: 800, borderRight: '1px solid #E2E8F0' }}>
                        #
                      </th>
                      <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 800, borderRight: '1px solid #E2E8F0' }}>
                        Cliente
                      </th>
                      <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 800, borderRight: '1px solid #E2E8F0' }}>
                        Produto / Parcela
                      </th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', color: '#475569', fontWeight: 800, minWidth: '100px' }}>
                        Valor Pago
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {extrato.itens.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          Nenhum pagamento registrado neste dia.
                        </td>
                      </tr>
                    ) : (
                      extrato.itens.map((item, idx) => {
                        const isPar = idx % 2 === 0;
                        return (
                          <tr
                            key={item.id}
                            style={{
                              backgroundColor: isPar ? '#FFFFFF' : '#F8FAFC',
                              borderBottom: '1px solid #E2E8F0'
                            }}
                          >
                            <td style={{ padding: '10px 8px', textAlign: 'center', color: '#64748B', fontWeight: 600, borderRight: '1px solid #E2E8F0' }}>
                              {item.ordem}
                            </td>

                            <td style={{ padding: '10px 12px', borderRight: '1px solid #E2E8F0' }}>
                              <div style={{ fontWeight: 700, color: 'var(--primary-800)' }}>
                                {item.clienteNome}
                              </div>
                              {item.clienteTelefone && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                  📞 {item.clienteTelefone}
                                </div>
                              )}
                            </td>

                            <td style={{ padding: '10px 12px', borderRight: '1px solid #E2E8F0' }}>
                              <div style={{ color: 'var(--primary-800)', fontWeight: 600 }}>
                                {item.produto}
                              </div>
                              {item.detalhes && (
                                <div style={{ fontSize: '0.72rem', color: '#15803D', marginTop: '2px' }}>
                                  {item.detalhes}
                                </div>
                              )}
                            </td>

                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#166534', fontSize: '0.92rem' }}>
                              R$ {item.valorPago.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>

                  <tfoot>
                    <tr
                      style={{
                        backgroundColor: '#DCFCE7',
                        borderTop: '2px solid #86EFAC',
                        borderBottom: '2px solid #86EFAC'
                      }}
                    >
                      <td
                        colSpan={3}
                        style={{
                          padding: '12px 14px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: '#166534',
                          fontSize: '0.88rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                          borderRight: '1px solid #86EFAC'
                        }}
                      >
                        Soma Total Cobrado no Dia:
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          textAlign: 'right',
                          fontWeight: 900,
                          color: '#14532D',
                          fontSize: '1.15rem'
                        }}
                      >
                        R$ {extrato.totalCobrado.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* -------------------------------------------------------------------------- */
        /* MODO 2: LISTA DE DATAS AGRUPADAS EM MESES COM TOTAIS CONSOLIDADOS          */
        /* -------------------------------------------------------------------------- */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header da Aba */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={24} color="var(--accent-600)" />
                Histórico de Cobrança
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Extratos consolidados e totais agrupados por mês
              </p>
            </div>
          </div>

          {/* Banner Informativo */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <AlertCircle size={20} color="#1D4ED8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.8rem', color: '#1E40AF', lineHeight: 1.4 }}>
              <strong>Prestação de Contas:</strong> Os totais de cada mês são somados automaticamente para facilitar a prestação de contas mensal. Os extratos do dia de hoje fecham ao término do dia.
            </div>
          </div>

          {/* Campo de Busca por Data / Mês */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar por data ou mês (ex: 30/08 ou agosto)..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px 0 42px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '14px', top: '14px' }}
            />
          </div>

          {/* Estado de Carregamento */}
          {loading && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '8px' }}>
                <Clock size={28} />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Buscando histórico consolidado...</p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div style={{ padding: '16px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', color: '#B91C1C', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          {/* LISTA DE MESES AGRUPADOS */}
          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {gruposMeses.length === 0 ? (
                <div
                  style={{
                    padding: '36px 16px',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border-color, #CBD5E1)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <Receipt size={36} color="var(--text-muted)" style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-800)', margin: '0 0 4px 0' }}>
                    Nenhum extrato anterior encontrado
                  </p>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>
                    {busca ? `Nenhum resultado para "${busca}".` : 'Extratos anteriores aparecerão aqui organizados por mês.'}
                  </p>
                </div>
              ) : (
                gruposMeses.map((grupo) => {
                  const expandido = mesesExpandidos[grupo.chave] ?? true;
                  const copiadoEsteMes = copiadoMesChave === grupo.chave;

                  return (
                    <div
                      key={grupo.chave}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid #CBD5E1',
                        boxShadow: 'var(--shadow-sm)',
                        overflow: 'hidden'
                      }}
                    >
                      {/* HEADER DO MÊS (CLICÁVEL PARA EXPANDIR/RECOLHER) */}
                      <div
                        onClick={() => toggleMes(grupo.chave)}
                        style={{
                          backgroundColor: '#0F172A',
                          color: '#FFFFFF',
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'rgba(255, 255, 255, 0.12)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Calendar size={18} color="#60A5FA" />
                          </div>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                              {grupo.label}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '1px' }}>
                              {grupo.dias.length} {grupo.dias.length === 1 ? 'dia fechado' : 'dias fechados'} • {grupo.qtdPagamentos} cobranças
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                          {/* Botão Copiar Resumo do Mês */}
                          <button
                            type="button"
                            title="Copiar resumo do mês para WhatsApp"
                            onClick={(e) => copiarResumoMesWhatsApp(grupo, e)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: copiadoEsteMes ? '#166534' : 'rgba(255, 255, 255, 0.15)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              padding: '6px 10px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {copiadoEsteMes ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copiadoEsteMes ? 'Copiado!' : 'Copiar Mês'}</span>
                          </button>

                          {expandido ? <ChevronUp size={20} color="#94A3B8" /> : <ChevronDown size={20} color="#94A3B8" />}
                        </div>
                      </div>

                      {/* CARD DO TOTAL DO MÊS */}
                      <div
                        style={{
                          backgroundColor: '#F0FDF4',
                          borderBottom: '1px solid #BBF7D0',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Wallet size={20} color="#166534" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                            Total Cobrado em {grupo.label}:
                          </span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803D' }}>
                          R$ {grupo.totalCobrado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>

                      {/* LISTA DE DIAS DO MÊS (EXPANSÍVEL) */}
                      {expandido && (
                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#F8FAFC' }}>
                          {grupo.dias.map((dia) => (
                            <button
                              key={dia.data}
                              type="button"
                              onClick={() => abrirExtrato(dia.data)}
                              className="touch-target"
                              style={{
                                width: '100%',
                                backgroundColor: '#FFFFFF',
                                borderRadius: 'var(--radius-md)',
                                padding: '12px 14px',
                                border: '1px solid var(--border-color, #E2E8F0)',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s ease',
                                gap: '10px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: '#EFF6FF',
                                    border: '1px solid #BFDBFE',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  <Calendar size={18} color="#2563EB" />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                                    {formatarDataCompleta(dia.data)}
                                  </div>
                                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                                    {dia.qtdPagamentos} cobrança(s) no dia
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <div style={{ textAlign: 'right' }}>
                                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
                                    Total do Dia
                                  </span>
                                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#166534' }}>
                                    R$ {Number(dia.totalCobrado).toFixed(2)}
                                  </span>
                                </div>

                                <ChevronRight size={18} color="var(--text-muted)" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
