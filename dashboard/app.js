const definicoesMetricas = {
  status_viabilidade: {
    rotulo: "Status de viabilidade",
    tipo: "categorica",
    rotuloDetalhe: "Status de viabilidade",
    fonte: {
      arquivo: "07.03_indicadores_base_completa_20260217.xlsx",
      aba: "indicadores",
      origem: "Base financeira principal consolidada",
    },
    descricao:
      "Classificação final de sustentabilidade do município no ano selecionado, refletindo a leitura consolidada da base financeira.",
    criterios:
      "Os critérios não são recalculados pelo painel. O dashboard lê diretamente os campos status_viabilidade, status_viabilidade_lrf e status_autonomia vindos da aba indicadores da planilha principal.",
    interpretacao:
      "OK indica quadro relativamente saudável. FRAGILIDADE e CRITICA sugerem atenção crescente. INVIAVEL sinaliza forte desequilíbrio ou baixa autonomia.",
    detalhe:
      "O painel usa a classificação pronta da planilha e a cruza com autonomia, dependência, receitas, despesas e porte populacional para contextualizar o resultado.",
    cores: {
      OK: "#2f7a54",
      FRAGILIDADE: "#cf9c45",
      CRITICA: "#bf6542",
      INVIAVEL: "#8e3f2f",
      "Sem dado": "#b7beb9",
    },
  },
  autonomia_fiscal: {
    rotulo: "Autonomia fiscal",
    tipo: "numerica",
    rotuloDetalhe: "Autonomia fiscal",
    fonte: {
      arquivo: "07.03_indicadores_base_completa_20260217.xlsx",
      aba: "indicadores",
      origem: "Base financeira principal consolidada",
    },
    descricao:
      "Mostra o grau de capacidade do município de sustentar sua estrutura a partir de arrecadação e recursos próprios.",
    criterios:
      "Usa o campo autonomia_fiscal da planilha principal. O indicador resume o peso relativo da capacidade própria frente à dependência de transferências.",
    interpretacao:
      "Quanto maior o valor, maior a autonomia relativa. Valores baixos sugerem maior vulnerabilidade a repasses externos.",
    detalhe:
      "Ao abrir um município, o painel compara a autonomia fiscal local com a mediana do filtro atual, para mostrar se ele está acima ou abaixo do grupo comparável.",
    paleta: ["#d5eadc", "#8ac4a5", "#1d6b52"],
    formatador: (valor) => formatarNumero(valor, 2),
  },
  pct_dependencia_transf: {
    rotulo: "Dependência de transferências (%)",
    tipo: "numerica",
    rotuloDetalhe: "Dependência de transferências",
    fonte: {
      arquivo: "07.03_indicadores_base_completa_20260217.xlsx",
      aba: "indicadores",
      origem: "Base financeira principal consolidada",
    },
    descricao:
      "Percentual da receita associado à dependência de transferências intergovernamentais no ano analisado.",
    criterios:
      "Usa o campo pct_dependencia_transf da base. O indicador sintetiza o quanto a estrutura fiscal depende de repasses, em vez de arrecadação própria.",
    interpretacao:
      "Quanto maior o percentual, maior o risco de dependência estrutural. Valores muito altos reforçam a leitura da cartilha sobre fragilidade federativa local.",
    detalhe:
      "O detalhamento cruza a dependência total com dependência federal, dependência estadual, FPM, FUNDEB, SUS, ICMS e IPVA, para explicar de onde vem a pressão fiscal.",
    paleta: ["#fbebca", "#d89b47", "#8e3f2f"],
    formatador: (valor) => `${formatarNumero(valor, 1)}%`,
  },
  receita_propria_per_capita: {
    rotulo: "Receita própria per capita",
    tipo: "numerica",
    rotuloDetalhe: "Receita própria per capita",
    fonte: {
      arquivo: "07.03_indicadores_base_completa_20260217.xlsx",
      aba: "indicadores",
      origem: "Base financeira principal consolidada",
    },
    descricao:
      "Quanto o município arrecada por habitante com base na sua estrutura própria de receitas.",
    criterios:
      "Considera o valor anual da receita própria dividido pela população registrada na base financeira consolidada.",
    interpretacao:
      "Valores maiores sugerem maior capacidade de financiar serviços com base local. É útil comparar com população e dependência de transferências.",
    detalhe:
      "No detalhe, o painel coloca esse valor ao lado da população, autonomia fiscal e grandes transferências para evitar leitura isolada do indicador.",
    paleta: ["#dce5f0", "#7a99b9", "#214565"],
    formatador: (valor) => formatarMoeda(valor),
  },
  populacao: {
    rotulo: "População",
    tipo: "numerica",
    rotuloDetalhe: "População",
    fonte: {
      arquivo: "07.03_indicadores_base_completa_20260217.xlsx + municipios_enriquecidos6.csv",
      aba: "indicadores + base tabular enriquecida",
      origem: "Base financeira principal com fallback demográfico",
    },
    descricao:
      "População do município usada como referência de escala e comparação entre cidades do mesmo filtro.",
    criterios:
      "Prioriza a população da base financeira anual. Se não houver valor, usa a população da base enriquecida.",
    interpretacao:
      "Não mede qualidade fiscal por si só, mas ajuda a interpretar escala administrativa, faixas populacionais e pressão sobre serviços.",
    detalhe:
      "O detalhe usa a população para contextualizar todos os demais indicadores e para comparar municípios grandes e pequenos dentro do filtro atual.",
    paleta: ["#efe0cf", "#c4864d", "#72361f"],
    formatador: (valor) => formatarInteiro(valor),
  },
  bolsa_familia_total: {
    rotulo: "Beneficiários do Bolsa Família",
    tipo: "numerica",
    rotuloDetalhe: "Beneficiários do Bolsa Família",
    fonte: {
      arquivo: "beneficios_bolsa_familia.csv",
      aba: "arquivo tabular único",
      origem: "Base social do Bolsa Família",
    },
    descricao:
      "Total de benefícios do Bolsa Família na referência mais recente disponível para cada município.",
    criterios:
      "Usa o campo qtd_ben_bf da última competência encontrada no CSV. Não é uma média anual; é um retrato do mês mais recente disponível.",
    interpretacao:
      "Valores altos podem refletir tamanho populacional, pobreza ou ambos. O indicador deve ser lido junto com população, renda e dependência fiscal.",
    detalhe:
      "O painel relaciona o total de beneficiários com população, renda e posição fiscal do município para evitar conclusões simplistas.",
    paleta: ["#ece6b7", "#b7a72d", "#6f631b"],
    formatador: (valor) => formatarInteiro(valor),
  },
  ifdm_geral: {
    rotulo: "IFDM Geral",
    tipo: "numerica",
    rotuloDetalhe: "IFDM Geral",
    fonte: {
      arquivo: "Ranking-IFDM-2025-ano-base-2023.xlsx",
      aba: "IFDM Geral",
      origem: "Ranking oficial da FIRJAN",
    },
    descricao:
      "Índice FIRJAN de Desenvolvimento Municipal para o ano-base 2023, combinando emprego e renda, educação e saúde.",
    criterios:
      "O painel usa o ranking oficial da FIRJAN e associa cada município por nome e UF à malha municipal e à base fiscal do dashboard.",
    interpretacao:
      "Valores maiores indicam melhor desenvolvimento relativo segundo a metodologia do IFDM. O índice deve ser lido em conjunto com autonomia fiscal e dependência.",
    detalhe:
      "O detalhe mostra o IFDM geral e seus componentes para conectar desenvolvimento municipal com sustentabilidade fiscal e social.",
    paleta: ["#edf3dd", "#9bc36b", "#3d6c29"],
    formatador: (valor) => formatarNumero(valor, 3),
  },
};

const explicacoesCampos = {
  "Métrica selecionada": "Valor da métrica ativa, igual ao que colore o mapa e alimenta os rankings.",
  "Status de viabilidade": "Classificação consolidada da planilha principal. É a origem do critério de viabilidade mostrado no painel.",
  "Status de viabilidade LRF": "Leitura complementar orientada pela lógica de limite fiscal presente na base consolidada.",
  "Status de autonomia": "Classificação adicional da planilha sobre o grau de dependência/autonomia do município.",
  População: "Escala demográfica usada para contextualizar os demais indicadores.",
  "Dependência de transferências": "Percentual de dependência da estrutura fiscal em relação aos repasses externos.",
  "Autonomia fiscal": "Síntese da capacidade própria do município de financiar sua operação.",
  "Receita própria per capita": "Arrecadação própria por habitante.",
  "Receita total bruta": "Receita total antes dos ajustes líquidos da base consolidada.",
  "Receita corrente bruta": "Receita corrente antes dos ajustes líquidos.",
  "Receita total líquida": "Receita total após os ajustes líquidos registrados na base.",
  "Receita corrente líquida": "Receita corrente após os ajustes líquidos registrados na base.",
  "Transferências totais": "Soma dos repasses relevantes para a estrutura de receitas.",
  "Receita tributária municipal": "Arrecadação tributária própria do município.",
  "Percentual tributário bruto": "Peso percentual da receita tributária sobre a receita bruta.",
  "Percentual da receita tributária": "Outro recorte percentual da tributação própria na composição das receitas.",
  IPTU: "Imposto municipal sobre propriedade urbana.",
  ISS: "Imposto municipal sobre serviços.",
  ITBI: "Imposto municipal sobre transmissão de bens imóveis.",
  "Bolsa Família": "Total de benefícios na referência social mais recente.",
  "Faixa populacional": "Classe de porte usada para comparação entre municípios semelhantes.",
  FPM: "Transferência federal relevante para municípios.",
  FUNDEB: "Transferência vinculada à educação.",
  SUS: "Repasse vinculado à saúde.",
  ICMS: "Participação municipal sobre arrecadação estadual.",
  IPVA: "Participação municipal vinculada ao imposto sobre veículos.",
  "Participação do FPM": "Peso do FPM dentro da receita bruta.",
  "Participação do FUNDEB": "Peso do FUNDEB dentro da receita bruta.",
  "Participação do SUS": "Peso do SUS dentro da receita bruta.",
  "Participação do ICMS": "Peso do ICMS dentro da receita bruta.",
  "Participação do IPVA": "Peso do IPVA dentro da receita bruta.",
  "Dependência federal": "Parte da dependência total associada à União.",
  "Dependência estadual": "Parte da dependência total associada ao estado.",
  "Despesa total": "Soma das despesas totais informadas na base.",
  "Despesa com pessoal": "Gasto com pessoal informado na base anual.",
  "Despesa de custeio": "Despesa corrente operacional do município.",
  "Despesa de investimento": "Parcela voltada a investimento.",
  "Capacidade de investimento": "Espaço relativo para investir após as pressões do orçamento.",
  "Margem orçamentária": "Folga ou aperto do orçamento segundo a base consolidada.",
  "Pessoal per capita": "Despesa com pessoal por habitante.",
  "Razão pessoal/receita própria": "Relação entre gasto com pessoal e receita própria.",
  "Razão pessoal/LRF": "Relação fiscal reportada na base em diálogo com a lógica da LRF.",
  Alfabetização: "Indicador adicional da base enriquecida, útil para contextualizar condições estruturais.",
  "Renda média 10+": "Renda média da população de 10 anos ou mais.",
  "Renda média 15+": "Renda média da população de 15 anos ou mais.",
  "Mortalidade infantil": "Indicador social agregado da base enriquecida.",
  "PIB aproximado": "Proxy econômico da base enriquecida.",
  "Mulheres no trabalho formal": "Participação feminina em trabalhos formais segundo a base enriquecida.",
  "Tem RGF": "Sinalização binária presente na planilha sobre disponibilidade de relatório fiscal.",
  "Avisos da base": "Observações e alertas trazidos pela própria planilha consolidada.",
  "IFDM Geral": "Índice FIRJAN de Desenvolvimento Municipal, com base oficial da FIRJAN para o ano-base 2023.",
  "IFDM Educação": "Componente do IFDM relacionado a desempenho educacional.",
  "IFDM Saúde": "Componente do IFDM relacionado a saúde.",
  "IFDM Emprego & renda": "Componente do IFDM relacionado a mercado de trabalho e renda.",
  "Ranking IFDM nacional": "Posição do município no ranking nacional do IFDM oficial da FIRJAN.",
  "Ranking IFDM estadual": "Posição do município no ranking estadual do IFDM oficial da FIRJAN.",
  "Fonte dos tributos municipais": "Quando disponível, o painel substitui os tributos municipais por consulta oficial à API do Siconfi/Tesouro para o município e ano selecionados.",
};

const elementos = {
  seletorMetrica: document.getElementById("seletor-metrica"),
  seletorAno: document.getElementById("seletor-ano"),
  seletorUf: document.getElementById("seletor-uf"),
  seletorRegiao: document.getElementById("seletor-regiao"),
  seletorFaixaPopulacional: document.getElementById("seletor-faixa-populacional"),
  seletorStatus: document.getElementById("seletor-status"),
  seletorClimaVariavel: document.getElementById("seletor-clima-variavel"),
  seletorClimaUf: document.getElementById("seletor-clima-uf"),
  resetarMapa: document.getElementById("resetar-mapa"),
  mapa: document.getElementById("mapa-svg"),
  mapaClima: document.getElementById("mapa-clima-svg"),
  mapaPrograma: document.getElementById("mapa-programa-svg"),
  tooltip: document.getElementById("tooltip-mapa"),
  tooltipClima: document.getElementById("tooltip-clima"),
  tooltipPrograma: document.getElementById("tooltip-programa"),
  tooltipAjuda: document.getElementById("tooltip-ajuda"),
  tituloDetalhe: document.getElementById("titulo-detalhe"),
  subtituloDetalhe: document.getElementById("subtitulo-detalhe"),
  buscaMunicipioInput: document.getElementById("busca-municipio-input"),
  buscaMunicipioSugestoes: document.getElementById("busca-municipio-sugestoes"),
  ajudaDetalheMontagem: document.getElementById("ajuda-detalhe-montagem"),
  gradeDetalhe: document.getElementById("grade-detalhe"),
  comparacaoDetalhe: document.getElementById("comparacao-detalhe"),
  explicacaoDetalhe: document.getElementById("explicacao-detalhe"),
  interpretacaoDetalhe: document.getElementById("interpretacao-detalhe"),
  resumoCartilha: document.getElementById("resumo-cartilha"),
  resumoCartilhasBloco: document.getElementById("resumo-cartilhas-bloco"),
  cartilha1Titulo: document.getElementById("cartilha-1-titulo"),
  cartilha1Foco: document.getElementById("cartilha-1-foco"),
  cartilha1Resumo: document.getElementById("cartilha-1-resumo"),
  cartilha1Temas: document.getElementById("cartilha-1-temas"),
  cartilha1Arquivo: document.getElementById("cartilha-1-arquivo"),
  cartilha1Link: document.getElementById("cartilha-1-link"),
  cartilha1Trecho: document.getElementById("cartilha-1-trecho"),
  cartilha2Titulo: document.getElementById("cartilha-2-titulo"),
  cartilha2Foco: document.getElementById("cartilha-2-foco"),
  cartilha2Resumo: document.getElementById("cartilha-2-resumo"),
  cartilha2Temas: document.getElementById("cartilha-2-temas"),
  cartilha2Arquivo: document.getElementById("cartilha-2-arquivo"),
  cartilha2Link: document.getElementById("cartilha-2-link"),
  cartilha2Trecho: document.getElementById("cartilha-2-trecho"),
  listaMudancasCartilha: document.getElementById("lista-mudancas-cartilha"),
  listaImplementacoesCartilha: document.getElementById("lista-implementacoes-cartilha"),
  listaCriteriosCartilha: document.getElementById("lista-criterios-cartilha"),
  tituloLegenda: document.getElementById("titulo-legenda"),
  escalaLegenda: document.getElementById("escala-legenda"),
  graficoTop: document.getElementById("grafico-top"),
  graficoStatus: document.getElementById("grafico-status"),
  graficoRegioes: document.getElementById("grafico-regioes"),
  graficoFaixas: document.getElementById("grafico-faixas"),
  insightsAutomaticos: document.getElementById("insights-automaticos"),
  graficoClimaMensal: document.getElementById("grafico-clima-mensal"),
  graficoClimaUfs: document.getElementById("grafico-clima-ufs"),
  graficoClimaEstacoes: document.getElementById("grafico-clima-estacoes"),
  escopoClima: document.getElementById("escopo-clima"),
  fonteClima: document.getElementById("fonte-clima"),
  coberturaClima: document.getElementById("cobertura-clima"),
  explicacaoClima: document.getElementById("explicacao-clima"),
  insightClima: document.getElementById("insight-clima"),
  municipiosOficiais: document.getElementById("municipios-oficiais"),
  referenciaBolsa: document.getElementById("referencia-bolsa"),
  municipiosComDados: document.getElementById("municipios-com-dados"),
  municipiosSemDados: document.getElementById("municipios-sem-dados"),
  tituloMetrica: document.getElementById("titulo-metrica"),
  descricaoMetrica: document.getElementById("descricao-metrica"),
  fonteMetrica: document.getElementById("fonte-metrica"),
  criteriosMetrica: document.getElementById("criterios-metrica"),
  interpretacaoMetrica: document.getElementById("interpretacao-metrica"),
  programaResumo: document.getElementById("programa-resumo"),
  programaMensagem: document.getElementById("programa-mensagem"),
  programaParametro: document.getElementById("programa-parametro"),
  programaIfdm: document.getElementById("programa-ifdm"),
  programaPosUnificacao: document.getElementById("programa-pos-unificacao"),
  programaLrg: document.getElementById("programa-lrg"),
  programaEixos: document.getElementById("programa-eixos"),
  programaMetodologia: document.getElementById("programa-metodologia"),
  programaTerritorios: document.getElementById("programa-territorios"),
  programaMapaResumo: document.getElementById("programa-mapa-resumo"),
  programaMapaAviso: document.getElementById("programa-mapa-aviso"),
  programaPerfilComparacao: document.getElementById("programa-perfil-comparacao"),
  programaAjudaPerfil: document.getElementById("programa-ajuda-perfil"),
  programaAjudaAgrupamentos: document.getElementById("programa-ajuda-agrupamentos"),
  programaAgrupamentosResumo: document.getElementById("programa-agrupamentos-resumo"),
  programaAgrupamentos: document.getElementById("programa-agrupamentos"),
  programaDetalheTerritorio: document.getElementById("programa-detalhe-territorio"),
  programaAjudaDetalheTerritorio: document.getElementById("programa-ajuda-detalhe-territorio"),
  programaDetalheTerritorioSubtitulo: document.getElementById("programa-detalhe-territorio-subtitulo"),
  programaDetalheTerritorioKpis: document.getElementById("programa-detalhe-territorio-kpis"),
  programaDetalheMunicipios: document.getElementById("programa-detalhe-municipios"),
  programaAjudaTabelaMunicipios: document.getElementById("programa-ajuda-tabela-municipios"),
  programaTabelaMunicipiosHead: document.getElementById("programa-tabela-municipios-head"),
  programaTabelaMunicipiosBody: document.getElementById("programa-tabela-municipios-body"),
  programaTabelaMunicipiosFoot: document.getElementById("programa-tabela-municipios-foot"),
  programaSeletorPopulacao: document.getElementById("programa-seletor-populacao"),
  programaSeletorPerfil: document.getElementById("programa-seletor-perfil"),
  programaBuscaTerritorios: document.getElementById("programa-busca-territorios"),
  programaOrdenarTerritorio: document.getElementById("programa-ordenar-territorio"),
  programaOrdenarUf: document.getElementById("programa-ordenar-uf"),
  programaOrdenarPopulacao: document.getElementById("programa-ordenar-populacao"),
  programaTabelaTerritorios: document.getElementById("programa-tabela-territorios"),
  programaTabelaTotalBrasil: document.getElementById("programa-tabela-total-brasil"),
  programaPaginaAnterior: document.getElementById("programa-pagina-anterior"),
  programaPaginaProxima: document.getElementById("programa-pagina-proxima"),
  programaPaginacaoResumo: document.getElementById("programa-paginacao-resumo"),
  programaCenariosAviso: document.getElementById("programa-cenarios-aviso"),
  programaCenarios: document.getElementById("programa-cenarios"),
  programaLegal: document.getElementById("programa-legal"),
  programaCapitaisIfdm: document.getElementById("programa-capitais-ifdm"),
  programaLrgPrincipios: document.getElementById("programa-lrg-principios"),
};

