import importlib.util
import json
import re
import unittest
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = ROOT / "scripts" / "build_dashboard_data.py"
PROGRAM_SCRIPT_PATH = ROOT / "scripts" / "build_programa_reforma.py"
METADATA_PATH = ROOT / "dashboard" / "data" / "metadata.json"
LINHAS_PATH = ROOT / "dashboard" / "data" / "municipality_data.json"
MAPA_PATH = ROOT / "dashboard" / "data" / "map_paths_by_year.json"
CLIMA_PATH = ROOT / "dashboard" / "data" / "climatologia.json"
PROGRAMA_PATH = ROOT / "dashboard" / "data" / "programa_reforma.json"
PERFIS_INDEX_PATH = ROOT / "dashboard" / "data" / "programa_perfis.json"
PERFIS_DIR = ROOT / "dashboard" / "data" / "programa_perfis"
INDEX_PATH = ROOT / "dashboard" / "index.html"
APP_PATH = ROOT / "dashboard" / "app.js"
README_PATH = ROOT / "README.md"
PACKAGE_PATH = ROOT / "package.json"
NETLIFY_PATH = ROOT / "netlify.toml"
VERCEL_PATH = ROOT / "vercel.json"
LOCAL_SERVER_PATH = ROOT / "scripts" / "serve_dashboard.py"
API_TRIBUTOS_PATH = ROOT / "api" / "tributos.js"


def carregar_builder():
    spec = importlib.util.spec_from_file_location("build_dashboard_data", SCRIPT_PATH)
    modulo = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(modulo)
    return modulo


def carregar_builder_programa():
    spec = importlib.util.spec_from_file_location("build_programa_reforma", PROGRAM_SCRIPT_PATH)
    modulo = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(modulo)
    return modulo


class BaseDashboardTest(unittest.TestCase):
    _cache_pronto = False

    @classmethod
    def setUpClass(cls):
        if not BaseDashboardTest._cache_pronto:
            BaseDashboardTest.builder = carregar_builder()
            BaseDashboardTest.builder_programa = carregar_builder_programa()
            BaseDashboardTest.builder.main()
            BaseDashboardTest.builder_programa.main()
            BaseDashboardTest.metadata = json.loads(METADATA_PATH.read_text(encoding="utf-8"))
            BaseDashboardTest.linhas = json.loads(LINHAS_PATH.read_text(encoding="utf-8"))
            BaseDashboardTest.mapa = json.loads(MAPA_PATH.read_text(encoding="utf-8"))
            BaseDashboardTest.clima = json.loads(CLIMA_PATH.read_text(encoding="utf-8"))
            BaseDashboardTest.programa = json.loads(PROGRAMA_PATH.read_text(encoding="utf-8"))
            BaseDashboardTest.perfis_programa = json.loads(PERFIS_INDEX_PATH.read_text(encoding="utf-8"))
            BaseDashboardTest.index_html = INDEX_PATH.read_text(encoding="utf-8")
            BaseDashboardTest.app_js = APP_PATH.read_text(encoding="utf-8")
            BaseDashboardTest.readme = README_PATH.read_text(encoding="utf-8")
            BaseDashboardTest.package = json.loads(PACKAGE_PATH.read_text(encoding="utf-8"))
            BaseDashboardTest.netlify = NETLIFY_PATH.read_text(encoding="utf-8")
            BaseDashboardTest.vercel = json.loads(VERCEL_PATH.read_text(encoding="utf-8"))
            BaseDashboardTest._cache_pronto = True
        cls.builder = BaseDashboardTest.builder
        cls.builder_programa = BaseDashboardTest.builder_programa
        cls.metadata = BaseDashboardTest.metadata
        cls.linhas = BaseDashboardTest.linhas
        cls.mapa = BaseDashboardTest.mapa
        cls.clima = BaseDashboardTest.clima
        cls.programa = BaseDashboardTest.programa
        cls.perfis_programa = BaseDashboardTest.perfis_programa
        cls.index_html = BaseDashboardTest.index_html
        cls.app_js = BaseDashboardTest.app_js
        cls.readme = BaseDashboardTest.readme
        cls.package = BaseDashboardTest.package
        cls.netlify = BaseDashboardTest.netlify
        cls.vercel = BaseDashboardTest.vercel


