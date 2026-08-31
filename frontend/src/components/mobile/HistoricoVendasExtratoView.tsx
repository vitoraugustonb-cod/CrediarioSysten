import React, { useEffect, useState, useCallback } from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  ChevronRight, 
  ArrowLeft, 
  Clock, 
  Search, 
  Copy, 
  Check, 
  Receipt,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getHistoricoVendasDiasFechados, 
  getExtratoVendasDia, 
  type DiaFechadoVendasItem, 
  type ExtratoDiaVendasResponse 
} from '../../services/api';

function formatarDataCompleta(dataIso: string): string {
  if (!dataIso) return 'Data não informada';
  const match = dataIso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dataIso;

  const [, ano, mes, dia] = match;
  const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
  
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const nomeDia = diasSemana[d.getDay()] || '';
  const nomeMes = meses[d.getMonth()] || '';

  return `${nomeDia}, ${dia} de ${nomeMes} de ${ano}`;
}

function formatarDataCurta(dataIso: string): string {
  if (!dataIso) return '';
  const match = dataIso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dataIso;
  const [, ano, mes, dia] = match;
  return `${dia}/${mes}/${ano}`;
}

export const HistoricoVendasExtratoView: React.FC = () => {
  const { token } = useAuth();

  const [diasFechados, setDiasFechados] = useState<DiaFechadoVendasItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');

  // Extrato selecionado
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [extrato, setExtrato] = useState<ExtratoDiaVendasResponse | null>(null);
  const [loadingExtrato, setLoadingExtrato] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);

  const carregarDias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getHistoricoVendasDiasFechados(token);
      setDiasFechados(dados);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar histórico de vendas fechadas.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    carregarDias();
  }, [carregarDias]);

  const abrirExtrato = async (dataIso: string) => {
    setDiaSelecionado(dataIso);
    setLoadingExtrato(true);
    setExtrato(null);
    setError(null);
    try {
      const dados = await getExtratoVendasDia(dataIso, token);
      setExtrato(dados);
    } catch (err: any) {
      setError(err.message || 'Erro ao abrir extrato de vendas do dia.');
    } finally {
      setLoadingExtrato(false);
    }
  };

  const voltarParaLista = () => {
    setDiaSelecionado(null);
    setExtrato(null);
    setError(null);
  };

  const copiarResumoWhatsApp = () => {
    if (!extrato) return;
    const dataStr = formatarDataCurta(extrato.data);
    let texto = `🛍️ *EXTRATO DE VENDAS - ${dataStr}*\n`;
    texto += `----------------------------------------\n`;
    extrato.itens.forEach(item => {
      texto += `${item.ordem}. *${item.clienteNome}*: R$ ${item.valorTotal.toFixed(2)} (${item.itens} - ${item.condicao})\n`;
    });
    texto += `----------------------------------------\n`;
    texto += `💰 *TOTAL VENDIDO:* R$ ${extrato.totalVendido.toFixed(2)}\n`;
    texto += `📦 *Qtd. Vendas:* ${extrato.qtdVendas}\n`;

    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const diasFiltrados = diasFechados.filter(d => {
    const dataFormatada = formatarDataCompleta(d.data).toLowerCase();
    const dataCurta = formatarDataCurta(d.data);
    const termo = busca.toLowerCase();
    return dataFormatada.includes(termo) || dataCurta.includes(termo);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* -------------------------------------------------------------------------- */}
      {/* MODO 1: EXTRATO DETALHADO DE VENDAS DO DIA (TABELA EXCEL) */}
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
              <span>Voltar para Datas</span>
            </button>

            {extrato && (
              <button
                onClick={copiarResumoWhatsApp}
                title="Copiar texto para WhatsApp"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: copiado ? '#1E40AF' : 'var(--primary-800)',
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
                {copiado ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiado ? 'Copiado!' : 'Copiar Resumo'}</span>
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
                  color: '#1E40AF',
                  backgroundColor: '#DBEAFE',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Extrato de Vendas Fechado
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {extrato ? `${extrato.qtdVendas} venda(s)` : ''}
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
              <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Carregando extrato de vendas da planilha...</p>
            </div>
          )}

          {error && (
            <div style={{ padding: '16px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', color: '#B91C1C', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          {/* TABELA ESTILO PLANILHA EXCEL */}
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
              {/* Top Banner da Planilha */}
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
                  <ShoppingBag size={18} color="#60A5FA" />
                  <span>EXTRATO DE VENDAS</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  {formatarDataCurta(extrato.data)}
                </span>
              </div>

              {/* Tabela Excel com Scroll Horizontal */}
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: '0.84rem'
                  }}
                >
                  {/* Cabeçalho de Colunas Excel */}
                  <thead>
                    <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                      <th style={{ padding: '10px 8px', width: '36px', textAlign: 'center', color: '#475569', fontWeight: 800, borderRight: '1px solid #E2E8F0' }}>
                        #
                      </th>
                      <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 800, borderRight: '1px solid #E2E8F0' }}>
                        Cliente
                      </th>
                      <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 800, borderRight: '1px solid #E2E8F0' }}>
                        Itens / Condição
                      </th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', color: '#475569', fontWeight: 800, minWidth: '110px' }}>
                        Valor da Venda
                      </th>
                    </tr>
                  </thead>

                  {/* Linhas da Tabela */}
                  <tbody>
                    {extrato.itens.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          Nenhuma venda registrada neste dia.
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
                            {/* # Índice */}
                            <td style={{ padding: '10px 8px', textAlign: 'center', color: '#64748B', fontWeight: 600, borderRight: '1px solid #E2E8F0' }}>
                              {item.ordem}
                            </td>

                            {/* Cliente */}
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

                            {/* Itens e Condição */}
                            <td style={{ padding: '10px 12px', borderRight: '1px solid #E2E8F0' }}>
                              <div style={{ color: 'var(--primary-800)', fontWeight: 600 }}>
                                {item.itens}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#2563EB', marginTop: '2px', fontWeight: 600 }}>
                                {item.condicao}
                              </div>
                            </td>

                            {/* Valor Total da Venda */}
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#1E40AF', fontSize: '0.92rem' }}>
                              R$ {item.valorTotal.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>

                  {/* Rodapé da Tabela: Linha de Totalização */}
                  <tfoot>
                    <tr
                      style={{
                        backgroundColor: '#DBEAFE',
                        borderTop: '2px solid #93C5FD',
                        borderBottom: '2px solid #93C5FD'
                      }}
                    >
                      <td
                        colSpan={3}
                        style={{
                          padding: '12px 14px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: '#1E40AF',
                          fontSize: '0.88rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                          borderRight: '1px solid #93C5FD'
                        }}
                      >
                        Soma Total Vendido no Dia:
                      </td>
                      <td
                        style={{
                          padding: '12px 14px',
                          textAlign: 'right',
                          fontWeight: 900,
                          color: '#1E3A8A',
                          fontSize: '1.15rem'
                        }}
                      >
                        R$ {extrato.totalVendido.toFixed(2)}
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
        /* MODO 2: LISTA CORRIDA DE DATAS FECHADAS DE VENDAS */
        /* -------------------------------------------------------------------------- */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header da Aba */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={24} color="#2563EB" />
                Histórico de Vendas
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Extratos consolidados de vendas dos dias anteriores
              </p>
            </div>
          </div>

          {/* Banner Informativo sobre Fechamento do Dia Atual */}
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
              <strong>Regra de Fechamento:</strong> Os extratos de vendas são fechados somente após o encerramento do dia. Para acompanhar as vendas de hoje em andamento, utilize a aba <strong>Resumo Dia</strong>.
            </div>
          </div>

          {/* Campo de Busca por Data */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar por data (ex: 30/08 ou agosto)..."
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
              <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Buscando extratos de vendas fechados...</p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div style={{ padding: '16px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)', color: '#B91C1C', fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          {/* Lista Corrida de Datas */}
          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {diasFiltrados.length === 0 ? (
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
                    Nenhum extrato de venda anterior encontrado
                  </p>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>
                    Extratos de vendas de dias passados aparecerão aqui assim que houver vendas finalizadas.
                  </p>
                </div>
              ) : (
                diasFiltrados.map((dia) => (
                  <button
                    key={dia.data}
                    type="button"
                    onClick={() => abrirExtrato(dia.data)}
                    className="touch-target"
                    style={{
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                      border: '1px solid var(--border-color, #E2E8F0)',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Calendar size={20} color="#1E40AF" />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                          {formatarDataCompleta(dia.data)}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {dia.qtdVendas} venda(s) realizada(s)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
                          Total Vendido
                        </span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E40AF' }}>
                          R$ {dia.totalVendido.toFixed(2)}
                        </span>
                      </div>

                      <ChevronRight size={20} color="var(--text-muted)" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