const estado = {
  metadata: null,
  linhas: [],
  nomeMunicipioPorCodigo: new Map(),
  caminhosPorAno: {},
  climatologia: null,
  programaReforma: null,
  perfisPrograma: null,
  metricaAtual: "status_viabilidade",
  anoAtual: null,
  ufAtual: "TODAS",
  regiaoAtual: "TODAS",
  faixaPopulacionalAtual: "TODAS",
  statusAtual: "TODOS",
  climaVariavelAtual: "precipitacao",
  climaUfAtual: "BRASIL",
  codigoSelecionado: null,
  buscaMunicipio: "",
  municipiosDestacadosPrograma: [],
  buscaTerritoriosPrograma: "",
  paginaTerritoriosPrograma: 1,
  itensPorPaginaTerritoriosPrograma: 15,
  ordenacaoTerritoriosPrograma: { chave: "nome", direcao: "asc" },
  territorioProgramaSelecionadoId: null,
  programaCenarioSelecionadoId: null,
  cacheTributosMunicipais: {},
  chaveTributosAtiva: null,
  timerBuscaTerritoriosPrograma: null,
  timerBuscaMunicipio: null,
  mapaTransforms: {
    principal: { escala: 1, x: 0, y: 0 },
    clima: { escala: 1, x: 0, y: 0 },
    programa: { escala: 1, x: 0, y: 0 },
  },
};

inicializar().catch((erro) => {
  console.error(erro);
  document.body.innerHTML = `<pre style="padding:24px;font-family:monospace;">Falha ao carregar os dados do dashboard.\n${erro.message}</pre>`;
});

async function inicializar() {
  const [metadata, linhas, caminhos, climatologia, programaReforma, perfisPrograma] = await Promise.all([
    buscarJson("./data/metadata.json"),
    buscarJson("./data/municipality_data.json"),
    buscarJson("./data/map_paths_by_year.json"),
    buscarJson("./data/climatologia.json"),
    buscarJson("./data/programa_reforma.json"),
    buscarJson("./data/programa_perfis.json"),
  ]);

  estado.metadata = metadata;
  estado.linhas = linhas;
  estado.nomeMunicipioPorCodigo = construirIndiceMunicipios(linhas);
  estado.caminhosPorAno = caminhos;
  estado.climatologia = climatologia;
  estado.perfisPrograma = perfisPrograma;
  prepararTerritoriosPrograma(programaReforma);
  estado.programaReforma = programaReforma;
  estado.anoAtual = String(metadata.filtros.anos.at(-1));

  prepararMapa();
  preencherResumo();
  preencherControles();
  preencherControlesClima();
  registrarEventos();
  renderizar();
}

async function buscarJson(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`${resposta.status} ao buscar ${url}`);
  }
  return resposta.json();
}

function construirIndiceMunicipios(linhas) {
  const indice = new Map();
  (linhas || []).forEach((linha) => {
    if (!linha?.codigo_ibge || !linha?.nome_municipio || !linha?.uf) return;
    indice.set(linha.codigo_ibge, `${linha.nome_municipio} (${linha.uf})`);
  });
  return indice;
}

function obterRotuloMunicipio(linha) {
  return linha ? `${linha.nome_municipio} (${linha.uf})` : "";
}

function criarTextoMontagemDetalhe(linha, metrica, tributos) {
  const fonteTributos = tributos?.fonte || "base financeira principal consolidada";
  return [
    `Este quadro combina a métrica ativa "${metrica.rotulo}" com o conjunto fiscal, social e demográfico do município selecionado.`,
    `A classificação de viabilidade, autonomia fiscal, dependência, receitas, despesas, transferências e população vêm principalmente da planilha 07.03_indicadores_base_completa_20260217.xlsx, aba indicadores. O painel não recalcula nem reinventa o status de viabilidade; ele lê o campo já consolidado na base principal.`,
    `Bolsa Família vem do arquivo beneficios_bolsa_familia.csv na referência mais recente disponível; IFDM Geral e componentes vêm do ranking oficial da FIRJAN, ano-base 2023; indicadores sociais complementares, como alfabetização, renda, mortalidade infantil e PIB aproximado, vêm da base municipios_enriquecidos6.csv.`,
    `Para IPTU, ITBI, ISS e receita tributária municipal, o painel prioriza a consulta oficial à API do Siconfi/Tesouro para ${linha.nome_municipio} em ${linha.ano}. Quando essa consulta não retorna dados, o detalhe usa o valor da base consolidada. Fonte atual dos tributos neste município: ${fonteTributos}.`,
    `O painel ainda compara o município com o filtro atual para mostrar posição relativa de porte, dependência e desempenho, evitando leitura isolada de um único número.`,
  ].join(" ");
}

function prepararTerritoriosPrograma(programaReforma) {
  const prepararLista = (territorios) => {
    (territorios || []).forEach((territorio) => {
      const municipiosTexto = (territorio.municipios || [])
        .map((codigo) => obterNomeMunicipioPorCodigo(codigo))
        .filter(Boolean)
        .join(", ");
      territorio._municipiosTexto = municipiosTexto;
      territorio._termoBusca = normalizarTextoLivre([territorio.nome, territorio.uf, municipiosTexto].join(" "));
    });
  };
  prepararLista(programaReforma?.mapa_unificado?.territorios);
  prepararLista(programaReforma?.territorios_identidade?.territorios);
  (programaReforma?.mapa_unificado?.cenarios || []).forEach((cenario) => {
    prepararLista(cenario.territorios);
    prepararLista(cenario.territorios_identidade);
  });
}

function prepararMapa() {
  estado.mapaTransforms = {
    principal: { escala: 1, x: 0, y: 0 },
    clima: { escala: 1, x: 0, y: 0 },
    programa: { escala: 1, x: 0, y: 0 },
  };
}

function preencherResumo() {
  const { metadata, linhas } = estado;
  elementos.resumoCartilha.textContent = metadata.narrativa.summary;
  elementos.resumoCartilhasBloco.textContent = metadata.narrativa.comparativo.resumo_geral;
  renderizarCartilhas(metadata.narrativa);
  elementos.referenciaBolsa.textContent = formatarMes(metadata.ultima_referencia_bolsa_familia);
  elementos.municipiosOficiais.textContent = formatarInteiro(metadata.qualidade.municipios_com_geometria);
  atualizarResumoCoberturaAno();
  elementos.escopoClima.textContent = estado.climatologia.escopo;
  renderizarProgramaReforma();
}

function atualizarResumoCoberturaAno() {
  const oficiais = estado.metadata.qualidade.municipios_com_geometria;
  const comDados = new Set(obterLinhasDoAno().map((linha) => linha.codigo_ibge)).size;
  const semDados = Math.max(0, oficiais - comDados);
  elementos.municipiosComDados.textContent = formatarInteiro(comDados);
  elementos.municipiosSemDados.textContent = formatarInteiro(semDados);
}

function renderizarCartilhas(narrativa) {
  const [cartilha1, cartilha2] = narrativa.cartilhas;
  preencherCardCartilha(cartilha1, {
    titulo: elementos.cartilha1Titulo,
    foco: elementos.cartilha1Foco,
    resumo: elementos.cartilha1Resumo,
    temas: elementos.cartilha1Temas,
    arquivo: elementos.cartilha1Arquivo,
    link: elementos.cartilha1Link,
    trecho: elementos.cartilha1Trecho,
  });
  preencherCardCartilha(cartilha2, {
    titulo: elementos.cartilha2Titulo,
    foco: elementos.cartilha2Foco,
    resumo: elementos.cartilha2Resumo,
    temas: elementos.cartilha2Temas,
    arquivo: elementos.cartilha2Arquivo,
    link: elementos.cartilha2Link,
    trecho: elementos.cartilha2Trecho,
  });
  preencherLista(elementos.listaMudancasCartilha, narrativa.comparativo.o_que_mudou);
  preencherLista(elementos.listaImplementacoesCartilha, narrativa.comparativo.implementado_no_dashboard);
  preencherLista(elementos.listaCriteriosCartilha, narrativa.comparativo.criterios_territoriais);
}

function renderizarProgramaReforma() {
  const programa = estado.programaReforma;
  if (!programa) return;
  if (!estado.programaCenarioSelecionadoId) {
    estado.programaCenarioSelecionadoId = programa.mapa_unificado.cenario_padrao_id;
  }
  preencherControlesCenarioPrograma();
  const cenario = obterCenarioProgramaAtivo();
  const perfilAtual = obterPerfilProgramaSelecionado();
  elementos.programaResumo.textContent =
    "Camada programática separada do diagnóstico, com metodologia preliminar, cenários iniciais e arquitetura legal em curadoria.";
  elementos.programaMensagem.textContent = programa.visao_geral.mensagem_programatica;
  elementos.programaParametro.textContent = `Referência inicial de ${formatarInteiro(
    programa.territorios_identidade.parametro_populacional_referencia
  )} habitantes por amálgama, com alvo ótimo de ${formatarInteiro(
    programa.territorios_identidade.parametro_populacional_otimo
  )} habitantes e possibilidade de recalibração.`;
  elementos.programaIfdm.textContent = `${programa.visao_geral.ifdm.status.replaceAll("_", " ")}. ${programa.visao_geral.ifdm.observacao}`;
  elementos.programaPosUnificacao.textContent = `${formatarInteiro(cenario.municipios_depois)} territórios no cenário simulado, ante ${formatarInteiro(
    cenario.municipios_antes
  )} municípios atuais.`;
  elementos.programaLrg.textContent = `${programa.lrg_conceitual.status.replaceAll("_", " ")}. ${programa.lrg_conceitual.aviso}`;
  elementos.programaMapaResumo.textContent = `Após a unificação preliminar, o cenário passa de ${formatarInteiro(
    cenario.municipios_antes
  )} para ${formatarInteiro(cenario.municipios_depois)} unidades territoriais, redução de ${formatarInteiro(
    cenario.reducao_absoluta
  )} (${formatarNumero(cenario.reducao_percentual, 1)}%).`;
  elementos.programaMapaAviso.textContent = `${programa.mapa_unificado.escopo} Cenário ativo: ${cenario.rotulo}. ${cenario.perfil_descricao}`;
  elementos.programaPerfilComparacao.textContent = criarResumoComparacaoPerfil(cenario, perfilAtual);
  elementos.programaCenariosAviso.textContent = programa.cenarios_amalgama.observacao_metodologica;
  atualizarAjudaPerfilPrograma(perfilAtual, cenario);
  atualizarAjudaAgrupamentosPrograma(cenario, perfilAtual);

  preencherLista(elementos.programaEixos, programa.visao_geral.eixos);
  preencherLista(elementos.programaMetodologia, programa.territorios_identidade.metodologia);
  preencherLista(elementos.programaLrgPrincipios, programa.lrg_conceitual.principios_sugeridos);

  renderizarTerritoriosPrograma(cenario.territorios_identidade || programa.territorios_identidade.territorios);
  renderizarMapaUnificadoPrograma(cenario.territorios);
  sincronizarControlesTabelaPrograma();
  renderizarTabelaMapaUnificado(cenario.territorios);
  renderizarAgrupamentosPrograma(cenario.territorios, cenario);
  renderizarDetalheTerritorioPrograma(cenario);
  renderizarCenariosPrograma(programa.cenarios_amalgama.municipios_prioritarios);
  renderizarArquiteturaLegal(programa.arquitetura_legal.eixos);
  renderizarCapitaisIfdm(programa.ifdm_capitais || []);
}

function obterCenarioProgramaAtivo() {
  const cenarios = estado.programaReforma?.mapa_unificado?.cenarios || [];
  return (
    cenarios.find((item) => item.id === estado.programaCenarioSelecionadoId) ||
    cenarios[0] ||
    estado.programaReforma?.mapa_unificado
  );
}

function obterPerfilProgramaSelecionado() {
  const perfilId = obterCenarioProgramaAtivo()?.perfil_agregacao;
  return (estado.perfisPrograma?.perfis || []).find((perfil) => perfil.id === perfilId) || null;
}

function criarResumoComparacaoPerfil(cenario, perfilAtual) {
  const comparacoes = cenario?.comparacoes_perfis || {};
  const perfis = (estado.perfisPrograma?.perfis || []).filter((perfil) => perfil.id !== cenario?.perfil_agregacao);
  if (!perfis.length) {
    return "Sem comparações disponíveis para o perfil atual.";
  }
  const trechos = perfis
    .map((perfil) => {
      const comparacao = comparacoes[perfil.id];
      if (!comparacao) return null;
      return `${perfil.rotulo}: ${formatarInteiro(comparacao.municipios_em_territorio_diferente)} municípios e ${formatarInteiro(
        comparacao.territorios_com_composicao_diferente
      )} composições diferentes`;
    })
    .filter(Boolean);
  if (!trechos.length) {
    return "Sem comparações disponíveis para o perfil atual.";
  }
  return `Comparação do perfil ${perfilAtual?.rotulo || cenario?.perfil_rotulo}: ${trechos.join(" · ")}.`;
}

function atualizarAjudaPerfilPrograma(perfilAtual, cenario) {
  if (!elementos.programaAjudaPerfil) return;
  const textoAjuda = perfilAtual?.ajuda || cenario?.perfil_ajuda || "Perfil metodológico do cenário programático.";
  elementos.programaAjudaPerfil.dataset.ajuda = textoAjuda;
  elementos.programaAjudaPerfil.dataset.ajudaHtml = construirAjudaHtmlPerfil(perfilAtual, cenario);
  elementos.programaAjudaPerfil.setAttribute("aria-label", textoAjuda);
}

function atualizarAjudaAgrupamentosPrograma(cenario, perfilAtual) {
  if (!elementos.programaAjudaAgrupamentos) return;
  const texto = `Agrupamentos do cenário mostram, no perfil ${perfilAtual?.rotulo || cenario?.perfil_rotulo}, quais municípios foram reunidos em cada novo território para a população de referência de ${formatarInteiro(
    cenario?.populacao_referencia || 0
  )} habitantes. Ao clicar em um agrupamento, o mapa e a tabela são sincronizados para esse território.`;
  elementos.programaAjudaAgrupamentos.dataset.ajuda = texto;
  elementos.programaAjudaAgrupamentos.dataset.ajudaHtml = `
    <div class="tooltip-ajuda-card">
      <strong>Agrupamentos do cenário</strong>
      <p>Esta seção transforma a simulação em uma leitura direta de composição territorial.</p>
      <div class="tooltip-ajuda-bloco">
        <span>O que aparece aqui</span>
        <ul>
          <li>cada card representa um novo território do cenário ativo</li>
          <li>a lista de municípios mostra quem foi englobado nesse bloco</li>
          <li>os números resumem população, dependência e autonomia do agrupamento</li>
        </ul>
      </div>
      <div class="tooltip-ajuda-bloco">
        <span>Como usar</span>
        <ul>
          <li>clique em um agrupamento para destacar o território no mapa</li>
          <li>use a busca da tabela ao lado para localizar um município e ver em qual agrupamento ele cai</li>
          <li>troque perfil e população de referência para comparar como a composição muda</li>
        </ul>
      </div>
    </div>
  `;
  elementos.programaAjudaAgrupamentos.setAttribute("aria-label", texto);
}