class TestOrganizacaoDeArquivos(BaseDashboardTest):
    def test_fontes_foram_movidas_para_data_fontes(self):
        pasta = ROOT / "data" / "fontes"
        esperados = {
            "07.03_indicadores_base_completa_20260217.xlsx",
            "CNES_saude_estabelecimentos.xlsx",
            "CNES_saude_leitos.xlsx",
            "Cartilha - Redução dos Municípios.docx",
            "Cartilha de Redução de Municípios - Segunda Etapa.docx",
            "IBGE 2026.xlsx",
            "Ranking-IFDM-2025-ano-base-2023.xlsx",
            "Ranking-IFDM-Capitais-2025-ano-base-2023.xlsx",
            "Normal-Climatologica-PREC.xlsx",
            "Normal-Climatologica-TMAX.xlsx",
            "Normal-Climatologica-URHORA.xlsx",
            "beneficios_bolsa_familia.csv",
            "municipios_enriquecidos6.csv",
        }
        encontrados = {arquivo.name for arquivo in pasta.iterdir() if arquivo.is_file()}
        self.assertTrue(esperados.issubset(encontrados))

    def test_raiz_nao_tem_planilhas_csv_ou_docx_soltos(self):
        proibidos = []
        for extensao in ("*.xlsx", "*.csv", "*.docx"):
            proibidos.extend(ROOT.glob(extensao))
        self.assertEqual([], [arquivo.name for arquivo in proibidos])

    def test_fontes_configuradas_no_builder_apontam_para_pasta_correta(self):
        self.assertIn("data/fontes", str(self.builder.FINANCE_XLSX))
        self.assertIn("data/fontes", str(self.builder.ENRICHED_CSV))
        self.assertIn("data/fontes", str(self.builder.BOLSA_CSV))
        self.assertIn("data/fontes", str(self.builder.DOCX_FILE))
        self.assertIn("data/fontes", str(self.builder.DOCX_FILE_2))

    def test_arquivo_oficial_do_ibge_existe(self):
        self.assertTrue(self.builder.BOUNDARY_ZIP.exists())


class TestFuncoesDoBuilder(BaseDashboardTest):
    def test_normalize_code_completa_zeros(self):
        self.assertEqual("0000123", self.builder.normalize_code("123", digits=7))
        self.assertEqual("120001", self.builder.normalize_code("120001", digits=6))

    def test_parse_number_trata_vazio_hifen_e_decimais(self):
        self.assertIsNone(self.builder.parse_number(""))
        self.assertIsNone(self.builder.parse_number("-"))
        self.assertEqual(1234.56, self.builder.parse_number("1234,56"))
        self.assertEqual(1500, self.builder.parse_number("1500"))

    def test_cartilha_e_lida_em_portugues(self):
        narrativa = self.builder.load_doc_text(self.builder.DOCX_FILE)
        self.assertIn("cartilha", narrativa["summary"].lower())
        self.assertGreater(len(narrativa["themes"]), 2)
        self.assertIn("Dependência", narrativa["themes"][0])

    def test_bundle_das_duas_cartilhas_tem_comparativo(self):
        narrativa = self.builder.build_cartilha_bundle()
        self.assertEqual(2, len(narrativa["cartilhas"]))
        self.assertIn("implementação", narrativa["cartilhas"][1]["resumo"].lower())
        self.assertGreaterEqual(len(narrativa["comparativo"]["o_que_mudou"]), 3)

    def test_malha_do_ibge_tem_total_de_municipios_esperado(self):
        features, _ = self.builder.read_shapefile(self.builder.BOUNDARY_ZIP)
        self.assertEqual(5573, len(features))

    def test_bolsa_familia_usa_referencia_mais_recente(self):
        bolsa, referencia = self.builder.latest_bolsa_rows()
        self.assertEqual("202602", referencia)
        self.assertEqual(referencia, bolsa["110001"]["referencia_bolsa_familia"])

    def test_normalize_text_do_programa_remove_acentos_e_normaliza(self):
        self.assertEqual(
            "sao jose do rio preto sp",
            self.builder_programa.normalize_text(" São José do Rio Preto (SP) "),
        )

    def test_status_predominante_do_programa_respeita_maioria(self):
        linhas = [
            {"status_viabilidade": "INVIAVEL"},
            {"status_viabilidade": "INVIAVEL"},
            {"status_viabilidade": "CRITICA"},
        ]
        self.assertEqual("INVIAVEL", self.builder_programa.status_predominante(linhas))


class TestContratosDosArtefatos(BaseDashboardTest):
    def test_arquivos_gerados_existem(self):
        self.assertTrue(METADATA_PATH.exists())
        self.assertTrue(LINHAS_PATH.exists())
        self.assertTrue(MAPA_PATH.exists())
        self.assertTrue(CLIMA_PATH.exists())
        self.assertTrue(PROGRAMA_PATH.exists())
        self.assertTrue(LOCAL_SERVER_PATH.exists())
        self.assertTrue(API_TRIBUTOS_PATH.exists())

    def test_metadata_tem_contrato_em_portugues(self):
        self.assertIn("mapa", self.metadata)
        self.assertIn("fontes", self.metadata)
        self.assertIn("narrativa", self.metadata)
        self.assertIn("filtros", self.metadata)
        self.assertIn("qualidade", self.metadata)
        self.assertIn("cartilhas", self.metadata["narrativa"])
        self.assertIn("comparativo", self.metadata["narrativa"])
        self.assertIn("ifdm_capitais", self.metadata)

    def test_fontes_declaradas_no_metadata_existem(self):
        for caminho_relativo in self.metadata["fontes"].values():
            self.assertTrue((ROOT / caminho_relativo).exists(), caminho_relativo)

    def test_metadata_indica_cobertura_geografica_total(self):
        qualidade = self.metadata["qualidade"]
        self.assertEqual(0, qualidade["total_sem_geometria"])
        self.assertEqual(0, qualidade["total_sem_regiao"])
        self.assertEqual(5567, qualidade["municipios_com_geometria"])

    def test_filtros_tem_anos_esperados(self):
        self.assertEqual([2019, 2020, 2021, 2022, 2023, 2024], self.metadata["filtros"]["anos"])

    def test_filtros_tem_regioes_brasileiras_esperadas(self):
        self.assertEqual(
            ["Centro-Oeste", "Nordeste", "Norte", "Sudeste", "Sul"],
            self.metadata["filtros"]["regioes"],
        )

    def test_filtros_tem_status_reais_do_dataset(self):
        self.assertEqual(
            ["OK", "FRAGILIDADE", "CRITICA", "INVIAVEL", "Sem dado"],
            self.metadata["filtros"]["status"],
        )

    def test_linhas_geradas_tem_volume_esperado(self):
        self.assertEqual(33291, len(self.linhas))
        self.assertEqual(self.metadata["qualidade"]["linhas"], len(self.linhas))


