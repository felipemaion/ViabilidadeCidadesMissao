# Painel Cidades Missão

Este projeto organiza os dados-fonte em [`data/fontes/`](/Users/maion/Projects/CidadesMissao/data/fontes), gera artefatos prontos para visualização em [`dashboard/data/`](/Users/maion/Projects/CidadesMissao/dashboard/data) e publica um dashboard local totalmente em português com foco em viabilidade municipal.

## Estrutura

- [`data/fontes/`](/Users/maion/Projects/CidadesMissao/data/fontes): planilhas, CSVs e cartilha originais
- [`data/raw/`](/Users/maion/Projects/CidadesMissao/data/raw): insumos geográficos oficiais do IBGE
- [`scripts/build_dashboard_data.py`](/Users/maion/Projects/CidadesMissao/scripts/build_dashboard_data.py): pipeline de ingestão, limpeza, validação e geração dos JSONs
- [`dashboard/`](/Users/maion/Projects/CidadesMissao/dashboard): aplicação web estática
- [`tests/`](/Users/maion/Projects/CidadesMissao/tests): suíte automatizada de validação técnica e de dados

## Comandos

```bash
npm run build-data
npm run build-programa
npm run preparar-publicacao
npm run test
npm run serve
```

## Colocar no ar

O dashboard e totalmente estatico, entao voce pode publica-lo sem backend.

### Opcao mais rapida: Netlify Drop

1. Rode:

```bash
npm run build-site
```

2. Isso vai gerar a pasta [`dist/`](/Users/maion/Projects/CidadesMissao/dist).
3. Acesse [https://app.netlify.com/drop](https://app.netlify.com/drop).
4. Arraste a pasta `dist` para a pagina.
5. O painel fica online em alguns segundos com um link publico.

### Opcao profissional: conectar o repositorio

- Netlify:
  - o arquivo [`netlify.toml`](/Users/maion/Projects/CidadesMissao/netlify.toml) ja esta pronto
  - basta conectar o repositorio e publicar
- Vercel:
  - o arquivo [`vercel.json`](/Users/maion/Projects/CidadesMissao/vercel.json) ja esta pronto
  - a Vercel passa a gerar a pasta [`dist/`](/Users/maion/Projects/CidadesMissao/dist) no build
  - o artefato [`dashboard/data/programa_reforma.json`](/Users/maion/Projects/CidadesMissao/dashboard/data/programa_reforma.json) e reconstruido no deploy a partir dos JSONs versionados em [`dashboard/data/`](/Users/maion/Projects/CidadesMissao/dashboard/data)

### O que sera publicado

- [`dist/index.html`](/Users/maion/Projects/CidadesMissao/dist/index.html)
- [`dist/app.js`](/Users/maion/Projects/CidadesMissao/dist/app.js)
- [`dist/styles.css`](/Users/maion/Projects/CidadesMissao/dist/styles.css)
- [`dist/data/`](/Users/maion/Projects/CidadesMissao/dist/data)

### Observacao importante

Sempre que houver mudanca nos dados ou na interface, rode novamente:

```bash
npm run build-site
```

As bases em [`data/fontes/`](/Users/maion/Projects/CidadesMissao/data/fontes) e [`data/raw/`](/Users/maion/Projects/CidadesMissao/data/raw) ficam para reconstrucao local. Elas nao precisam ir para o GitHub nem para a Vercel.
O arquivo [`dashboard/data/programa_reforma.json`](/Users/maion/Projects/CidadesMissao/dashboard/data/programa_reforma.json) tambem nao precisa mais ser versionado: ele e regenerado no build a partir de [`dashboard/data/municipality_data.json`](/Users/maion/Projects/CidadesMissao/dashboard/data/municipality_data.json) e [`dashboard/data/map_paths_by_year.json`](/Users/maion/Projects/CidadesMissao/dashboard/data/map_paths_by_year.json).

## Garantias implementadas

- junção municipal por código IBGE padronizado
- uso da malha oficial municipal do IBGE 2024
- tradução integral da interface e dos artefatos gerados
- cobertura automatizada para integridade das fontes, consistência do pipeline, contratos dos JSONs, cobertura geográfica e textos da interface

## Observações

- Os arquivos `CNES_*` e `Normal-Climatologica-*` foram movidos para a pasta de fontes, mas continuam fora da versão 1 do painel por ainda exigirem política específica de agregação municipal.
- A suíte de testes foi pensada para o padrão de revisão de um time sênior: ela verifica schema, unicidade, coerência temporal, completude de joins, amostras conhecidas e consistência entre o que o builder produz e o que o frontend consome.