function atualizarAjudaDetalheTerritorioPrograma(cenario, territorio) {
  if (!elementos.programaAjudaDetalheTerritorio) return;
  const texto = territorio
    ? `Este consolidado recompõe o território ${territorio.nome} a partir da soma dos municípios englobados no cenário ${cenario.rotulo}. Percentuais fiscais territoriais, como dependência de transferências, são recalculados com base nos agregados do território, e não por média simples dos municípios.`
    : "Selecione um território no mapa ou na tabela para ver o consolidado territorial recalculado a partir das somas do agrupamento.";
  elementos.programaAjudaDetalheTerritorio.dataset.ajuda = texto;
  elementos.programaAjudaDetalheTerritorio.dataset.ajudaHtml = `
    <div class="tooltip-ajuda-card">
      <strong>Consolidado territorial</strong>
      <p>${escapeHtml(texto)}</p>
      <div class="tooltip-ajuda-bloco">
        <span>Como os números são montados</span>
        <ul>
          <li>valores monetários do território são somas dos municípios englobados</li>
          <li>dependência territorial é recalculada como transferências totais divididas pela receita total bruta do território</li>
          <li>autonomia territorial é recalculada pela razão entre receita sem transferências principais e receita total bruta</li>
          <li>IFDM e alguns indicadores médios usam ponderação por população para evitar distorção de municípios muito pequenos</li>
        </ul>
      </div>
    </div>
  `;
  elementos.programaAjudaDetalheTerritorio.setAttribute("aria-label", texto);
}

function construirAjudaHtmlPerfil(perfilAtual, cenario) {
  const criterios = (perfilAtual?.criterios_considerados || cenario?.perfil_criterios_considerados || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const blocosComparacao = Object.entries(cenario?.comparacoes_perfis || {})
    .map(([perfilId, comparacao]) => {
      const perfil = (estado.perfisPrograma?.perfis || []).find((item) => item.id === perfilId);
      const amostra = (comparacao?.amostra_municipios || [])
        .slice(0, 4)
        .map((item) => `<li>${escapeHtml(item.nome_municipio)} (${escapeHtml(item.uf)})</li>`)
        .join("");
      return `
        <div class="tooltip-ajuda-subbloco">
          <span>Vs ${escapeHtml(perfil?.rotulo || perfilId)}</span>
          <p>Muda ${formatarInteiro(comparacao.municipios_em_territorio_diferente)} municípios e ${formatarInteiro(
            comparacao.territorios_com_composicao_diferente
          )} composições territoriais.</p>
          ${amostra ? `<ul>${amostra}</ul>` : ""}
        </div>
      `;
    })
    .join("");

  return `
    <div class="tooltip-ajuda-card">
      <strong>${escapeHtml(perfilAtual?.rotulo || cenario?.perfil_rotulo || "Perfil de agregação")}</strong>
      <p>${escapeHtml(perfilAtual?.descricao || cenario?.perfil_descricao || "Perfil metodológico do cenário.")}</p>
      <div class="tooltip-ajuda-bloco">
        <span>O que este perfil prioriza</span>
        <ul>${criterios || "<li>Sem critérios detalhados no perfil atual.</li>"}</ul>
      </div>
      <div class="tooltip-ajuda-bloco">
        <span>Comparações deste cenário</span>
        ${blocosComparacao || "<p>Sem comparações adicionais disponíveis para este perfil.</p>"}
      </div>
    </div>
  `;
}

function preencherControlesCenarioPrograma() {
  const cenarios = estado.programaReforma?.mapa_unificado?.cenarios || [];
  const populacoes = [...new Set(cenarios.map((cenario) => cenario.populacao_referencia))].sort((a, b) => a - b);
  const perfis = [];
  const vistos = new Set();
  cenarios.forEach((cenario) => {
    if (vistos.has(cenario.perfil_agregacao)) return;
    vistos.add(cenario.perfil_agregacao);
    perfis.push({ id: cenario.perfil_agregacao, rotulo: cenario.perfil_rotulo });
  });

  elementos.programaSeletorPopulacao.innerHTML = populacoes
    .map((valor) => `<option value="${valor}">${formatarInteiro(valor)} habitantes</option>`)
    .join("");
  elementos.programaSeletorPerfil.innerHTML = perfis
    .map((perfil) => `<option value="${perfil.id}">${perfil.rotulo}</option>`)
    .join("");

  const ativo = obterCenarioProgramaAtivo();
  if (ativo) {
    elementos.programaSeletorPopulacao.value = String(ativo.populacao_referencia);
    elementos.programaSeletorPerfil.value = ativo.perfil_agregacao;
  }
}

function preencherCardCartilha(cartilha, elementosCard) {
  elementosCard.titulo.textContent = cartilha.titulo;
  elementosCard.foco.textContent = cartilha.foco;
  elementosCard.resumo.textContent = cartilha.resumo;
  elementosCard.arquivo.textContent = cartilha.arquivo;
  if (elementosCard.link) {
    elementosCard.link.href = obterLinkCartilha(cartilha.id);
    elementosCard.link.setAttribute("download", cartilha.arquivo);
  }
  elementosCard.trecho.textContent = cartilha.trecho;
  preencherLista(elementosCard.temas, cartilha.temas);
}

function obterLinkCartilha(cartilhaId) {
  const links = {
    primeira_etapa: "./assets/documentos/cartilha-reducao-municipios-primeira-etapa.docx",
    segunda_etapa: "./assets/documentos/cartilha-reducao-municipios-segunda-etapa.docx",
  };
  return links[cartilhaId] || "#";
}

function preencherLista(elemento, itens) {
  if (!elemento) return;
  elemento.innerHTML = "";
  (itens || []).forEach((texto) => {
    const item = document.createElement("li");
    item.textContent = texto;
    elemento.appendChild(item);
  });
}

function renderizarTerritoriosPrograma(territorios) {
  elementos.programaTerritorios.innerHTML = "";
  territorios
    .slice(0, 12)
    .forEach((territorio) => {
      const card = document.createElement("div");
      card.className = "programa-card";
      card.innerHTML = `
        <span>${territorio.nome}</span>
        <strong>${formatarInteiro(territorio.populacao_total)} hab. · ${territorio.quantidade_municipios} municípios</strong>
      <small>Autonomia média: ${formatarNumero(territorio.autonomia_media, 2)} · Dependência média: ${formatarNumero(
          territorio.dependencia_media,
          1
        )}% · IFDM médio: ${formatarNumero(territorio.ifdm_medio, 3)} · Status predominante: ${territorio.status_predominante}</small>
        <small>Municípios: ${territorio._municipiosTexto || "Sem detalhamento nominal disponível."}</small>
      `;
      elementos.programaTerritorios.appendChild(card);
    });
}

function renderizarCenariosPrograma(municipios) {
  elementos.programaCenarios.innerHTML = "";
  municipios.slice(0, 10).forEach((item) => {
    const card = document.createElement("div");
    card.className = "programa-card";
    card.innerHTML = `
      <span>${item.nome_municipio} (${item.uf})</span>
      <strong>Score ${formatarNumero(item.score_prioridade, 3)} · ${item.status_viabilidade || "Sem dado"}</strong>
      <small>População: ${formatarInteiro(item.populacao)} · Dependência: ${formatarNumero(
        item.pct_dependencia_transf,
        1
      )}% · Autonomia: ${formatarNumero(item.autonomia_fiscal, 2)} · IFDM: ${formatarNumero(item.ifdm_geral, 3)}</small>
    `;
    elementos.programaCenarios.appendChild(card);
  });
}

function renderizarTabelaMapaUnificado(territorios) {
  elementos.programaTabelaTerritorios.innerHTML = "";
  const territoriosFiltradosBase = ordenarTerritoriosMapaUnificado(filtrarTerritoriosMapaUnificado(territorios || []));
  const territoriosFiltrados = estado.territorioProgramaSelecionadoId
    ? territoriosFiltradosBase.filter((territorio) => territorio.id === estado.territorioProgramaSelecionadoId)
    : territoriosFiltradosBase;
  const totalBrasil = (territorios || []).reduce((acumulado, territorio) => acumulado + (territorio.populacao_total || 0), 0);
  sincronizarPaginaTerritorioSelecionado(territoriosFiltrados);
  const totalPaginas = Math.max(1, Math.ceil(territoriosFiltrados.length / estado.itensPorPaginaTerritoriosPrograma));
  estado.paginaTerritoriosPrograma = Math.min(Math.max(1, estado.paginaTerritoriosPrograma), totalPaginas);
  const inicio = (estado.paginaTerritoriosPrograma - 1) * estado.itensPorPaginaTerritoriosPrograma;
  const territoriosDaPagina = territoriosFiltrados.slice(inicio, inicio + estado.itensPorPaginaTerritoriosPrograma);

  territoriosDaPagina.forEach((territorio) => {
    const linha = document.createElement("tr");
    linha.className = territorio.id === estado.territorioProgramaSelecionadoId ? "linha-selecionada" : "";
    linha.dataset.territorioId = territorio.id;

    linha.innerHTML = `
      <td>${territorio.nome}</td>
      <td>${territorio.uf}</td>
      <td>${territorio._municipiosTexto || "Sem detalhamento nominal disponível."}</td>
      <td>${formatarInteiro(territorio.populacao_total)}</td>
    `;
    linha.addEventListener("click", () => selecionarTerritorioPrograma(territorio.id));
    elementos.programaTabelaTerritorios.appendChild(linha);
  });

  if (!territoriosDaPagina.length) {
    const linha = document.createElement("tr");
    linha.innerHTML = '<td colspan="4">Nenhum território encontrado para a cidade pesquisada.</td>';
    elementos.programaTabelaTerritorios.appendChild(linha);
  }

  elementos.programaTabelaTotalBrasil.textContent = formatarInteiro(totalBrasil);
  elementos.programaPaginacaoResumo.textContent = `${formatarInteiro(estado.paginaTerritoriosPrograma)} de ${formatarInteiro(
    totalPaginas
  )} · ${formatarInteiro(territoriosFiltrados.length)} territórios`;
  elementos.programaPaginaAnterior.disabled = estado.paginaTerritoriosPrograma <= 1;
  elementos.programaPaginaProxima.disabled = estado.paginaTerritoriosPrograma >= totalPaginas;
  sincronizarCabecalhosTabelaPrograma();
}

function obterRecorteTerritoriosPrograma(territorios) {
  const territoriosFiltradosBase = ordenarTerritoriosMapaUnificado(filtrarTerritoriosMapaUnificado(territorios || []));
  const territoriosFiltrados = estado.territorioProgramaSelecionadoId
    ? territoriosFiltradosBase.filter((territorio) => territorio.id === estado.territorioProgramaSelecionadoId)
    : territoriosFiltradosBase;
  const totalPaginas = Math.max(1, Math.ceil(territoriosFiltrados.length / estado.itensPorPaginaTerritoriosPrograma));
  const paginaAtual = Math.min(Math.max(1, estado.paginaTerritoriosPrograma), totalPaginas);
  const inicio = (paginaAtual - 1) * estado.itensPorPaginaTerritoriosPrograma;
  return {
    territoriosFiltradosBase,
    territoriosFiltrados,
    totalPaginas,
    paginaAtual,
    territoriosDaPagina: territoriosFiltrados.slice(inicio, inicio + estado.itensPorPaginaTerritoriosPrograma),
  };
}

function renderizarAgrupamentosPrograma(territorios, cenario) {
  if (!elementos.programaAgrupamentos) return;
  elementos.programaAgrupamentos.innerHTML = "";
  const { territoriosFiltrados, territoriosDaPagina, totalPaginas, paginaAtual } = obterRecorteTerritoriosPrograma(territorios);
  elementos.programaAgrupamentosResumo.textContent = `Cenário ativo: ${cenario.rotulo}. Exibindo ${formatarInteiro(
    territoriosDaPagina.length
  )} agrupamentos nesta página, de ${formatarInteiro(territoriosFiltrados.length)} no filtro atual.`;

  if (!territoriosDaPagina.length) {
    elementos.programaAgrupamentos.innerHTML = '<div class="empty-state">Nenhum agrupamento encontrado para o filtro atual.</div>';
    return;
  }

  territoriosDaPagina.forEach((territorio) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `programa-card programa-agrupamento-card${
      territorio.id === estado.territorioProgramaSelecionadoId ? " programa-agrupamento-card-ativo" : ""
    }`;
    card.innerHTML = `
      <span>${territorio.nome}</span>
      <strong>${formatarInteiro(territorio.populacao_total)} hab. · ${territorio.quantidade_municipios} municípios</strong>
      <small>Perfil: ${cenario.perfil_rotulo} · Referência: ${formatarInteiro(cenario.populacao_referencia)} hab.</small>
      <small>Autonomia média: ${formatarNumero(territorio.autonomia_media, 2)} · Dependência média: ${formatarNumero(
        territorio.dependencia_media,
        1
      )}%</small>
      <small>Municípios englobados: ${territorio._municipiosTexto || "Sem detalhamento nominal disponível."}</small>
    `;
    card.addEventListener("click", () => selecionarTerritorioPrograma(territorio.id));
    elementos.programaAgrupamentos.appendChild(card);
  });
}

