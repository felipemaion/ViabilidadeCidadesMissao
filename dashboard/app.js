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
  totalLinhas: document.getElementById("total-linhas"),
  referenciaBolsa: document.getElementById("referencia-bolsa"),
  coberturaGeografica: document.getElementById("cobertura-geografica"),
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
  caminhosPorAno: {},
  climatologia: null,
  programaReforma: null,
  metricaAtual: "status_viabilidade",
  anoAtual: null,
  ufAtual: "TODAS",
  regiaoAtual: "TODAS",
  faixaPopulacionalAtual: "TODAS",
  statusAtual: "TODOS",
  climaVariavelAtual: "precipitacao",
  climaUfAtual: "BRASIL",
  codigoSelecionado: null,
  municipiosDestacadosPrograma: [],
  buscaTerritoriosPrograma: "",
  paginaTerritoriosPrograma: 1,
  itensPorPaginaTerritoriosPrograma: 15,
  ordenacaoTerritoriosPrograma: { chave: "nome", direcao: "asc" },
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
  const [metadata, linhas, caminhos, climatologia, programaReforma] = await Promise.all([
    buscarJson("./data/metadata.json"),
    buscarJson("./data/municipality_data.json"),
    buscarJson("./data/map_paths_by_year.json"),
    buscarJson("./data/climatologia.json"),
    buscarJson("./data/programa_reforma.json"),
  ]);

  estado.metadata = metadata;
  estado.linhas = linhas;
  estado.caminhosPorAno = caminhos;
  estado.climatologia = climatologia;
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
  elementos.totalLinhas.textContent = formatarInteiro(linhas.length);
  elementos.referenciaBolsa.textContent = formatarMes(metadata.ultima_referencia_bolsa_familia);
  const cobertura = ((metadata.qualidade.municipios_com_geometria / new Set(linhas.map((linha) => linha.codigo_ibge)).size) * 100).toFixed(1);
  elementos.coberturaGeografica.textContent = `${cobertura}%`;
  elementos.escopoClima.textContent = estado.climatologia.escopo;
  renderizarProgramaReforma();
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
  elementos.programaResumo.textContent =
    "Camada programática separada do diagnóstico, com metodologia preliminar, cenários iniciais e arquitetura legal em curadoria.";
  elementos.programaMensagem.textContent = programa.visao_geral.mensagem_programatica;
  elementos.programaParametro.textContent = `Referência inicial de ${formatarInteiro(
    programa.territorios_identidade.parametro_populacional_referencia
  )} habitantes por amálgama, com alvo ótimo de ${formatarInteiro(
    programa.territorios_identidade.parametro_populacional_otimo
  )} habitantes e possibilidade de recalibração.`;
  elementos.programaIfdm.textContent = `${programa.visao_geral.ifdm.status.replaceAll("_", " ")}. ${programa.visao_geral.ifdm.observacao}`;
  elementos.programaPosUnificacao.textContent = `${formatarInteiro(programa.mapa_unificado.municipios_depois)} territórios no cenário simulado, ante ${formatarInteiro(
    programa.mapa_unificado.municipios_antes
  )} municípios atuais.`;
  elementos.programaLrg.textContent = `${programa.lrg_conceitual.status.replaceAll("_", " ")}. ${programa.lrg_conceitual.aviso}`;
  elementos.programaMapaResumo.textContent = `Após a unificação preliminar, o cenário passa de ${formatarInteiro(
    programa.mapa_unificado.municipios_antes
  )} para ${formatarInteiro(programa.mapa_unificado.municipios_depois)} unidades territoriais, redução de ${formatarInteiro(
    programa.mapa_unificado.reducao_absoluta
  )} (${formatarNumero(programa.mapa_unificado.reducao_percentual, 1)}%).`;
  elementos.programaMapaAviso.textContent = programa.mapa_unificado.escopo;
  elementos.programaCenariosAviso.textContent = programa.cenarios_amalgama.observacao_metodologica;

  preencherLista(elementos.programaEixos, programa.visao_geral.eixos);
  preencherLista(elementos.programaMetodologia, programa.territorios_identidade.metodologia);
  preencherLista(elementos.programaLrgPrincipios, programa.lrg_conceitual.principios_sugeridos);

  renderizarTerritoriosPrograma(programa.territorios_identidade.territorios);
  renderizarMapaUnificadoPrograma(programa.mapa_unificado.territorios);
  sincronizarControlesTabelaPrograma();
  renderizarTabelaMapaUnificado(programa.mapa_unificado.territorios);
  renderizarCenariosPrograma(programa.cenarios_amalgama.municipios_prioritarios);
  renderizarArquiteturaLegal(programa.arquitetura_legal.eixos);
  renderizarCapitaisIfdm(programa.ifdm_capitais || []);
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
      const nomesMunicipios = territorio.municipios
        .map((codigo) => obterNomeMunicipioPorCodigo(codigo))
        .filter(Boolean)
        .join(", ");
      const card = document.createElement("div");
      card.className = "programa-card";
      card.innerHTML = `
        <span>${territorio.nome}</span>
        <strong>${formatarInteiro(territorio.populacao_total)} hab. · ${territorio.quantidade_municipios} municípios</strong>
      <small>Autonomia média: ${formatarNumero(territorio.autonomia_media, 2)} · Dependência média: ${formatarNumero(
          territorio.dependencia_media,
          1
        )}% · IFDM médio: ${formatarNumero(territorio.ifdm_medio, 3)} · Status predominante: ${territorio.status_predominante}</small>
        <small>Municípios: ${nomesMunicipios || "Sem detalhamento nominal disponível."}</small>
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
  const territoriosFiltrados = ordenarTerritoriosMapaUnificado(filtrarTerritoriosMapaUnificado(territorios || []));
  const totalBrasil = (territorios || []).reduce((acumulado, territorio) => acumulado + (territorio.populacao_total || 0), 0);
  const totalPaginas = Math.max(1, Math.ceil(territoriosFiltrados.length / estado.itensPorPaginaTerritoriosPrograma));
  estado.paginaTerritoriosPrograma = Math.min(Math.max(1, estado.paginaTerritoriosPrograma), totalPaginas);
  const inicio = (estado.paginaTerritoriosPrograma - 1) * estado.itensPorPaginaTerritoriosPrograma;
  const territoriosDaPagina = territoriosFiltrados.slice(inicio, inicio + estado.itensPorPaginaTerritoriosPrograma);

  territoriosDaPagina.forEach((territorio) => {
    const linha = document.createElement("tr");
    const municipios = (territorio.municipios || [])
      .map((codigo) => obterNomeMunicipioPorCodigo(codigo))
      .filter(Boolean)
      .join(", ");

    linha.innerHTML = `
      <td>${territorio.nome}</td>
      <td>${territorio.uf}</td>
      <td>${municipios || "Sem detalhamento nominal disponível."}</td>
      <td>${formatarInteiro(territorio.populacao_total)}</td>
    `;
    elementos.programaTabelaTerritorios.appendChild(linha);
  });

  if (!territoriosDaPagina.length) {
    const linha = document.createElement("tr");
    linha.innerHTML = '<td colspan="4">Nenhum território encontrado para a cidade pesquisada.</td>';
    elementos.programaTabelaTerritorios.appendChild(linha);
  }

  elementos.programaTabelaTotalBrasil.textContent = formatarInteiro(totalBrasil);
  elementos.programaPaginacaoResumo.textContent = `Página ${formatarInteiro(estado.paginaTerritoriosPrograma)} de ${formatarInteiro(
    totalPaginas
  )} · ${formatarInteiro(territoriosFiltrados.length)} territórios encontrados`;
  elementos.programaPaginaAnterior.disabled = estado.paginaTerritoriosPrograma <= 1;
  elementos.programaPaginaProxima.disabled = estado.paginaTerritoriosPrograma >= totalPaginas;
  sincronizarCabecalhosTabelaPrograma();
}

function sincronizarControlesTabelaPrograma() {
  elementos.programaBuscaTerritorios.value = estado.buscaTerritoriosPrograma;
}

function filtrarTerritoriosMapaUnificado(territorios) {
  const termo = normalizarTextoLivre(estado.buscaTerritoriosPrograma);
  if (!termo) return territorios;
  return territorios.filter((territorio) => {
    const municipios = (territorio.municipios || [])
      .map((codigo) => obterNomeMunicipioPorCodigo(codigo))
      .join(" ");
    return [territorio.nome, territorio.uf, municipios].some((valor) => normalizarTextoLivre(valor).includes(termo));
  });
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
  const linha = estado.linhas.find((item) => String(item.ano) === estado.anoAtual && item.codigo_ibge === codigoIbge);
  return linha ? `${linha.nome_municipio} (${linha.uf})` : codigoIbge;
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
    path.setAttribute("fill", cor);
    path.setAttribute("stroke", "rgba(255,255,255,0.45)");
    path.setAttribute("stroke-width", "0.42");
    path.setAttribute("class", "municipality");
    path.addEventListener("mouseenter", (evento) => {
      destacarMunicipiosDoTerritorio(territorio.municipios || []);
      renderizarDestaqueProgramaNoMapaSimulado(territorio.municipios || []);
      exibirTooltipPrograma(evento, territorio);
    });
    path.addEventListener("mousemove", posicionarTooltipPrograma);
    path.addEventListener("mouseleave", () => {
      limparDestaqueMunicipiosPrograma();
      limparDestaqueProgramaNoMapaSimulado();
      ocultarTooltipPrograma();
    });
    grupo.appendChild(path);
  });
  habilitarNavegacaoMapa(elementos.mapaPrograma, "programa", "grupo-mapa-programa-root");
  aplicarTransformacaoMapa("programa", "grupo-mapa-programa-root");
}

function exibirTooltipPrograma(evento, territorio) {
  const municipios = (territorio.municipios || [])
    .map((codigo) => obterNomeMunicipioPorCodigo(codigo))
    .filter(Boolean)
    .join(", ");
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
      </div>
      <div class="tooltip-programa-lista">
        <span>Municípios englobados</span>
        <small>${municipios || "Sem detalhamento nominal disponível."}</small>
      </div>
    </div>
  `;
  posicionarTooltipPrograma(evento);
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
    estado.buscaTerritoriosPrograma = evento.target.value || "";
    estado.paginaTerritoriosPrograma = 1;
    renderizarTabelaMapaUnificado(estado.programaReforma?.mapa_unificado?.territorios || []);
  });
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
      renderizarTabelaMapaUnificado(estado.programaReforma?.mapa_unificado?.territorios || []);
    });
  });
  elementos.programaPaginaAnterior.addEventListener("click", () => {
    estado.paginaTerritoriosPrograma = Math.max(1, estado.paginaTerritoriosPrograma - 1);
    renderizarTabelaMapaUnificado(estado.programaReforma?.mapa_unificado?.territorios || []);
  });
  elementos.programaPaginaProxima.addEventListener("click", () => {
    estado.paginaTerritoriosPrograma += 1;
    renderizarTabelaMapaUnificado(estado.programaReforma?.mapa_unificado?.territorios || []);
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
        estado.codigoSelecionado = feature.codigo_ibge;
        renderizar();
      });
    }
    grupo.appendChild(path);
  });
  habilitarNavegacaoMapa(elementos.mapa, "principal", "grupo-mapa-principal");
  aplicarTransformacaoMapa("principal", "grupo-mapa-principal");
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

