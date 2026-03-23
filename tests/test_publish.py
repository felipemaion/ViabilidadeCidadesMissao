import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
PREPARE_SCRIPT_PATH = ROOT / "scripts" / "prepare_static_publish.py"


def carregar_preparador_publicacao():
    spec = importlib.util.spec_from_file_location("prepare_static_publish", PREPARE_SCRIPT_PATH)
    modulo = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(modulo)
    return modulo


class TestPublicacaoEstatica(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.preparador_publicacao = carregar_preparador_publicacao()

    def test_preparador_publicacao_copia_arquivos_e_nojekyll(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            origem = tmp_path / "dashboard"
            destino = tmp_path / "dist"
            origem.mkdir()
            (origem / "index.html").write_text("<html></html>", encoding="utf-8")
            (origem / "styles.css").write_text("body {}", encoding="utf-8")

            with patch.object(self.preparador_publicacao, "SOURCE_DIR", origem), patch.object(
                self.preparador_publicacao, "DIST_DIR", destino
            ):
                self.preparador_publicacao.main()

            self.assertTrue((destino / "index.html").exists())
            self.assertTrue((destino / "styles.css").exists())
            self.assertTrue((destino / ".nojekyll").exists())