function renderizarDetalheTerritorioPrograma(cenario) {
  if (!elementos.programaDetalheTerritorioKpis) return;
  const territorio = (cenario?.territorios || []).find((item) => item.id === estado.territorioProgramaSelecionadoId) || null;
  atualizarAjudaDetalheTerritorioPrograma(cenario, territorio);
  elementos.programaDetalheTerritorioKpis.innerHTML = "";
  elementos.programaDetalheMunicipios.innerHTML = "";
  if (elementos.programaTabelaMunicipiosHead) elementos.programaTabelaMunicipiosHead.innerHTML = "";
  if (elementos.programaTabelaMunicipiosBody) elementos.programaTabelaMunicipiosBody.innerHTML = "";
  if (elementos.programaTabelaMunicipiosFoot) elementos.programaTabelaMunicipiosFoot.innerHTML = "";

  if (!territorio) {
    elementos.programaDetalheTerritorioSubtitulo.textContent = "Selecione um território no mapa ou na tabela para ver o consolidado.";
    elementos.programaDetalheMunicipios.innerHTML = '<div class="empty-state">Nenhum território selecionado.</div>';
    atualizarAjudaTabelaMunicipiosTerritorioPrograma();
    return;
  }

  elementos.programaDetalheTerritorioSubtitulo.textContent = `${territorio.nome} · ${territorio.uf} · Perfil ${cenario.perfil_rotulo} · Referência ${formatarInteiro(
    cenario.populacao_referencia
  )} hab.`;

  const consolidado = obterConsolidadoTerritorioComTributos(territorio);
  const explicacoes = obterExplicacoesIndicadoresTerritorio(consolidado);
  const itens = [
    ["População agregada", formatarInteiro(consolidado.populacao_total)],
    ["Municípios englobados", formatarInteiro(consolidado.quantidade_municipios)],
    ["Dependência territorial recalculada", formatarPercentual(consolidado.dependencia_media, 1)],
    ["Dependência média simples", formatarPercentual(consolidado.dependencia_media_simples, 1)],
    ["Autonomia territorial recalculada", formatarPercentual(consolidado.autonomia_media, 1)],
    ["Autonomia média simples", formatarPercentual(consolidado.autonomia_media_simples, 1)],
    ["Receita total bruta agregada", formatarMoeda(consolidado.receita_total_bruta_total)],
    ["Transferências totais", formatarMoeda(consolidado.transferencias_total)],
    ["Receita tributária agregada", formatarMoeda(consolidado.receita_tributaria_total)],
    ["Receita própria per capita", formatarMoeda(consolidado.receita_propria_per_capita_territorial)],
    ["IPTU agregado", formatarMoeda(consolidado.iptu_total)],
    ["ISS agregado", formatarMoeda(consolidado.iss_total)],
    ["ITBI agregado", formatarMoeda(consolidado.itbi_total)],
    ["Despesa total agregada", formatarMoeda(consolidado.despesa_total)],
    ["Despesa com pessoal", formatarMoeda(consolidado.despesa_pessoal)],
    ["Capacidade de investimento média", formatarPercentual(consolidado.capacidade_investimento_media, 1)],
    ["IFDM médio ponderado", formatarNumero(consolidado.ifdm_medio, 3)],
    ["Bolsa Família total", formatarInteiro(consolidado.bolsa_familia_total)],
  ];

  itens.forEach(([rotulo, valor]) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <dt><span class="rotulo-indicador">${rotulo}${criarBotaoAjudaCompleto(explicacoes[rotulo])}</span></dt>
      <dd>${valor}</dd>
    `;
    elementos.programaDetalheTerritorioKpis.appendChild(wrapper);
  });

  (territorio._municipiosTexto || "")
    .split(", ")
    .filter(Boolean)
    .forEach((municipio) => {
      const item = document.createElement("div");
      item.className = "programa-municipio-chip";
      item.textContent = municipio;
      elementos.programaDetalheMunicipios.appendChild(item);
    });

  renderizarTabelaMunicipiosTerritorioPrograma(territorio, consolidado);
  carregarTributosTerritorioPrograma(territorio);
}

function obterLinhasTerritorioPrograma(territorio) {
  if (!territorio?.municipios?.length) return [];
  const codigos = new Set(territorio.municipios.map(String));
  return obterLinhasDoAno().filter((linha) => codigos.has(String(linha.codigo_ibge)));
}

function obterConsolidadoTerritorioComTributos(territorio) {
  const linhasTerritorio = obterLinhasTerritorioPrograma(territorio);
  if (!linhasTerritorio.length) return territorio;
  const iptuTotal = linhasTerritorio.reduce((soma, linha) => soma + Number(obterTributosMunicipais(linha).iptu ?? linha.IPTU ?? 0), 0);
  const issTotal = linhasTerritorio.reduce((soma, linha) => soma + Number(obterTributosMunicipais(linha).iss ?? linha.ISS ?? 0), 0);
  const itbiTotal = linhasTerritorio.reduce((soma, linha) => soma + Number(obterTributosMunicipais(linha).itbi ?? linha.ITBI ?? 0), 0);
  const receitaTributariaTotal = linhasTerritorio.reduce(
    (soma, linha) => soma + Number(obterTributosMunicipais(linha).receita_tributaria_municipal ?? linha.receita_tributaria_mun ?? 0),
    0
  );
  return {
    ...territorio,
    iptu_total: Number(iptuTotal.toFixed(2)),
    iss_total: Number(issTotal.toFixed(2)),
    itbi_total: Number(itbiTotal.toFixed(2)),
    receita_tributaria_total: Number(receitaTributariaTotal.toFixed(2)),
    receita_propria_per_capita_territorial: territorio.populacao_total
      ? Number((receitaTributariaTotal / territorio.populacao_total).toFixed(2))
      : 0,
  };
}

function renderizarTabelaMunicipiosTerritorioPrograma(territorio, consolidado) {
  if (!elementos.programaTabelaMunicipiosHead || !elementos.programaTabelaMunicipiosBody || !elementos.programaTabelaMunicipiosFoot) return;
  atualizarAjudaTabelaMunicipiosTerritorioPrograma();
  const linhasTerritorio = obterLinhasTerritorioPrograma(territorio).sort((a, b) => {
    const aNome = `${a.nome_municipio || ""} (${a.uf || ""})`;
    const bNome = `${b.nome_municipio || ""} (${b.uf || ""})`;
    return aNome.localeCompare(bNome, "pt-BR");
  });

  const colunas = [
    {
      rotulo: "Município",
      render: (linha) => `${linha.nome_municipio} (${linha.uf})`,
      classe: "coluna-municipio",
      tipoCalculo: "Identificação",
      ajuda: "Linha municipal individual. A última linha resume o território consolidado.",
    },
    {
      rotulo: "População",
      render: (linha) => formatarInteiro(linha.populacao),
      tipoCalculo: "Soma",
      ajuda: "Na linha final, o território usa a soma da população dos municípios englobados.",
    },
    {
      rotulo: "Dependência",
      render: (linha) => formatarPercentual(linha.pct_dependencia_transf, 1),
      tipoCalculo: "Recalculo territorial",
      ajuda:
        "Na linha final, o território recalcula a dependência como transferências totais agregadas divididas pela receita total bruta agregada. Não é média simples.",
    },
    {
      rotulo: "Autonomia",
      render: (linha) => formatarNumero(linha.autonomia_fiscal, 1),
      tipoCalculo: "Recalculo territorial",
      ajuda:
        "Na linha final, o território recalcula a autonomia como receita sem transferências principais agregada dividida pela receita total bruta agregada.",
    },
    {
      rotulo: "Receita tributária",
      render: (linha) => formatarMoeda(obterTributosMunicipais(linha).receita_tributaria_municipal ?? linha.receita_tributaria_mun),
      tipoCalculo: "Soma",
      ajuda: "Na linha final, o território usa a soma da receita tributária dos municípios englobados.",
    },
    {
      rotulo: "Rec. própria pc",
      render: (linha) => formatarMoeda(
        valorSignificativo(obterTributosMunicipais(linha).receita_tributaria_municipal)
          ? Number(obterTributosMunicipais(linha).receita_tributaria_municipal) / Number(linha.populacao || 0)
          : linha.receita_propria_per_capita
      ),
      tipoCalculo: "Razão territorial",
      ajuda:
        "Na linha final, o território calcula receita tributária agregada dividida pela população agregada. Não é soma nem média simples.",
    },
    {
      rotulo: "IPTU",
      render: (linha) => formatarMoeda(obterTributosMunicipais(linha).iptu ?? linha.IPTU),
      tipoCalculo: "Soma",
      ajuda: "Na linha final, o território usa a soma do IPTU dos municípios. Quando disponível, o painel prioriza a API oficial do Siconfi/Tesouro.",
    },
    {
      rotulo: "ISS",
      render: (linha) => formatarMoeda(obterTributosMunicipais(linha).iss ?? linha.ISS),
      tipoCalculo: "Soma",
      ajuda: "Na linha final, o território usa a soma do ISS dos municípios. Quando disponível, o painel prioriza a API oficial do Siconfi/Tesouro.",
    },
    {
      rotulo: "ITBI",
      render: (linha) => formatarMoeda(obterTributosMunicipais(linha).itbi ?? linha.ITBI),
      tipoCalculo: "Soma",
      ajuda: "Na linha final, o território usa a soma do ITBI dos municípios. Quando disponível, o painel prioriza a API oficial do Siconfi/Tesouro.",
    },
    {
      rotulo: "IFDM",
      render: (linha) => formatarNumero(linha.ifdm_geral, 3),
      tipoCalculo: "Média ponderada",
      ajuda: "Na linha final, o território usa o IFDM médio ponderado pela população dos municípios englobados.",
    },
    {
      rotulo: "Bolsa Família",
      render: (linha) => formatarInteiro(linha.bolsa_familia_total),
      tipoCalculo: "Soma",
      ajuda: "Na linha final, o território usa a soma dos benefícios do Bolsa Família dos municípios englobados.",
    },
  ];

  elementos.programaTabelaMunicipiosHead.innerHTML = `
    <tr>
      ${colunas
        .map(
          (coluna) =>
            `<th class="${coluna.classe || ""}"><span class="rotulo-indicador">${coluna.rotulo}${criarBotaoAjuda(
              coluna.ajuda
            )}</span></th>`
        )
        .join("")}
    </tr>
    <tr class="programa-tabela-municipios-tipo">
      ${colunas.map((coluna) => `<th class="${coluna.classe || ""}">${coluna.tipoCalculo}</th>`).join("")}
    </tr>
  `;

  elementos.programaTabelaMunicipiosBody.innerHTML = linhasTerritorio
    .map(
      (linha) => `
        <tr>
          ${colunas
            .map((coluna) => `<td class="${coluna.classe || ""}">${coluna.render(linha)}</td>`)
            .join("")}
        </tr>
      `
    )
    .join("");

  elementos.programaTabelaMunicipiosFoot.innerHTML = `
    <tr>
      <th class="coluna-municipio">Território consolidado</th>
      <th>${formatarInteiro(consolidado.populacao_total)}</th>
      <th>${formatarPercentual(consolidado.dependencia_media, 1)}</th>
      <th>${formatarPercentual(consolidado.autonomia_media, 1)}</th>
      <th>${formatarMoeda(consolidado.receita_tributaria_total)}</th>
      <th>${formatarMoeda(consolidado.receita_propria_per_capita_territorial)}</th>
      <th>${formatarMoeda(consolidado.iptu_total)}</th>
      <th>${formatarMoeda(consolidado.iss_total)}</th>
      <th>${formatarMoeda(consolidado.itbi_total)}</th>
      <th>${formatarNumero(consolidado.ifdm_medio, 3)}</th>
      <th>${formatarInteiro(consolidado.bolsa_familia_total)}</th>
    </tr>
  `;
}

function atualizarAjudaTabelaMunicipiosTerritorioPrograma() {
  if (!elementos.programaAjudaTabelaMunicipios) return;
  const texto =
    "Cada linha mostra um município do território selecionado. A última linha mostra o consolidado territorial: somas para valores monetários e Bolsa Família, soma de população, IFDM ponderado pela população e indicadores territoriais recalculados para dependência e autonomia.";
  const html = `
    <strong>Como ler esta tabela</strong>
    <p>Cada linha corresponde a um município do território selecionado no mapa ou na tabela lateral.</p>
    <p>A última linha, <strong>Território</strong>, mostra o resultado consolidado do agrupamento.</p>
    <p><strong>Somas</strong>: população, receita tributária, IPTU, ISS, ITBI e Bolsa Família.</p>
    <p><strong>Recalculo territorial</strong>: dependência e autonomia usam os agregados do território, e não média simples.</p>
    <p><strong>Média ponderada</strong>: IFDM usa ponderação pela população dos municípios.</p>
  `;
  elementos.programaAjudaTabelaMunicipios.dataset.ajuda = texto;
  elementos.programaAjudaTabelaMunicipios.dataset.ajudaHtml = html;
  elementos.programaAjudaTabelaMunicipios.setAttribute("aria-label", texto);
}

function obterExplicacoesIndicadoresTerritorio(territorio) {
  const fonteBase = "Base principal consolidada: 07.03_indicadores_base_completa_20260217.xlsx.";
  const fonteTributos = "Tributos municipais priorizam a integração oficial com Siconfi/Tesouro; no consolidado territorial, o painel soma os valores disponíveis no dataset consolidado do cenário.";
  const fonteSocial = "Bolsa Família vem da base específica de benefícios por município; IFDM vem do ranking oficial da FIRJAN e é ponderado pela população.";
  const ajuda = (texto, html) => ({ texto, html });
  return {
    "População agregada": ajuda("Soma da população dos municípios englobados no território.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma da população dos municípios englobados no território selecionado.</p>
      <p>${fonteBase}</p>
    `),
    "Municípios englobados": ajuda("Quantidade de municípios incorporados ao território no cenário atual.", `
      <strong>Memorial de cálculo</strong>
      <p>Contagem de municípios incorporados ao território no cenário e perfil atualmente selecionados.</p>
      <p>Não é média: é a quantidade institucional do agrupamento.</p>
    `),
    "Dependência territorial recalculada": ajuda("Transferências totais agregadas divididas pela receita total bruta agregada.", `
      <strong>Memorial de cálculo</strong>
      <p><code>transferências totais agregadas / receita total bruta agregada</code>.</p>
      <p>Este é o indicador territorial tecnicamente mais representativo, porque recalcula a dependência a partir dos agregados do território, em vez de tratar todos os municípios com o mesmo peso.</p>
      <p>${fonteBase}</p>
    `),
    "Dependência média simples": ajuda("Média aritmética simples dos percentuais municipais de dependência.", `
      <strong>Memorial de cálculo</strong>
      <p>Média aritmética simples dos percentuais municipais de dependência.</p>
      <p>Serve como comparação metodológica, mas pode distorcer a leitura quando um município muito pequeno tem peso igual a um município grande.</p>
    `),
    "Autonomia territorial recalculada": ajuda("Receita territorial sem transferências principais dividida pela receita total bruta agregada.", `
      <strong>Memorial de cálculo</strong>
      <p><code>receita sem transferências principais agregada / receita total bruta agregada</code>.</p>
      <p>Assim como a dependência territorial, esta leitura é recalculada no nível do território consolidado.</p>
      <p>${fonteBase}</p>
    `),
    "Autonomia média simples": ajuda("Média aritmética simples da autonomia fiscal municipal.", `
      <strong>Memorial de cálculo</strong>
      <p>Média aritmética simples do indicador municipal de autonomia fiscal.</p>
      <p>É mantida no painel para comparação, mas não substitui a autonomia territorial recalculada.</p>
    `),
    "Receita total bruta agregada": ajuda("Soma da receita total bruta dos municípios do território.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma da receita total bruta dos municípios englobados.</p>
      <p>É a base usada para recalcular indicadores territoriais como dependência, autonomia e participação tributária.</p>
      <p>${fonteBase}</p>
    `),
    "Transferências totais": ajuda("Soma das transferências principais dos municípios englobados.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma das transferências correntes principais dos municípios do território.</p>
      <p>Entra diretamente no cálculo da dependência territorial recalculada.</p>
      <p>${fonteBase}</p>
    `),
    "Receita tributária agregada": ajuda("Soma da receita tributária municipal dos municípios englobados.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma da receita tributária municipal dos municípios englobados.</p>
      <p>Ajuda a medir a capacidade arrecadatória própria do território.</p>
      <p>${fonteBase}</p>
    `),
    "Receita própria per capita": ajuda("Receita tributária agregada dividida pela população agregada.", `
      <strong>Memorial de cálculo</strong>
      <p><code>receita tributária agregada / população agregada</code>.</p>
      <p>Mostra quanto de arrecadação própria o território gera por habitante.</p>
      <p>${fonteBase}</p>
    `),
    "IPTU agregado": ajuda("Soma do IPTU dos municípios englobados.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma do IPTU dos municípios englobados.</p>
      <p>${fonteTributos}</p>
    `),
    "ISS agregado": ajuda("Soma do ISS dos municípios englobados.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma do ISS dos municípios englobados.</p>
      <p>${fonteTributos}</p>
    `),
    "ITBI agregado": ajuda("Soma do ITBI dos municípios englobados.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma do ITBI dos municípios englobados.</p>
      <p>${fonteTributos}</p>
    `),
    "Despesa total agregada": ajuda("Soma da despesa total dos municípios englobados.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma da despesa total dos municípios do território.</p>
      <p>Permite comparar o porte orçamentário territorial com a receita agregada.</p>
      <p>${fonteBase}</p>
    `),
    "Despesa com pessoal": ajuda("Soma da despesa com pessoal dos municípios englobados.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma da despesa com pessoal dos municípios englobados.</p>
      <p>É um sinal importante de rigidez orçamentária e pressão fiscal.</p>
      <p>${fonteBase}</p>
    `),
    "Capacidade de investimento média": ajuda("Média ponderada pela população da capacidade de investimento municipal.", `
      <strong>Memorial de cálculo</strong>
      <p>Média ponderada pela população do indicador municipal de capacidade de investimento.</p>
      <p>Ajuda a comparar o potencial de investimento do território sem tratar todos os municípios como iguais.</p>
      <p>${fonteBase}</p>
    `),
    "IFDM médio ponderado": ajuda("Média do IFDM ponderada pela população dos municípios englobados.", `
      <strong>Memorial de cálculo</strong>
      <p>Média do IFDM ponderada pela população dos municípios englobados.</p>
      <p>Territórios com municípios maiores têm peso maior no resultado final.</p>
      <p>${fonteSocial}</p>
    `),
    "Bolsa Família total": ajuda("Soma dos benefícios do Bolsa Família dos municípios do território.", `
      <strong>Memorial de cálculo</strong>
      <p>Soma dos benefícios do Bolsa Família no recorte municipal que compõe o território.</p>
      <p>Funciona como proxy adicional de vulnerabilidade social no cenário selecionado.</p>
      <p>${fonteSocial}</p>
    `),
  };
}

function sincronizarControlesTabelaPrograma() {
  elementos.programaBuscaTerritorios.value = estado.buscaTerritoriosPrograma;
}

function sincronizarPaginaTerritorioSelecionado(territoriosFiltrados) {
  if (!estado.territorioProgramaSelecionadoId) return;
  const indice = territoriosFiltrados.findIndex((territorio) => territorio.id === estado.territorioProgramaSelecionadoId);
  if (indice === -1) return;
  estado.paginaTerritoriosPrograma = Math.floor(indice / estado.itensPorPaginaTerritoriosPrograma) + 1;
}

function filtrarTerritoriosMapaUnificado(territorios) {
  const termo = normalizarTextoLivre(estado.buscaTerritoriosPrograma);
  if (!termo) return territorios;
  return territorios.filter((territorio) => (territorio._termoBusca || "").includes(termo));
}

function ordenarTerritoriosMapaUnificado(territorios) {
  const { chave, direcao } = estado.ordenacaoTerritoriosPrograma;
  const fator = direcao === "desc" ? -1 : 1;
  return [...territorios].sort((a, b) => {
    if (chave === "populacao_total") {
      return ((a.populacao_total || 0) - (b.populacao_total || 0)) * fator;
    }
    return normalizarTextoLivre(a[chave]).localeCompare(normalizarTextoLivre(b[chave]), "pt-BR") * fator;
  });
}

function sincronizarCabecalhosTabelaPrograma() {
  const botoes = [
    { elemento: elementos.programaOrdenarTerritorio, chave: "nome", rotulo: "Território novo" },
    { elemento: elementos.programaOrdenarUf, chave: "uf", rotulo: "UF" },
    { elemento: elementos.programaOrdenarPopulacao, chave: "populacao_total", rotulo: "População agregada" },
  ];
  botoes.forEach(({ elemento, chave, rotulo }) => {
    const ativo = estado.ordenacaoTerritoriosPrograma.chave === chave;
    const seta = !ativo ? "↕" : estado.ordenacaoTerritoriosPrograma.direcao === "asc" ? "↑" : "↓";
    elemento.textContent = `${rotulo} ${seta}`;
    elemento.setAttribute("aria-pressed", String(ativo));
  });
}

