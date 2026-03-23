import importlib.util
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROGRAM_SCRIPT_PATH = ROOT / "scripts" / "build_programa_reforma.py"


def carregar_builder_programa():
    spec = importlib.util.spec_from_file_location("build_programa_reforma", PROGRAM_SCRIPT_PATH)
    modulo = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(modulo)
    return modulo


class TestBuildProgramaReformaUnit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.builder_programa = carregar_builder_programa()

    def test_normalize_text_remove_acentos_e_simbolos(self):
        self.assertEqual(
            "sao jose do rio preto sp",
            self.builder_programa.normalize_text(" São José do Rio Preto (SP) "),
        )

    def test_status_predominante_respeita_maioria(self):
        linhas = [
            {"status_viabilidade": "INVIAVEL"},
            {"status_viabilidade": "INVIAVEL"},
            {"status_viabilidade": "CRITICA"},
        ]
        self.assertEqual("INVIAVEL", self.builder_programa.status_predominante(linhas))

    def test_build_priority_rows_prioriza_status_conhecido_e_ordena(self):
        rows = [
            {
                "codigo_ibge": "1000001",
                "nome_municipio": "A",
                "uf": "AC",
                "populacao": 1000,
                "autonomia_fiscal": 2.0,
                "pct_dependencia_transf": 80.0,
                "bolsa_familia_total": 300,
                "status_viabilidade": "INVIAVEL",
                "ifdm_geral": 0.4,
            },
            {
                "codigo_ibge": "1000002",
                "nome_municipio": "B",
                "uf": "AC",
                "populacao": 10000,
                "autonomia_fiscal": 20.0,
                "pct_dependencia_transf": 20.0,
                "bolsa_familia_total": 20,
                "status_viabilidade": "OK",
                "ifdm_geral": 0.8,
            },
            {
                "codigo_ibge": "1000003",
                "nome_municipio": "C",
                "uf": "AC",
                "populacao": 5000,
                "autonomia_fiscal": 5.0,
                "pct_dependencia_transf": 50.0,
                "bolsa_familia_total": 100,
                "status_viabilidade": "Sem dado",
                "ifdm_geral": 0.6,
            },
        ]
        prioritarios, com_lacuna = self.builder_programa.build_priority_rows(rows)
        self.assertEqual("A", prioritarios[0]["nome_municipio"])
        self.assertTrue(all(item["status_viabilidade"] != "Sem dado" for item in prioritarios))
        self.assertEqual("C", com_lacuna[0]["nome_municipio"])

    def test_build_unified_map_preserva_campos_essenciais(self):
        territorios = [
            {
                "id": "TERR-AC-01",
                "nome": "Território preliminar 1 - AC",
                "uf": "AC",
                "quantidade_municipios": 2,
                "populacao_total": 3000,
                "autonomia_media": 4.5,
                "dependencia_media": 60.0,
                "ifdm_medio": 0.55,
                "receita_total_bruta_total": 123.0,
                "status_predominante": "INVIAVEL",
                "municipios": ["1000001", "1000002"],
            }
        ]
        rows = [
            {"codigo_ibge": "1000001", "caminho_svg": "M 0 0 Z", "centroide": [10, 20]},
            {"codigo_ibge": "1000002", "caminho_svg": "M 1 1 Z", "centroide": [30, 40]},
        ]
        resultado = self.builder_programa.build_unified_map(territorios, rows)
        self.assertEqual(1, len(resultado))
        item = resultado[0]
        self.assertEqual("TERR-AC-01", item["id"])
        self.assertEqual([20.0, 30.0], item["centroide"])
        self.assertEqual("M 0 0 Z M 1 1 Z", item["caminho_svg"])

    def test_constantes_de_cenarios_expoem_grade_esperada(self):
        self.assertEqual([30000, 60000, 120000, 180000], self.builder_programa.POP_REFERENCIAS_CENARIO)
        self.assertEqual({"equilibrado"}, set(self.builder_programa.PERFIL_EQUIBRADO_BASE.keys()))
        self.assertEqual({"fiscal", "porte"}, set(self.builder_programa.PERFIS_CANDIDATOS_AB.keys()))

    def test_compare_territories_detecta_municipios_e_territorios_diferentes(self):
        rows_by_code = {
            "1": {"codigo_ibge": "1", "nome_municipio": "A", "uf": "AC"},
            "2": {"codigo_ibge": "2", "nome_municipio": "B", "uf": "AC"},
            "3": {"codigo_ibge": "3", "nome_municipio": "C", "uf": "AC"},
        }
        base = [
            {"municipios": ["1", "2"]},
            {"municipios": ["3"]},
        ]
        comparado = [
            {"municipios": ["1"]},
            {"municipios": ["2", "3"]},
        ]
        resultado = self.builder_programa.compare_territories(base, comparado, rows_by_code)
        self.assertEqual(3, resultado["municipios_em_territorio_diferente"])
        self.assertGreater(resultado["territorios_com_composicao_diferente"], 0)
        self.assertEqual("A", resultado["amostra_municipios"][0]["nome_municipio"])

    def test_aggregate_territory_metrics_recalcula_dependencia_por_agregado(self):
        rows = [
            {
                "populacao": 1000,
                "pct_dependencia_transf": 50.0,
                "autonomia_fiscal": 10.0,
                "receita_total_bruta": 100.0,
                "transferencias_total": 50.0,
                "receita_sem_transferencias_principais": 50.0,
                "receita_tributaria_mun": 20.0,
                "ifdm_geral": 0.4,
            },
            {
                "populacao": 120000,
                "pct_dependencia_transf": 20.0,
                "autonomia_fiscal": 40.0,
                "receita_total_bruta": 1000.0,
                "transferencias_total": 200.0,
                "receita_sem_transferencias_principais": 800.0,
                "receita_tributaria_mun": 350.0,
                "ifdm_geral": 0.8,
            },
        ]
        agregado = self.builder_programa.aggregate_territory_metrics(rows)
        self.assertAlmostEqual(250.0 / 1100.0 * 100, agregado["dependencia_media"], places=3)
        self.assertAlmostEqual(850.0 / 1100.0 * 100, agregado["autonomia_media"], places=3)
        self.assertEqual(35.0, agregado["dependencia_media_simples"])
