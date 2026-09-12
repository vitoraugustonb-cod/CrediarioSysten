# 💳 Crediário System

<p align="center">
  <strong>Sistema completo de gestão de crediário próprio: controle de clientes, emissão de carnês flexíveis, rotas de cobrança de rua, segurança dupla em pagamentos e relatórios financeiros em tempo real.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma_ORM-6.x-2D3748?logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arquitetura-API_REST-blue?logoColor=white" alt="API REST">
  <img src="https://img.shields.io/badge/Auth-JWT_Stateless-F7B731?logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/Design-Dual--Platform-8B5CF6?logoColor=white" alt="Dual Platform">
  <img src="https://img.shields.io/badge/Security-Audit_Log_Append--Only-2ea44f?logoColor=white" alt="Audit Log">
  <img src="https://img.shields.io/badge/Coverage-90%25-brightgreen" alt="Cobertura">
  <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-green.svg" alt="Licença">
</p>

---

## 📑 Sumário

- [📱 Sobre o Projeto](#-sobre-o-projeto)
- [💻 Stack Tecnológica & Justificativas](#-stack-tecnológica--justificativas)
- [🏗️ Arquitetura em Camadas](#️-arquitetura-em-camadas)
- [🎨 Design & Usabilidade](#-design--usabilidade)
- [⚙️ Funcionalidades Principais](#️-funcionalidades-principais)
- [📐 Regras de Negócio Financeiras](#-regras-de-negócio-financeiras)
- [🔄 Fluxo de Venda & Ciclo de Vida](#-fluxo-de-venda--ciclo-de-vida)
- [📱 Módulos Operacionais Mobile](#-módulos-operacionais-mobile)
- [🗂️ Estrutura do Projeto](#️-estrutura-do-projeto)
- [🛠️ Como Executar o Projeto](#️-como-executar-o-projeto)
- [🔐 Contas de Acesso Padrão](#-contas-de-acesso-padrão)
- [🌐 Referência da API REST](#-referência-da-api-rest)
- [🗃️ Modelo de Dados & Diagrama ERD](#️-modelo-de-dados--diagrama-erd)
- [🔒 Segurança, Concorrência & LGPD](#-segurança-concorrência--lgpd)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [🧰 Scripts Úteis & Banco de Dados](#-scripts-úteis--banco-de-dados)
- [❓ Resolução de Problemas (FAQ)](#-resolução-de-problemas-faq)
- [🚀 Roadmap & Ciclo de Lançamentos](#-roadmap--ciclo-de-lançamentos)
- [🤝 Contribuição & Boas Práticas](#-contribuição--boas-práticas)
- [📜 Licença](#-licença)

---

## 📱 Sobre o Projeto

O **Crediário System** é uma solução web full-stack desenvolvida para digitalizar e revolucionar as operações de crediário próprio para comércios locais, confecções, óticas, lojas de móveis e vendedores externos.

### 🔴 O Cenário Tradicional e suas Dores
A dependência de cadernetas de papel, canhotos físicos ou planilhas desatualizadas gera graves problemas operacionais e financeiros:
- **Inadimplência Invisível:** Dificuldade em identificar rapidamente clientes com parcelas vencidas no dia;
- **Falta de Controle de Repasse:** Complexidade na prestação de contas diária entre cobradores de rua e a gerência;
- **Lentidão no Ponto de Venda:** Demora na consulta de saldo devedor e aprovação de novos limites de crédito;
- **Erros de Cálculo Manual:** Dízimas periódicas e diferenças de centavos no fechamento do caixa;
- **Ausência de Trilha de Auditoria:** Impossibilidade de rastrear com precisão quem recebeu cada valor e quando;
- **Comunicação Descentralizada:** Falta de canais diretos para avisar clientes sobre vencimentos iminentes.

### 🟢 A Solução Digital do Crediário System
O sistema resolve esses gargalos integrando uma **API REST em Node.js com Express e Prisma ORM** a uma interface responsiva **SPA em React 19 com Vite**, oferecendo:
- Rota inteligente de cobrança diária priorizada por urgência;
- Verificação de segurança dupla na baixa de pagamentos;
- Registro imutável de auditoria contábil (append-only);
- Painéis gerenciais em tempo real com cálculo automático de comissões.

---

## 💻 Stack Tecnológica & Justificativas

A escolha das tecnologias baseou-se em critérios rigorosos de robustez, performance e tipagem estática ponta a ponta:

| Camada | Tecnologia | Versão | Justificativa Técnica |
| :--- | :--- | :---: | :--- |
| **Frontend Core** | React | 19.x | Renderização reativa de alto desempenho e componentização limpa com hooks modernos. |
| **Build & Tooling** | Vite | 6.x | Hot Module Replacement (HMR) instantâneo e bundling otimizado com Rollup. |
| **Linguagem (Fullstack)** | TypeScript | 5.x | Tipagem estática end-to-end, prevenindo falhas em cálculos financeiros em tempo de execução. |
| **Backend Framework** | Node.js + Express | 22.x / 5.x | Servidor assíncrono, leve e maduro para processar requisições REST com mínima latência. |
| **ORM & Migrations** | Prisma ORM | 6.x | Tipagem autogerada com Prisma Client, migrações declarativas seguras e suporte a transações atômicas. |
| **Banco de Dados** | MySQL | 8.0 | ACID compliance robusto, integridade relacional nativa e alta performance para relatórios tabulares. |
| **Segurança & Criptografia** | JWT + bcryptjs | — | Autenticação stateless baseada em claims assinadas com HMAC SHA-256 e hashing de senhas com salt. |
| **Validação de Schemas** | Zod | 3.x | Validação rigorosa de contratos de entrada na API REST com inferência automática de tipos. |
| **Ícones & UI** | Lucide React | 0.x | Biblioteca moderna e consistente de ícones SVG limpos e otimizados para web e mobile. |
| **Utilitários de Data** | date-fns | 4.x | Manipulação imutável de datas para cálculo exato de vencimentos semanais, quinzenais e mensais. |