function aplicarAcaoControleMapa(chaveMapa, acao) {
  const ids = {
    principal: "grupo-mapa-principal",
    clima: "grupo-mapa-clima",
    programa: "grupo-mapa-programa",
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
    elementos.interpretacaoDetalhe.textContent = "";
    return;
  }
  estado.codigoSelecionado = linha.codigo_ibge;
  const metrica = definicoesMetricas[estado.metricaAtual];
  elementos.tituloDetalhe.textContent = `${linha.nome_municipio} (${linha.uf})`;
  elementos.subtituloDetalhe.textContent = `${linha.regiao || "Região indisponível"} · Ano ${linha.ano}`;
  elementos.explicacaoDetalhe.textContent = `${metrica.detalhe} Para viabilidade, o critério vem do campo já consolidado na planilha principal; o painel não inventa nem recalcula a regra.`;
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
    ["Receita tributária municipal", formatarMoeda(linha.receita_tributaria_mun)],
    ["Percentual tributário bruto", formatarNumero(linha.pct_tributaria_bruta, 2)],
    ["Percentual da receita tributária", formatarNumero(linha.pct_receita_tributaria, 2)],
    ["IPTU", formatarMoeda(linha.IPTU)],
    ["ISS", formatarMoeda(linha.ISS)],
    ["ITBI", formatarMoeda(linha.ITBI)],
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
  const grupos = agruparPor(linhas.filter((linha) => valorSignificativo(linha[estado.metricaAtual])), "regiao");
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
  if (!texto) return;
  elementos.tooltipAjuda.classList.remove("hidden");
  elementos.tooltipAjuda.innerHTML = texto;
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
