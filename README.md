# 💳 Crediário System

Sistema completo e moderno para gestão de vendas no crediário, controle de clientes, emissão de carnês de parcelamento, registro de cobranças e relatórios financeiros consolidados.

---

## 🚀 Tecnologias Utilizadas

### **Back-end**
- **Node.js** & **Express** com **TypeScript**
- **Prisma ORM** (Banco de dados relacional SQLite/PostgreSQL)
- **JWT (JSON Web Tokens)** para autenticação segura
- **BcryptJS** para criptografia de senhas
- **Cors** & **Dotenv**

### **Front-end**
- **React 19** & **Vite** com **TypeScript**
- **Lucide React** para iconografia moderna
- **Design System Responsivo** (Interface adaptada para uso Desktop e Mobile)
- **Oxlint** & **TypeScript Compiler** para alta qualidade de código

---

## 📌 Funcionalidades Principais

- 🔐 **Autenticação & Controle de Acesso por Perfil:**
  - `GERENTE`: Acesso completo a relatórios financeiros, gestão de funcionários, ajustes manuais de parcelas e visibilidade global.
  - `VENDEDOR_COBRADOR`: Focado em registro de vendas, cadastro de clientes, recebimentos e consulta da sua própria prestação de contas.

- 👥 **Gestão de Clientes & Produtos:**
  - Cadastro completo com endereço, telefone e referências.
  - Consulta do saldo devedor individual acumulado de cada cliente.
  - Catálogo de produtos com categorias e preços.

- 🛒 **Vendas & Carnês de Parcelamento:**
  - Registro de vendas com múltiplos itens, aplicação de valor de entrada e divisão de parcelas.
  - Cálculo atômico de parcelas com arredondamento preciso de centavos.
  - Visualização e impressão de Carnê de Pagamento por venda.

- 💰 **Cobranças & Pagamentos:**
  - Baixa de parcelas com registro de data e valor pago.
  - Adição de observações e histórico detalhado de movimentações por parcela.
  - Filtros por status (*PENDENTE*, *PAGA*, *ATRASADA*).

- 📊 **Dashboards & Relatórios:**
  - Dashboard em tempo real com KPIs da empresa.
  - Prestação de Contas Diária individual e por funcionário.
  - Relatório Mensal Consolidado por funcionário.

---

## 📁 Estrutura do Projeto

```bash
Crediario/
├── backend/                  # Servidor API Node.js/Express + Prisma
│   ├── prisma/               # Schema do Banco de Dados e Migrations
│   ├── src/
│   │   ├── controllers/      # Lógica das regras de negócio
│   │   ├── middlewares/      # Middleware de autenticação JWT e papéis
│   │   ├── routes/           # Rotas da API REST
│   │   └── server.ts         # Ponto de entrada do servidor HTTP
│   └── package.json
│
├── frontend/                 # Aplicação Front-end React + Vite
│   ├── src/
│   │   ├── components/       # Componentes Desktop e Mobile
│   │   ├── context/          # Contexto de Autenticação
│   │   ├── services/         # Integração com a API (fetch)
│   │   └── App.tsx           # Componente principal com roteamento
│   └── package.json
└── README.md
```

---

## 🛠️ Como Executar o Projeto

### Pró-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### 1. Configurando o Back-end

```bash
cd backend

# Instalar as dependências
npm install

# Configurar as variáveis de ambiente (.env)
# Crie um arquivo .env na pasta backend com:
# PORT=3300
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="sua_chave_secreta_super_segura"

# Executar as migrações do banco de dados
npx prisma migrate dev

# Iniciar o servidor de desenvolvimento
npm run dev
```

O servidor estará rodando em `http://localhost:3300`.

### 2. Configurando o Front-end

```bash
cd frontend

# Instalar as dependências
npm install

# Iniciar a aplicação web
npm run dev
```

Acesse a aplicação em `http://localhost:5173`.

---

## 📜 Licença

Este projeto é desenvolvido para fins de gestão comercial e controle financeiro de crediário.
