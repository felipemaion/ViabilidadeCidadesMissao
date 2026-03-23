import io
import json
import importlib.util
import unittest
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
LOCAL_SERVER_PATH = ROOT / "scripts" / "serve_dashboard.py"


def carregar_servidor_local():
    spec = importlib.util.spec_from_file_location("serve_dashboard", LOCAL_SERVER_PATH)
    modulo = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(modulo)
    return modulo


class TestServidorLocal(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.servidor_local = carregar_servidor_local()

    def test_sum_by_prefix_soma_apenas_itens_validos(self):
        itens = [
            {"conta_contabil": "621200000", "natureza_receita": "11125001", "valor": "10"},
            {"conta_contabil": "621200000", "natureza_receita": "11125099", "valor": 5},
            {"conta_contabil": "999999999", "natureza_receita": "11125000", "valor": 50},
            {"conta_contabil": "621200000", "natureza_receita": "11125300", "valor": 100},
        ]
        self.assertEqual(15.0, self.servidor_local.sum_by_prefix(itens, "111250"))

    def test_fetch_tributos_monta_payload_com_somas_esperadas(self):
        payload = {
            "items": [
                {"conta_contabil": "621200000", "natureza_receita": "11125001", "valor": "100.5"},
                {"conta_contabil": "621200000", "natureza_receita": "11125301", "valor": "25"},
                {"conta_contabil": "621200000", "natureza_receita": "11145101", "valor": "50"},
            ]
        }

        class FakeResponse(io.BytesIO):
            def __enter__(self):
                return self

            def __exit__(self, exc_type, exc, tb):
                return False

        self.servidor_local.fetch_tributos.cache_clear()
        with patch.object(
            self.servidor_local.urllib.request,
            "urlopen",
            return_value=FakeResponse(json.dumps(payload).encode("utf-8")),
        ):
            tributos = self.servidor_local.fetch_tributos("3550308", "2024")

        self.assertEqual("3550308", tributos["codigo_ibge"])
        self.assertEqual(2024, tributos["ano"])
        self.assertEqual(100.5, tributos["iptu"])
        self.assertEqual(25.0, tributos["itbi"])
        self.assertEqual(50.0, tributos["iss"])
        self.assertEqual(175.5, tributos["receita_tributaria_municipal"])

    def test_handle_tributos_rejeita_parametros_invalidos(self):
        chamadas = []

        class FakeHandler:
            def send_json(self, status, payload):
                chamadas.append((status, payload))

        self.servidor_local.DashboardHandler.handle_tributos(FakeHandler(), "codigo_ibge=12&ano=20")
        self.assertEqual(400, chamadas[0][0])
        self.assertIn("Parâmetros inválidos", chamadas[0][1]["erro"])

    def test_handle_tributos_retorna_502_em_falha_de_rede(self):
        chamadas = []

        class FakeHandler:
            def send_json(self, status, payload):
                chamadas.append((status, payload))

        with patch.object(
            self.servidor_local,
            "fetch_tributos",
            side_effect=self.servidor_local.urllib.error.URLError("sem rede"),
        ):
            self.servidor_local.DashboardHandler.handle_tributos(FakeHandler(), "codigo_ibge=3550308&ano=2024")

        self.assertEqual(502, chamadas[0][0])
        self.assertIn("Falha ao consultar a API oficial do Siconfi.", chamadas[0][1]["erro"])
