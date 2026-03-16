#!/usr/bin/env python3

import json
import urllib.error
import urllib.parse
import urllib.request
from functools import lru_cache
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DASHBOARD_DIR = ROOT / "dashboard"
HOST = "0.0.0.0"
PORT = 4173
BASE_URL = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt//msc_orcamentaria"
LIMIT = 10000


def sum_by_prefix(items, prefix):
    total = 0.0
    for item in items:
        natureza = str(item.get("natureza_receita") or "")
        if item.get("conta_contabil") != "621200000" or not natureza.startswith(prefix):
            continue
        total += float(item.get("valor") or 0)
    return round(total, 2)


@lru_cache(maxsize=2048)
def fetch_tributos(codigo_ibge, ano):
    query = urllib.parse.urlencode(
        {
            "id_ente": codigo_ibge,
            "an_referencia": ano,
            "me_referencia": 12,
            "co_tipo_matriz": "MSCE",
            "classe_conta": 6,
            "id_tv": "period_change",
            "limit": LIMIT,
        }
    )
    url = f"{BASE_URL}?{query}"
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    items = payload.get("items", [])
    iptu = sum_by_prefix(items, "111250")
    itbi = sum_by_prefix(items, "111253")
    iss = sum_by_prefix(items, "111451")
    return {
        "codigo_ibge": codigo_ibge,
        "ano": int(ano),
        "fonte": "API oficial Siconfi/Tesouro",
        "referencia": f"{ano}-12",
        "iptu": iptu,
        "itbi": itbi,
        "iss": iss,
        "receita_tributaria_municipal": round(iptu + itbi + iss, 2),
    }


class DashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DASHBOARD_DIR), **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/tributos":
            self.handle_tributos(parsed.query)
            return
        super().do_GET()

    def handle_tributos(self, query):
        params = urllib.parse.parse_qs(query)
        codigo_ibge = "".join(ch for ch in params.get("codigo_ibge", [""])[0] if ch.isdigit())
        ano = "".join(ch for ch in params.get("ano", [""])[0] if ch.isdigit())
        if len(codigo_ibge) != 7 or len(ano) != 4:
            self.send_json(400, {"erro": "Parâmetros inválidos. Use codigo_ibge com 7 dígitos e ano com 4 dígitos."})
            return
        try:
            payload = fetch_tributos(codigo_ibge, ano)
        except urllib.error.URLError as error:
            self.send_json(502, {"erro": "Falha ao consultar a API oficial do Siconfi.", "detalhe": str(error.reason)})
            return
        except Exception as error:  # pragma: no cover
            self.send_json(502, {"erro": "Falha ao consultar a API oficial do Siconfi.", "detalhe": str(error)})
            return
        self.send_json(200, payload)

    def send_json(self, status, payload):
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(encoded)


def main():
    server = ThreadingHTTPServer((HOST, PORT), DashboardHandler)
    print(f"Serving dashboard at http://localhost:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