class TestIntegridadeDasLinhas(BaseDashboardTest):
    def test_schema_minimo_esta_presente_em_todas_as_linhas(self):
        campos = {
            "codigo_ibge",
            "codigo_ibge6",
            "nome_municipio",
            "uf",
            "regiao",
            "ano",
            "faixa_populacional",
            "status_viabilidade",
            "autonomia_fiscal",
            "pct_dependencia_transf",
            "receita_propria_per_capita",
            "populacao",
            "bolsa_familia_total",
            "referencia_bolsa_familia",
            "ifdm_geral",
            "ifdm_educacao",
            "ifdm_saude",
            "ifdm_emprego_renda",
            "interpretacao",
        }
        for linha in self.linhas[:500]:
            self.assertTrue(campos.issubset(linha.keys()))

    def test_codigo_ibge_tem_sete_digitos(self):
        for linha in self.linhas:
            self.assertRegex(linha["codigo_ibge"], r"^\d{7}$")
            self.assertEqual(linha["codigo_ibge"][:6], linha["codigo_ibge6"])

    def test_chave_municipio_ano_e_unica(self):
        chaves = [(linha["codigo_ibge"], linha["ano"]) for linha in self.linhas]
        self.assertEqual(len(chaves), len(set(chaves)))

    def test_nenhuma_linha_ficou_sem_uf_ou_regiao(self):
        sem_uf = [linha for linha in self.linhas if not linha["uf"]]
        sem_regiao = [linha for linha in self.linhas if not linha["regiao"]]
        self.assertEqual([], sem_uf)
        self.assertEqual([], sem_regiao)

    def test_referencia_bolsa_e_constante_neste_snapshot(self):
        referencias = {linha["referencia_bolsa_familia"] for linha in self.linhas}
        self.assertEqual({"202602"}, referencias)

    def test_contagem_de_status_bate_com_o_dataset(self):
        contagem = Counter(linha["status_viabilidade"] for linha in self.linhas)
        self.assertEqual(82, contagem["OK"])
        self.assertEqual(265, contagem["FRAGILIDADE"])
        self.assertEqual(593, contagem["CRITICA"])
        self.assertEqual(7803, contagem["INVIAVEL"])
        self.assertEqual(24548, contagem["Sem dado"])

    def test_valores_numericos_criticos_nao_sao_negativos(self):
        campos = ["populacao", "bolsa_familia_total", "fpm_valor", "fundeb_valor", "icms_valor", "ipva_valor"]
        for linha in self.linhas:
            for campo in campos:
                valor = linha[campo]
                if valor is not None:
                    self.assertGreaterEqual(valor, 0, (campo, linha["codigo_ibge"], linha["ano"]))

    def test_interpretacao_esta_em_portugues(self):
        amostras = [linha["interpretacao"] for linha in self.linhas if linha["interpretacao"]][:50]
        self.assertTrue(any("Município" in texto or "Dependência" in texto or "atenção" in texto for texto in amostras))


class TestAmostrasReaisDoDataset(BaseDashboardTest):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.indice = {(linha["codigo_ibge"], linha["ano"]): linha for linha in cls.linhas}

    def test_acrelandia_2024_foi_unida_corretamente(self):
        linha = self.indice[("1200013", 2024)]
        self.assertEqual("Acrelândia", linha["nome_municipio"])
        self.assertEqual("AC", linha["uf"])
        self.assertEqual("Norte", linha["regiao"])
        self.assertGreater(linha["bolsa_familia_total"], 0)

    def test_sao_paulo_2024_existe(self):
        linha = self.indice[("3550308", 2024)]
        self.assertEqual("São Paulo", linha["nome_municipio"])
        self.assertEqual("SP", linha["uf"])
        self.assertEqual("Sudeste", linha["regiao"])

    def test_rio_de_janeiro_2024_existe(self):
        linha = self.indice[("3304557", 2024)]
        self.assertEqual("Rio de Janeiro", linha["nome_municipio"])
        self.assertEqual("RJ", linha["uf"])

    def test_ultima_referencia_bolsa_para_sao_paulo_2024_esta_preenchida(self):
        linha = self.indice[("3550308", 2024)]
        self.assertEqual("202602", linha["referencia_bolsa_familia"])