function selecionarTerritorioPrograma(territorioId) {
  const territorios = obterCenarioProgramaAtivo()?.territorios || [];
  const territorioSelecionado = territorios.find((territorio) => territorio.id === territorioId) || null;
  estado.territorioProgramaSelecionadoId = territorioId;
  if (territorioSelecionado) {
    estado.buscaTerritoriosPrograma = territorioSelecionado.nome;
    sincronizarControlesTabelaPrograma();
  }
  renderizarMapaUnificadoPrograma(territorios);
  renderizarTabelaMapaUnificado(territorios);
  renderizarAgrupamentosPrograma(territorios, obterCenarioProgramaAtivo());
  renderizarDetalheTerritorioPrograma(obterCenarioProgramaAtivo());
  requestAnimationFrame(() => {
    focarTerritorioProgramaNoMapa(territorioId);
    const linha = elementos.programaTabelaTerritorios.querySelector(`tr[data-territorio-id="${territorioId}"]`);
    linha?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}

function resetarInteracaoPrograma({ manterBusca = false } = {}) {
  if (!manterBusca) {
    estado.buscaTerritoriosPrograma = "";
  }
  estado.paginaTerritoriosPrograma = 1;
  estado.ordenacaoTerritoriosPrograma = { chave: "nome", direcao: "asc" };
  estado.territorioProgramaSelecionadoId = null;
  estado.mapaTransforms.programa = { escala: 1, x: 0, y: 0 };
  limparDestaqueMunicipiosPrograma();
  limparDestaqueProgramaNoMapaSimulado();
  sincronizarControlesTabelaPrograma();
}

function atualizarInteracaoProgramaSemRecriarMapa() {
  const grupo = document.getElementById("grupo-mapa-programa-root");
  if (grupo) {
    const caminhos = grupo.querySelectorAll("path[data-territorio-id]");
    caminhos.forEach((caminho) => {
      const selecionado = caminho.dataset.territorioId === estado.territorioProgramaSelecionadoId;
      caminho.setAttribute("class", `municipality${selecionado ? " highlighted" : ""}`);
      caminho.setAttribute("stroke-width", selecionado ? "1.35" : "0.42");
    });
  }
  aplicarTransformacaoMapa("programa", "grupo-mapa-programa-root");
}

function aplicarBuscaTerritoriosPrograma(termo) {
  estado.buscaTerritoriosPrograma = termo || "";
  resetarInteracaoPrograma({ manterBusca: true });
  atualizarInteracaoProgramaSemRecriarMapa();
  const territorios = obterCenarioProgramaAtivo()?.territorios || [];
  const cenario = obterCenarioProgramaAtivo();
  renderizarTabelaMapaUnificado(territorios);
  renderizarAgrupamentosPrograma(territorios, cenario);
  renderizarDetalheTerritorioPrograma(cenario);
}

function renderizarArquiteturaLegal(eixos) {
  elementos.programaLegal.innerHTML = "";
  eixos.forEach((eixo) => {
    const card = document.createElement("div");
    card.className = "programa-card";
    card.innerHTML = `
      <span>${eixo.status.replaceAll("_", " ")}</span>
      <strong>${eixo.titulo}</strong>
      <small>Verificação oficial: ${eixo.verificacao_oficial.replaceAll("_", " ")}</small>
    `;
    elementos.programaLegal.appendChild(card);
  });
}

function renderizarCapitaisIfdm(capitais) {
  elementos.programaCapitaisIfdm.innerHTML = "";
  if (!capitais.length) {
    elementos.programaCapitaisIfdm.innerHTML = '<div class="empty-state">Sem capitais carregadas para o IFDM.</div>';
    return;
  }
  capitais.slice(0, 10).forEach((capital) => {
    const card = document.createElement("div");
    card.className = "programa-card";
    card.innerHTML = `
      <span>${capital.nome_municipio} (${capital.uf})</span>
      <strong>${formatarNumero(capital.ifdm_geral_2023, 3)} · ranking ${formatarInteiro(capital.ranking_2023)}</strong>
      <small>Emprego & renda: ${formatarNumero(capital.ifdm_emprego_renda_2023, 3)} · Educação: ${formatarNumero(
        capital.ifdm_educacao_2023,
        3
      )} · Saúde: ${formatarNumero(capital.ifdm_saude_2023, 3)}</small>
    `;
    elementos.programaCapitaisIfdm.appendChild(card);
  });
}

function obterNomeMunicipioPorCodigo(codigoIbge) {
  return estado.nomeMunicipioPorCodigo.get(codigoIbge) || codigoIbge;
}

function renderizarMapaUnificadoPrograma(territorios) {
  if (!elementos.mapaPrograma) return;
  elementos.mapaPrograma.innerHTML = "";
  elementos.mapaPrograma.setAttribute("viewBox", `0 0 ${estado.metadata.mapa.largura} ${estado.metadata.mapa.altura}`);
  const namespace = "http://www.w3.org/2000/svg";
  const grupoRaiz = document.createElementNS(namespace, "g");
  grupoRaiz.setAttribute("id", "grupo-mapa-programa-root");
  const grupo = document.createElementNS(namespace, "g");
  grupo.setAttribute("id", "grupo-mapa-programa");
  const grupoOverlay = document.createElementNS(namespace, "g");
  grupoOverlay.setAttribute("id", "grupo-mapa-programa-overlay");
  grupoRaiz.appendChild(grupo);
  grupoRaiz.appendChild(grupoOverlay);
  elementos.mapaPrograma.appendChild(grupoRaiz);
  const escala = criarEscalaNumerica(
    territorios.map((item) => item.dependencia_media).filter(valorSignificativo),
    ["#dce5f0", "#7a99b9", "#214565"]
  );

  territorios.forEach((territorio) => {
    const path = document.createElementNS(namespace, "path");
    const cor = valorSignificativo(territorio.dependencia_media) ? escala.pick(Number(territorio.dependencia_media)) : "#d6dad6";
    path.setAttribute("d", territorio.caminho_svg);
    path.dataset.territorioId = territorio.id;
    path.setAttribute("fill", cor);
    path.setAttribute("stroke", "rgba(255,255,255,0.45)");
    path.setAttribute("stroke-width", territorio.id === estado.territorioProgramaSelecionadoId ? "1.35" : "0.42");
    path.setAttribute("class", `municipality${territorio.id === estado.territorioProgramaSelecionadoId ? " highlighted" : ""}`);
    path.addEventListener("mouseenter", (evento) => {
      destacarMunicipiosDoTerritorio(territorio.municipios || []);
      renderizarDestaqueProgramaNoMapaSimulado(territorio.municipios || []);
      exibirTooltipPrograma(evento, territorio);
    });
    path.addEventListener("mousemove", posicionarTooltipPrograma);
    path.addEventListener("mouseleave", () => {
      if (!estado.territorioProgramaSelecionadoId) {
        limparDestaqueMunicipiosPrograma();
        limparDestaqueProgramaNoMapaSimulado();
      } else {
        reaplicarSelecaoTerritorioPrograma();
      }
      ocultarTooltipPrograma();
    });
    path.addEventListener("click", () => selecionarTerritorioPrograma(territorio.id));
    grupo.appendChild(path);
  });
  reaplicarSelecaoTerritorioPrograma();
  habilitarNavegacaoMapa(elementos.mapaPrograma, "programa", "grupo-mapa-programa-root");
  aplicarTransformacaoMapa("programa", "grupo-mapa-programa-root");
}

function exibirTooltipPrograma(evento, territorio) {
  elementos.tooltipPrograma.classList.remove("hidden");
  elementos.tooltipPrograma.innerHTML = `
    <div class="tooltip-programa-card">
      <div class="tooltip-programa-topo">
        <strong>${territorio.nome}</strong>
        <span>${territorio.uf}</span>
      </div>
      <div class="tooltip-programa-metricas">
        <div><span>População</span><strong>${formatarInteiro(territorio.populacao_total)} hab.</strong></div>
        <div><span>Municípios</span><strong>${territorio.quantidade_municipios}</strong></div>
        <div><span>Dependência média</span><strong>${formatarNumero(territorio.dependencia_media, 1)}%</strong></div>
        <div><span>Status predominante</span><strong>${territorio.status_predominante}</strong></div>
        <div><span>Receita total agregada</span><strong>${formatarMoeda(territorio.receita_total_bruta_total)}</strong></div>
      </div>
      <div class="tooltip-programa-lista">
        <span>Municípios englobados</span>
        <small>${territorio._municipiosTexto || "Sem detalhamento nominal disponível."}</small>
      </div>
    </div>
  `;
  posicionarTooltipPrograma(evento);
}

function focarTerritorioProgramaNoMapa(territorioId) {
  if (!territorioId || !elementos.mapaPrograma) return;
  const caminho = elementos.mapaPrograma.querySelector(`path[data-territorio-id="${territorioId}"]`);
  if (!caminho) return;
  const grupo = document.getElementById("grupo-mapa-programa-root");
  if (!grupo) return;
  grupo.setAttribute("transform", "translate(0 0) scale(1)");
  const caixa = caminho.getBBox();
  if (!caixa || !caixa.width || !caixa.height) return;
  const larguraMapa = Number(estado.metadata?.mapa?.largura) || elementos.mapaPrograma.viewBox.baseVal.width;
  const alturaMapa = Number(estado.metadata?.mapa?.altura) || elementos.mapaPrograma.viewBox.baseVal.height;
  const padding = 42;
  const escala = Math.max(
    1,
    Math.min(
      8,
      (larguraMapa - padding * 2) / caixa.width,
      (alturaMapa - padding * 2) / caixa.height
    )
  );
  const centroX = caixa.x + caixa.width / 2;
  const centroY = caixa.y + caixa.height / 2;
  estado.mapaTransforms.programa.escala = escala;
  estado.mapaTransforms.programa.x = larguraMapa / 2 - centroX * escala;
  estado.mapaTransforms.programa.y = alturaMapa / 2 - centroY * escala;
  aplicarTransformacaoMapa("programa", "grupo-mapa-programa-root");
  requestAnimationFrame(() => ajustarCentroTerritorioPrograma(caminho));
}

function ajustarCentroTerritorioPrograma(caminho) {
  if (!caminho || !elementos.mapaPrograma) return;
  const svgRect = elementos.mapaPrograma.getBoundingClientRect();
  const pathRect = caminho.getBoundingClientRect();
  if (!svgRect.width || !svgRect.height || !pathRect.width || !pathRect.height) return;
  const deltaX = svgRect.left + svgRect.width / 2 - (pathRect.left + pathRect.width / 2);
  const deltaY = svgRect.top + svgRect.height / 2 - (pathRect.top + pathRect.height / 2);
  estado.mapaTransforms.programa.x += deltaX;
  estado.mapaTransforms.programa.y += deltaY;
  aplicarTransformacaoMapa("programa", "grupo-mapa-programa-root");
}

function posicionarTooltipPrograma(evento) {
  const bounds = evento.currentTarget.ownerSVGElement.getBoundingClientRect();
  elementos.tooltipPrograma.style.left = `${evento.clientX - bounds.left + 14}px`;
  elementos.tooltipPrograma.style.top = `${evento.clientY - bounds.top + 14}px`;
}

function posicionarTooltipClima(evento) {
  const bounds = evento.currentTarget.ownerSVGElement.getBoundingClientRect();
  elementos.tooltipClima.style.left = `${evento.clientX - bounds.left + 14}px`;
  elementos.tooltipClima.style.top = `${evento.clientY - bounds.top + 14}px`;
}

function ocultarTooltipPrograma() {
  elementos.tooltipPrograma.classList.add("hidden");
}

function ocultarTooltipClima() {
  elementos.tooltipClima.classList.add("hidden");
}

function destacarMunicipiosDoTerritorio(codigos) {
  estado.municipiosDestacadosPrograma = [...codigos];
  atualizarDestaqueMunicipiosPrograma();
}

function limparDestaqueMunicipiosPrograma() {
  estado.municipiosDestacadosPrograma = [];
  atualizarDestaqueMunicipiosPrograma();
}

function reaplicarSelecaoTerritorioPrograma() {
  const territorios = obterCenarioProgramaAtivo()?.territorios || [];
  const territorio = territorios.find((item) => item.id === estado.territorioProgramaSelecionadoId);
  if (!territorio) {
    limparDestaqueMunicipiosPrograma();
    limparDestaqueProgramaNoMapaSimulado();
    return;
  }
  estado.municipiosDestacadosPrograma = [...(territorio.municipios || [])];
  atualizarDestaqueMunicipiosPrograma();
  renderizarDestaqueProgramaNoMapaSimulado(territorio.municipios || []);
}

function atualizarDestaqueMunicipiosPrograma() {
  const caminhos = elementos.mapa.querySelectorAll("path[data-code]");
  caminhos.forEach((caminho) => {
    caminho.classList.toggle("aggregate-highlight", estado.municipiosDestacadosPrograma.includes(caminho.dataset.code));
  });
}

function renderizarDestaqueProgramaNoMapaSimulado(codigos) {
  const grupoOverlay = document.getElementById("grupo-mapa-programa-overlay");
  if (!grupoOverlay) return;
  grupoOverlay.innerHTML = "";
  const caminhosAno = estado.caminhosPorAno[String(estado.programaReforma?.mapa_unificado?.ano_referencia || estado.anoAtual)] || [];
  const caminhosPorCodigo = new Map(caminhosAno.map((item) => [item.codigo_ibge, item]));
  const namespace = "http://www.w3.org/2000/svg";

  codigos.forEach((codigo) => {
    const feature = caminhosPorCodigo.get(codigo);
    if (!feature) return;
    const path = document.createElementNS(namespace, "path");
    path.setAttribute("d", feature.caminho_svg);
    path.setAttribute("class", "programa-overlay-municipio");
    grupoOverlay.appendChild(path);
  });
}

function limparDestaqueProgramaNoMapaSimulado() {
  const grupoOverlay = document.getElementById("grupo-mapa-programa-overlay");
  if (grupoOverlay) grupoOverlay.innerHTML = "";
}

function preencherControles() {
  preencherSelect(
    elementos.seletorMetrica,
    Object.entries(definicoesMetricas).map(([valor, definicao]) => ({ valor, rotulo: definicao.rotulo })),
    estado.metricaAtual
  );
  preencherSelect(
    elementos.seletorAno,
    estado.metadata.filtros.anos.map((ano) => ({ valor: String(ano), rotulo: String(ano) })),
    estado.anoAtual
  );
  preencherSelect(
    elementos.seletorUf,
    [{ valor: "TODAS", rotulo: "Todas" }, ...estado.metadata.filtros.ufs.map((valor) => ({ valor, rotulo: valor }))],
    estado.ufAtual
  );
  preencherSelect(
    elementos.seletorRegiao,
    [{ valor: "TODAS", rotulo: "Todas" }, ...estado.metadata.filtros.regioes.map((valor) => ({ valor, rotulo: valor }))],
    estado.regiaoAtual
  );
  const faixas = Array.from(new Set(estado.linhas.map((linha) => linha.faixa_populacional).filter(Boolean))).sort();
  preencherSelect(
    elementos.seletorFaixaPopulacional,
    [{ valor: "TODAS", rotulo: "Todas" }, ...faixas.map((valor) => ({ valor, rotulo: valor }))],
    estado.faixaPopulacionalAtual
  );
  preencherSelect(
    elementos.seletorStatus,
    [{ valor: "TODOS", rotulo: "Todos" }, ...estado.metadata.filtros.status.map((valor) => ({ valor, rotulo: valor }))],
    estado.statusAtual
  );
}

function preencherControlesClima() {
  preencherSelect(
    elementos.seletorClimaVariavel,
    [
      { valor: "precipitacao", rotulo: "Precipitação acumulada" },
      { valor: "temperatura_maxima", rotulo: "Temperatura máxima" },
      { valor: "umidade_relativa", rotulo: "Umidade relativa" },
    ],
    estado.climaVariavelAtual
  );
  const ufs = Object.keys(estado.climatologia.variaveis[estado.climaVariavelAtual].ufs).sort();
  preencherSelect(
    elementos.seletorClimaUf,
    [{ valor: "BRASIL", rotulo: "Brasil" }, ...ufs.map((uf) => ({ valor: uf, rotulo: uf }))],
    estado.climaUfAtual
  );
}

function preencherSelect(elemento, opcoes, selecionado) {
  elemento.innerHTML = "";
  opcoes.forEach((opcao) => {
    const node = document.createElement("option");
    node.value = opcao.valor;
    node.textContent = opcao.rotulo;
    node.selected = opcao.valor === selecionado;
    elemento.appendChild(node);
  });
}

function registrarEventos() {
  elementos.seletorMetrica.addEventListener("change", (evento) => {
    estado.metricaAtual = evento.target.value;
    renderizar();
  });
  elementos.seletorAno.addEventListener("change", (evento) => {
    estado.anoAtual = evento.target.value;
    if (estado.codigoSelecionado && !obterLinhasFiltradas().some((linha) => linha.codigo_ibge === estado.codigoSelecionado)) {
      estado.codigoSelecionado = null;
    }
    renderizar();
  });
  elementos.seletorUf.addEventListener("change", (evento) => {
    estado.ufAtual = evento.target.value;
    renderizar();
  });
  elementos.seletorRegiao.addEventListener("change", (evento) => {
    estado.regiaoAtual = evento.target.value;
    renderizar();
  });
  elementos.seletorFaixaPopulacional.addEventListener("change", (evento) => {
    estado.faixaPopulacionalAtual = evento.target.value;
    renderizar();
  });
  elementos.seletorStatus.addEventListener("change", (evento) => {
    estado.statusAtual = evento.target.value;
    renderizar();
  });
  elementos.seletorClimaVariavel.addEventListener("change", (evento) => {
    estado.climaVariavelAtual = evento.target.value;
    estado.climaUfAtual = "BRASIL";
    preencherControlesClima();
    renderizarClima();
  });
  elementos.seletorClimaUf.addEventListener("change", (evento) => {
    estado.climaUfAtual = evento.target.value;
    renderizarClima();
  });
  elementos.programaBuscaTerritorios.addEventListener("input", (evento) => {
    const termo = evento.target.value || "";
    if (estado.timerBuscaTerritoriosPrograma) {
      window.clearTimeout(estado.timerBuscaTerritoriosPrograma);
    }
    estado.timerBuscaTerritoriosPrograma = window.setTimeout(() => {
      aplicarBuscaTerritoriosPrograma(termo);
    }, 120);
  });
  const atualizarCenarioPrograma = () => {
    const populacao = Number(elementos.programaSeletorPopulacao.value || 0);
    const perfil = elementos.programaSeletorPerfil.value;
    const cenarios = estado.programaReforma?.mapa_unificado?.cenarios || [];
    const proximo = cenarios.find(
      (cenario) => cenario.populacao_referencia === populacao && cenario.perfil_agregacao === perfil
    );
    if (!proximo) return;
    estado.programaCenarioSelecionadoId = proximo.id;
    resetarInteracaoPrograma();
    renderizarProgramaReforma();
  };
  elementos.programaSeletorPopulacao.addEventListener("change", atualizarCenarioPrograma);
  elementos.programaSeletorPerfil.addEventListener("change", atualizarCenarioPrograma);
  [elementos.programaOrdenarTerritorio, elementos.programaOrdenarUf, elementos.programaOrdenarPopulacao].forEach((botao) => {
    botao.addEventListener("click", () => {
      const chave = botao.dataset.sortKey;
      if (estado.ordenacaoTerritoriosPrograma.chave === chave) {
        estado.ordenacaoTerritoriosPrograma.direcao =
          estado.ordenacaoTerritoriosPrograma.direcao === "asc" ? "desc" : "asc";
      } else {
        estado.ordenacaoTerritoriosPrograma = { chave, direcao: chave === "populacao_total" ? "desc" : "asc" };
      }
      estado.paginaTerritoriosPrograma = 1;
      const territorios = obterCenarioProgramaAtivo()?.territorios || [];
      const cenario = obterCenarioProgramaAtivo();
      renderizarTabelaMapaUnificado(territorios);
      renderizarAgrupamentosPrograma(territorios, cenario);
      renderizarDetalheTerritorioPrograma(cenario);
    });
  });
  elementos.programaPaginaAnterior.addEventListener("click", () => {
    estado.paginaTerritoriosPrograma = Math.max(1, estado.paginaTerritoriosPrograma - 1);
    const territorios = obterCenarioProgramaAtivo()?.territorios || [];
    const cenario = obterCenarioProgramaAtivo();
    renderizarTabelaMapaUnificado(territorios);
    renderizarAgrupamentosPrograma(territorios, cenario);
    renderizarDetalheTerritorioPrograma(cenario);
  });
  elementos.programaPaginaProxima.addEventListener("click", () => {
    estado.paginaTerritoriosPrograma += 1;
    const territorios = obterCenarioProgramaAtivo()?.territorios || [];
    const cenario = obterCenarioProgramaAtivo();
    renderizarTabelaMapaUnificado(territorios);
    renderizarAgrupamentosPrograma(territorios, cenario);
    renderizarDetalheTerritorioPrograma(cenario);
  });
  elementos.buscaMunicipioInput.addEventListener("input", (evento) => {
    const termo = evento.target.value || "";
    estado.buscaMunicipio = termo;
    if (!termo.trim()) {
      if (estado.timerBuscaMunicipio) {
        window.clearTimeout(estado.timerBuscaMunicipio);
      }
      ocultarSugestoesMunicipio();
      resetarMapaPrincipal();
      return;
    }
    if (estado.timerBuscaMunicipio) {
      window.clearTimeout(estado.timerBuscaMunicipio);
    }
    estado.timerBuscaMunicipio = window.setTimeout(() => {
      renderizarSugestoesMunicipio(termo);
      const correspondenciaExata = obterLinhasFiltradas().find(
        (linha) => normalizarTextoLivre(obterRotuloMunicipio(linha)) === normalizarTextoLivre(termo)
      );
      if (correspondenciaExata) {
        selecionarMunicipioPrincipal(correspondenciaExata.codigo_ibge);
      }
    }, 90);
  });
  elementos.buscaMunicipioInput.addEventListener("focus", (evento) => {
    renderizarSugestoesMunicipio(evento.target.value || "");
  });
  document.addEventListener("click", (evento) => {
    if (evento.target.closest(".busca-municipio-box")) return;
    ocultarSugestoesMunicipio();
  });
  document.addEventListener("mouseover", (evento) => {
    const alvo = evento.target.closest(".ajuda-indicador");
    if (!alvo) return;
    mostrarTooltipAjuda(alvo, evento);
  });
  document.addEventListener("mousemove", (evento) => {
    const alvo = evento.target.closest(".ajuda-indicador");
    if (!alvo) return;
    posicionarTooltipAjuda(evento);
  });
  document.addEventListener("mouseout", (evento) => {
    if (evento.target.closest(".ajuda-indicador")) ocultarTooltipAjuda();
  });
  document.addEventListener("click", (evento) => {
    const alvo = evento.target.closest(".ajuda-indicador");
    if (!alvo) {
      ocultarTooltipAjuda();
    } else {
      evento.preventDefault();
      mostrarTooltipAjuda(alvo, evento);
    }
  });
  document.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".controle-mapa");
    if (!botao) return;
    aplicarAcaoControleMapa(botao.dataset.mapTarget, botao.dataset.mapAction);
  });
}

