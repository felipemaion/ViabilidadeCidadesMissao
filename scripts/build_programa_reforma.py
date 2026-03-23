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
PERFIS_INDEX_PATH = DATA_DIR / "programa_perfis.json"
PERFIS_DIR = DATA_DIR / "programa_perfis"
BUILD_DASHBOARD_PATH = ROOT / "scripts" / "build_dashboard_data.py"

POP_REFERENCIA = 120000
POP_OTIMA_REFERENCIA = 30000
POP_REFERENCIAS_CENARIO = [30000, 60000, 120000, 180000]
PERFIL_EQUIBRADO_BASE = {
    "equilibrado": {
        "rotulo": "Equilibrado",
        "descricao": "Balanceia contiguidade, aproximação ao porte de referência e similaridade sociofiscal sem puxar o agrupamento para um eixo único.",
        "criterios_considerados": [
            "contiguidade física entre municípios",
            "aproximação à população de referência do cenário",
            "similaridade em dependência de transferências e autonomia fiscal",
            "sinal social complementar via IFDM e Bolsa Família",
        ],
        "pesos": {
            "contiguidade": 1.35,
            "meta_populacional": 1.15,
            "preferir_maiores": 0.55,
            "dependencia_alta": 0.35,
            "autonomia_baixa": 0.3,
            "ifdm_baixo": 0.25,
            "bolsa_alta": 0.2,
            "semelhanca_fiscal": 0.85,
            "penalidade_excesso": 1.25,
        },
        "ab_status": "perfil_referencia",
        "json_path": "./data/programa_perfis/equilibrado.json",
    }
}
PERFIS_CANDIDATOS_AB = {
    "fiscal": [
        {
            "candidate_id": "fiscal_a1",
            "rotulo": "Fiscal",
            "descricao": "Favorece a reunião de municípios com maior fragilidade fiscal e dependência de transferências, preservando a contiguidade territorial.",
            "criterios_considerados": [
                "contiguidade física obrigatória",
                "alta dependência de transferências",
                "baixa autonomia fiscal",
                "baixa folga social medida por IFDM",
            ],
            "pesos": {
                "contiguidade": 0.95,
                "meta_populacional": 0.75,
                "preferir_maiores": 0.3,
                "dependencia_alta": 1.85,
                "autonomia_baixa": 1.65,
                "ifdm_baixo": 1.2,
                "bolsa_alta": 0.7,
                "semelhanca_fiscal": 1.6,
                "penalidade_excesso": 0.95,
            },
        },
        {
            "candidate_id": "fiscal_a2",
            "rotulo": "Fiscal",
            "descricao": "Empurra o cenário para blocos com dependência elevada e baixa autonomia, aceitando mais heterogeneidade de porte.",
            "criterios_considerados": [
                "contiguidade física obrigatória",
                "prioridade máxima para dependência e autonomia",
                "meta populacional mais flexível",
                "bolsa família como proxy de pressão social",
            ],
            "pesos": {
                "contiguidade": 0.85,
                "meta_populacional": 0.55,
                "preferir_maiores": 0.15,
                "dependencia_alta": 2.05,
                "autonomia_baixa": 1.9,
                "ifdm_baixo": 1.05,
                "bolsa_alta": 1.0,
                "semelhanca_fiscal": 1.45,
                "penalidade_excesso": 0.7,
            },
        },
        {
            "candidate_id": "fiscal_a3",
            "rotulo": "Fiscal",
            "descricao": "Usa forte alinhamento sociofiscal para unir municípios pequenos mais frágeis, mesmo com aproximação populacional menos rígida.",
            "criterios_considerados": [
                "contiguidade física obrigatória",
                "semelhança fiscal entre municípios do território",
                "baixa autonomia e IFDM mais baixo",
                "porte como critério secundário",
            ],
            "pesos": {
                "contiguidade": 1.05,
                "meta_populacional": 0.65,
                "preferir_maiores": 0.25,
                "dependencia_alta": 1.6,
                "autonomia_baixa": 1.8,
                "ifdm_baixo": 1.35,
                "bolsa_alta": 0.6,
                "semelhanca_fiscal": 1.95,
                "penalidade_excesso": 0.8,
            },
        },
        {
            "candidate_id": "fiscal_a4",
            "rotulo": "Fiscal",
            "descricao": "Combina forte fragilidade fiscal com alguma disciplina de porte para evitar agrupamentos excessivamente irregulares.",
            "criterios_considerados": [
                "contiguidade física obrigatória",
                "alta dependência e baixa autonomia",
                "meta populacional intermediária",
                "penalidade moderada para excesso de população",
            ],
            "pesos": {
                "contiguidade": 1.0,
                "meta_populacional": 0.95,
                "preferir_maiores": 0.35,
                "dependencia_alta": 1.75,
                "autonomia_baixa": 1.55,
                "ifdm_baixo": 0.95,
                "bolsa_alta": 0.5,
                "semelhanca_fiscal": 1.35,
                "penalidade_excesso": 1.1,
            },
        },
    ],
    "porte": [
        {
            "candidate_id": "porte_a1",
            "rotulo": "Porte populacional",
            "descricao": "Tenta atingir o porte de referência mais rapidamente, puxando municípios maiores e reduzindo o peso das semelhanças fiscais.",
            "criterios_considerados": [
                "contiguidade física obrigatória",
                "aproximação forte ao porte de referência",
                "preferência por municípios maiores no frontier",
                "critérios fiscais como desempate secundário",
            ],
            "pesos": {
                "contiguidade": 0.9,
                "meta_populacional": 1.9,
                "preferir_maiores": 1.85,
                "dependencia_alta": 0.25,
                "autonomia_baixa": 0.2,
                "ifdm_baixo": 0.15,
                "bolsa_alta": 0.1,
                "semelhanca_fiscal": 0.25,
                "penalidade_excesso": 0.65,
            },
        },
        {
            "candidate_id": "porte_a2",
            "rotulo": "Porte populacional",
            "descricao": "Força aproximação ao parâmetro populacional com baixa tolerância a excesso, preservando contiguidade e pouca influência fiscal.",
            "criterios_considerados": [
                "contiguidade física obrigatória",
                "meta populacional quase dominante",
                "tamanho dos municípios como acelerador do agrupamento",
                "penalidade elevada para extrapolar demais o alvo",
            ],
            "pesos": {
                "contiguidade": 1.05,
                "meta_populacional": 2.2,
                "preferir_maiores": 1.55,
                "dependencia_alta": 0.1,
                "autonomia_baixa": 0.1,
                "ifdm_baixo": 0.05,
                "bolsa_alta": 0.05,
                "semelhanca_fiscal": 0.15,
                "penalidade_excesso": 1.35,
            },
        },
        {
            "candidate_id": "porte_a3",
            "rotulo": "Porte populacional",
            "descricao": "Busca territórios compactos em população, aceitando maior heterogeneidade sociofiscal se isso ajudar a fechar o alvo demográfico.",
            "criterios_considerados": [
                "contiguidade física obrigatória",
                "forte busca pelo alvo populacional",
                "baixa importância de IFDM e dependência",
                "semelhança fiscal mínima para evitar rupturas extremas",
            ],
            "pesos": {
                "contiguidade": 0.8,
                "meta_populacional": 2.35,
                "preferir_maiores": 1.95,
                "dependencia_alta": 0.15,
                "autonomia_baixa": 0.15,
                "ifdm_baixo": 0.05,
                "bolsa_alta": 0.05,
                "semelhanca_fiscal": 0.1,
                "penalidade_excesso": 0.85,
            },
        },
        {
            "candidate_id": "porte_a4",
            "rotulo": "Porte populacional",
            "descricao": "Equilibra porte forte com um pouco mais de contiguidade e de disciplina de excesso populacional.",
            "criterios_considerados": [
                "contiguidade física obrigatória",
                "meta populacional forte",
                "preferência por municípios maiores",
                "controle moderado de extrapolação do alvo",
            ],
            "pesos": {
                "contiguidade": 1.15,
                "meta_populacional": 1.8,
                "preferir_maiores": 1.4,
                "dependencia_alta": 0.2,
                "autonomia_baixa": 0.2,
                "ifdm_baixo": 0.1,
                "bolsa_alta": 0.1,
                "semelhanca_fiscal": 0.25,
                "penalidade_excesso": 1.15,
            },
        },
    ],
}


