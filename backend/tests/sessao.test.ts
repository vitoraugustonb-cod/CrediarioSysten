/**
 * Testes da sessão renovável (login, renovação automática, expiração e CORS).
 *
 * IMPORTANTE: estes testes NÃO acessam o banco de dados. Um Prisma falso é injetado
 * em globalThis.prisma ANTES de importar o app (ver src/lib/prisma.ts), então nenhuma
 * conexão com o banco é aberta e nenhum dado é lido ou alterado.
 *
 * Rodar: npm test
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Ambiente isolado de teste (variáveis definidas aqui têm prioridade sobre o .env)
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'segredo-somente-para-testes';
process.env.JWT_EXPIRES_IN = '7d';
process.env.DATABASE_URL = 'postgresql://teste:teste@127.0.0.1:1/nao-usar';

const SEGREDO = process.env.JWT_SECRET;
const SETE_DIAS = 7 * 24 * 60 * 60;
const UM_DIA = 24 * 60 * 60;
const ORIGEM_FRONT = 'http://localhost:5173';

const usuarioFake = {
  id: 1,
  nome: 'Usuário Teste',
  email: 'teste@crediario.com',
  perfil: 'GERENTE',
  ativo: true,
  senhaHash: bcrypt.hashSync('senha123', 4),
};

// Prisma falso: só "usuario.findUnique" devolve dados; o resto devolve vazio.
const modeloVazio = new Proxy({}, {
  get: (_alvo, metodo) => async () => {
    if (metodo === 'count') return 0;
    if (metodo === 'findMany' || metodo === 'groupBy') return [];
    if (metodo === 'aggregate') return { _sum: {}, _count: {} };
    return null;
  },
});
const prismaFake: any = new Proxy({}, {
  get: (_alvo, prop) => {
    if (prop === 'usuario') {
      return {
        findUnique: async ({ where }: any) =>
          where.id === usuarioFake.id || where.email === usuarioFake.email ? usuarioFake : null,
      };
    }
    if (prop === '$transaction') {
      return async (arg: any) => (typeof arg === 'function' ? arg(prismaFake) : Promise.all(arg));
    }
    if (prop === 'then') return undefined;
    return modeloVazio;
  },
});
(globalThis as any).prisma = prismaFake;

let server: Server;
let baseUrl = '';

before(async () => {
  const { default: app } = await import('../src/app.js');
  server = app.listen(0);
  await new Promise<void>((r) => server.once('listening', () => r()));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server?.close();
});

// Gera um token como se tivesse sido emitido "idadeSegundos" atrás
function tokenComIdade(idadeSegundos: number): string {
  const iat = Math.floor(Date.now() / 1000) - idadeSegundos;
  return jwt.sign(
    { id: usuarioFake.id, email: usuarioFake.email, perfil: usuarioFake.perfil, nome: usuarioFake.nome, iat },
    SEGREDO,
    { expiresIn: '7d' }
  );
}

function getComToken(token: string) {
  return fetch(`${baseUrl}/parcelas`, {
    headers: { Authorization: `Bearer ${token}`, Origin: ORIGEM_FRONT },
  });
}

test('deveRenovarToken: só renova depois da metade da validade', async () => {
  const { deveRenovarToken } = await import('../src/config/jwt.js');
  const agora = Math.floor(Date.now() / 1000);
  assert.equal(deveRenovarToken(agora - 60, agora - 60 + SETE_DIAS), false, 'token novo não renova');
  assert.equal(deveRenovarToken(agora - 3 * UM_DIA, agora + 4 * UM_DIA), false, '3 dias: ainda não');
  assert.equal(deveRenovarToken(agora - 4 * UM_DIA, agora + 3 * UM_DIA), true, '4 dias: renova');
  assert.equal(deveRenovarToken(undefined, undefined), false);
});

test('login gera token de 7 dias e cookie com a mesma validade', async () => {
  const res = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGEM_FRONT },
    body: JSON.stringify({ email: usuarioFake.email, senha: 'senha123' }),
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  const decoded = jwt.verify(body.token, SEGREDO) as jwt.JwtPayload;
  assert.equal(decoded.exp! - decoded.iat!, SETE_DIAS, 'token deve valer 7 dias');

  const cookie = res.headers.get('set-cookie') ?? '';
  assert.match(cookie, /token=/);
  assert.match(cookie, /HttpOnly/i);
  const maxAge = Number(/Max-Age=(\d+)/i.exec(cookie)?.[1]);
  assert.ok(Math.abs(maxAge - SETE_DIAS) <= 5, `cookie deve durar ~7 dias (veio ${maxAge}s)`);
});

test('token recente funciona e NÃO é renovado', async () => {
  const res = await getComToken(tokenComIdade(60));
  assert.notEqual(res.status, 401);
  assert.equal(res.headers.get('x-token-renovado'), null);
});

test('token com 4 dias funciona e é renovado automaticamente (header + cookie)', async () => {
  const res = await getComToken(tokenComIdade(4 * UM_DIA));
  assert.notEqual(res.status, 401);

  const novo = res.headers.get('x-token-renovado');
  assert.ok(novo, 'deveria devolver X-Token-Renovado');
  const decoded = jwt.verify(novo!, SEGREDO) as jwt.JwtPayload;
  const agora = Math.floor(Date.now() / 1000);
  assert.ok(Math.abs(decoded.exp! - (agora + SETE_DIAS)) <= 5, 'novo token deve valer mais 7 dias a partir de agora');
  assert.equal(decoded.id, usuarioFake.id);

  assert.match(res.headers.get('set-cookie') ?? '', /token=/, 'cookie também deve ser renovado');
});

test('header X-Token-Renovado é exposto no CORS para o frontend conseguir ler', async () => {
  const res = await getComToken(tokenComIdade(4 * UM_DIA));
  const expostos = (res.headers.get('access-control-expose-headers') ?? '').toLowerCase();
  assert.ok(expostos.includes('x-token-renovado'), `expose-headers veio: "${expostos}"`);
});

test('token vencido (8 dias) recebe 401', async () => {
  const res = await getComToken(tokenComIdade(8 * UM_DIA));
  assert.equal(res.status, 401);
  assert.equal(res.headers.get('x-token-renovado'), null);
});

test('sem token recebe 401', async () => {
  const res = await fetch(`${baseUrl}/parcelas`, { headers: { Origin: ORIGEM_FRONT } });
  assert.equal(res.status, 401);
});
