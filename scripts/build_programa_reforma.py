#!/usr/bin/env python3

import importlib.util
import json
from collections import Counter
from pathlib import Path
import re
import unicodedata


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "dashboard" / "data"
METADATA_PATH = DATA_DIR / "metadata.json"
LINHAS_PATH = DATA_DIR / "municipality_data.json"
MAPA_PATH = DATA_DIR / "map_paths_by_year.json"
OUTPUT_PATH = DATA_DIR / "programa_reforma.json"
BUILD_DASHBOARD_PATH = ROOT / "scripts" / "build_dashboard_data.py"

POP_REFERENCIA = 120000
POP_OTIMA_REFERENCIA = 30000


def load_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_dashboard_builder():
    spec = importlib.util.spec_from_file_location("build_dashboard_data", BUILD_DASHBOARD_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def mean(values):
    values = [value for value in values if value is not None]
    return sum(values) / len(values) if values else None


def normalize_text(value):
    text = str(value or "").strip()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = re.sub(r"[^a-zA-Z0-9]+", " ", text).strip().lower()
    return re.sub(r"\s+", " ", text)


def status_predominante(rows):
    contagem = Counter(row.get("status_viabilidade") or "Sem dado" for row in rows)
    return contagem.most_common(1)[0][0] if contagem else "Sem dado"


def normalize_series(values):
    filtered = [value for value in values if value is not None]
    if not filtered:
        return lambda _: 0
    minimo = min(filtered)
    maximo = max(filtered)
    if minimo == maximo:
        return lambda _: 0.5
    return lambda value: 0 if value is None else (value - minimo) / (maximo - minimo)


def build_latest_rows():
    linhas = load_json(LINHAS_PATH)
    mapa = load_json(MAPA_PATH)
    ano = str(max(int(key) for key in mapa))
    latest_rows = [row for row in linhas if str(row["ano"]) == ano]
    centroids = {item["codigo_ibge"]: item["centroide"] for item in mapa[ano]}
    paths = {item["codigo_ibge"]: item["caminho_svg"] for item in mapa[ano]}
    for row in latest_rows:
        row["centroide"] = centroids.get(row["codigo_ibge"], [0, 0])
        row["caminho_svg"] = paths.get(row["codigo_ibge"], "")
    return latest_rows, int(ano)


def quantize_point(point):
    return (round(point[0], 6), round(point[1], 6))


def normalize_edge(a, b):
    edge = (quantize_point(a), quantize_point(b))
    return edge if edge[0] <= edge[1] else (edge[1], edge[0])


def build_adjacency_map(codes_by_uf=None):
    builder = load_dashboard_builder()
    features, _ = builder.read_shapefile(builder.BOUNDARY_ZIP)
    if codes_by_uf is None:
      codes_by_uf = {}
    allowed_codes = set().union(*codes_by_uf.values()) if codes_by_uf else None
    features = [feature for feature in features if allowed_codes is None or feature["codigo_ibge"] in allowed_codes]

    edge_index = {}
    for feature in features:
        code = feature["codigo_ibge"]
        if codes_by_uf and code not in codes_by_uf.get(feature["uf"], set()):
            continue
        for ring in feature["rings"]:
            for idx in range(len(ring) - 1):
                edge = normalize_edge(ring[idx], ring[idx + 1])
                edge_index.setdefault(edge, []).append(code)

    adjacency = {feature["codigo_ibge"]: set() for feature in features}
    for members in edge_index.values():
        unique_members = sorted(set(members))
        if len(unique_members) < 2:
            continue
        for code in unique_members:
            adjacency.setdefault(code, set()).update(other for other in unique_members if other != code)
    return adjacency


def pick_seed(rows_by_code, remaining):
    return min(
        remaining,
        key=lambda code: (
            rows_by_code[code]["centroide"][0],
            rows_by_code[code]["centroide"][1],
            rows_by_code[code].get("populacao") or 0,
            code,
        ),
    )


def pick_best_neighbor(rows_by_code, territory_codes, frontier):
    territory_centroid_x = mean([rows_by_code[code]["centroide"][0] for code in territory_codes]) or 0
    territory_centroid_y = mean([rows_by_code[code]["centroide"][1] for code in territory_codes]) or 0

    def score(code):
        row = rows_by_code[code]
        centroid_x, centroid_y = row["centroide"]
        distance = abs(centroid_x - territory_centroid_x) + abs(centroid_y - territory_centroid_y)
        population = row.get("populacao") or 0
        dependence = -(row.get("pct_dependencia_transf") or 0)
        return (distance, population, dependence, code)

    return min(frontier, key=score)


def build_territories(rows):
    territorios = []
    rows_by_code = {row["codigo_ibge"]: row for row in rows}
    codes_by_uf = {}
    for row in rows:
        codes_by_uf.setdefault(row["uf"], set()).add(row["codigo_ibge"])
    adjacency = build_adjacency_map(codes_by_uf)

    for uf in sorted({row["uf"] for row in rows}):
        remaining = set(codes_by_uf.get(uf, set()))
        indice = 1

        def flush(lote_codigos):
            nonlocal indice
            lote = [rows_by_code[codigo] for codigo in lote_codigos]
            populacao_acumulada = sum((row.get("populacao") or 0) for row in lote)
            territorios.append(
                {
                    "id": f"TERR-{uf}-{indice:02d}",
                    "nome": f"Território preliminar {indice} - {uf}",
                    "uf": uf,
                    "municipios": [row["codigo_ibge"] for row in lote],
                    "quantidade_municipios": len(lote),
                    "populacao_total": sum((row.get("populacao") or 0) for row in lote),
                    "autonomia_media": round(mean([row.get("autonomia_fiscal") for row in lote]) or 0, 3),
                    "dependencia_media": round(mean([row.get("pct_dependencia_transf") for row in lote]) or 0, 3),
                    "ifdm_medio": round(mean([row.get("ifdm_geral") for row in lote]) or 0, 3),
                    "bolsa_familia_total": sum((row.get("bolsa_familia_total") or 0) for row in lote),
                    "status_predominante": status_predominante(lote),
                    "alinhamento_populacional": "acima_da_referencia"
                    if populacao_acumulada > POP_REFERENCIA
                    else "dentro_da_referencia",
                }
            )
            indice += 1

        while remaining:
            seed = pick_seed(rows_by_code, remaining)
            territory_codes = [seed]
            remaining.remove(seed)
            population = rows_by_code[seed].get("populacao") or 0
            frontier = set(adjacency.get(seed, set())) & remaining

            while frontier and population < POP_REFERENCIA:
                next_code = pick_best_neighbor(rows_by_code, territory_codes, frontier)
                territory_codes.append(next_code)
                remaining.remove(next_code)
                population += rows_by_code[next_code].get("populacao") or 0
                frontier.discard(next_code)
                frontier.update((adjacency.get(next_code, set()) & remaining))

            flush(territory_codes)

    return territorios, adjacency


def build_priority_rows(rows):
    pop_norm = normalize_series([row.get("populacao") for row in rows])
    dep_norm = normalize_series([row.get("pct_dependencia_transf") for row in rows])
    aut_norm = normalize_series([row.get("autonomia_fiscal") for row in rows])
    bolsa_norm = normalize_series([row.get("bolsa_familia_total") for row in rows])

    prioridades = []
    prioridades_com_lacuna = []
    for row in rows:
        status = row.get("status_viabilidade") or "Sem dado"
        score = (
            (1 - pop_norm(row.get("populacao"))) * 0.30
            + dep_norm(row.get("pct_dependencia_transf")) * 0.35
            + (1 - aut_norm(row.get("autonomia_fiscal"))) * 0.25
            + bolsa_norm(row.get("bolsa_familia_total")) * 0.10
        )
        item = {
            "codigo_ibge": row["codigo_ibge"],
            "nome_municipio": row["nome_municipio"],
            "uf": row["uf"],
            "populacao": row.get("populacao"),
            "autonomia_fiscal": row.get("autonomia_fiscal"),
            "pct_dependencia_transf": row.get("pct_dependencia_transf"),
            "status_viabilidade": status,
            "ifdm_geral": row.get("ifdm_geral"),
            "score_prioridade": round(score, 4),
        }
        if normalize_text(status) == "sem dado":
            prioridades_com_lacuna.append(item)
        else:
            prioridades.append(item)
    prioridades.sort(key=lambda item: item["score_prioridade"], reverse=True)
    prioridades_com_lacuna.sort(key=lambda item: item["score_prioridade"], reverse=True)
    return prioridades[:30], prioridades_com_lacuna[:15]


def build_program():
    rows, ano = build_latest_rows()
    metadata = load_json(METADATA_PATH)
    territorios, adjacency = build_territories(rows)
    prioridades, prioridades_com_lacuna = build_priority_rows(rows)
    mapa_unificado = build_unified_map(territorios, rows)
    capitais_ifdm = metadata.get("ifdm_capitais", [])

    programa = {
        "visao_geral": {
            "ano_referencia": ano,
            "mensagem_programatica": (
                "Esta camada do site apresenta uma proposta político-programática de reforma municipal, "
                "distinta da camada puramente diagnóstica. Os blocos abaixo organizam território, "
                "modelagem, transição e arquitetura legal em um mesmo sistema de leitura."
            ),
            "eixos": [
                "Territórios de identidade e amálgamas municipais preliminares",
                "Modelagem analítica com clusterização e infraestrutura para econometria espacial",
                "Arquitetura constitucional, legal e transitória da reforma",
                "Plano de crescimento, integração territorial e avaliação recorrente",
            ],
            "ifdm": {
                "status": "integrado",
                "observacao": (
                    "O IFDM municipal foi integrado a partir do ranking oficial da FIRJAN para o ano-base 2023. "
                    "A leitura continua dependente de curadoria metodológica para pesos e uso normativo."
                ),
            },
        },
        "territorios_identidade": {
            "metodologia": [
                "Agrupamento preliminar por UF com crescimento territorial apenas por municípios fisicamente contíguos.",
                "Uso de população, autonomia fiscal, dependência de transferências e Bolsa Família para síntese do território.",
                "Modelo exploratório e revisável, adequado para discussão programática inicial e não para decisão final.",
            ],
            "parametro_populacional_referencia": POP_REFERENCIA,
            "parametro_populacional_otimo": POP_OTIMA_REFERENCIA,
            "criterio_contiguidade": True,
            "territorios": territorios,
        },
        "mapa_unificado": {
            "ano_referencia": ano,
            "escopo": (
                "Mapa simulado e não oficial. Cada shape representa um território preliminar resultante "
                "da agregação visual dos municípios que compõem o cenário programático inicial."
            ),
            "municipios_antes": len(rows),
            "municipios_depois": len(mapa_unificado),
            "reducao_absoluta": len(rows) - len(mapa_unificado),
            "reducao_percentual": round(((len(rows) - len(mapa_unificado)) / len(rows)) * 100, 2) if rows else 0,
            "territorios": mapa_unificado,
        },
        "cenarios_amalgama": {
            "descricao": (
                "Os cenários preliminares usam o parâmetro de 120 mil habitantes como referência flexível "
                "para agregação e priorizam municípios pequenos, dependentes e com menor autonomia."
            ),
            "observacao_metodologica": (
                "A lista principal prioriza municípios com status de viabilidade conhecido. Casos com "
                "lacuna classificatória permanecem em uma lista separada para revisão e saneamento."
            ),
            "parametro_populacional_referencia": POP_REFERENCIA,
            "parametro_editavel": True,
            "municipios_prioritarios": prioridades,
            "municipios_com_lacuna_classificatoria": prioridades_com_lacuna,
        },
        "arquitetura_legal": {
            "aviso": (
                "A camada jurídica deve distinguir rigorosamente norma vigente, proposta do projeto e "
                "conteúdo ainda sujeito à verificação oficial antes de publicação definitiva."
            ),
            "eixos": [
                {
                    "titulo": "PEC e ADCT para fusão e extinção de municípios",
                    "status": "proposta_programatica",
                    "verificacao_oficial": "pendente_curadoria_juridica",
                },
                {
                    "titulo": "Projeto de Lei em linha temática com o PLC 98/2002",
                    "status": "proposta_programatica",
                    "verificacao_oficial": "pendente_curadoria_juridica",
                },
                {
                    "titulo": "Novos parâmetros na LRF para desempenho municipal e disciplina do gasto",
                    "status": "proposta_programatica",
                    "verificacao_oficial": "pendente_curadoria_juridica",
                },
                {
                    "titulo": "Lei Complementar de Diretrizes Orçamentárias federativas",
                    "status": "proposta_programatica",
                    "verificacao_oficial": "pendente_curadoria_juridica",
                },
            ],
        },
        "lrg_conceitual": {
            "status": "em_analise_pela_equipe",
            "aviso": (
                "A LRG aparece no site apenas como proposta conceitual em análise pela equipe. "
                "Não corresponde a texto legal consolidado nem a anteprojeto validado."
            ),
            "principios_sugeridos": [
                "Premiação por excelência de gestão com base em indicadores verificáveis.",
                "Critérios de governança, execução orçamentária e qualidade do gasto.",
                "Regras de transição para municípios fundidos ou extintos.",
                "Vinculação gradual entre incentivos fiscais e desempenho administrativo.",
            ],
        },
        "ifdm_capitais": capitais_ifdm[:12],
    }
    return programa


def build_unified_map(territorios, rows):
    rows_by_code = {row["codigo_ibge"]: row for row in rows}
    features = []
    for territorio in territorios:
        membros = [rows_by_code[codigo] for codigo in territorio["municipios"] if codigo in rows_by_code]
        caminhos = [membro.get("caminho_svg", "") for membro in membros if membro.get("caminho_svg")]
        centroides = [membro.get("centroide", [0, 0]) for membro in membros if membro.get("centroide")]
        if not caminhos or not centroides:
            continue
        centroide_x = round(sum(item[0] for item in centroides) / len(centroides), 2)
        centroide_y = round(sum(item[1] for item in centroides) / len(centroides), 2)
        features.append(
            {
                "id": territorio["id"],
                "nome": territorio["nome"],
                "uf": territorio["uf"],
                "quantidade_municipios": territorio["quantidade_municipios"],
                "populacao_total": territorio["populacao_total"],
                "autonomia_media": territorio["autonomia_media"],
                "dependencia_media": territorio["dependencia_media"],
                "ifdm_medio": territorio.get("ifdm_medio"),
                "status_predominante": territorio["status_predominante"],
                "municipios": territorio["municipios"],
                "caminho_svg": " ".join(caminhos),
                "centroide": [centroide_x, centroide_y],
            }
        )
    return features




def main():
    programa = build_program()
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(programa, handle, ensure_ascii=False, separators=(",", ":"))
    print("Programa de reforma gerado.")
    print(f"Territórios preliminares: {len(programa['territorios_identidade']['territorios'])}")
    print(f"Municípios prioritários: {len(programa['cenarios_amalgama']['municipios_prioritarios'])}")


if __name__ == "__main__":
    main()