def build_model_context(rows):
    xs = [row["centroide"][0] for row in rows if row.get("centroide")]
    ys = [row["centroide"][1] for row in rows if row.get("centroide")]
    return {
        "pop_norm": normalize_series([row.get("populacao") for row in rows]),
        "dep_norm": normalize_series([row.get("pct_dependencia_transf") for row in rows]),
        "aut_norm": normalize_series([row.get("autonomia_fiscal") for row in rows]),
        "ifdm_norm": normalize_series([row.get("ifdm_geral") for row in rows]),
        "bolsa_norm": normalize_series([row.get("bolsa_familia_total") for row in rows]),
        "distance_scale": max(1.0, (max(xs) - min(xs) if xs else 0) + (max(ys) - min(ys) if ys else 0)),
    }


def build_profile_help_text(perfil):
    criterios = "; ".join(perfil.get("criterios_considerados", []))
    pesos = perfil.get("pesos", {})
    pesos_texto = ", ".join(f"{chave.replace('_', ' ')}={valor}" for chave, valor in pesos.items())
    return (
        f"{perfil['rotulo']}. {perfil['descricao']} Critérios considerados: {criterios}. "
        f"Pesos metodológicos atuais: {pesos_texto}."
    )


def resolve_profile_id(perfil):
    return perfil.get("id") or perfil.get("perfil_id") or perfil.get("candidate_id")


