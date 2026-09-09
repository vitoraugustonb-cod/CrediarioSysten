# 💳 Crediário System

<p align="center">
  <strong>Sistema completo de gestão de crediário: controle de clientes, emissão de carnês, registro de cobranças, pagamentos e relatórios financeiros em tempo real.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma_ORM-6.x-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-API_REST-blue?logoColor=white" alt="API REST">
  <img src="https://img.shields.io/badge/Auth-JWT-F7B731?logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Design-Mobile_First-8B5CF6?logoColor=white" alt="Mobile First">
  <img src="https://img.shields.io/badge/Licença-Privada-red" alt="Licença">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-orange" alt="Status">
</p>

---

## 📑 Sumário

- [📱 Sobre o Projeto](#-sobre-o-projeto)
- [🎨 Design & Usabilidade](#-design--usabilidade)
- [⚙️ Funcionalidades Principais](#️-funcionalidades-principais)
- [📐 Regras de Negócio Financeiras](#-regras-de-negócio-financeiras)
- [🔄 Fluxo de Venda & Ciclo de Vida](#-fluxo-de-venda--ciclo-de-vida)
- [📱 Módulos Operacionais Mobile](#-módulos-operacionais-mobile)
- [🗂️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🛠️ Como Executar o Projeto](#️-como-executar-o-projeto)
- [🌐 Referência da API REST](#-referência-da-api-rest)
- [🔒 Segurança & Auditoria](#-segurança--auditoria)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [🧰 Scripts Úteis & Banco de Dados](#-scripts-úteis--banco-de-dados)
- [🚀 Roadmap](#-roadmap)
- [🤝 Contribuição & Boas Práticas](#-contribuição--boas-práticas)
- [📜 Licença](#-licença)

---

## 📱 Sobre o Projeto

O **Crediário System** é uma aplicação web full-stack desenvolvida para digitalizar e centralizar toda a gestão de vendas no crediário para pequenos e médios comércios.

O sistema resolve a dor de controlar manualmente cadernetas e carnês físicos, substituindo-os por uma plataforma digital intuitiva e segura. Construído com uma arquitetura desacoplada entre uma **API REST (Node.js + Express)** e um **Frontend SPA (React + Vite)**, o sistema oferece controle completo de clientes, geração de carnês de parcelamento, lançamento de cobranças diárias e dashboards financeiros — tudo com controle de acesso baseado em perfis de usuário.

---

## 🎨 Design & Usabilidade

O frontend foi desenvolvido com as melhores práticas de design moderno, apresentando:

- **Interface Dual-Platform (Desktop & Mobile):** O sistema detecta o dispositivo e renderiza automaticamente a melhor experiência — layout de painel completo para desktops e interface de toque fluída para smartphones dos vendedores em campo.
- **Design System Premium:** Paleta de cores cuidadosamente curada com variáveis CSS semânticas, tipografia moderna (Google Fonts), gradientes suaves e sombras hierárquicas que transmitem profissionalismo.
- **Micro-Animações e Feedback Visual:** Transições suaves, estados de loading animados, banners de sucesso não-bloqueantes e modais com animações de entrada para uma experiência de uso fluída.
- **Validação de Segurança Dupla no Pagamento:** Ao registrar um pagamento, um modal de confirmação solicita que o vendedor redigite o valor, evitando lançamentos acidentais por clique errado.
- **Pesquisa Inteligente com Autocomplete:** Campos de busca com filtragem em tempo real por nome, telefone ou endereço em listas de clientes e cobranças.

---

## ⚙️ Funcionalidades Principais

### 👤 Perfil: Gerente

- **Dashboard Gerencial em Tempo Real:** KPIs da empresa com total de clientes, vendas do dia, valor em aberto e cobranças realizadas.
- **Gestão de Funcionários:** Cadastro, ativação e desativação de vendedores/cobradores.
- **Gestão de Clientes & Produtos:** Visão global de todos os clientes cadastrados, saldo devedor acumulado e catálogo de produtos com categorias.
- **Registro de Vendas Completo:** Criação de vendas com múltiplos itens, valor de entrada opcional e geração automática do carnê de parcelas (periodicidade mensal, quinzenal ou semanal).
- **Visualização de Carnê:** Consulta detalhada de todas as parcelas de cada venda, com status atualizado em tempo real.
- **Relatório Mensal Consolidado:** Desempenho individual de cada funcionário com total cobrado, número de cobranças e comissão.
- **Prestação de Contas Global:** Visão da movimentação financeira diária de todos os cobradores da empresa.

### 🛵 Perfil: Vendedor / Cobrador

- **Aba de Cobranças (Foco Operacional):** Lista dinâmica somente com os clientes que possuem parcelas vencendo **hoje** ou **em atraso**, priorizando o trabalho diário de cobrança.
- **Registro de Pagamento com Segurança Dupla:** Ao baixar uma parcela, o cobrador deve redigitar o valor recebido para confirmar o lançamento.
- **Pagamento Adiantado de Parcelas:** Permite registrar o recebimento de parcelas futuras diretamente pelo card do cliente.
- **Aba de Clientes:** Consulta do saldo devedor individual e histórico de parcelas de cada cliente cadastrado.
- **Nova Venda com Busca Inteligente:** Formulário de venda que permite selecionar um cliente já cadastrado via campo de pesquisa autocomplete (sem selects gigantes), ou cadastrar um novo cliente diretamente no fluxo.
- **Prestação de Contas Própria:** Visualização da movimentação financeira e cobranças registradas pelo próprio vendedor no dia.

---

## 📐 Regras de Negócio Financeiras

O sistema opera com regras contábeis e financeiras desenhadas especificamente para a realidade de crediário de rua e lojistas:

1. **Geração Automática do Plano de Parcelamento:**
   - O valor total da venda deduzido de eventual entrada é dividido igualmente pelo número de parcelas acordadas.
   - Suporte a frequências: **Semanal** (a cada 7 dias), **Quinzenal** (a cada 15 dias) e **Mensal** (mesmo dia do mês subsequente).
   - Centavos residuais decorrentes de dízimas na divisão são automaticamente ajustados na primeira parcela para garantir fechamento de 100% do saldo total.

2. **Critério de Atraso e Cobrança Diária:**
   - Parcelas com data de vencimento anterior à data atual (`vencimento < hoje`) e com status diferente de `PAGA` são categorizadas instantaneamente como **Em Atraso**.
   - Na aba operacional do cobrador, clientes inadimplentes ganham destaque prioritário no topo da listagem com contadores de dias decorridos.

3. **Amortização e Pagamento Adiantado:**
   - O sistema permite o pagamento antecipado de parcelas vincendas diretamente pela ficha do cliente.
   - Amortizações parciais abatem prioritariamente a parcela mais antiga em aberto, impedindo que juros ou carência se acumulem desnecessariamente.

4. **Prestação de Contas & Fechamento de Caixa:**
   - Todo pagamento processado é creditado ao operador autenticado, gerando um histórico diário consolidado para conferência física de valores (dinheiro, Pix ou transferência) no fim do expediente.

---

## 🗂️ Estrutura do Projeto

```
Crediario/
├── backend/                    # Servidor API Node.js/Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de dados (Usuário, Cliente, Venda, Parcela...)
│   │   └── migrations/         # Histórico de migrações do banco de dados
│   ├── src/
│   │   ├── controllers/        # Lógica de negócio (vendas, parcelas, relatórios...)
│   │   ├── middlewares/        # Autenticação JWT e validação de papéis (perfil)
│   │   ├── routes/             # Definição das rotas da API REST
│   │   ├── lib/                # Instância do Prisma Client
│   │   └── server.ts           # Ponto de entrada do servidor HTTP
│   └── package.json
│
├── frontend/                   # Aplicação Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── desktop/        # Views do painel gerencial (tela grande)
│   │   │   ├── mobile/         # Views do app do cobrador (smartphone)
│   │   │   └── common/         # Componentes reutilizáveis (Modal, etc.)
│   │   ├── context/            # AuthContext (token JWT e dados do usuário)
│   │   ├── hooks/              # Hook useAuth
│   │   ├── services/           # Integração com a API (fetch + tipos)
│   │   └── App.tsx             # Componente raiz com roteamento por perfil
│   └── package.json
│
└── README.md
```

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- **Node.js** v18 ou superior
- **MySQL** 8.0 rodando localmente (ou outro banco suportado pelo Prisma)
- **npm** ou **yarn**

---

### 1. Clonando o Repositório

```bash
git clone https://github.com/vitoraugustonb-cod/CrediarioSysten.git
cd CrediarioSysten
```

---

### 2. Configurando o Back-end

```bash
cd backend

# Instalar as dependências
npm install

# Criar o arquivo de variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3300
DATABASE_URL="mysql://usuario:senha@localhost:3306/crediario_db"
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
```

```bash
# Executar as migrações e criar as tabelas no banco
npx prisma migrate dev

# (Opcional) Criar o primeiro usuário Gerente
npx tsx src/scripts/seedGerente.ts

# Iniciar o servidor de desenvolvimento
npm run dev
```

✅ O servidor estará disponível em `http://localhost:3300`

---

### 3. Configurando o Front-end

```bash
cd ../frontend

# Instalar as dependências
npm install

# Iniciar a aplicação web
npm run dev
```

✅ Acesse a aplicação em `http://localhost:5173`

---

## 🔐 Contas de Acesso Padrão

Após rodar o seed do gerente, use as credenciais abaixo para o primeiro login:

| Perfil    | E-mail                     | Senha        |
|-----------|----------------------------|--------------|
| Gerente   | `gerente@crediario.com`    | `gerente123` |

> O gerente pode cadastrar novos usuários **Vendedor/Cobrador** diretamente pelo painel.

---

## 🌐 Referência da API REST

A API segue padrões RESTful, retornando respostas estruturadas em formato JSON e utilizando códigos HTTP semânticos (200, 201, 400, 401, 403, 404, 500).

Todas as rotas (exceto `/api/auth/login`) exigem o cabeçalho `Authorization: Bearer <token_jwt>`.

| Módulo | Método | Endpoint | Perfil Mínimo | Descrição |
| :--- | :---: | :--- | :---: | :--- |
| **Autenticação** | `POST` | `/api/auth/login` | Público | Autentica usuário e retorna JWT com dados de sessão |
| **Usuários** | `GET` | `/api/users` | Gerente | Lista funcionários com contadores e status |
| **Usuários** | `POST` | `/api/users` | Gerente | Cadastra novo funcionário (Gerente/Cobrador) |
| **Usuários** | `PATCH` | `/api/users/:id/status` | Gerente | Ativa ou desativa o acesso de um funcionário |
| **Clientes** | `GET` | `/api/clientes` | Todos | Lista clientes com busca por nome/telefone e saldo |
| **Clientes** | `POST` | `/api/clientes` | Todos | Cadastra um novo cliente no sistema |
| **Clientes** | `GET` | `/api/clientes/:id` | Todos | Detalha histórico completo, carnês e endereço |
| **Produtos** | `GET` | `/api/produtos` | Todos | Catálogo de produtos com preço e categorias |
| **Produtos** | `POST` | `/api/produtos` | Gerente | Cadastro de novos produtos no estoque/catálogo |
| **Vendas** | `POST` | `/api/vendas` | Todos | Registra venda e gera parcelas automaticamente |
| **Vendas** | `GET` | `/api/vendas/:id` | Todos | Detalhes da venda, itens e parcelamento |
| **Parcelas** | `GET` | `/api/parcelas/cobrancas` | Cobrador | Lista cobranças do dia e parcelas em atraso |
| **Parcelas** | `POST` | `/api/parcelas/:id/pagar` | Cobrador | Baixa parcela com confirmação e auditoria |
| **Relatórios** | `GET` | `/api/relatorios/dashboard` | Gerente | Indicadores macro (KPIs, volume, inadimplência) |
| **Relatórios** | `GET` | `/api/relatorios/mensal` | Gerente | Desempenho individual e comissões do mês |
| **Prestação** | `GET` | `/api/prestacao-contas/resumo` | Todos | Prestação diária de caixa do operador autenticado |

---

## 🗃️ Modelo de Dados Resumido

```
Usuario  ──< Venda >── Cliente
                │
                └──< Parcela >── Auditoria
Venda    ──< ItemVenda >── Produto
```

| Entidade     | Descrição                                                  |
|--------------|------------------------------------------------------------|
| `Usuario`    | Gerentes e Vendedores/Cobradores com autenticação JWT      |
| `Cliente`    | Dados cadastrais e histórico de compras no crediário       |
| `Venda`      | Cabeçalho da venda com valor total, entrada e parcelas     |
| `ItemVenda`  | Produtos individuais associados a cada venda               |
| `Parcela`    | Carnê gerado automaticamente com vencimento e status       |
| `Auditoria`  | Log imutável de todas as operações em parcelas             |

---

## 📜 Licença

Este projeto é desenvolvido para fins de gestão comercial e controle financeiro de crediário.  
Todos os direitos reservados © 2025 — Vitor Augusto.