class TestCoerenciaDoMapa(BaseDashboardTest):
    def test_mapa_tem_anos_iguais_ao_metadata(self):
        self.assertEqual(
            {str(ano) for ano in self.metadata["filtros"]["anos"]},
            set(self.mapa.keys()),
        )

    def test_cada_ano_do_mapa_tem_um_path_por_municipio(self):
        for ano, paths in self.mapa.items():
            linhas_ano = [linha for linha in self.linhas if str(linha["ano"]) == ano]
            municipios = {linha["codigo_ibge"] for linha in linhas_ano}
            municipios_mapa = {item["codigo_ibge"] for item in paths}
            self.assertEqual(municipios, municipios_mapa, ano)

    def test_caminhos_svg_tem_formato_valido(self):
        for ano, paths in self.mapa.items():
            for item in paths[:100]:
                self.assertTrue(item["caminho_svg"].startswith("M "))
                self.assertIn(" Z", item["caminho_svg"])
                self.assertRegex(item["codigo_ibge"], r"^\d{7}$")
                self.assertEqual(2, len(item["centroide"]))

    def test_municipios_do_mapa_sao_ordenados_por_codigo(self):
        for _, paths in self.mapa.items():
            codigos = [item["codigo_ibge"] for item in paths]
            self.assertEqual(codigos, sorted(codigos))