def build_membership_map(territorios):
    membership = {}
    for territorio in territorios:
        assinatura = tuple(sorted(territorio["municipios"]))
        for codigo in territorio["municipios"]:
            membership[codigo] = assinatura
    return membership


def compare_territories(base_territorios, comparado_territorios, rows_by_code):
    base_membership = build_membership_map(base_territorios)
    comparado_membership = build_membership_map(comparado_territorios)
    codigos = sorted(set(base_membership) | set(comparado_membership))
    mudancas = []
    for codigo in codigos:
        if base_membership.get(codigo) == comparado_membership.get(codigo):
            continue
        row = rows_by_code.get(codigo, {})
        mudancas.append(
            {
                "codigo_ibge": codigo,
                "nome_municipio": row.get("nome_municipio", codigo),
                "uf": row.get("uf", ""),
            }
        )
    base_sets = {tuple(sorted(territorio["municipios"])) for territorio in base_territorios}
    comparado_sets = {tuple(sorted(territorio["municipios"])) for territorio in comparado_territorios}
    return {
        "municipios_em_territorio_diferente": len(mudancas),
        "territorios_com_composicao_diferente": len(base_sets.symmetric_difference(comparado_sets)),
        "amostra_municipios": mudancas[:12],
    }


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


def pick_best_neighbor(rows_by_code, territory_codes, frontier, perfil, pop_referencia, model_context):
    territory_centroid_x = mean([rows_by_code[code]["centroide"][0] for code in territory_codes]) or 0
    territory_centroid_y = mean([rows_by_code[code]["centroide"][1] for code in territory_codes]) or 0
    territory_population = sum((rows_by_code[code].get("populacao") or 0) for code in territory_codes)
    territory_dependence = mean([rows_by_code[code].get("pct_dependencia_transf") for code in territory_codes]) or 0
    territory_autonomy = mean([rows_by_code[code].get("autonomia_fiscal") for code in territory_codes]) or 0
    pesos = perfil["pesos"]

    def score(code):
        row = rows_by_code[code]
        centroid_x, centroid_y = row["centroide"]
        distance = abs(centroid_x - territory_centroid_x) + abs(centroid_y - territory_centroid_y)
        distance_score = distance / model_context["distance_scale"]
        population = row.get("populacao") or 0
        dependence = row.get("pct_dependencia_transf") or 0
        autonomy = row.get("autonomia_fiscal") or 0
        ifdm = row.get("ifdm_geral") or 0
        bolsa = row.get("bolsa_familia_total") or 0
        projected_population = territory_population + population
        gap_score = abs(projected_population - pop_referencia) / max(pop_referencia, 1)
        overshoot_score = max(0, projected_population - pop_referencia) / max(pop_referencia, 1)
        prefer_large_score = 1 - model_context["pop_norm"](population)
        dependence_score = 1 - model_context["dep_norm"](dependence)
        autonomy_score = model_context["aut_norm"](autonomy)
        ifdm_score = model_context["ifdm_norm"](ifdm)
        bolsa_score = 1 - model_context["bolsa_norm"](bolsa)
        semelhanca_fiscal_score = (
            abs((model_context["dep_norm"](dependence) or 0) - (model_context["dep_norm"](territory_dependence) or 0))
            + abs((model_context["aut_norm"](autonomy) or 0) - (model_context["aut_norm"](territory_autonomy) or 0))
        )
        composed = (
            pesos["contiguidade"] * distance_score
            + pesos["meta_populacional"] * gap_score
            + pesos["preferir_maiores"] * prefer_large_score
            + pesos["dependencia_alta"] * dependence_score
            + pesos["autonomia_baixa"] * autonomy_score
            + pesos["ifdm_baixo"] * ifdm_score
            + pesos["bolsa_alta"] * bolsa_score
            + pesos["semelhanca_fiscal"] * semelhanca_fiscal_score
            + pesos["penalidade_excesso"] * overshoot_score
        )
        return (round(composed, 8), code)

    return min(frontier, key=score)