function obterLinhasDoAno() {
  return estado.linhas.filter((linha) => String(linha.ano) === estado.anoAtual);
}

function obterLinhasFiltradas() {
  return obterLinhasDoAno().filter((linha) => {
    if (estado.ufAtual !== "TODAS" && linha.uf !== estado.ufAtual) return false;
    if (estado.regiaoAtual !== "TODAS" && linha.regiao !== estado.regiaoAtual) return false;
    if (estado.faixaPopulacionalAtual !== "TODAS" && linha.faixa_populacional !== estado.faixaPopulacionalAtual) return false;
    if (estado.statusAtual !== "TODOS" && linha.status_viabilidade !== estado.statusAtual) return false;
    return true;
  });
}

function renderizar() {
  const linhasFiltradas = obterLinhasFiltradas();
  const mapaLinhas = new Map(linhasFiltradas.map((linha) => [linha.codigo_ibge, linha]));
  const caminhosAno = estado.caminhosPorAno[estado.anoAtual] || [];
  atualizarResumoCoberturaAno();
  atualizarPainelMetrica();
  renderizarMapa(caminhosAno, mapaLinhas);
  renderizarLegenda(linhasFiltradas);
  renderizarDetalhe(mapaLinhas.get(estado.codigoSelecionado) || linhasFiltradas[0] || null, linhasFiltradas);
  renderizarRanking(linhasFiltradas);
  renderizarStatus(linhasFiltradas);
  renderizarRegioes(linhasFiltradas);
  renderizarFaixas(linhasFiltradas);
  renderizarInsights(linhasFiltradas);
  renderizarClima();
}

function atualizarPainelMetrica() {
  const metrica = definicoesMetricas[estado.metricaAtual];
  elementos.tituloMetrica.textContent = metrica.rotulo;
  elementos.descricaoMetrica.innerHTML = criarLinhaAjuda("O que esta métrica mede", metrica.descricao);
  elementos.fonteMetrica.innerHTML = `
    <strong>Origem:</strong> ${metrica.fonte.origem}<br />
    <strong>Arquivo:</strong> ${metrica.fonte.arquivo}<br />
    <strong>Aba/estrutura:</strong> ${metrica.fonte.aba}
  `;
  elementos.criteriosMetrica.innerHTML = criarLinhaAjuda("Ver critérios usados", metrica.criterios);
  elementos.interpretacaoMetrica.innerHTML = criarLinhaAjuda("Ver como interpretar", metrica.interpretacao);
}

function renderizarMapa(caminhos, mapaLinhas) {
  elementos.mapa.innerHTML = "";
  elementos.mapa.setAttribute("viewBox", `0 0 ${estado.metadata.mapa.largura} ${estado.metadata.mapa.altura}`);
  const namespace = "http://www.w3.org/2000/svg";
  const grupo = document.createElementNS(namespace, "g");
  grupo.setAttribute("id", "grupo-mapa-principal");
  elementos.mapa.appendChild(grupo);

  const metrica = definicoesMetricas[estado.metricaAtual];
  const valores = Array.from(mapaLinhas.values()).map((linha) => linha[estado.metricaAtual]).filter(valorSignificativo);
  const escalaNumerica = metrica.tipo === "numerica" ? criarEscalaNumerica(valores, metrica.paleta) : null;

  caminhos.forEach((feature) => {
    const path = document.createElementNS(namespace, "path");
    const linha = mapaLinhas.get(feature.codigo_ibge);
    const visivel = Boolean(linha);
    const cor = linha ? obterCor(linha, metrica, escalaNumerica) : "#d9ddd9";
    const destacadoPrograma = estado.municipiosDestacadosPrograma.includes(feature.codigo_ibge);
    path.setAttribute("d", feature.caminho_svg);
    path.setAttribute("fill", cor);
    path.setAttribute(
      "class",
      `municipality${visivel ? "" : " dimmed"}${estado.codigoSelecionado === feature.codigo_ibge ? " highlighted" : ""}${
        destacadoPrograma ? " aggregate-highlight" : ""
      }`
    );
    if (visivel) {
      path.dataset.code = feature.codigo_ibge;
      path.addEventListener("mouseenter", (evento) => exibirTooltip(evento, linha));
      path.addEventListener("mousemove", (evento) => posicionarTooltip(evento));
      path.addEventListener("mouseleave", ocultarTooltip);
      path.addEventListener("click", () => {
        selecionarMunicipioPrincipal(feature.codigo_ibge);
      });
    }
    grupo.appendChild(path);
  });
  habilitarNavegacaoMapa(elementos.mapa, "principal", "grupo-mapa-principal");
  aplicarTransformacaoMapa("principal", "grupo-mapa-principal");
}

function focarMunicipioNoMapa(codigoIbge) {
  if (!codigoIbge || !elementos.mapa) return;
  const caminho = elementos.mapa.querySelector(`path[data-code="${codigoIbge}"]`);
  if (!caminho) return;
  const grupo = document.getElementById("grupo-mapa-principal");
  if (!grupo) return;
  grupo.setAttribute("transform", "translate(0 0) scale(1)");
  const caixa = caminho.getBBox();
  if (!caixa || !caixa.width || !caixa.height) return;
  const larguraMapa = Number(estado.metadata?.mapa?.largura) || elementos.mapa.viewBox.baseVal.width;
  const alturaMapa = Number(estado.metadata?.mapa?.altura) || elementos.mapa.viewBox.baseVal.height;
  const padding = 64;
  const escala = Math.max(1, Math.min(10, (larguraMapa - padding * 2) / caixa.width, (alturaMapa - padding * 2) / caixa.height));
  const centroX = caixa.x + caixa.width / 2;
  const centroY = caixa.y + caixa.height / 2;
  estado.mapaTransforms.principal.escala = escala;
  estado.mapaTransforms.principal.x = larguraMapa / 2 - centroX * escala;
  estado.mapaTransforms.principal.y = alturaMapa / 2 - centroY * escala;
  aplicarTransformacaoMapa("principal", "grupo-mapa-principal");
  requestAnimationFrame(() => ajustarCentroMunicipioNoMapa(caminho));
}

function ajustarCentroMunicipioNoMapa(caminho) {
  if (!caminho || !elementos.mapa) return;
  const svgRect = elementos.mapa.getBoundingClientRect();
  const pathRect = caminho.getBoundingClientRect();
  if (!svgRect.width || !svgRect.height || !pathRect.width || !pathRect.height) return;
  const deltaX = svgRect.left + svgRect.width / 2 - (pathRect.left + pathRect.width / 2);
  const deltaY = svgRect.top + svgRect.height / 2 - (pathRect.top + pathRect.height / 2);
  estado.mapaTransforms.principal.x += deltaX;
  estado.mapaTransforms.principal.y += deltaY;
  aplicarTransformacaoMapa("principal", "grupo-mapa-principal");
}

function selecionarMunicipioPrincipal(codigoIbge, { focarMapa = true } = {}) {
  const linha = obterLinhasFiltradas().find((item) => item.codigo_ibge === codigoIbge);
  if (!linha) return;
  estado.codigoSelecionado = codigoIbge;
  estado.buscaMunicipio = obterRotuloMunicipio(linha);
  sincronizarBuscaMunicipio();
  ocultarSugestoesMunicipio();
  renderizar();
  if (focarMapa) {
    requestAnimationFrame(() => focarMunicipioNoMapa(codigoIbge));
  }
}

function resetarMapaPrincipal() {
  estado.codigoSelecionado = null;
  estado.mapaTransforms.principal = { escala: 1, x: 0, y: 0 };
  renderizar();
}

function habilitarNavegacaoMapa(svg, chaveMapa, idGrupo) {
  let dragging = false;
  let start = { x: 0, y: 0 };
  svg.onwheel = (evento) => {
    evento.preventDefault();
    const delta = evento.deltaY > 0 ? 0.9 : 1.1;
    const transform = estado.mapaTransforms[chaveMapa];
    transform.escala = Math.max(1, Math.min(8, transform.escala * delta));
    aplicarTransformacaoMapa(chaveMapa, idGrupo);
  };
  svg.onmousedown = (evento) => {
    dragging = true;
    const transform = estado.mapaTransforms[chaveMapa];
    start = { x: evento.clientX - transform.x, y: evento.clientY - transform.y };
  };
  svg.onmousemove = (evento) => {
    if (!dragging) return;
    const transform = estado.mapaTransforms[chaveMapa];
    if (transform.escala === 1) return;
    transform.x = evento.clientX - start.x;
    transform.y = evento.clientY - start.y;
    aplicarTransformacaoMapa(chaveMapa, idGrupo);
  };
  svg.onmouseleave = () => {
    dragging = false;
  };
  window.addEventListener("mouseup", () => {
    dragging = false;
  });
}

function aplicarTransformacaoMapa(chaveMapa, idGrupo) {
  const grupo = document.getElementById(idGrupo);
  if (!grupo) return;
  const transform = estado.mapaTransforms[chaveMapa];
  grupo.setAttribute(
    "transform",
    `translate(${transform.x} ${transform.y}) scale(${transform.escala})`
  );
}

function sincronizarBuscaMunicipio() {
  if (elementos.buscaMunicipioInput) {
    elementos.buscaMunicipioInput.value = estado.buscaMunicipio || "";
  }
}

function obterSugestoesMunicipio(termo) {
  const normalizado = normalizarTextoLivre(termo);
  if (!normalizado) return [];
  return obterLinhasFiltradas()
    .filter((linha) => normalizarTextoLivre(`${linha.nome_municipio} ${linha.uf}`).includes(normalizado))
    .sort((a, b) => a.nome_municipio.localeCompare(b.nome_municipio, "pt-BR"))
    .slice(0, 8);
}

function ocultarSugestoesMunicipio() {
  elementos.buscaMunicipioSugestoes.innerHTML = "";
  elementos.buscaMunicipioSugestoes.classList.add("hidden");
}

function renderizarSugestoesMunicipio(termo) {
  const sugestoes = obterSugestoesMunicipio(termo);
  if (!sugestoes.length) {
    ocultarSugestoesMunicipio();
    return;
  }
  elementos.buscaMunicipioSugestoes.innerHTML = "";
  sugestoes.forEach((linha) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "sugestao-municipio-item";
    botao.textContent = obterRotuloMunicipio(linha);
    botao.addEventListener("click", () => selecionarMunicipioPrincipal(linha.codigo_ibge));
    elementos.buscaMunicipioSugestoes.appendChild(botao);
  });
  elementos.buscaMunicipioSugestoes.classList.remove("hidden");
}

function aplicarAcaoControleMapa(chaveMapa, acao) {
  const ids = {
    principal: "grupo-mapa-principal",
    clima: "grupo-mapa-clima",
    programa: "grupo-mapa-programa-root",
  };
  const transform = estado.mapaTransforms[chaveMapa];
  if (!transform) return;
  const passo = 40;
  if (acao === "zoom_in") transform.escala = Math.min(8, transform.escala * 1.2);
  if (acao === "zoom_out") transform.escala = Math.max(1, transform.escala / 1.2);
  if (acao === "up") transform.y += passo;
  if (acao === "down") transform.y -= passo;
  if (acao === "left") transform.x += passo;
  if (acao === "right") transform.x -= passo;
  if (acao === "reset") {
    if (chaveMapa === "programa") {
      resetarInteracaoPrograma();
      const territorios = obterCenarioProgramaAtivo()?.territorios || [];
      const cenario = obterCenarioProgramaAtivo();
      renderizarMapaUnificadoPrograma(territorios);
      renderizarTabelaMapaUnificado(territorios);
      renderizarAgrupamentosPrograma(territorios, cenario);
      renderizarDetalheTerritorioPrograma(cenario);
      return;
    }
    transform.escala = 1;
    transform.x = 0;
    transform.y = 0;
  }
  aplicarTransformacaoMapa(chaveMapa, ids[chaveMapa]);
}