class TestFrontendEmPortugues(BaseDashboardTest):
    def test_html_usa_localizacao_pt_br(self):
        self.assertIn('lang="pt-BR"', self.index_html)

    def test_html_nao_tem_rotulos_principais_em_ingles(self):
        proibidos = [
            r">\s*Metric\s*<",
            r">\s*Map explorer\s*<",
            r">\s*Legend\s*<",
            r">\s*Population band\s*<",
            r">\s*Municipality detail\s*<",
            r">\s*Comparison views\s*<",
        ]
        for padrao in proibidos:
            self.assertIsNone(re.search(padrao, self.index_html))

    def test_app_nao_tem_mensagem_de_erro_principal_em_ingles(self):
        self.assertNotIn("Failed to load dashboard data", self.app_js)
        self.assertIn("Falha ao carregar os dados do dashboard", self.app_js)

    def test_frontend_consume_chaves_em_portugues(self):
        termos = [
            "metadata.filtros.anos",
            "linha.codigo_ibge",
            "linha.nome_municipio",
            "linha.faixa_populacional",
            "metadata.qualidade.municipios_com_geometria",
        ]
        for termo in termos:
            self.assertIn(termo, self.app_js)

    def test_index_tem_titulos_centrais_em_portugues(self):
        obrigatorios = [
            "Mapa coroplético municipal do Brasil",
            "Detalhe do município",
            "Distribuição do status de viabilidade no filtro atual",
            "Base de dados",
            "O que entra no cálculo",
            "Como interpretar",
            "Comparação com o filtro atual",
            "Média da métrica por região",
            "Leitura climática por estação e por UF",
            "Variável climática",
            "Mapa climático por UF",
            "Resumo, mudanças e implicações das duas etapas",
            "Programa de reforma municipal",
            "Territórios preliminares propostos",
            "Arquitetura legal e transição",
            "Mapa simulado dos municípios unificados",
            "Capitais no IFDM",
        ]
        for termo in obrigatorios:
            self.assertIn(termo, self.index_html)

    def test_leitura_da_cartilha_saiu_do_sidebar_e_foi_para_o_final(self):
        self.assertNotIn('<p class="section-kicker">Leitura da cartilha</p>', self.index_html)
        self.assertIn('class="panel panel-cartilhas"', self.index_html)
        self.assertIn("cartilha-1-titulo", self.index_html)
        self.assertIn("cartilha-2-titulo", self.index_html)

    def test_app_declara_fontes_e_explicacoes_por_metrica(self):
        termos = [
            "fonte:",
            "criterios:",
            "interpretacao:",
            "explicacoesCampos",
            "renderizarComparacaoDetalhe",
            "renderizarRegioes",
            "renderizarClima",
            "renderizarMapaClimatico",
            "renderizarCartilhas",
            "renderizarProgramaReforma",
            "renderizarMapaUnificadoPrograma",
            "aplicarAcaoControleMapa",
            "habilitarNavegacaoMapa",
            "resetar-mapa",
            "ajuda-indicador",
            "tooltip-ajuda",
        ]
        for termo in termos:
            self.assertIn(termo, self.app_js)

    def test_frontend_tem_controles_em_todos_os_mapas(self):
        self.assertGreaterEqual(self.index_html.count('class="botao-mapa controle-mapa"'), 18)
        self.assertIn("tooltip-clima", self.index_html)

    def test_frontend_tem_tabela_do_cenario_unificado(self):
        self.assertIn("Municípios oficiais no mapa", self.index_html)
        self.assertIn("Municípios com dados no ano", self.index_html)
        self.assertIn("Municípios sem dados no ano", self.index_html)
        self.assertIn("atualizarResumoCoberturaAno", self.app_js)
        self.assertIn("chart-card-programa-mapa", self.index_html)
        self.assertIn("programa-tabela-territorios", self.index_html)
        self.assertIn("programa-tabela-total-brasil", self.index_html)
        self.assertIn("renderizarTabelaMapaUnificado", self.app_js)
        self.assertIn("programa-busca-territorios", self.index_html)
        self.assertIn("programa-pagina-anterior", self.index_html)
        self.assertIn("programa-pagina-proxima", self.index_html)
        self.assertIn("busca-municipio-input", self.index_html)
        self.assertIn("busca-municipio-sugestoes", self.index_html)
        self.assertIn("ajuda-detalhe-montagem", self.index_html)
        self.assertIn("programa-ajuda-perfil", self.index_html)
        self.assertIn("programa-perfil-comparacao", self.index_html)
        self.assertIn("programa-ajuda-agrupamentos", self.index_html)
        self.assertIn("programa-agrupamentos-resumo", self.index_html)
        self.assertIn("programa-agrupamentos", self.index_html)
        self.assertIn("programa-detalhe-territorio", self.index_html)
        self.assertIn("programa-ajuda-detalhe-territorio", self.index_html)
        self.assertIn("programa-detalhe-territorio-kpis", self.index_html)
        self.assertIn("programa-detalhe-municipios", self.index_html)
        self.assertIn("programa-ajuda-tabela-municipios", self.index_html)
        self.assertIn("programa-tabela-municipios-head", self.index_html)
        self.assertIn("programa-tabela-municipios-body", self.index_html)
        self.assertIn("programa-tabela-municipios-foot", self.index_html)
        self.assertIn("Território consolidado", self.app_js)
        self.assertIn("programa-tabela-municipios-tipo", self.app_js)
        self.assertIn("itensPorPaginaTerritoriosPrograma: 15", self.app_js)
        self.assertIn("filtrarTerritoriosMapaUnificado", self.app_js)
        self.assertIn("programa-mapa-grid", self.index_html)
        self.assertIn("programa-ordenar-territorio", self.index_html)
        self.assertIn("programa-ordenar-uf", self.index_html)
        self.assertIn("programa-ordenar-populacao", self.index_html)
        self.assertIn("ordenarTerritoriosMapaUnificado", self.app_js)
        self.assertIn('ordenacaoTerritoriosPrograma: { chave: "nome", direcao: "asc" }', self.app_js)
        self.assertIn("programa-seletor-populacao", self.index_html)
        self.assertIn("programa-seletor-perfil", self.index_html)
        self.assertIn("programaCenarioSelecionadoId", self.app_js)
        self.assertIn("obterCenarioProgramaAtivo", self.app_js)
        self.assertIn("preencherControlesCenarioPrograma", self.app_js)
        self.assertIn("obterPerfilProgramaSelecionado", self.app_js)
        self.assertIn("criarResumoComparacaoPerfil", self.app_js)
        self.assertIn("atualizarAjudaPerfilPrograma", self.app_js)
        self.assertIn("renderizarAgrupamentosPrograma", self.app_js)
        self.assertIn("atualizarAjudaAgrupamentosPrograma", self.app_js)
        self.assertIn("renderizarDetalheTerritorioPrograma", self.app_js)
        self.assertIn("atualizarAjudaDetalheTerritorioPrograma", self.app_js)
        self.assertIn("renderizarTabelaMunicipiosTerritorioPrograma", self.app_js)
        self.assertIn("atualizarAjudaTabelaMunicipiosTerritorioPrograma", self.app_js)
        self.assertIn("obterExplicacoesIndicadoresTerritorio", self.app_js)
        self.assertIn("formatarPercentual", self.app_js)
        self.assertIn("obterConsolidadoTerritorioComTributos", self.app_js)
        self.assertIn("carregarTributosTerritorioPrograma", self.app_js)
        self.assertIn("carregarTributosMunicipaisComCallback", self.app_js)
        self.assertIn("territorioProgramaSelecionadoId", self.app_js)
        self.assertIn("selecionarTerritorioPrograma", self.app_js)
        self.assertIn("reaplicarSelecaoTerritorioPrograma", self.app_js)
        self.assertIn("territoriosFiltradosBase.filter((territorio) => territorio.id === estado.territorioProgramaSelecionadoId)", self.app_js)
        self.assertIn("linha.dataset.territorioId = territorio.id", self.app_js)
        self.assertIn("scrollIntoView", self.app_js)
        self.assertIn("focarTerritorioProgramaNoMapa", self.app_js)
        self.assertIn("ajustarCentroTerritorioPrograma", self.app_js)
        self.assertIn("path.dataset.territorioId = territorio.id", self.app_js)
        self.assertIn("getBBox()", self.app_js)
        self.assertIn("getBoundingClientRect()", self.app_js)
        self.assertIn('grupo.setAttribute("transform", "translate(0 0) scale(1)")', self.app_js)
        self.assertIn("resetarInteracaoPrograma({ manterBusca: true })", self.app_js)
        self.assertIn("resetarInteracaoPrograma()", self.app_js)
        self.assertIn("construirIndiceMunicipios", self.app_js)
        self.assertIn("criarTextoMontagemDetalhe", self.app_js)
        self.assertIn("selecionarMunicipioPrincipal", self.app_js)
        self.assertIn("focarMunicipioNoMapa", self.app_js)
        self.assertIn("renderizarSugestoesMunicipio", self.app_js)
        self.assertIn("buscaMunicipio", self.app_js)
        self.assertIn("prepararTerritoriosPrograma", self.app_js)
        self.assertIn('metrica.tipo === "categorica"', self.app_js)
        self.assertIn('linha[estado.metricaAtual] !== "Sem dado"', self.app_js)
        self.assertIn("timerBuscaTerritoriosPrograma", self.app_js)
        self.assertIn("window.setTimeout", self.app_js)
        self.assertIn("aplicarBuscaTerritoriosPrograma", self.app_js)
        self.assertIn("atualizarInteracaoProgramaSemRecriarMapa", self.app_js)
        self.assertIn("tooltip-programa-lista", self.app_js)
        self.assertIn("Municípios englobados", self.app_js)
        self.assertIn("destacarMunicipiosDoTerritorio", self.app_js)
        self.assertIn("aggregate-highlight", self.app_js)
        self.assertIn("grupo-mapa-programa-overlay", self.app_js)
        self.assertIn("renderizarDestaqueProgramaNoMapaSimulado", self.app_js)
        self.assertIn("programa-overlay-municipio", self.app_js)
        self.assertIn("/api/tributos", self.app_js)
        self.assertIn("cacheTributosMunicipais", self.app_js)
        self.assertIn("Transferências totais agregadas divididas pela receita total bruta agregada.", self.app_js)
        self.assertIn("Média aritmética simples dos percentuais municipais de dependência.", self.app_js)
        self.assertIn("Tributos municipais priorizam a integração oficial com Siconfi/Tesouro", self.app_js)