def build_territories(rows, pop_referencia=POP_REFERENCIA, perfil=None, adjacency=None, model_context=None):
    territorios = []
    rows_by_code = {row["codigo_ibge"]: row for row in rows}
    codes_by_uf = {}
    for row in rows:
        codes_by_uf.setdefault(row["uf"], set()).add(row["codigo_ibge"])
    adjacency = adjacency or build_adjacency_map(codes_by_uf)
    perfil = perfil or PERFIL_EQUIBRADO_BASE["equilibrado"]
    model_context = model_context or build_model_context(rows)

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
                    "receita_total_bruta_total": sum((row.get("receita_total_bruta") or 0) for row in lote),
                    "bolsa_familia_total": sum((row.get("bolsa_familia_total") or 0) for row in lote),
                    "status_predominante": status_predominante(lote),
                    "perfil_agregacao": resolve_profile_id(perfil),
                    "alinhamento_populacional": "acima_da_referencia"
                    if populacao_acumulada > pop_referencia
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

            while frontier and population < pop_referencia:
                next_code = pick_best_neighbor(rows_by_code, territory_codes, frontier, perfil, pop_referencia, model_context)
                territory_codes.append(next_code)
                remaining.remove(next_code)
                population += rows_by_code[next_code].get("populacao") or 0
                frontier.discard(next_code)
                frontier.update((adjacency.get(next_code, set()) & remaining))

            flush(territory_codes)

    return territorios, adjacency


def avaliar_candidato_ab(rows, adjacency, model_context, perfil):
    comparacoes = []
    base_profile = PERFIL_EQUIBRADO_BASE["equilibrado"]
    rows_by_code = {row["codigo_ibge"]: row for row in rows}
    for pop_referencia in POP_REFERENCIAS_CENARIO:
        territorios_base, _ = build_territories(
            rows,
            pop_referencia=pop_referencia,
            perfil=base_profile,
            adjacency=adjacency,
            model_context=model_context,
        )
        territorios_candidato, _ = build_territories(
            rows,
            pop_referencia=pop_referencia,
            perfil=perfil,
            adjacency=adjacency,
            model_context=model_context,
        )
        comparacao = compare_territories(territorios_base, territorios_candidato, rows_by_code)
        comparacao["populacao_referencia"] = pop_referencia
        comparacoes.append(comparacao)
    media_municipios = round(
        sum(item["municipios_em_territorio_diferente"] for item in comparacoes) / len(comparacoes), 2
    )
    media_territorios = round(
        sum(item["territorios_com_composicao_diferente"] for item in comparacoes) / len(comparacoes), 2
    )
    return {
        "candidate_id": perfil["candidate_id"],
        "rotulo": perfil["rotulo"],
        "descricao": perfil["descricao"],
        "criterios_considerados": perfil["criterios_considerados"],
        "pesos": perfil["pesos"],
        "comparacoes": comparacoes,
        "municipios_diferentes_media": media_municipios,
        "territorios_diferentes_media": media_territorios,
    }


