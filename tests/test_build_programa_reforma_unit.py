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