function renderizarLegenda(linhasFiltradas) {
  const metrica = definicoesMetricas[estado.metricaAtual];
  elementos.tituloLegenda.textContent = metrica.rotulo;
  elementos.escalaLegenda.innerHTML = "";
  if (metrica.tipo === "categorica") {
    Object.entries(metrica.cores).forEach(([rotulo, cor]) => {
      elementos.escalaLegenda.appendChild(criarLinhaLegenda(cor, rotulo));
    });
    return;
  }
  const valores = linhasFiltradas.map((linha) => linha[estado.metricaAtual]).filter(valorSignificativo).sort((a, b) => a - b);
  if (!valores.length) {
    elementos.escalaLegenda.innerHTML = '<div class="empty-state">Sem valores no filtro atual.</div>';
    return;
  }
  const escala = criarEscalaNumerica(valores, metrica.paleta);
  escala.stops.forEach((ponto, indice) => {
    const rotulo =
      indice === 0
        ? `Baixo · ${formatarMetrica(ponto.value, estado.metricaAtual)}`
        : indice === escala.stops.length - 1
          ? `Alto · ${formatarMetrica(ponto.value, estado.metricaAtual)}`
          : formatarMetrica(ponto.value, estado.metricaAtual);
    elementos.escalaLegenda.appendChild(criarLinhaLegenda(ponto.color, rotulo));
  });
}

function criarLinhaLegenda(cor, rotulo) {
  const linha = document.createElement("div");
  linha.className = "legend-row";
  linha.innerHTML = `<span class="legend-swatch" style="background:${cor}"></span><span>${rotulo}</span>`;
  return linha;
}

function renderizarDetalhe(linha, linhasFiltradas) {
  if (!linha) {
    elementos.tituloDetalhe.textContent = "Nenhum município no filtro atual";
    elementos.subtituloDetalhe.textContent = "Amplie os filtros ou escolha outro ano para continuar a análise.";
    elementos.gradeDetalhe.innerHTML = "";
    elementos.comparacaoDetalhe.innerHTML = "";
    elementos.explicacaoDetalhe.textContent = "";
    elementos.ajudaDetalheMontagem.dataset.ajuda = "";
    elementos.ajudaDetalheMontagem.setAttribute("aria-label", "Explicação metodológica do detalhe");
    elementos.interpretacaoDetalhe.textContent = "";
    return;
  }
  estado.codigoSelecionado = linha.codigo_ibge;
  const metrica = definicoesMetricas[estado.metricaAtual];
  const tributos = obterTributosMunicipais(linha);
  elementos.tituloDetalhe.textContent = `${linha.nome_municipio} (${linha.uf})`;
  elementos.subtituloDetalhe.textContent = `${linha.regiao || "Região indisponível"} · Ano ${linha.ano}`;
  const textoMontagem = criarTextoMontagemDetalhe(linha, metrica, tributos);
  elementos.explicacaoDetalhe.textContent = "";
  elementos.ajudaDetalheMontagem.dataset.ajuda = textoMontagem;
  elementos.ajudaDetalheMontagem.setAttribute("aria-label", textoMontagem);
  elementos.gradeDetalhe.innerHTML = "";

  const itens = [
    ["Métrica selecionada", formatarMetrica(linha[estado.metricaAtual], estado.metricaAtual)],
    ["Status de viabilidade", linha.status_viabilidade || "Sem dado"],
    ["Status de viabilidade LRF", linha.status_viabilidade_lrf || "Sem dado"],
    ["Status de autonomia", linha.status_autonomia || "Sem dado"],
    ["População", formatarInteiro(linha.populacao)],
    ["Dependência de transferências", formatarMetrica(linha.pct_dependencia_transf, "pct_dependencia_transf")],
    ["Autonomia fiscal", formatarMetrica(linha.autonomia_fiscal, "autonomia_fiscal")],
    ["Receita própria per capita", formatarMetrica(linha.receita_propria_per_capita, "receita_propria_per_capita")],
    ["Receita total bruta", formatarMoeda(linha.receita_total_bruta)],
    ["Receita corrente bruta", formatarMoeda(linha.receita_corrente_bruta)],
    ["Receita total líquida", formatarMoeda(linha.receita_total_liquida)],
    ["Receita corrente líquida", formatarMoeda(linha.receita_corrente_liquida)],
    ["Transferências totais", formatarMoeda(linha.transferencias_total)],
    ["Receita tributária municipal", formatarMoeda(tributos.receita_tributaria_municipal ?? linha.receita_tributaria_mun)],
    ["Percentual tributário bruto", formatarNumero(linha.pct_tributaria_bruta, 2)],
    ["Percentual da receita tributária", formatarNumero(linha.pct_receita_tributaria, 2)],
    ["IPTU", formatarMoeda(tributos.iptu ?? linha.IPTU)],
    ["ISS", formatarMoeda(tributos.iss ?? linha.ISS)],
    ["ITBI", formatarMoeda(tributos.itbi ?? linha.ITBI)],
    ["Fonte dos tributos municipais", tributos.fonte || "Base financeira principal consolidada"],
    ["Bolsa Família", formatarMetrica(linha.bolsa_familia_total, "bolsa_familia_total")],
    ["Faixa populacional", linha.faixa_populacional || "-"],
    ["FPM", formatarMoeda(linha.fpm_valor)],
    ["FUNDEB", formatarMoeda(linha.fundeb_valor)],
    ["SUS", formatarMoeda(linha.sus_valor)],
    ["ICMS", formatarMoeda(linha.icms_valor)],
    ["IPVA", formatarMoeda(linha.ipva_valor)],
    ["Participação do FPM", formatarNumero(linha.fpm_pct_bruta, 2)],
    ["Participação do FUNDEB", formatarNumero(linha.fundeb_pct_bruta, 2)],
    ["Participação do SUS", formatarNumero(linha.sus_pct_bruta, 2)],
    ["Participação do ICMS", formatarNumero(linha.icms_pct_bruta, 2)],
    ["Participação do IPVA", formatarNumero(linha.ipva_pct_bruta, 2)],
    ["Dependência federal", formatarNumero(linha.dependencia_federal, 1)],
    ["Dependência estadual", formatarNumero(linha.dependencia_estadual, 1)],
    ["Despesa total", formatarMoeda(linha.despesa_total)],
    ["Despesa com pessoal", formatarMoeda(linha.despesa_pessoal)],
    ["Despesa de custeio", formatarMoeda(linha.despesa_custeio)],
    ["Despesa de investimento", formatarMoeda(linha.despesa_investimento)],
    ["Capacidade de investimento", formatarNumero(linha.capacidade_investimento, 1)],
    ["Margem orçamentária", formatarNumero(linha.margem_orcamentaria, 1)],
    ["Pessoal per capita", formatarMoeda(linha.pessoal_per_capita)],
    ["Razão pessoal/receita própria", formatarNumero(linha.razao_pessoal_propria, 3)],
    ["Razão pessoal/LRF", formatarNumero(linha.razao_pessoal_lrf, 3)],
    ["Alfabetização", formatarNumero(linha.alfabetizacao, 2)],
    ["Renda média 10+", formatarMoeda(linha.renda_media_10_mais)],
    ["Renda média 15+", formatarMoeda(linha.renda_media_15_mais)],
    ["Mortalidade infantil", formatarNumero(linha.mortalidade_infantil, 2)],
    ["PIB aproximado", formatarMoeda(linha.pib_aproximado)],
    ["Mulheres no trabalho formal", `${formatarNumero(linha.proporcao_mulheres_trabalho_formal, 1)}%`],
    ["IFDM Geral", formatarNumero(linha.ifdm_geral, 3)],
    ["IFDM Educação", formatarNumero(linha.ifdm_educacao, 3)],
    ["IFDM Saúde", formatarNumero(linha.ifdm_saude, 3)],
    ["IFDM Emprego & renda", formatarNumero(linha.ifdm_emprego_renda, 3)],
    ["Ranking IFDM nacional", formatarInteiro(linha.ifdm_ranking_nacional)],
    ["Ranking IFDM estadual", formatarInteiro(linha.ifdm_ranking_estadual)],
    ["Tem RGF", String(linha.tem_rgf ?? "Sem dado")],
    ["Avisos da base", linha.aviso_indicadores || "Sem avisos"],
  ];

  itens.forEach(([rotulo, valor]) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <dt><span class="rotulo-indicador">${rotulo}${criarBotaoAjuda(explicacoesCampos[rotulo] || "Indicador mostrado com base nas fontes e filtros atuais do painel.")}</span></dt>
      <dd>${valor}</dd>
    `;
    elementos.gradeDetalhe.appendChild(wrapper);
  });

  renderizarComparacaoDetalhe(linha, linhasFiltradas);
  elementos.interpretacaoDetalhe.textContent = linha.interpretacao || "";
  carregarTributosMunicipais(linha);
}

function renderizarComparacaoDetalhe(linha, linhasFiltradas) {
  const metricaValor = linha[estado.metricaAtual];
  const medianaAtual = calcularMediana(linhasFiltradas.map((item) => item[estado.metricaAtual]).filter(valorSignificativo));
  const mediaPopulacao = calcularMedia(linhasFiltradas.map((item) => item.populacao).filter(valorSignificativo));
  const mediaDependencia = calcularMedia(linhasFiltradas.map((item) => item.pct_dependencia_transf).filter(valorSignificativo));
  const cards = [
    {
      rotulo: "Valor do município",
      valor: formatarMetrica(metricaValor, estado.metricaAtual),
      apoio: "Valor observado para a métrica ativa no município selecionado.",
    },
    {
      rotulo: "Mediana do filtro",
      valor: formatarMetrica(medianaAtual, estado.metricaAtual),
      apoio: "Ponto central do grupo atualmente filtrado.",
    },
    {
      rotulo: "População média do filtro",
      valor: formatarInteiro(mediaPopulacao),
      apoio: "Comparação de porte do município com o conjunto atual.",
    },
    {
      rotulo: "Dependência média do filtro",
      valor: formatarMetrica(mediaDependencia, "pct_dependencia_transf"),
      apoio: "Referência para saber se o município está mais ou menos dependente que o grupo analisado.",
    },
  ];

  elementos.comparacaoDetalhe.innerHTML = cards
    .map(
      (item) => `
        <div class="comparacao-item">
          <span>${item.rotulo}</span>
          <strong>${item.valor}</strong>
          <small class="texto-apoio">${item.apoio}</small>
        </div>
      `
    )
    .join("");
}

function obterChaveTributos(linha) {
  return `${linha.codigo_ibge}-${linha.ano}`;
}

function obterTributosMunicipais(linha) {
  const chave = obterChaveTributos(linha);
  return estado.cacheTributosMunicipais[chave] || {};
}

async function carregarTributosMunicipais(linha) {
  return carregarTributosMunicipaisComCallback(linha);
}

async function carregarTributosMunicipaisComCallback(linha, aoAtualizar = null) {
  const chave = obterChaveTributos(linha);
  if (estado.cacheTributosMunicipais[chave]?.fonte || estado.cacheTributosMunicipais[chave]?.carregando) return;
  estado.cacheTributosMunicipais[chave] = { carregando: true };
  estado.chaveTributosAtiva = chave;

  try {
    const resposta = await fetch(`/api/tributos?codigo_ibge=${linha.codigo_ibge}&ano=${linha.ano}`);
    if (!resposta.ok) {
      throw new Error(`${resposta.status}`);
    }
    const payload = await resposta.json();
    estado.cacheTributosMunicipais[chave] = payload;
    if (typeof aoAtualizar === "function") {
      aoAtualizar(payload);
    }
    if (estado.chaveTributosAtiva === chave && estado.codigoSelecionado === linha.codigo_ibge && String(estado.anoAtual) === String(linha.ano)) {
      renderizarDetalhe(linha, obterLinhasFiltradas());
    }
  } catch (erro) {
    estado.cacheTributosMunicipais[chave] = {
      fonte: "Base financeira principal consolidada",
      erro_api_tributos: String(erro.message || erro),
    };
    if (typeof aoAtualizar === "function") {
      aoAtualizar(estado.cacheTributosMunicipais[chave]);
    }
  }
}

function carregarTributosTerritorioPrograma(territorio) {
  const linhasTerritorio = obterLinhasTerritorioPrograma(territorio);
  if (!linhasTerritorio.length) return;
  linhasTerritorio.forEach((linha) => {
    carregarTributosMunicipaisComCallback(linha, () => {
      const cenario = obterCenarioProgramaAtivo();
      if (!cenario || estado.territorioProgramaSelecionadoId !== territorio.id) return;
      renderizarDetalheTerritorioPrograma(cenario);
    });
  });
}

function renderizarRanking(linhas) {
  elementos.graficoTop.innerHTML = "";
  const metrica = definicoesMetricas[estado.metricaAtual];
  const ranking =
    metrica.tipo === "categorica"
      ? linhas
          .filter((linha) => linha.status_viabilidade && linha.status_viabilidade !== "Sem dado")
          .sort((a, b) => (Number(b.populacao) || 0) - (Number(a.populacao) || 0))
          .slice(0, 10)
      : linhas
          .filter((linha) => valorSignificativo(linha[estado.metricaAtual]))
          .sort((a, b) => Number(b[estado.metricaAtual]) - Number(a[estado.metricaAtual]))
          .slice(0, 10);

  if (!ranking.length) {
    elementos.graficoTop.innerHTML = '<div class="empty-state">Sem valores comparáveis no filtro atual.</div>';
    return;
  }

  const metricaGrafico = metrica.tipo === "categorica" ? "populacao" : estado.metricaAtual;
  const escalaGrafico = criarEscalaNumerica(
    ranking.map((linha) => linha[metricaGrafico]).filter(valorSignificativo),
    metrica.tipo === "categorica" ? definicoesMetricas.populacao.paleta : metrica.paleta
  );
  const maximo = Math.max(...ranking.map((linha) => Number(linha[metricaGrafico]) || 0), 1);

  ranking.forEach((linha) => {
    const proporcao = ((Number(linha[metricaGrafico]) || 0) / maximo) * 100;
    const cor =
      metrica.tipo === "categorica"
        ? escalaGrafico.pick(Number(linha[metricaGrafico]) || 0)
        : obterCor(linha, metrica, escalaGrafico);
    const rotuloValor =
      metrica.tipo === "categorica"
        ? `${linha.status_viabilidade} · ${formatarInteiro(linha.populacao)} hab.`
        : formatarMetrica(linha[estado.metricaAtual], estado.metricaAtual);
    const barra = document.createElement("div");
    barra.className = "bar-row";
    barra.innerHTML = `
      <div class="bar-label">${linha.nome_municipio} (${linha.uf})</div>
      <div class="bar-track"><div class="bar-fill" style="width:${proporcao}%;background:${cor}"></div></div>
      <div>${rotuloValor}</div>
    `;
    elementos.graficoTop.appendChild(barra);
  });
}

function renderizarStatus(linhas) {
  elementos.graficoStatus.innerHTML = "";
  const contagens = linhas.reduce((acc, linha) => {
    const chave = linha.status_viabilidade || "Sem dado";
    acc[chave] = (acc[chave] || 0) + 1;
    return acc;
  }, {});
  const total = linhas.length || 1;
  const entradas = Object.entries(contagens);
  if (!entradas.length) {
    elementos.graficoStatus.innerHTML = '<div class="empty-state">Sem linhas no filtro atual.</div>';
    return;
  }
  entradas.sort((a, b) => b[1] - a[1]);
  entradas.forEach(([status, quantidade]) => {
    const linha = document.createElement("div");
    linha.className = "stack-row";
    const percentual = ((quantidade / total) * 100).toFixed(1);
    linha.innerHTML = `
      <div class="stack-label">${status}</div>
      <div class="stack-track"><div class="stack-fill ${statusParaClasse(status)}" style="width:${percentual}%"></div></div>
      <div>${quantidade} (${percentual}%)</div>
    `;
    elementos.graficoStatus.appendChild(linha);
  });
}

function renderizarRegioes(linhas) {
  elementos.graficoRegioes.innerHTML = "";
  const metrica = definicoesMetricas[estado.metricaAtual];
  const linhasValidas =
    metrica.tipo === "categorica"
      ? linhas.filter((linha) => linha[estado.metricaAtual] && linha[estado.metricaAtual] !== "Sem dado")
      : linhas.filter((linha) => valorSignificativo(linha[estado.metricaAtual]));
  const grupos = agruparPor(linhasValidas, "regiao");
  const medias = Object.entries(grupos)
    .map(([regiao, itens]) => ({
      rotulo: regiao,
      valor:
        metrica.tipo === "categorica"
          ? (itens.filter((item) => item.status_viabilidade === "INVIAVEL").length / itens.length) * 100
          : calcularMedia(itens.map((item) => item[estado.metricaAtual])),
    }))
    .sort((a, b) => (b.valor || 0) - (a.valor || 0));

  if (!medias.length) {
    elementos.graficoRegioes.innerHTML = '<div class="empty-state">Sem dados suficientes para médias regionais.</div>';
    return;
  }

  const maximo = Math.max(...medias.map((item) => item.valor || 0), 1);
  medias.forEach((item) => {
    const linha = document.createElement("div");
    linha.className = "bar-row";
    linha.innerHTML = `
      <div class="bar-label">${item.rotulo}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(item.valor / maximo) * 100}%"></div></div>
      <div>${metrica.tipo === "categorica" ? `${formatarNumero(item.valor, 1)}% inv.` : formatarMetrica(item.valor, estado.metricaAtual)}</div>
    `;
    elementos.graficoRegioes.appendChild(linha);
  });
}

function renderizarFaixas(linhas) {
  elementos.graficoFaixas.innerHTML = "";
  const metrica = definicoesMetricas[estado.metricaAtual];
  const total = linhas.length;
  if (!total) {
    elementos.graficoFaixas.innerHTML = '<div class="empty-state">Sem linhas para interpretar o filtro atual.</div>';
    return;
  }

  const cards = [
    {
      rotulo: "Municípios no filtro",
      valor: formatarInteiro(total),
      apoio: "Quantidade total de municípios após aplicar ano e filtros.",
    },
    {
      rotulo: "Valor médio da métrica",
      valor:
        metrica.tipo === "categorica"
          ? `${formatarNumero((linhas.filter((linha) => linha.status_viabilidade === "INVIAVEL").length / total) * 100, 1)}% inviáveis`
          : formatarMetrica(calcularMedia(linhas.map((linha) => linha[estado.metricaAtual]).filter(valorSignificativo)), estado.metricaAtual),
      apoio: "Resumo central do filtro atual para leitura rápida.",
    },
    {
      rotulo: "Maior município do filtro",
      valor: obterMaiorMunicipio(linhas),
      apoio: "Ajuda a entender qual cidade domina o conjunto em escala populacional.",
    },
    {
      rotulo: "Bolsa Família médio",
      valor: formatarInteiro(calcularMedia(linhas.map((linha) => linha.bolsa_familia_total).filter(valorSignificativo))),
      apoio: "Referência social útil para complementar a leitura fiscal.",
    },
  ];

  cards.forEach((item) => {
    const bloco = document.createElement("div");
    bloco.className = "comparacao-item";
    bloco.innerHTML = `<span>${item.rotulo}</span><strong>${item.valor}</strong><small class="texto-apoio">${item.apoio}</small>`;
    elementos.graficoFaixas.appendChild(bloco);
  });
}

function renderizarInsights(linhas) {
  elementos.insightsAutomaticos.innerHTML = "";
  if (!linhas.length) {
    elementos.insightsAutomaticos.innerHTML = '<div class="empty-state">Sem dados para gerar insights neste filtro.</div>';
    return;
  }
  const total = linhas.length;
  const inviaveis = linhas.filter((linha) => linha.status_viabilidade === "INVIAVEL").length;
  const muitoDependentes = linhas.filter((linha) => (Number(linha.pct_dependencia_transf) || 0) >= 80).length;
  const autonomiaMedia = calcularMedia(linhas.map((linha) => linha.autonomia_fiscal).filter(valorSignificativo));
  const regiaoMaisCritica = Object.entries(agruparPor(linhas, "regiao"))
    .map(([regiao, itens]) => ({
      regiao,
      taxa: itens.filter((item) => item.status_viabilidade === "INVIAVEL").length / itens.length,
    }))
    .sort((a, b) => b.taxa - a.taxa)[0];
  const insights = [
    `${formatarNumero((inviaveis / total) * 100, 1)}% dos municípios no filtro atual estão marcados como INVIAVEL.`,
    `${formatarNumero((muitoDependentes / total) * 100, 1)}% do recorte tem dependência de transferências igual ou superior a 80%.`,
    `A autonomia fiscal média do filtro está em ${formatarNumero(autonomiaMedia, 2)}.`,
    regiaoMaisCritica
      ? `${regiaoMaisCritica.regiao} é a região mais pressionada neste recorte, com ${formatarNumero(regiaoMaisCritica.taxa * 100, 1)}% de municípios inviáveis.`
      : "Não foi possível identificar uma região crítica neste recorte.",
  ];
  insights.forEach((texto) => {
    const item = document.createElement("div");
    item.className = "insight-item";
    item.textContent = texto;
    elementos.insightsAutomaticos.appendChild(item);
  });
}

function renderizarClima() {
  const bundle = estado.climatologia.variaveis[estado.climaVariavelAtual];
  const rotulos = {
    precipitacao: "Precipitação acumulada",
    temperatura_maxima: "Temperatura máxima",
    umidade_relativa: "Umidade relativa",
  };
  const fonte = estado.climatologia.fontes[estado.climaVariavelAtual];
  elementos.fonteClima.textContent = `Arquivo: ${fonte}`;
  elementos.coberturaClima.textContent = `A variável ${rotulos[estado.climaVariavelAtual]} usa ${Object.keys(bundle.ufs).length} UFs com estações válidas e unidade ${bundle.unidade}.`;
  elementos.explicacaoClima.textContent =
    "A climatologia é por estação meteorológica. O painel resume as estações por UF e Brasil para permitir comparação sem fingir uma precisão municipal que a base não entrega.";
  const alvo = estado.climaUfAtual === "BRASIL" ? bundle.brasil : bundle.ufs[estado.climaUfAtual];
  elementos.insightClima.textContent = criarInsightClimatico(bundle, alvo);
  renderizarMapaClimatico(bundle);
  renderizarClimaMensal(alvo, bundle.unidade);
  renderizarClimaUfs(bundle);
  renderizarClimaEstacoes(bundle);
}

function renderizarMapaClimatico(bundle) {
  if (!elementos.mapaClima) return;
  elementos.mapaClima.innerHTML = "";
  elementos.mapaClima.setAttribute("viewBox", `0 0 ${estado.metadata.mapa.largura} ${estado.metadata.mapa.altura}`);
  const namespace = "http://www.w3.org/2000/svg";
  const grupo = document.createElementNS(namespace, "g");
  grupo.setAttribute("id", "grupo-mapa-clima");
  elementos.mapaClima.appendChild(grupo);
  const valoresUf = Object.fromEntries(
    Object.entries(bundle.ufs).map(([uf, item]) => [uf, item.media_anual]).filter(([, valor]) => valor !== null)
  );
  const escala = criarEscalaNumerica(Object.values(valoresUf), ["#d7e8e0", "#74b49b", "#1d6b52"]);
  const caminhosAno = estado.caminhosPorAno[estado.anoAtual] || [];
  const ufPorCodigo = new Map(
    estado.linhas
      .filter((item) => String(item.ano) === estado.anoAtual)
      .map((item) => [item.codigo_ibge, item.uf])
  );
  caminhosAno.forEach((feature) => {
    const path = document.createElementNS(namespace, "path");
    const uf = ufPorCodigo.get(feature.codigo_ibge);
    const valor = uf ? valoresUf[uf] : null;
    const destacar = estado.climaUfAtual === "BRASIL" || estado.climaUfAtual === uf;
    path.setAttribute("d", feature.caminho_svg);
    path.setAttribute("fill", valor !== null ? escala.pick(valor) : "#d9ddd9");
    path.setAttribute("stroke", destacar ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)");
    path.setAttribute("stroke-width", destacar ? "0.28" : "0.18");
    path.setAttribute("opacity", destacar ? "1" : "0.16");
    if (uf && valor !== null) {
      path.addEventListener("mouseenter", (evento) => {
        elementos.tooltipClima.classList.remove("hidden");
        elementos.tooltipClima.innerHTML = `<strong>${uf}</strong><br />${formatarNumero(valor, 1)} ${bundle.unidade}<br />Indicador climático por UF`;
        posicionarTooltipClima(evento);
      });
      path.addEventListener("mousemove", posicionarTooltipClima);
      path.addEventListener("mouseleave", ocultarTooltipClima);
    }
    grupo.appendChild(path);
  });
  habilitarNavegacaoMapa(elementos.mapaClima, "clima", "grupo-mapa-clima");
  aplicarTransformacaoMapa("clima", "grupo-mapa-clima");
}

function criarInsightClimatico(bundle, alvo) {
  if (!alvo) return "Sem dados climáticos para o recorte atual.";
  const mensal = Object.entries(alvo.mensal || {}).filter(([, valor]) => valor !== null);
  if (!mensal.length) return "Sem sazonalidade disponível para o recorte atual.";
  mensal.sort((a, b) => b[1] - a[1]);
  const [maisAltoMes, valorAlto] = mensal[0];
  const [maisBaixoMes, valorBaixo] = mensal[mensal.length - 1];
  return `No recorte atual, ${maisAltoMes} é o mês mais intenso (${formatarNumero(valorAlto, 1)} ${bundle.unidade}) e ${maisBaixoMes} o mais baixo (${formatarNumero(valorBaixo, 1)} ${bundle.unidade}).`;
}

function renderizarClimaMensal(alvo, unidade) {
  elementos.graficoClimaMensal.innerHTML = "";
  if (!alvo) {
    elementos.graficoClimaMensal.innerHTML = '<div class="empty-state">Sem dados climáticos para este recorte.</div>';
    return;
  }
  const entries = Object.entries(alvo.mensal).filter(([, valor]) => valor !== null);
  const maximo = Math.max(...entries.map(([, valor]) => valor), 1);
  entries.forEach(([mes, valor]) => {
    const linha = document.createElement("div");
    linha.className = "bar-row";
    linha.innerHTML = `
      <div class="bar-label">${mes}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(valor / maximo) * 100}%"></div></div>
      <div>${formatarNumero(valor, 1)} ${unidade}</div>
    `;
    elementos.graficoClimaMensal.appendChild(linha);
  });
}

function renderizarClimaUfs(bundle) {
  elementos.graficoClimaUfs.innerHTML = "";
  const entries = Object.entries(bundle.ufs)
    .filter(([, valor]) => valor.media_anual !== null)
    .map(([uf, valor]) => ({ uf, valor: valor.media_anual }))
    .sort((a, b) => b.valor - a.valor);
  const maximo = Math.max(...entries.map((item) => item.valor), 1);
  entries.forEach((item) => {
    const linha = document.createElement("div");
    linha.className = "bar-row";
    linha.innerHTML = `
      <div class="bar-label">${item.uf}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(item.valor / maximo) * 100}%"></div></div>
      <div>${formatarNumero(item.valor, 1)} ${bundle.unidade}</div>
    `;
    elementos.graficoClimaUfs.appendChild(linha);
  });
}

function renderizarClimaEstacoes(bundle) {
  elementos.graficoClimaEstacoes.innerHTML = "";
  const entries = bundle.ranking_estacoes
    .filter((item) => estado.climaUfAtual === "BRASIL" || item.uf === estado.climaUfAtual)
    .slice(0, 12);
  if (!entries.length) {
    elementos.graficoClimaEstacoes.innerHTML = '<div class="empty-state">Sem estações para o recorte atual.</div>';
    return;
  }
  const maximo = Math.max(...entries.map((item) => item.valor_anual), 1);
  entries.forEach((item) => {
    const linha = document.createElement("div");
    linha.className = "bar-row";
    linha.innerHTML = `
      <div class="bar-label">${item.estacao} (${item.uf})</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(item.valor_anual / maximo) * 100}%"></div></div>
      <div>${formatarNumero(item.valor_anual, 1)} ${bundle.unidade}</div>
    `;
    elementos.graficoClimaEstacoes.appendChild(linha);
  });
}

function obterMaiorMunicipio(linhas) {
  const maior = [...linhas].sort((a, b) => (Number(b.populacao) || 0) - (Number(a.populacao) || 0))[0];
  return maior ? `${maior.nome_municipio} (${maior.uf})` : "Sem dado";
}

function agruparPor(linhas, chave) {
  return linhas.reduce((acc, linha) => {
    const valor = linha[chave] || "Sem dado";
    if (!acc[valor]) acc[valor] = [];
    acc[valor].push(linha);
    return acc;
  }, {});
}

function obterCor(linha, metrica, escala) {
  const valor = linha[estado.metricaAtual];
  if (metrica.tipo === "categorica") {
    return metrica.cores[valor] || metrica.cores["Sem dado"];
  }
  if (!valorSignificativo(valor) || !escala) {
    return "#d6dad6";
  }
  return escala.pick(Number(valor));
}

function criarEscalaNumerica(valores, paleta) {
  const ordenados = valores.filter(valorSignificativo).map(Number).sort((a, b) => a - b);
  const minimo = ordenados[0];
  const maximo = ordenados[ordenados.length - 1];
  const stops = [0, 0.5, 1].map((posicao, indice) => ({
    color: paleta[indice],
    value: minimo + (maximo - minimo) * posicao,
  }));
  return {
    stops,
    pick(valor) {
      if (maximo === minimo) return paleta[1];
      const proporcao = Math.max(0, Math.min(1, (valor - minimo) / (maximo - minimo)));
      if (proporcao <= 0.5) return misturarCores(paleta[0], paleta[1], proporcao / 0.5);
      return misturarCores(paleta[1], paleta[2], (proporcao - 0.5) / 0.5);
    },
  };
}

function misturarCores(corA, corB, proporcao) {
  const a = corA.match(/[a-f0-9]{2}/gi).map((hex) => parseInt(hex, 16));
  const b = corB.match(/[a-f0-9]{2}/gi).map((hex) => parseInt(hex, 16));
  const misturada = a.map((valor, indice) => Math.round(valor + (b[indice] - valor) * proporcao));
  return `#${misturada.map((valor) => valor.toString(16).padStart(2, "0")).join("")}`;
}