class TestProgramaReforma(BaseDashboardTest):
    def test_programa_reforma_tem_blocos_essenciais(self):
        self.assertIn("visao_geral", self.programa)
        self.assertIn("territorios_identidade", self.programa)
        self.assertIn("cenarios_amalgama", self.programa)
        self.assertIn("arquitetura_legal", self.programa)
        self.assertIn("lrg_conceitual", self.programa)
        self.assertIn("mapa_unificado", self.programa)
        self.assertIn("perfis_json_path", self.programa["mapa_unificado"])

    def test_programa_reforma_tem_territorios_preliminares(self):
        territorios = self.programa["territorios_identidade"]["territorios"]
        self.assertGreater(len(territorios), 20)
        self.assertTrue(self.programa["territorios_identidade"]["criterio_contiguidade"])
        amostra = territorios[0]
        self.assertIn("id", amostra)
        self.assertIn("uf", amostra)
        self.assertIn("municipios", amostra)
        self.assertIn("populacao_total", amostra)

    def test_mapa_unificado_tem_geometrias_cenario(self):
        mapa = self.programa["mapa_unificado"]
        self.assertIn("territorios", mapa)
        self.assertIn("cenarios", mapa)
        self.assertIn("cenario_padrao_id", mapa)
        self.assertGreater(len(mapa["territorios"]), 20)
        amostra = mapa["territorios"][0]
        self.assertTrue(amostra["caminho_svg"].startswith("M "))
        self.assertIn(" Z", amostra["caminho_svg"])
        self.assertGreaterEqual(amostra["quantidade_municipios"], 1)
        self.assertEqual(len(amostra["centroide"]), 2)
        self.assertIn("receita_total_bruta_total", amostra)
        self.assertIn("transferencias_total", amostra)
        self.assertIn("receita_tributaria_total", amostra)
        self.assertIn("dependencia_media_simples", amostra)
        self.assertIn("autonomia_media_simples", amostra)
        self.assertIn("receita_propria_per_capita_territorial", amostra)
        self.assertIn("iptu_total", amostra)
        self.assertIn("iss_total", amostra)
        self.assertIn("itbi_total", amostra)

    def test_mapa_unificado_expoe_cenarios_parametricos(self):
        mapa = self.programa["mapa_unificado"]
        cenarios = mapa["cenarios"]
        self.assertEqual(12, len(cenarios))
        ids = {cenario["id"] for cenario in cenarios}
        self.assertEqual(len(cenarios), len(ids))
        self.assertIn(mapa["cenario_padrao_id"], ids)
        amostra = cenarios[0]
        self.assertIn("populacao_referencia", amostra)
        self.assertIn("perfil_agregacao", amostra)
        self.assertIn("perfil_rotulo", amostra)
        self.assertIn("perfil_descricao", amostra)
        self.assertIn("perfil_json_path", amostra)
        self.assertIn("perfil_ajuda", amostra)
        self.assertIn("comparacao_vs_equilibrado", amostra)
        self.assertIn("comparacoes_perfis", amostra)
        self.assertIn("territorios_identidade", amostra)
        self.assertIn("territorios", amostra)

    def test_mapa_unificado_tem_populacao_brasil_consistente(self):
        territorios = self.programa["mapa_unificado"]["territorios"]
        total_cenario = sum(item["populacao_total"] for item in territorios)
        total_base = sum(linha["populacao"] for linha in self.linhas if linha["ano"] == self.programa["mapa_unificado"]["ano_referencia"])
        self.assertEqual(total_base, total_cenario)

    def test_consolidado_territorial_tem_indicadores_recalculados(self):
        cenario = next(
            item for item in self.programa["mapa_unificado"]["cenarios"] if item["id"] == self.programa["mapa_unificado"]["cenario_padrao_id"]
        )
        amostra = next(item for item in cenario["territorios"] if item["quantidade_municipios"] > 1)
        self.assertIsNotNone(amostra["dependencia_media"])
        self.assertIsNotNone(amostra["autonomia_media"])
        self.assertIsNotNone(amostra["receita_total_bruta_total"])
        self.assertIsNotNone(amostra["transferencias_total"])
        self.assertGreater(amostra["receita_total_bruta_total"], 0)
        self.assertGreaterEqual(amostra["transferencias_total"], 0)

    def test_todos_os_cenarios_preservam_populacao_total(self):
        total_base = sum(linha["populacao"] for linha in self.linhas if linha["ano"] == self.programa["mapa_unificado"]["ano_referencia"])
        for cenario in self.programa["mapa_unificado"]["cenarios"]:
          total_cenario = sum(item["populacao_total"] for item in cenario["territorios"])
          self.assertEqual(total_base, total_cenario, cenario["id"])

    def test_perfis_programa_tem_jsons_e_comparacoes(self):
        self.assertTrue(PERFIS_INDEX_PATH.exists())
        self.assertTrue(PERFIS_DIR.exists())
        perfis = self.perfis_programa["perfis"]
        self.assertEqual({"equilibrado", "fiscal", "porte"}, {perfil["id"] for perfil in perfis})
        for perfil in perfis:
            arquivo = ROOT / "dashboard" / perfil["json_path"].replace("./data/", "data/")
            self.assertTrue(arquivo.exists(), perfil["id"])
            self.assertIn("criterios_considerados", perfil)
            self.assertIn("ajuda", perfil)
            self.assertIn("ab_resultado", perfil)

    def test_perfis_alternativos_realmente_mudam_territorios(self):
        perfis = {perfil["id"]: perfil for perfil in self.perfis_programa["perfis"]}
        for perfil_id in ("fiscal", "porte"):
            medias = perfis[perfil_id]["ab_resultado"]
            self.assertGreater(medias["municipios_diferentes_media"], 0, perfil_id)
            self.assertGreater(medias["territorios_diferentes_media"], 0, perfil_id)

    def test_cenarios_expoem_comparacoes_contra_todos_os_outros_perfis(self):
        for cenario in self.programa["mapa_unificado"]["cenarios"]:
            comparacoes = cenario["comparacoes_perfis"]
            esperado = {"equilibrado", "fiscal", "porte"} - {cenario["perfil_agregacao"]}
            self.assertEqual(esperado, set(comparacoes.keys()))

    def test_mapa_unificado_tem_mais_de_uma_pagina_de_registros(self):
        territorios = self.programa["mapa_unificado"]["territorios"]
        self.assertGreater(len(territorios), 15)

    def test_busca_por_cidade_encontra_territorio_que_a_contem(self):
        nomes_por_codigo = {
            linha["codigo_ibge"]: linha["nome_municipio"].lower()
            for linha in self.linhas
            if linha["ano"] == self.programa["mapa_unificado"]["ano_referencia"]
        }
        territorios = self.programa["mapa_unificado"]["territorios"]
        alvo = next(
            territorio
            for territorio in territorios
            if any("curitiba" in nomes_por_codigo.get(codigo, "") for codigo in territorio["municipios"])
        )
        self.assertIsNotNone(alvo)

    def test_mapa_unificado_pode_ser_ordenado_por_populacao(self):
        territorios = self.programa["mapa_unificado"]["territorios"]
        ordenados = sorted(territorios, key=lambda item: item["populacao_total"], reverse=True)
        self.assertGreaterEqual(ordenados[0]["populacao_total"], ordenados[1]["populacao_total"])

    def test_territorios_preliminares_formam_componentes_contiguos(self):
        rows_latest, _ = self.builder_programa.build_latest_rows()
        codes_by_uf = {}
        for row in rows_latest:
            codes_by_uf.setdefault(row["uf"], set()).add(row["codigo_ibge"])
        adjacency = self.builder_programa.build_adjacency_map(codes_by_uf)
        territorios = self.programa["territorios_identidade"]["territorios"][:120]
        for territorio in territorios:
            codigos = territorio["municipios"]
            if len(codigos) <= 1:
                continue
            visitados = set()
            fronteira = [codigos[0]]
            conjunto = set(codigos)
            while fronteira:
                atual = fronteira.pop()
                if atual in visitados:
                    continue
                visitados.add(atual)
                fronteira.extend((adjacency.get(atual, set()) & conjunto) - visitados)
            self.assertEqual(conjunto, visitados, territorio["id"])

    def test_cenarios_prioritarios_priorizam_status_conhecido(self):
        prioritarios = self.programa["cenarios_amalgama"]["municipios_prioritarios"][:10]
        self.assertTrue(all(item["status_viabilidade"] != "Sem dado" for item in prioritarios))
        self.assertIn("municipios_com_lacuna_classificatoria", self.programa["cenarios_amalgama"])

    def test_programa_reforma_declara_ifdm_com_status_metodologico(self):
        ifdm = self.programa["visao_geral"]["ifdm"]
        self.assertEqual("integrado", ifdm["status"])
        self.assertIn("firjan", ifdm["observacao"].lower())

    def test_lrg_fica_marcada_como_conceitual(self):
        lrg = self.programa["lrg_conceitual"]
        self.assertEqual("em_analise_pela_equipe", lrg["status"])
        self.assertIn("conceitual", lrg["aviso"].lower())

    def test_ifdm_capitais_foi_integrado_ao_programa(self):
        capitais = self.programa["ifdm_capitais"]
        self.assertGreater(len(capitais), 5)
        self.assertEqual("Curitiba", capitais[0]["nome_municipio"])


