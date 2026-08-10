async function runParcelasTest() {
  const baseUrl = 'http://localhost:3300';

  console.log('=== TESTE E2E DE PARCELAS, ATRASOS, PAGAMENTOS E OBSERVAÇÕES (RF11, RF12, RF13, RF17) ===\n');

  // 1. Login Gerente
  const resGerenteLogin = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'gerente@crediario.com', senha: 'gerente123' })
  });
  const gerenteData = await resGerenteLogin.json();
  const gerenteToken = gerenteData.token;

  // 2. Criar Cobrador (Vendedor)
  const cobradorEmail = `cobrador.parcela_${Date.now()}@crediario.com`;
  const resCobrador = await fetch(`${baseUrl}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${gerenteToken}` },
    body: JSON.stringify({
      nome: 'Pedro Cobrador',
      email: cobradorEmail,
      senha: 'cobrador123',
      perfil: 'VENDEDOR_COBRADOR'
    })
  });
  const cobradorData = await resCobrador.json();

  const resCobradorLogin = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cobradorEmail, senha: 'cobrador123' })
  });
  const cobradorLoginData = await resCobradorLogin.json();
  const cobradorToken = cobradorLoginData.token;

  // 3. Cadastrar Cliente e Produto
  const resCliente = await fetch(`${baseUrl}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cobradorToken}` },
    body: JSON.stringify({
      nome: 'João de Souza',
      telefone: '(11) 97777-8888',
      endereco: 'Av. Brasil, 456'
    })
  });
  const cliente = await resCliente.json();

  const resProduto = await fetch(`${baseUrl}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cobradorToken}` },
    body: JSON.stringify({ nome: 'Televisor 50', preco: 2000.00 })
  });
  const produto = await resProduto.json();

  // 4. Criar uma venda com data 60 dias no passado para testar parcelas vencidas (RF17)
  const dataPassado = new Date();
  dataPassado.setDate(dataPassado.getDate() - 60);

  const resVenda = await fetch(`${baseUrl}/vendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cobradorToken}` },
    body: JSON.stringify({
      clienteId: cliente.id,
      produtoId: produto.id,
      valorTotal: 2000.00,
      valorEntrada: 500.00, // Saldo R$ 1500 -> 3x R$ 500
      numParcelas: 3,
      dataVenda: dataPassado.toISOString()
    })
  });
  const venda = await resVenda.json();
  console.log('1. Venda criada no passado com 3 parcelas:', venda.id);

  // 5. Testar GET /parcelas (RF11 e RF17)
  console.log('\n--- ⏰ RF17 & RF11: ATUALIZAÇÃO AUTOMÁTICA DE ATRASO E LISTAGEM ---');
  const resParcelas = await fetch(`${baseUrl}/parcelas`, {
    headers: { 'Authorization': `Bearer ${cobradorToken}` }
  });
  const parcelas = await resParcelas.json();

  const parcelasDestaVenda = parcelas.filter((p: any) => p.vendaId === venda.id);
  console.log(`Cobrador listou ${parcelasDestaVenda.length} parcelas para cobrança.`);

  const temAtrasada = parcelasDestaVenda.some((p: any) => p.status === 'ATRASADA');
  const temDadosCliente = parcelasDestaVenda.every((p: any) => p.venda?.cliente?.nome === 'João de Souza');

  if (temAtrasada && temDadosCliente) {
    console.log('   ✅ RF17 & RF11 CONFIRMADOS: Parcela vencida foi atualizada para ATRASADA e inclui dados do cliente!');
  } else {
    console.error('   ❌ FALHA NO CÁLCULO DE ATRASO OU LISTAGEM!');
    process.exit(1);
  }

  const parcelaParaPagar = parcelasDestaVenda[0];

  // 6. Testar Pagamento Parcial (RF12)
  console.log('\n--- 💵 RF12: REGISTRO DE PAGAMENTO PARCIAL E TOTAL ---');
  const resPagamentoParcial = await fetch(`${baseUrl}/parcelas/${parcelaParaPagar.id}/pagamento`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cobradorToken}` },
    body: JSON.stringify({ valorPago: 200.00 }) // R$ 200 de R$ 500
  });
  const parcelaParcial = await resPagamentoParcial.json();
  console.log(`Pagamento R$ 200/500 -> Status retornado: ${parcelaParcial.status} (Esperado: PARCIAL)`);

  if (parcelaParcial.status === 'PARCIAL' && Number(parcelaParcial.valorPago) === 200) {
    console.log('   ✅ RF12 PARCIAL CONFIRMADO: Status alterado para PARCIAL!');
  } else {
    console.error('   ❌ FALHA NO PAGAMENTO PARCIAL!');
    process.exit(1);
  }

  // 7. Testar Observação de Cobrança (RF13)
  console.log('\n--- 📝 RF13: REGISTRO DE OBSERVAÇÃO DE COBRANÇA ---');
  const textoObs = 'Cliente prometeu pagar os R$ 300 restantes na próxima sexta-feira.';
  const resObs = await fetch(`${baseUrl}/parcelas/${parcelaParaPagar.id}/observacao`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cobradorToken}` },
    body: JSON.stringify({ observacao: textoObs })
  });
  const parcelaComObs = await resObs.json();
  console.log(`Observação gravada: "${parcelaComObs.observacao}"`);

  if (parcelaComObs.observacao === textoObs) {
    console.log('   ✅ RF13 OBSERVAÇÃO CONFIRMADA!');
  } else {
    console.error('   ❌ FALHA NA OBSERVAÇÃO!');
    process.exit(1);
  }

  // 8. Testar Pagamento Total (RF12)
  const resPagamentoTotal = await fetch(`${baseUrl}/parcelas/${parcelaParaPagar.id}/pagamento`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cobradorToken}` },
    body: JSON.stringify({ valorPago: 500.00 })
  });
  const parcelaPaga = await resPagamentoTotal.json();
  console.log(`Pagamento R$ 500/500 -> Status retornado: ${parcelaPaga.status} (Esperado: PAGA)`);

  if (parcelaPaga.status === 'PAGA') {
    console.log('   ✅ RF12 TOTAL CONFIRMADO: Status alterado para PAGA!');
  } else {
    console.error('   ❌ FALHA NO PAGAMENTO TOTAL!');
    process.exit(1);
  }

  console.log('\n✅ TODOS OS REQUISITOS (RF11, RF12, RF13, RF17) PASSARAM EM 100% NOS TESTES!');
}

runParcelasTest().catch((err) => {
  console.error('❌ Erro no teste de parcelas:', err);
  process.exit(1);
});