def selecionar_perfis_salvos(rows, adjacency, model_context):
    perfis_salvos = {"equilibrado": dict(PERFIL_EQUIBRADO_BASE["equilibrado"])}
    testes_ab = {"quantidade_candidatos_testados": 0, "familias": {}, "melhores_resultados": []}

    for familia, candidatos in PERFIS_CANDIDATOS_AB.items():
        resultados = [avaliar_candidato_ab(rows, adjacency, model_context, candidato) for candidato in candidatos]
        testes_ab["quantidade_candidatos_testados"] += len(resultados)
        melhor = max(
            resultados,
            key=lambda item: (item["municipios_diferentes_media"], item["territorios_diferentes_media"], item["candidate_id"]),
        )
        perfil_salvo = {
            "id": familia,
            "rotulo": melhor["rotulo"],
            "descricao": melhor["descricao"],
            "criterios_considerados": melhor["criterios_considerados"],
            "pesos": melhor["pesos"],
            "ab_status": "selecionado_por_teste_ab",
            "ab_resultado": {
                "candidate_id_origem": melhor["candidate_id"],
                "municipios_diferentes_media": melhor["municipios_diferentes_media"],
                "territorios_diferentes_media": melhor["territorios_diferentes_media"],
                "comparacoes": melhor["comparacoes"],
            },
            "json_path": f"./data/programa_perfis/{familia}.json",
        }
        perfis_salvos[familia] = perfil_salvo
        testes_ab["familias"][familia] = {
            "candidatos_testados": len(resultados),
            "candidate_id_selecionado": melhor["candidate_id"],
            "municipios_diferentes_media": melhor["municipios_diferentes_media"],
            "territorios_diferentes_media": melhor["territorios_diferentes_media"],
        }
        testes_ab["melhores_resultados"].append(
            {
                "perfil": familia,
                "candidate_id": melhor["candidate_id"],
                "municipios_diferentes_media": melhor["municipios_diferentes_media"],
                "territorios_diferentes_media": melhor["territorios_diferentes_media"],
            }
        )

    perfis_salvos["equilibrado"]["id"] = "equilibrado"
    perfis_salvos["equilibrado"]["ab_resultado"] = {
        "comparacoes": [
            {
                "populacao_referencia": pop_referencia,
                "municipios_em_territorio_diferente": 0,
                "territorios_com_composicao_diferente": 0,
                "amostra_municipios": [],
            }
            for pop_referencia in POP_REFERENCIAS_CENARIO
        ]
    }
    return perfis_salvos, testes_ab


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
    codes_by_uf = {}
    for row in rows:
        codes_by_uf.setdefault(row["uf"], set()).add(row["codigo_ibge"])
    adjacency = build_adjacency_map(codes_by_uf)
    model_context = build_model_context(rows)
    perfis_salvos, testes_ab = selecionar_perfis_salvos(rows, adjacency, model_context)
    territorios, adjacency = build_territories(
        rows,
        pop_referencia=POP_REFERENCIA,
        perfil=perfis_salvos["equilibrado"],
        adjacency=adjacency,
        model_context=model_context,
    )
    prioridades, prioridades_com_lacuna = build_priority_rows(rows)
    mapa_unificado = build_unified_map(territorios, rows)
    cenarios = []
    rows_by_code = {row["codigo_ibge"]: row for row in rows}
    for pop_referencia in POP_REFERENCIAS_CENARIO:
        territorios_por_perfil = {}
        for perfil_id, perfil in perfis_salvos.items():
            territorios_cenario, _ = build_territories(
                rows,
                pop_referencia=pop_referencia,
                perfil=perfil,
                adjacency=adjacency,
                model_context=model_context,
            )
            territorios_por_perfil[perfil_id] = {
                "perfil": perfil,
                "territorios_identidade": territorios_cenario,
                "territorios": build_unified_map(territorios_cenario, rows),
            }
        for perfil_id, bundle in territorios_por_perfil.items():
            perfil = bundle["perfil"]
            territorios_cenario = bundle["territorios_identidade"]
            mapa_cenario = bundle["territorios"]
            comparacoes_perfis = {}
            for outro_id, outro_bundle in territorios_por_perfil.items():
                if outro_id == perfil_id:
                    continue
                comparacoes_perfis[outro_id] = compare_territories(
                    territorios_cenario,
                    outro_bundle["territorios_identidade"],
                    rows_by_code,
                )
            cenarios.append(
                {
                    "id": f"cenario-{pop_referencia}-{perfil_id}",
                    "rotulo": f"{format(pop_referencia, ',').replace(',', '.')} hab. · {perfil['rotulo']}",
                    "populacao_referencia": pop_referencia,
                    "perfil_agregacao": perfil_id,
                    "perfil_rotulo": perfil["rotulo"],
                    "perfil_descricao": perfil["descricao"],
                    "perfil_json_path": perfil["json_path"],
                    "perfil_ajuda": build_profile_help_text(perfil),
                    "perfil_criterios_considerados": perfil["criterios_considerados"],
                    "municipios_antes": len(rows),
                    "municipios_depois": len(mapa_cenario),
                    "reducao_absoluta": len(rows) - len(mapa_cenario),
                    "reducao_percentual": round(((len(rows) - len(mapa_cenario)) / len(rows)) * 100, 2) if rows else 0,
                    "comparacao_vs_equilibrado": comparacoes_perfis.get("equilibrado"),
                    "comparacoes_perfis": comparacoes_perfis,
                    "territorios_identidade": territorios_cenario,
                    "territorios": mapa_cenario,
                }
            )
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
            "perfis_json_path": "./data/programa_perfis.json",
            "cenarios_disponiveis": [
                {
                    "id": cenario["id"],
                    "rotulo": cenario["rotulo"],
                    "populacao_referencia": cenario["populacao_referencia"],
                    "perfil_agregacao": cenario["perfil_agregacao"],
                    "perfil_rotulo": cenario["perfil_rotulo"],
                    "perfil_json_path": cenario["perfil_json_path"],
                }
                for cenario in cenarios
            ],
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
            "cenario_padrao_id": "cenario-120000-equilibrado",
            "perfis_json_path": "./data/programa_perfis.json",
            "cenarios": cenarios,
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
    perfis_index = {
        "perfil_padrao_id": "equilibrado",
        "metodologia": (
            "Perfis selecionados após bateria A/B com múltiplos candidatos por família, "
            "medindo municípios e territórios que mudam de composição frente ao perfil equilibrado."
        ),
        "populacoes_referencia": POP_REFERENCIAS_CENARIO,
        "testes_ab": testes_ab,
        "perfis": [],
    }
    for perfil_id, perfil in perfis_salvos.items():
        item = {
            "id": perfil_id,
            "rotulo": perfil["rotulo"],
            "descricao": perfil["descricao"],
            "criterios_considerados": perfil["criterios_considerados"],
            "pesos": perfil["pesos"],
            "ab_status": perfil["ab_status"],
            "ajuda": build_profile_help_text(perfil),
            "json_path": perfil["json_path"],
            "ab_resultado": perfil["ab_resultado"],
        }
        perfis_index["perfis"].append(item)
    return programa, perfis_index


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
                "receita_total_bruta_total": territorio.get("receita_total_bruta_total"),
                "status_predominante": territorio["status_predominante"],
                "municipios": territorio["municipios"],
                "caminho_svg": " ".join(caminhos),
                "centroide": [centroide_x, centroide_y],
            }
        )
    return features




def main():
    programa, perfis_index = build_program()
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(programa, handle, ensure_ascii=False, separators=(",", ":"))
    PERFIS_DIR.mkdir(parents=True, exist_ok=True)
    with PERFIS_INDEX_PATH.open("w", encoding="utf-8") as handle:
        json.dump(perfis_index, handle, ensure_ascii=False, separators=(",", ":"))
    for perfil in perfis_index["perfis"]:
        destino = PERFIS_DIR / f"{perfil['id']}.json"
        with destino.open("w", encoding="utf-8") as handle:
            json.dump(perfil, handle, ensure_ascii=False, separators=(",", ":"))
    print("Programa de reforma gerado.")
    print(f"Territórios preliminares: {len(programa['territorios_identidade']['territorios'])}")
    print(f"Municípios prioritários: {len(programa['cenarios_amalgama']['municipios_prioritarios'])}")


if __name__ == "__main__":
    main()
