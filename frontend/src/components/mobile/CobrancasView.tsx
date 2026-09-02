import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  FileText, 
  X, 
  ArrowRight, 
  Users, 
  CheckCircle2,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  getParcelas, 
  registrarPagamentoAPI, 
  registrarObservacaoAPI, 
  registrarContatoParcelaAPI,
  type Parcela 
} from '../../services/api';

interface CobrancasViewProps {
  onNavigate?: (tab: string) => void;
}

// Verifica se a data de último contato foi realizada hoje (fuso local)
function foiContatadoHoje(ultimoContatoEm?: string | null): boolean {
  if (!ultimoContatoEm) return false;
  const match = String(ultimoContatoEm).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, ano, mes, dia] = match;
    const dHoje = new Date();
    return Number(ano) === dHoje.getFullYear() && 
           Number(mes) - 1 === dHoje.getMonth() && 
           Number(dia) === dHoje.getDate();
  }
  const d = new Date(ultimoContatoEm);
  const dHoje = new Date();
  return d.getFullYear() === dHoje.getFullYear() && 
         d.getMonth() === dHoje.getMonth() && 
         d.getDate() === dHoje.getDate();
}

function formatarHoraContato(ultimoContatoEm?: string | null): string {
  if (!ultimoContatoEm) return '';
  const d = new Date(ultimoContatoEm);
  if (isNaN(d.getTime())) return '';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export const CobrancasView: React.FC<CobrancasViewProps> = ({ onNavigate }) => {
  const { token } = useAuth();
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<'TODOS' | 'COBRAR_HOJE' | 'ATRASADO'>('COBRAR_HOJE');
  const [gavetaContatadosAberta, setGavetaContatadosAberta] = useState<boolean>(true);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Selected Parcela for Detail Modal
  const [parcelaSelecionada, setParcelaSelecionada] = useState<Parcela | null>(null);

  // Action Sub-modals
  const [modalPagamento, setModalPagamento] = useState<boolean>(false);
  const [modalObservacao, setModalObservacao] = useState<boolean>(false);

  // Validation Sub-modal
  const [modalValidacaoValor, setModalValidacaoValor] = useState<boolean>(false);
  const [valorConfirmacaoInput, setValorConfirmacaoInput] = useState<string>('');
  const [erroConfirmacao, setErroConfirmacao] = useState<string | null>(null);

  // Form states
  const [valorPagoInput, setValorPagoInput] = useState<string>('');
  const [dataPagamentoInput, setDataPagamentoInput] = useState<string>('');
  const [observacaoInput, setObservacaoInput] = useState<string>('');
  const [salvando, setSalvando] = useState<boolean>(false);

  const carregarParcelas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await getParcelas(token);
      setParcelas(dados);
    } catch {
      setError('Erro ao carregar parcelas de cobrança.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    carregarParcelas();
  }, [carregarParcelas]);

  const abrirDetalhe = (p: Parcela) => {
    setParcelaSelecionada(p);
    setValorPagoInput(String(p.valor));
    setDataPagamentoInput(new Date().toISOString().substring(0, 10));
    setObservacaoInput(p.observacao || '');
  };

  const abrirWhatsAppCliente = async (p: Parcela) => {
    const telefone = p.venda?.cliente?.telefone;
    if (!telefone || !telefone.trim()) {
      alert('⚠️ Este cliente não possui número de telefone cadastrado.');
      return;
    }

    let numeros = telefone.replace(/\D/g, '');

    if (!numeros || numeros.length < 8) {
      alert('⚠️ O número de telefone cadastrado é inválido.');
      return;
    }

    if (numeros.length === 10 || numeros.length === 11) {
      numeros = `55${numeros}`;
    } else if (numeros.length === 8 || numeros.length === 9) {
      numeros = `55${numeros}`;
    }

    const url = `https://wa.me/${numeros}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    const agoraIso = new Date().toISOString();
    setParcelas(prev => prev.map(item => item.id === p.id ? { ...item, ultimoContatoEm: agoraIso } : item));
    if (parcelaSelecionada && parcelaSelecionada.id === p.id) {
      setParcelaSelecionada(prev => prev ? { ...prev, ultimoContatoEm: agoraIso } : null);
    }

    try {
      await registrarContatoParcelaAPI(p.id, token);
    } catch (err) {
      console.error('Erro ao registrar contato no servidor:', err);
    }
  };

  const handleIniciarValidacaoPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaSelecionada || !valorPagoInput) return;

    const valorNum = parseFloat(valorPagoInput);
    if (isNaN(valorNum) || valorNum <= 0) {
      alert('Informe um valor de pagamento válido.');
      return;
    }

    setValorConfirmacaoInput('');
    setErroConfirmacao(null);
    setModalValidacaoValor(true);
  };

  const handleConfirmarEExecutarPagamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaSelecionada || !valorPagoInput) return;

    const valorOriginalNum = parseFloat(valorPagoInput);
    const valorConfirmaNum = parseFloat(valorConfirmacaoInput);

    if (isNaN(valorConfirmaNum) || Math.abs(valorOriginalNum - valorConfirmaNum) > 0.001) {
      setErroConfirmacao(`O valor digitado (R$ ${isNaN(valorConfirmaNum) ? '0,00' : valorConfirmaNum.toFixed(2)}) não coincide com R$ ${valorOriginalNum.toFixed(2)}. Re-digite exatamente o mesmo valor.`);
      return;
    }

    const nomeCliente = parcelaSelecionada.venda?.cliente?.nome || 'Cliente';

    setSalvando(true);
    try {
      await registrarPagamentoAPI(
        parcelaSelecionada.id,
        valorOriginalNum,
        dataPagamentoInput,
        token
      );
      
      setModalValidacaoValor(false);
      setModalPagamento(false);
      setParcelaSelecionada(null);
      
      await carregarParcelas();

      setMensagemSucesso(`✅ Pagamento de R$ ${valorOriginalNum.toFixed(2)} registrado para ${nomeCliente}!`);
      
      setTimeout(() => setMensagemSucesso(null), 5000);
    } catch (err: any) {
      alert(`❌ Erro ao registrar pagamento: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarObservacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelaSelecionada) return;

    const nomeCliente = parcelaSelecionada.venda?.cliente?.nome || 'Cliente';

    setSalvando(true);
    try {
      await registrarObservacaoAPI(
        parcelaSelecionada.id,
        observacaoInput,
        token
      );
      
      setModalObservacao(false);
      setParcelaSelecionada(null);
      await carregarParcelas();
      
      setMensagemSucesso(`✅ Observação registrada para ${nomeCliente}!`);
      setTimeout(() => setMensagemSucesso(null), 4000);
    } catch (err: any) {
      alert(`❌ Erro ao salvar observação: ${err.message}`);
    } finally {
      setSalvando(false);
    }
  };

  // Funcao para calcular o status exato da cobranca: COBRAR_HOJE ou ATRASADO
  const getStatusCobranca = (dataVencimentoStr: string, statusOriginal: string): 'COBRAR_HOJE' | 'ATRASADO' | 'EM_DIA' | 'PAGA' => {
    if (statusOriginal === 'PAGA') return 'PAGA';

    let anoVenc = 0, mesVenc = 0, diaVenc = 0;
    if (typeof dataVencimentoStr === 'string') {
      const match = dataVencimentoStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        anoVenc = Number(match[1]);
        mesVenc = Number(match[2]) - 1;
        diaVenc = Number(match[3]);
      }
    }

    if (!anoVenc) {
      const d = new Date(dataVencimentoStr);
      anoVenc = d.getFullYear();
      mesVenc = d.getMonth();
      diaVenc = d.getDate();
    }

    const dHoje = new Date();
    const vencLocal = new Date(anoVenc, mesVenc, diaVenc).getTime();
    const hojeLocal = new Date(dHoje.getFullYear(), dHoje.getMonth(), dHoje.getDate()).getTime();

    if (vencLocal === hojeLocal) {
      return 'COBRAR_HOJE';
    } else if (vencLocal < hojeLocal || statusOriginal === 'ATRASADA') {
      return 'ATRASADO';
    } else {
      return 'EM_DIA';
    }
  };

  // 1. Filtrar APENAS parcelas com vencimento HOJE ou ATRASADAS
  const cobrancasFiltradasPorData = useMemo(() => {
    return parcelas.filter(p => {
      const statusC = getStatusCobranca(p.dataVencimento, p.status);
      return statusC === 'COBRAR_HOJE' || statusC === 'ATRASADO';
    });
  }, [parcelas]);

  // 2. Filtro pelas abas (Cobrar Hoje / Atrasados)
  const cobrancasPorStatus = useMemo(() => {
    return cobrancasFiltradasPorData.filter(p => {
      const statusC = getStatusCobranca(p.dataVencimento, p.status);
      if (filtroStatus === 'COBRAR_HOJE') return statusC === 'COBRAR_HOJE';
      if (filtroStatus === 'ATRASADO') return statusC === 'ATRASADO';
      return true;
    });
  }, [cobrancasFiltradasPorData, filtroStatus]);

  // 3. Filtro por Busca de texto
  const parcelasExibidas = useMemo(() => {
    return cobrancasPorStatus.filter(p => {
      const q = busca.toLowerCase().trim();
      if (!q) return true;
      const nome = p.venda?.cliente?.nome?.toLowerCase() || '';
      const end = p.venda?.cliente?.endereco?.toLowerCase() || '';
      const tel = p.venda?.cliente?.telefone || '';
      return nome.includes(q) || end.includes(q) || tel.includes(q);
    });
  }, [cobrancasPorStatus, busca]);

  // 4. Separação entre Fila Pendente e Já Contatados Hoje
  const pendentesContato = useMemo(() => {
    return parcelasExibidas.filter(p => !foiContatadoHoje(p.ultimoContatoEm));
  }, [parcelasExibidas]);

  const jaContatadosHoje = useMemo(() => {
    return parcelasExibidas.filter(p => foiContatadoHoje(p.ultimoContatoEm));
  }, [parcelasExibidas]);

  // Contadores
  const qtdHoje = cobrancasFiltradasPorData.filter(p => getStatusCobranca(p.dataVencimento, p.status) === 'COBRAR_HOJE').length;
  const qtdAtrasados = cobrancasFiltradasPorData.filter(p => getStatusCobranca(p.dataVencimento, p.status) === 'ATRASADO').length;

  // Renderização ultra otimizada e consistente de Card de Cobrança
  const renderCardCobranca = (p: Parcela, isJaContatado: boolean) => {
    const statusC = getStatusCobranca(p.dataVencimento, p.status);
    const isHoje = statusC === 'COBRAR_HOJE';
    const cliente = p.venda?.cliente;

    const [yyyy, mm, dd] = p.dataVencimento.substring(0, 10).split('-');
    const dataVencFormatada = `${dd}/${mm}/${yyyy}`;

    const cardBorderTop = isHoje ? '4px solid #2563EB' : '4px solid #DC2626';
    const badgeBg = isHoje ? '#EFF6FF' : '#FEE2E2';
    const badgeText = isHoje ? '#1D4ED8' : '#B91C1C';
    const statusLabel = isHoje ? '🔵 Hoje' : '🔴 Atrasado';
    const horaContato = formatarHoraContato(p.ultimoContatoEm);

    return (
      <div
        key={p.id}
        onClick={() => abrirDetalhe(p)}
        style={{
          backgroundColor: isJaContatado ? '#F8FAFC' : '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '12px 10px',
          borderLeft: isJaContatado ? '1px solid #CBD5E1' : '1px solid var(--border-color)',
          borderRight: isJaContatado ? '1px solid #CBD5E1' : '1px solid var(--border-color)',
          borderBottom: isJaContatado ? '1px solid #CBD5E1' : '1px solid var(--border-color)',
          borderTop: cardBorderTop,
          boxShadow: isJaContatado ? 'none' : 'var(--shadow-sm)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '8px',
          minHeight: '215px',
          transition: 'all 0.15s ease',
          opacity: isJaContatado ? 0.92 : 1,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', minHeight: '22px' }}>
          <span
            style={{
              padding: '2px 7px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: badgeBg,
              color: badgeText,
              fontWeight: 800,
              fontSize: '0.68rem',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            {statusLabel}
          </span>

          {isJaContatado && (
            <span
              style={{
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontWeight: 800,
                fontSize: '0.66rem',
                textAlign: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                whiteSpace: 'nowrap'
              }}
            >
              <MessageCircle size={10} />
              <span>{horaContato || 'Chamado'}</span>
            </span>
          )}
        </div>

        {/* Customer Info (Altura fixa para alinhar todos os cards da fileira perfeitamente) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'center', minHeight: '48px', justifyContent: 'center' }}>
          <h4
            style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: 'var(--primary-800)',
              margin: 0,
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}
            title={cliente?.nome}
          >
            {cliente?.nome || 'Cliente'}
          </h4>

          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%'
            }}
            title={cliente?.endereco}
          >
            <MapPin size={11} color="var(--accent-600)" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {cliente?.endereco || 'Sem endereço'}
            </span>
          </div>
        </div>

        {/* Installment Info & Amount */}
        <div style={{ padding: '6px 4px', backgroundColor: isJaContatado ? '#EEF2F6' : 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', whiteSpace: 'nowrap' }}>
            P. {p.numero}/{p.venda?.numParcelas || 1} • {dataVencFormatada}
          </span>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isHoje ? '#1D4ED8' : '#B91C1C', marginTop: '2px' }}>
            R$ {Number(p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Action Button */}
        <button
          className="touch-target"
          style={{
            width: '100%',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isHoje ? '#EFF6FF' : '#FEE2E2',
            color: isHoje ? '#1D4ED8' : '#B91C1C',
            border: `1px solid ${isHoje ? '#BFDBFE' : '#FCA5A5'}`,
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          Cobrar
        </button>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
      
      {/* Banner de Mensagem de Sucesso */}
      {mensagemSucesso && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: '1px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Buscar cliente na rota..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            width: '100%',
            height: '44px',
            padding: '0 12px 0 38px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: '#FFFFFF',
            fontSize: '0.9rem',
            outline: 'none',
            boxShadow: 'var(--shadow-sm)',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Filter Tabs: Cobrar Hoje / Atrasados / Todos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.9fr', gap: '6px' }}>
        <button
          type="button"
          onClick={() => setFiltroStatus('COBRAR_HOJE')}
          style={{
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: filtroStatus === 'COBRAR_HOJE' ? '2px solid #2563EB' : '1px solid var(--border-color)',
            backgroundColor: filtroStatus === 'COBRAR_HOJE' ? '#EFF6FF' : '#FFFFFF',
            color: '#1D4ED8',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: filtroStatus === 'COBRAR_HOJE' ? 'var(--shadow-sm)' : 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <span>🔵 Hoje ({qtdHoje})</span>
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus('ATRASADO')}
          style={{
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: filtroStatus === 'ATRASADO' ? '2px solid #DC2626' : '1px solid var(--border-color)',
            backgroundColor: filtroStatus === 'ATRASADO' ? '#FEE2E2' : '#FFFFFF',
            color: '#B91C1C',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: filtroStatus === 'ATRASADO' ? 'var(--shadow-sm)' : 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <span>🔴 Atrasados ({qtdAtrasados})</span>
        </button>

        <button
          type="button"
          onClick={() => setFiltroStatus('TODOS')}
          style={{
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: filtroStatus === 'TODOS' ? '2px solid var(--primary-800)' : '1px solid var(--border-color)',
            backgroundColor: filtroStatus === 'TODOS' ? 'var(--primary-100)' : '#FFFFFF',
            color: 'var(--primary-900)',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: filtroStatus === 'TODOS' ? 'var(--shadow-sm)' : 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <span>Todos ({cobrancasFiltradasPorData.length})</span>
        </button>
      </div>



      {loading && (
        <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Carregando rota de cobrança...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--status-atrasada-bg)',
            color: 'var(--status-atrasada-text)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Parcelas Content */}
      {!loading && (
        <>
          {parcelasExibidas.length === 0 ? (
            <div 
              style={{ 
                padding: '24px 14px', 
                textAlign: 'center', 
                backgroundColor: '#FFFFFF', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {busca 
                  ? `Nenhuma cobrança encontrada com "${busca}".` 
                  : 'Nenhuma cobrança pendente para hoje ou em atraso!'}
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('clientes')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-600)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Users size={16} />
                  <span>Ver Todos os Clientes</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              {/* ================================================================ */}
              {/* SEÇÃO 1: FILA DE COBRANÇA — PENDENTES DE CONTATO                 */}
              {/* ================================================================ */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                      📌 Fila de Cobrança (Faltam Chamar)
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '2px 7px', borderRadius: 'var(--radius-full)' }}>
                      {pendentesContato.length}
                    </span>
                  </div>
                </div>

                {pendentesContato.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-md)', color: '#166534', fontSize: '0.82rem', fontWeight: 600 }}>
                    🎉 Todos os clientes desta lista já receberam mensagem hoje!
                  </div>
                ) : (
                  <div className="cobrancas-grid">
                    {pendentesContato.map(p => renderCardCobranca(p, false))}
                  </div>
                )}
              </div>

              {/* ================================================================ */}
              {/* SEÇÃO 2: JÁ CHAMADOS NO WHATSAPP HOJE                            */}
              {/* ================================================================ */}
              {jaContatadosHoje.length > 0 && (
                <div>
                  {/* Cabeçalho da Gaveta de Já Chamados */}
                  <div
                    onClick={() => setGavetaContatadosAberta(!gavetaContatadosAberta)}
                    style={{
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      marginBottom: gavetaContatadosAberta ? '8px' : '0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageCircle size={16} color="#166534" />
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1E293B' }}>
                        📁 Já Chamados no WhatsApp ({jaContatadosHoje.length})
                      </span>
                    </div>
                    {gavetaContatadosAberta ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
                  </div>

                  {/* Grid de Já Chamados */}
                  {gavetaContatadosAberta && (
                    <div className="cobrancas-grid">
                      {jaContatadosHoje.map(p => renderCardCobranca(p, true))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Prompt to navigate to Clientes tab */}
          {onNavigate && cobrancasFiltradasPorData.length > 0 && (
            <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Precisa consultar um cliente que não está em cobrança hoje?
              </span>
              <button
                type="button"
                onClick={() => onNavigate('clientes')}
                style={{
                  marginTop: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'transparent',
                  color: 'var(--accent-700)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <span>Ir para a Aba Clientes (Ver Todos)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* MODAL DETALHE DA PARCELA */}
      {/* -------------------------------------------------------------------------- */}
      {parcelaSelecionada && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setParcelaSelecionada(null);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 16px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: getStatusCobranca(parcelaSelecionada.dataVencimento, parcelaSelecionada.status) === 'COBRAR_HOJE' ? '#EFF6FF' : '#FEE2E2',
                    color: getStatusCobranca(parcelaSelecionada.dataVencimento, parcelaSelecionada.status) === 'COBRAR_HOJE' ? '#1D4ED8' : '#B91C1C',
                    fontWeight: 800,
                    fontSize: '0.74rem'
                  }}
                >
                  {getStatusCobranca(parcelaSelecionada.dataVencimento, parcelaSelecionada.status) === 'COBRAR_HOJE' ? '🔵 Cobrar Hoje' : '🔴 Atrasado'}
                </span>

                {foiContatadoHoje(parcelaSelecionada.ultimoContatoEm) && (
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <MessageCircle size={12} />
                    <span>Chamado hoje às {formatarHoraContato(parcelaSelecionada.ultimoContatoEm)}</span>
                  </span>
                )}

                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Parcela #{parcelaSelecionada.numero}
                </span>
              </div>

              <button
                onClick={() => setParcelaSelecionada(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Customer Details Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                {parcelaSelecionada.venda?.cliente?.nome}
              </h3>
              
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px', margin: '6px 0 0 0' }}>
                <MapPin size={14} color="var(--accent-600)" style={{ flexShrink: 0 }} />
                <span>{parcelaSelecionada.venda?.cliente?.endereco || 'Endereço não cadastrado'}</span>
              </p>

              {parcelaSelecionada.venda?.cliente?.telefone && (
                <p style={{ fontSize: '0.82rem', color: '#166534', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, margin: '4px 0 0 0' }}>
                  <Phone size={14} color="#166534" style={{ flexShrink: 0 }} />
                  <span>{parcelaSelecionada.venda.cliente.telefone}</span>
                </p>
              )}

              {parcelaSelecionada.venda?.cliente?.referencias && (
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic', margin: '4px 0 0 0' }}>
                  Ref: {parcelaSelecionada.venda.cliente.referencias}
                </p>
              )}
            </div>

            {/* Sale & Installment Details */}
            <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Produto & Valor
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                {parcelaSelecionada.venda?.itens?.[0]?.produto?.nome || 'Venda de Crediário'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.88rem' }}>
                <span>Valor da Parcela:</span>
                <strong style={{ color: 'var(--primary-800)', fontSize: '1rem' }}>
                  R$ {Number(parcelaSelecionada.valor).toFixed(2)}
                </strong>
              </div>
              {parcelaSelecionada.valorPago && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.84rem', color: '#15803D' }}>
                  <span>Valor já pago:</span>
                  <strong>R$ {Number(parcelaSelecionada.valorPago).toFixed(2)}</strong>
                </div>
              )}
              {parcelaSelecionada.observacao && (
                <div style={{ marginTop: '8px', padding: '8px 10px', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: '#B45309' }}>
                  💬 <strong>Observação:</strong> {parcelaSelecionada.observacao}
                </div>
              )}
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Botão Registrar Pagamento */}
              <button
                onClick={() => setModalPagamento(true)}
                className="touch-target"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(22, 163, 74, 0.3)',
                }}
              >
                <DollarSign size={18} />
                <span>Registrar Pagamento</span>
              </button>

              {/* Botão Mandar Mensagem no WhatsApp */}
              <button
                onClick={() => abrirWhatsAppCliente(parcelaSelecionada)}
                className="touch-target"
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(37, 211, 102, 0.3)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <MessageCircle size={18} />
                <span>{foiContatadoHoje(parcelaSelecionada.ultimoContatoEm) ? 'Reenviar Mensagem WhatsApp' : 'Mandar Mensagem'}</span>
              </button>

              {/* Botão Registrar Observação */}
              <button
                onClick={() => setModalObservacao(true)}
                className="touch-target"
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--primary-800)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <FileText size={16} />
                <span>Registrar Observação</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Sub-modal: Form de Registrar Pagamento */}
      {modalPagamento && parcelaSelecionada && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalPagamento(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 10010,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                Registrar Pagamento
              </h3>
              <button
                onClick={() => setModalPagamento(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleIniciarValidacaoPagamento} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Valor Recebido (R$) *
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} color="var(--accent-600)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={valorPagoInput}
                    onChange={(e) => setValorPagoInput(e.target.value)}
                    style={{
                      width: '100%',
                      height: '46px',
                      padding: '0 12px 0 36px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '1rem',
                      fontWeight: 800,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Data do Pagamento *
                </label>
                <input
                  type="date"
                  required
                  value={dataPagamentoInput}
                  onChange={(e) => setDataPagamentoInput(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setModalPagamento(false)}
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Sub-modal: Confirmação de Valor */}
      {modalValidacaoValor && parcelaSelecionada && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalValidacaoValor(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 10020,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <DollarSign size={24} />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', margin: '0 0 6px 0' }}>
              Confirmar Valor Recebido
            </h3>
            
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Digite novamente o valor exato recebido (<strong>R$ {parseFloat(valorPagoInput || '0').toFixed(2)}</strong>) para confirmar a baixa:
            </p>

            <form onSubmit={handleConfirmarEExecutarPagamento} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <input
                  type="number"
                  step="0.01"
                  autoFocus
                  required
                  placeholder="0.00"
                  value={valorConfirmacaoInput}
                  onChange={(e) => {
                    setValorConfirmacaoInput(e.target.value);
                    setErroConfirmacao(null);
                  }}
                  style={{
                    width: '100%',
                    height: '48px',
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 900,
                    color: 'var(--primary-800)',
                    borderRadius: 'var(--radius-md)',
                    border: erroConfirmacao ? '2px solid #EF4444' : '2px solid var(--accent-600)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {erroConfirmacao && (
                  <p style={{ fontSize: '0.76rem', color: '#DC2626', marginTop: '6px', textAlign: 'left', lineHeight: 1.3 }}>
                    {erroConfirmacao}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setModalValidacaoValor(false)}
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: salvando ? '#94A3B8' : '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: salvando ? 'not-allowed' : 'pointer',
                  }}
                >
                  {salvando ? 'Gravando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Sub-modal: Form de Registrar Observação */}
      {modalObservacao && parcelaSelecionada && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalObservacao(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 10010,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-800)', margin: 0 }}>
                Registrar Observação
              </h3>
              <button
                onClick={() => setModalObservacao(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvarObservacao} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Nota / Observação sobre o cliente:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ex: Cliente pediu para passar amanhã às 14h..."
                  value={observacaoInput}
                  onChange={(e) => setObservacaoInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setModalObservacao(false)}
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: salvando ? '#94A3B8' : 'var(--accent-600)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: salvando ? 'not-allowed' : 'pointer',
                  }}
                >
                  {salvando ? 'Salvando...' : 'Salvar Nota'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