class TestClimatologia(BaseDashboardTest):
    def test_arquivo_climatico_gerado_tem_variaveis(self):
        self.assertIn("variaveis", self.clima)
        self.assertIn("precipitacao", self.clima["variaveis"])
        self.assertIn("temperatura_maxima", self.clima["variaveis"])
        self.assertIn("umidade_relativa", self.clima["variaveis"])

    def test_climatologia_tem_ufs_e_ranking(self):
        precip = self.clima["variaveis"]["precipitacao"]
        self.assertIn("SP", precip["ufs"])
        self.assertGreater(len(precip["ranking_estacoes"]), 10)

    def test_temperatura_maxima_tem_valores_anuais_plausiveis(self):
        temp = self.clima["variaveis"]["temperatura_maxima"]
        maiores = [item["valor_anual"] for item in temp["ranking_estacoes"][:20]]
        self.assertTrue(all(15 <= valor <= 45 for valor in maiores))

    def test_climatologia_explica_escopo_por_estacao(self):
        self.assertIn("por estação", self.clima["escopo"])


class TestDocumentacaoEOperacao(BaseDashboardTest):
    def test_package_json_tem_scripts_essenciais(self):
        self.assertIn("build-data", self.package["scripts"])
        self.assertIn("preparar-publicacao", self.package["scripts"])
        self.assertIn("serve", self.package["scripts"])
        self.assertIn("test", self.package["scripts"])
        self.assertIn("serve_dashboard.py", self.package["scripts"]["serve"])

    def test_readme_esta_em_portugues(self):
        self.assertIn("suíte automatizada", self.readme)
        self.assertIn("viabilidade municipal", self.readme)
        self.assertNotIn("This project", self.readme)

    def test_readme_documenta_publicacao(self):
        self.assertIn("Netlify Drop", self.readme)
        self.assertIn("npm run preparar-publicacao", self.readme)

    def test_arquivos_de_deploy_estatico_existem(self):
        self.assertTrue(NETLIFY_PATH.exists())
        self.assertTrue(VERCEL_PATH.exists())
        self.assertIn("rewrites", self.vercel)
        self.assertEqual("/dashboard/:path", self.vercel["rewrites"][1]["destination"])
        self.assertIn('publish = "dist"', self.netlify)

    def test_metadados_declaram_fontes_em_portugues(self):
        self.assertIn("financeiro", self.metadata["fontes"])
        self.assertIn("cartilha", self.metadata["fontes"])
        self.assertIn("cartilha_segunda_etapa", self.metadata["fontes"])
        self.assertIn("ifdm_municipios", self.metadata["fontes"])
        self.assertIn("ifdm_capitais", self.metadata["fontes"])
        self.assertIn("malha_municipal", self.metadata["fontes"])

    def test_builder_nao_inclui_cnes_no_dashboard_v1(self):
        self.assertNotIn("CNES", LINHAS_PATH.read_text(encoding="utf-8"))


