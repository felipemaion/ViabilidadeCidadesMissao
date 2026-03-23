import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const handler = require('../api/tributos.js');

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(payload) {
      this.body = payload;
    },
  };
}

test('retorna 405 para metodo diferente de GET', async () => {
  const req = { method: 'POST', query: {} };
  const res = createRes();
  await handler(req, res);
  assert.equal(res.statusCode, 405);
  assert.match(res.body, /Método não permitido/);
});

test('retorna 400 para parametros invalidos', async () => {
  const req = { method: 'GET', query: { codigo_ibge: '12', ano: '20' } };
  const res = createRes();
  await handler(req, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body, /Parâmetros inválidos/);
});

test('retorna payload com tributos calculados', async () => {
  global.fetch = async () => ({
    ok: true,
    async json() {
      return {
        items: [
          { conta_contabil: '621200000', natureza_receita: '11125001', valor: '100.5' },
          { conta_contabil: '621200000', natureza_receita: '11125301', valor: '25' },
          { conta_contabil: '621200000', natureza_receita: '11145101', valor: '50' },
          { conta_contabil: '999999999', natureza_receita: '11125001', valor: '999' },
        ],
      };
    },
  });

  const req = { method: 'GET', query: { codigo_ibge: '3550308', ano: '2024' } };
  const res = createRes();
  await handler(req, res);
  const payload = JSON.parse(res.body);

  assert.equal(res.statusCode, 200);
  assert.equal(payload.codigo_ibge, '3550308');
  assert.equal(payload.ano, 2024);
  assert.equal(payload.iptu, 100.5);
  assert.equal(payload.itbi, 25);
  assert.equal(payload.iss, 50);
  assert.equal(payload.receita_tributaria_municipal, 175.5);
});

test('retorna 502 quando o fetch externo falha', async () => {
  global.fetch = async () => {
    throw new Error('sem rede');
  };

  const req = { method: 'GET', query: { codigo_ibge: '3550308', ano: '2024' } };
  const res = createRes();
  await handler(req, res);

  assert.equal(res.statusCode, 502);
  assert.match(res.body, /Falha ao consultar a API oficial do Siconfi/);
});