function exibirTooltip(evento, linha) {
  elementos.tooltip.classList.remove("hidden");
  elementos.tooltip.innerHTML = `
    <strong>${linha.nome_municipio} (${linha.uf})</strong><br />
    ${definicoesMetricas[estado.metricaAtual].rotulo}: ${formatarMetrica(linha[estado.metricaAtual], estado.metricaAtual)}<br />
    Base: ${definicoesMetricas[estado.metricaAtual].fonte.arquivo}<br />
    Status: ${linha.status_viabilidade || "Sem dado"}
  `;
  posicionarTooltip(evento);
}

function criarLinhaAjuda(rotulo, textoAjuda) {
  return `<span class="linha-ajuda">${rotulo}${criarBotaoAjuda(textoAjuda)}</span>`;
}

function criarBotaoAjuda(textoAjuda) {
  return `<button class="ajuda-indicador" type="button" data-ajuda="${escapeHtml(textoAjuda)}" aria-label="${escapeHtml(textoAjuda)}">?</button>`;
}

function criarBotaoAjudaCompleto(configuracaoAjuda) {
  if (!configuracaoAjuda) {
    return criarBotaoAjuda("Indicador mostrado com base nas fontes e filtros atuais do painel.");
  }
  if (typeof configuracaoAjuda === "string") {
    return criarBotaoAjuda(configuracaoAjuda);
  }
  const texto = configuracaoAjuda.texto || "Indicador mostrado com base nas fontes e filtros atuais do painel.";
  const html = configuracaoAjuda.html || "";
  return `<button class="ajuda-indicador" type="button" data-ajuda="${escapeHtml(texto)}" data-ajuda-html="${escapeHtml(html)}" aria-label="${escapeHtml(texto)}">?</button>`;
}

function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function posicionarTooltip(evento) {
  const bounds = evento.currentTarget.ownerSVGElement.getBoundingClientRect();
  elementos.tooltip.style.left = `${evento.clientX - bounds.left + 14}px`;
  elementos.tooltip.style.top = `${evento.clientY - bounds.top + 14}px`;
}

function mostrarTooltipAjuda(alvo, evento) {
  const texto = alvo.dataset.ajuda || alvo.getAttribute("aria-label") || "";
  const html = alvo.dataset.ajudaHtml || "";
  if (!texto) return;
  elementos.tooltipAjuda.classList.remove("hidden");
  elementos.tooltipAjuda.innerHTML = html || texto;
  posicionarTooltipAjuda(evento);
}

function posicionarTooltipAjuda(evento) {
  elementos.tooltipAjuda.style.left = `${evento.clientX + 12}px`;
  elementos.tooltipAjuda.style.top = `${evento.clientY + 12}px`;
}

function ocultarTooltipAjuda() {
  elementos.tooltipAjuda.classList.add("hidden");
}

function ocultarTooltip() {
  elementos.tooltip.classList.add("hidden");
}

function valorSignificativo(valor) {
  return valor !== null && valor !== undefined && valor !== "" && !Number.isNaN(Number(valor));
}

function calcularMedia(valores) {
  if (!valores.length) return null;
  return valores.reduce((soma, valor) => soma + Number(valor), 0) / valores.length;
}

function calcularMediana(valores) {
  if (!valores.length) return null;
  const ordenados = [...valores].map(Number).sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 === 0 ? (ordenados[meio - 1] + ordenados[meio]) / 2 : ordenados[meio];
}

function formatarMetrica(valor, chaveMetrica) {
  if (valor === null || valor === undefined || valor === "") return "Sem dado";
  const metrica = definicoesMetricas[chaveMetrica];
  if (metrica?.formatador) return metrica.formatador(valor);
  return String(valor);
}

function formatarInteiro(valor) {
  if (!valorSignificativo(valor)) return "Sem dado";
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(Number(valor));
}

function formatarNumero(valor, casas = 1) {
  if (!valorSignificativo(valor)) return "Sem dado";
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: casas,
  }).format(Number(valor));
}

function formatarMoeda(valor) {
  if (!valorSignificativo(valor)) return "Sem dado";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number(valor));
}

function formatarPercentual(valor, casas = 1) {
  if (!valorSignificativo(valor)) return "Sem dado";
  return `${formatarNumero(valor, casas)}%`;
}

function formatarMes(valor) {
  if (!valor) return "-";
  const texto = String(valor);
  return `${texto.slice(4, 6)}/${texto.slice(0, 4)}`;
}

function normalizarTextoLivre(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function statusParaClasse(status) {
  if (status === "FRAGILIDADE") return "status-atencao";
  if (status === "CRITICA" || status === "INVIAVEL") return "status-critico";
  if (status === "Sem dado") return "status-sem-dado";
  return "";
}