class TestConsistenciaTemporalETerritorial(BaseDashboardTest):
    def test_todos_os_municipios_tem_de_uma_a_seis_observacoes(self):
        contagem = Counter(linha["codigo_ibge"] for linha in self.linhas)
        self.assertTrue(all(1 <= quantidade <= 6 for quantidade in contagem.values()))

    def test_ufs_das_linhas_batem_com_o_metadata(self):
        ufs_linhas = sorted({linha["uf"] for linha in self.linhas})
        self.assertEqual(self.metadata["filtros"]["ufs"], ufs_linhas)

    def test_regioes_das_linhas_batem_com_o_metadata(self):
        regioes_linhas = sorted({linha["regiao"] for linha in self.linhas})
        self.assertEqual(self.metadata["filtros"]["regioes"], regioes_linhas)

    def test_todos_os_anos_tem_linhas(self):
        por_ano = defaultdict(int)
        for linha in self.linhas:
            por_ano[linha["ano"]] += 1
        for ano in self.metadata["filtros"]["anos"]:
            self.assertGreater(por_ano[ano], 0)

    def test_nenhum_codigo_do_mapa_fica_sem_linha_correspondente(self):
        codigos_linhas = {linha["codigo_ibge"] for linha in self.linhas}
        for paths in self.mapa.values():
            self.assertTrue(all(item["codigo_ibge"] in codigos_linhas for item in paths))


if __name__ == "__main__":
    unittest.main(verbosity=2)
