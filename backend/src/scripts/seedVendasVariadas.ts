import { prisma } from '../lib/prisma.js';
import { StatusParcela, CategoriaProduto, TipoVenda } from '@prisma/client';

async function main() {
  console.log('🚀 Iniciando inserção de vendas variadas para o perfil do Vendedor/Cobrador...');

  // 1. Localizar o Vendedor (ID 2 ou perfil VENDEDOR_COBRADOR)
  const vendedor = await prisma.usuario.findFirst({
    where: { perfil: 'VENDEDOR_COBRADOR', ativo: true }
  });

  if (!vendedor) {
    throw new Error('Nenhum vendedor/cobrador ativo encontrado no banco.');
  }

  console.log(`👤 Vendedor selecionado: ${vendedor.nome} (ID: ${vendedor.id})`);

  // 2. Criar ou garantir catálogo variado de Produtos (Móveis e Variedades)
  const produtosCatalogo = [
    { nome: 'Guarda-Roupa Casal 6 Portas Espelhado', preco: 1450.00, categoria: CategoriaProduto.MOVEIS, descricao: 'MDF alta resistência com corrediças telescópicas' },
    { nome: 'Cama Box Queen Size Molas Ensacadas', preco: 1200.00, categoria: CategoriaProduto.MOVEIS, descricao: 'Ortopédico e Pillow Top duplo' },
    { nome: 'Mesa de Jantar 6 Cadeiras Tampo de Vidro', preco: 980.00, categoria: CategoriaProduto.MOVEIS, descricao: 'Estrutura madeira maciça estofada' },
    { nome: 'Painel para TV até 65 Polegadas com LED', preco: 550.00, categoria: CategoriaProduto.MOVEIS, descricao: 'Ripado moderno com prateleira' },
    { nome: 'Jogo de Panelas Cerâmica Antiaderente 5 Peças', preco: 380.00, categoria: CategoriaProduto.VARIEDADES, descricao: 'Cabos soft-touch e fundo indução' },
    { nome: 'Kit Cobreleito e Lençol 400 Fios Casal', preco: 260.00, categoria: CategoriaProduto.VARIEDADES, descricao: 'Algodão egípcio acetinado 4 peças' },
    { nome: 'Ventilador Turbo 50cm Silencioso', preco: 220.00, categoria: CategoriaProduto.VARIEDADES, descricao: '8 pás e 3 velocidades' },
    { nome: 'Fritadeira Air Fryer 5.5L Digital', preco: 420.00, categoria: CategoriaProduto.VARIEDADES, descricao: 'Painel touch e cesto antiaderente' },
    { nome: 'Conjunto Tapetes para Sala Geométrico', preco: 190.00, categoria: CategoriaProduto.VARIEDADES, descricao: 'Toque aveludado antiderrapante' }
  ];

  const produtosMap = new Map<string, any>();
  for (const p of produtosCatalogo) {
    let prod = await prisma.produto.findFirst({ where: { nome: p.nome } });
    if (!prod) {
      prod = await prisma.produto.create({
        data: {
          nome: p.nome,
          preco: p.preco,
          categoria: p.categoria,
          descricao: p.descricao
        }
      });
    }
    produtosMap.set(p.nome, prod);
  }

  // Datas de referência
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 12, 0, 0);

  const ha30Dias = new Date(hoje);
  ha30Dias.setDate(ha30Dias.getDate() - 30);

  const ha15Dias = new Date(hoje);
  ha15Dias.setDate(ha15Dias.getDate() - 15);

  const ha5Dias = new Date(hoje);
  ha5Dias.setDate(ha5Dias.getDate() - 5);

  const daqui15Dias = new Date(hoje);
  daqui15Dias.setDate(daqui15Dias.getDate() + 15);

  const daqui30Dias = new Date(hoje);
  daqui30Dias.setDate(daqui30Dias.getDate() + 30);

  const daqui60Dias = new Date(hoje);
  daqui60Dias.setDate(daqui60Dias.getDate() + 60);

  // 3. Estruturação de 6 vendas distintas e cenários realistas
  const cenariosVendas = [
    {
      // CENÁRIO 1: Móveis com Entrada paga no ato + 1ª parcela vencendo HOJE
      cliente: {
        nome: 'Dona Maria do Carmo Alencar',
        telefone: '(88) 99712-3344',
        endereco: 'Rua São José, 145, Bairro Fátima',
        referencias: 'Próximo ao Mercadinho São José'
      },
      tipoVenda: TipoVenda.MOVEIS,
      dataVenda: ha30Dias,
      valorEntrada: 250.00,
      valorTotal: 1450.00, // 1450 total - 250 entrada = 1200 (6x de 200)
      numParcelas: 6,
      produtos: [{ nome: 'Guarda-Roupa Casal 6 Portas Espelhado', qtd: 1, unit: 1450.00 }],
      parcelas: [
        { numero: 1, valor: 200.00, venc: hoje, status: StatusParcela.PENDENTE, obs: 'Cliente pediu para passar após as 14h' },
        { numero: 2, valor: 200.00, venc: daqui30Dias, status: StatusParcela.PENDENTE },
        { numero: 3, valor: 200.00, venc: daqui60Dias, status: StatusParcela.PENDENTE },
        { numero: 4, valor: 200.00, venc: new Date(daqui60Dias.getTime() + 30*86400000), status: StatusParcela.PENDENTE },
        { numero: 5, valor: 200.00, venc: new Date(daqui60Dias.getTime() + 60*86400000), status: StatusParcela.PENDENTE },
        { numero: 6, valor: 200.00, venc: new Date(daqui60Dias.getTime() + 90*86400000), status: StatusParcela.PENDENTE }
      ]
    },
    {
      // CENÁRIO 2: Variedades 100% a prazo + Parcela ATRASADA (Cobrança em Atraso)
      cliente: {
        nome: 'Raimundo Nonato das Chagas',
        telefone: '(88) 98845-9012',
        endereco: 'Av. Brasil, 820, Bairro Alto Novo',
        referencias: 'Oficina mecânica na esquina'
      },
      tipoVenda: TipoVenda.VARIEDADES,
      dataVenda: ha30Dias,
      valorEntrada: null,
      valorTotal: 600.00,
      numParcelas: 4,
      produtos: [
        { nome: 'Jogo de Panelas Cerâmica Antiaderente 5 Peças', qtd: 1, unit: 380.00 },
        { nome: 'Ventilador Turbo 50cm Silencioso', qtd: 1, unit: 220.00 }
      ],
      parcelas: [
        { numero: 1, valor: 150.00, venc: ha15Dias, status: StatusParcela.ATRASADA, obs: 'Ligado dia 10, combinou de acertar esta semana' },
        { numero: 2, valor: 150.00, venc: daqui15Dias, status: StatusParcela.PENDENTE },
        { numero: 3, valor: 150.00, venc: daqui30Dias, status: StatusParcela.PENDENTE },
        { numero: 4, valor: 150.00, venc: daqui60Dias, status: StatusParcela.PENDENTE }
      ]
    },
    {
      // CENÁRIO 3: Variedades com Pagamento PARCIAL (Pagou metade e falta restante)
      cliente: {
        nome: 'Fernanda Oliveira Soares',
        telefone: '(88) 99654-7811',
        endereco: 'Rua Pedro Álvares Cabral, 305, Centro',
        referencias: 'Em frente ao Colégio Diocesano'
      },
      tipoVenda: TipoVenda.VARIEDADES,
      dataVenda: ha30Dias,
      valorEntrada: null,
      valorTotal: 450.00,
      numParcelas: 3,
      produtos: [
        { nome: 'Kit Cobreleito e Lençol 400 Fios Casal', qtd: 1, unit: 260.00 },
        { nome: 'Conjunto Tapetes para Sala Geométrico', qtd: 1, unit: 190.00 }
      ],
      parcelas: [
        { numero: 1, valor: 150.00, valorPago: 80.00, venc: ha5Dias, status: StatusParcela.PARCIAL, obs: 'Cliente pagou R$ 80,00 e pediu para cobrar os R$ 70,00 restantes hoje' },
        { numero: 2, valor: 150.00, venc: daqui15Dias, status: StatusParcela.PENDENTE },
        { numero: 3, valor: 150.00, venc: daqui30Dias, status: StatusParcela.PENDENTE }
      ],
      pagamentoRegistrado: { valor: 80.00, data: ha5Dias, parcelaNumero: 1 }
    },
    {
      // CENÁRIO 4: Móveis Quitado Hoje (Para testar Prestação de Contas do dia / Relatório)
      cliente: {
        nome: 'Marcos Vinicius de Souza',
        telefone: '(88) 99234-1234',
        endereco: 'Travessa Santos Dumont, 55, Bairro Aeroporto',
        referencias: 'Casa amarela com portão de ferro branco'
      },
      tipoVenda: TipoVenda.MOVEIS,
      dataVenda: ha15Dias,
      valorEntrada: 100.00,
      valorTotal: 550.00,
      numParcelas: 3,
      produtos: [{ nome: 'Painel para TV até 65 Polegadas com LED', qtd: 1, unit: 550.00 }],
      parcelas: [
        { numero: 1, valor: 150.00, valorPago: 150.00, venc: hoje, dataPagamento: hoje, status: StatusParcela.PAGA, obs: 'Recebido em dinheiro pelo cobrador' },
        { numero: 2, valor: 150.00, venc: daqui30Dias, status: StatusParcela.PENDENTE },
        { numero: 3, valor: 150.00, venc: daqui60Dias, status: StatusParcela.PENDENTE }
      ],
      pagamentoRegistrado: { valor: 150.00, data: hoje, parcelaNumero: 1 }
    },
    {
      // CENÁRIO 5: Móvel Completo Cama Box (Parcelamento Quinquenal / Mensal longo)
      cliente: {
        nome: 'Luciana Ferreira Coutinho',
        telefone: '(88) 98112-9988',
        endereco: 'Rua Cel. Alexanzinho, 1102, Bairro Planalto',
        referencias: 'Ao lado da Padaria Pão Dourado'
      },
      tipoVenda: TipoVenda.MOVEIS,
      dataVenda: hoje,
      valorEntrada: 200.00,
      valorTotal: 1200.00,
      numParcelas: 5,
      produtos: [{ nome: 'Cama Box Queen Size Molas Ensacadas', qtd: 1, unit: 1200.00 }],
      parcelas: [
        { numero: 1, valor: 200.00, venc: daqui15Dias, status: StatusParcela.PENDENTE },
        { numero: 2, valor: 200.00, venc: daqui30Dias, status: StatusParcela.PENDENTE },
        { numero: 3, valor: 200.00, venc: daqui60Dias, status: StatusParcela.PENDENTE },
        { numero: 4, valor: 200.00, venc: new Date(daqui60Dias.getTime() + 30*86400000), status: StatusParcela.PENDENTE },
        { numero: 5, valor: 200.00, venc: new Date(daqui60Dias.getTime() + 60*86400000), status: StatusParcela.PENDENTE }
      ]
    },
    {
      // CENÁRIO 6: Variedades - Eletroportátil Air Fryer (Parcela vence HOJE)
      cliente: {
        nome: 'João Batista Ferreira',
        telefone: '(88) 99401-4455',
        endereco: 'Rua Dom Pedro II, 47, Bairro Centro',
        referencias: 'Vizinho à Farmácia Santa Terezinha'
      },
      tipoVenda: TipoVenda.VARIEDADES,
      dataVenda: ha15Dias,
      valorEntrada: null,
      valorTotal: 420.00,
      numParcelas: 3,
      produtos: [{ nome: 'Fritadeira Air Fryer 5.5L Digital', qtd: 1, unit: 420.00 }],
      parcelas: [
        { numero: 1, valor: 140.00, venc: hoje, status: StatusParcela.PENDENTE, obs: 'Cobrança do dia na rota do centro' },
        { numero: 2, valor: 140.00, venc: daqui15Dias, status: StatusParcela.PENDENTE },
        { numero: 3, valor: 140.00, venc: daqui30Dias, status: StatusParcela.PENDENTE }
      ]
    }
  ];

  for (const c of cenariosVendas) {
    // 1. Criar Cliente
    const cliente = await prisma.cliente.create({
      data: {
        nome: c.cliente.nome,
        telefone: c.cliente.telefone,
        endereco: c.cliente.endereco,
        referencias: c.cliente.referencias
      }
    });

    // 2. Criar Venda
    const venda = await prisma.venda.create({
      data: {
        clienteId: cliente.id,
        vendedorId: vendedor.id,
        valorTotal: c.valorTotal,
        valorEntrada: c.valorEntrada,
        numParcelas: c.numParcelas,
        dataVenda: c.dataVenda,
        tipoVenda: c.tipoVenda
      }
    });

    // 3. Criar Itens da Venda
    for (const item of c.produtos) {
      const prod = produtosMap.get(item.nome);
      await prisma.itemVenda.create({
        data: {
          vendaId: venda.id,
          produtoId: prod.id,
          quantidade: item.qtd,
          valorUnitario: item.unit,
          subtotal: item.unit * item.qtd
        }
      });
    }

    // 4. Criar Parcelas
    const parcelasCriadas = [];
    for (const p of c.parcelas) {
      const parcela = await prisma.parcela.create({
        data: {
          vendaId: venda.id,
          cobradorId: vendedor.id,
          numero: p.numero,
          valor: p.valor,
          valorPago: (p as any).valorPago || null,
          dataVencimento: p.venc,
          dataPagamento: (p as any).dataPagamento || null,
          status: p.status,
          observacao: p.obs || null
        }
      });
      parcelasCriadas.push(parcela);
    }

    // 5. Se houver pagamento registrado, cria no modelo Pagamento
    if (c.pagamentoRegistrado) {
      const pAlvo = parcelasCriadas.find(p => p.numero === c.pagamentoRegistrado.parcelaNumero);
      await prisma.pagamento.create({
        data: {
          vendaId: venda.id,
          clienteId: cliente.id,
          cobradorId: vendedor.id,
          parcelaId: pAlvo ? pAlvo.id : null,
          valorPago: c.pagamentoRegistrado.valor,
          dataPagamento: c.pagamentoRegistrado.data,
          detalhes: `Pagamento registrado pelo cobrador ${vendedor.nome}`
        }
      });
    }

    console.log(`✅ Venda [${c.tipoVenda}] criada para "${cliente.nome}" (Total: R$ ${c.valorTotal.toFixed(2)}, ${c.numParcelas}x)`);
  }

  console.log('\n🎉 Todas as vendas e cobranças variadas foram inseridas com sucesso no banco de dados!');
}

main()
  .catch((err) => {
    console.error('❌ Erro ao inserir vendas variadas:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
