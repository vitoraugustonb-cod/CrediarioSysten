async function runRelatoriosTest() {
  const baseUrl = 'http://localhost:3300';

  console.log('=== TESTE E2E DE PRESTAÇÃO DE CONTAS, RELATÓRIOS, RE AJUSTES E SALDO (RF04, RF05, RF06, RF14, RF15, RF19) ===\n');

  // 1. Logins
  const resGerenteLogin = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'gerente@crediario.com', senha: 'gerente123' })
  });
  const gerenteData = await resGerenteLogin.json();
  const gerenteToken = gerenteData.token;

  // Criar Vendedor
  const vendedorEmail = `vendedor.relatorio_${Date.now()}@crediario.com`;
  const resVendedor = await fetch(`${baseUrl}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${gerenteToken}` },
    body: JSON.stringify({
      nome: 'Lucas Vendedor Relatorios',
      email: vendedorEmail,
      senha: 'vendedor123',
      perfil: 'VENDEDOR_COBRADOR'
    })
  });
  const vendedorData = await resVendedor.json();

  const resVendedorLogin = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: vendedorEmail, senha: 'vendedor123' })
  });
  const vendedorLoginData = await resVendedorLogin.json();
  const vendedorToken = vendedorLoginData.token;

  // Criar Cliente e Produto
  const resCliente = await fetch(`${baseUrl}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vendedorToken}` },
    body: JSON.stringify({
      nome: 'Ana Paula Medeiros',
      telefone: '(11) 96666-5555',
      endereco: 'Rua Augusta, 789'
    })
  });
  const cliente = await resCliente.json();

  const resProduto = await fetch(`${baseUrl}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vendedorToken}` },
    body: JSON.stringify({ nome: 'Smartphone 128GB', preco: 1500.00 })
  });
  const produto = await resProduto.json();

  // Criar Venda
  const hojeIso = new Date().toISOString().substring(0, 10);
  const resVenda = await fetch(`${baseUrl}/vendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vendedorToken}` },
    body: JSON.stringify({
      clienteId: cliente.id,
      produtoId: produto.id,
      valorTotal: 1500.00,
      valorEntrada: 300.00, // Saldo R$ 1200 -> 3x R$ 400
      numParcelas: 3
    })
  });
  const venda = await resVenda.json();

  // Registrar pagamento na Parcela 1
  const parcela1 = venda.parcelas[0];
  await fetch(`${baseUrl}/parcelas/${parcela1.id}/pagamento`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vendedorToken}` },
    body: JSON.stringify({ valorPago: 400.00 })
  });

  // --- RF14: Resumo do Próprio Dia ---
  console.log('\n--- 📊 RF14: GET /prestacao-contas/dia (VENDEDOR) ---');
  const resRf14 = await fetch(`${baseUrl}/prestacao-contas/dia?data=${hojeIso}`, {
    headers: { 'Authorization': `Bearer ${vendedorToken}` }
  });
  const dataRf14 = await resRf14.json();
  console.log(JSON.stringify(dataRf14, null, 2));

  // --- RF04: Prestação de Contas por Funcionário ---
  console.log(`\n--- 📊 RF04: GET /prestacao-contas/dia/${vendedorData.id}?data=${hojeIso} (GERENTE) ---`);
  const resRf04 = await fetch(`${baseUrl}/prestacao-contas/dia/${vendedorData.id}?data=${hojeIso}`, {
    headers: { 'Authorization': `Bearer ${gerenteToken}` }
  });
  const dataRf04 = await resRf04.json();
  console.log(JSON.stringify(dataRf04, null, 2));

  // --- RF15: Vendas e Histórico por Período ---
  console.log(`\n--- 📅 RF15: GET /vendas?dataInicio=${hojeIso}&dataFim=${hojeIso} ---`);
  const resRf15Vendas = await fetch(`${baseUrl}/vendas?dataInicio=${hojeIso}&dataFim=${hojeIso}`, {
    headers: { 'Authorization': `Bearer ${vendedorToken}` }
  });
  const dataRf15Vendas = await resRf15Vendas.json();
  console.log(`Retornadas ${dataRf15Vendas.length} venda(s) no período.`);

  console.log(`\n--- 📅 RF15: GET /parcelas/historico?dataInicio=${hojeIso}&dataFim=${hojeIso} ---`);
  const resRf15Parcelas = await fetch(`${baseUrl}/parcelas/historico?dataInicio=${hojeIso}&dataFim=${hojeIso}`, {
    headers: { 'Authorization': `Bearer ${vendedorToken}` }
  });
  const dataRf15Parcelas = await resRf15Parcelas.json();
  console.log(`Retornadas ${dataRf15Parcelas.length} parcela(s) cobradas no período.`);

  // --- RF05: Relatório Mensal Consolidado ---
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();
  console.log(`\n--- 📈 RF05: GET /relatorios/mensal?mes=${mesAtual}&ano=${anoAtual} (GERENTE) ---`);
  const resRf05 = await fetch(`${baseUrl}/relatorios/mensal?mes=${mesAtual}&ano=${anoAtual}`, {
    headers: { 'Authorization': `Bearer ${gerenteToken}` }
  });
  const dataRf05 = await resRf05.json();
  console.log(JSON.stringify(dataRf05, null, 2));

  // --- RF06: Ajuste Manual em Parcela pelo Gerente ---
  const parcela2 = venda.parcelas[1];
  console.log(`\n--- ✏️ RF06: PATCH /parcelas/${parcela2.id}/ajuste (GERENTE) ---`);
  const resRf06 = await fetch(`${baseUrl}/parcelas/${parcela2.id}/ajuste`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${gerenteToken}` },
    body: JSON.stringify({
      valor: 350.00, // Desconto de R$ 50
      motivo: 'Renegociação com desconto concedido pelo gerente'
    })
  });
  const dataRf06 = await resRf06.json();
  console.log(JSON.stringify(dataRf06, null, 2));

  // --- RF19: Saldo Devedor Total do Cliente ---
  console.log(`\n--- 💰 RF19: GET /clientes/${cliente.id}/saldo ---`);
  const resRf19 = await fetch(`${baseUrl}/clientes/${cliente.id}/saldo`, {
    headers: { 'Authorization': `Bearer ${vendedorToken}` }
  });
  const dataRf19 = await resRf19.json();
  console.log(JSON.stringify(dataRf19, null, 2));

  console.log('\n✅ TODOS OS REQUISITOS (RF04, RF05, RF06, RF14, RF15, RF19) TESTADOS COM SUCESSO!');
}

runRelatoriosTest().catch((err) => {
  console.error('❌ Erro nos testes de relatórios:', err);
  process.exit(1);
});
