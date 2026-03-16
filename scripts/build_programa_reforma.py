#!/usr/bin/env python3

import json
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "dashboard" / "data"
LINHAS_PATH = DATA_DIR / "municipality_data.json"
MAPA_PATH = DATA_DIR / "map_paths_by_year.json"
OUTPUT_PATH = DATA_DIR / "programa_reforma.json"

POP_REFERENCIA = 120000
POP_OTIMA_REFERENCIA = 30000


def load_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def mean(values):
    values = [value for value in values if value is not None]
    return sum(values) / len(values) if values else None


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
    for row in latest_rows:
        row["centroide"] = centroids.get(row["codigo_ibge"], [0, 0])
    return latest_rows, int(ano)


def build_territories(rows):
    territorios = []
    for uf in sorted({row["uf"] for row in rows}):
        rows_uf = [row for row in rows if row["uf"] == uf]
        rows_uf.sort(key=lambda row: (row["centroide"][0], row["centroide"][1], row["codigo_ibge"]))

        lote = []
        populacao_acumulada = 0
        indice = 1

        def flush():
            nonlocal lote, populacao_acumulada, indice
            if not lote:
                return
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
                    "bolsa_familia_total": sum((row.get("bolsa_familia_total") or 0) for row in lote),
                    "status_predominante": status_predominante(lote),
                    "alinhamento_populacional": "acima_da_referencia"
                    if populacao_acumulada > POP_REFERENCIA
                    else "dentro_da_referencia",
                }
            )
            lote = []
            populacao_acumulada = 0
            indice += 1

        for row in rows_uf:
            pop = row.get("populacao") or 0
            if lote and populacao_acumulada >= POP_REFERENCIA:
                flush()
            lote.append(row)
            populacao_acumulada += pop

        flush()

    return territorios


def build_priority_rows(rows):
    pop_norm = normalize_series([row.get("populacao") for row in rows])
    dep_norm = normalize_series([row.get("pct_dependencia_transf") for row in rows])
    aut_norm = normalize_series([row.get("autonomia_fiscal") for row in rows])
    bolsa_norm = normalize_series([row.get("bolsa_familia_total") for row in rows])

    prioridades = []
    for row in rows:
        score = (
            (1 - pop_norm(row.get("populacao"))) * 0.30
            + dep_norm(row.get("pct_dependencia_transf")) * 0.35
            + (1 - aut_norm(row.get("autonomia_fiscal"))) * 0.25
            + bolsa_norm(row.get("bolsa_familia_total")) * 0.10
        )
        prioridades.append(
            {
                "codigo_ibge": row["codigo_ibge"],
                "nome_municipio": row["nome_municipio"],
                "uf": row["uf"],
                "populacao": row.get("populacao"),
                "autonomia_fiscal": row.get("autonomia_fiscal"),
                "pct_dependencia_transf": row.get("pct_dependencia_transf"),
                "status_viabilidade": row.get("status_viabilidade"),
                "score_prioridade": round(score, 4),
            }
        )
    prioridades.sort(key=lambda item: item["score_prioridade"], reverse=True)
    return prioridades[:30]


def build_program():
    rows, ano = build_latest_rows()
    territorios = build_territories(rows)
    prioridades = build_priority_rows(rows)

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
                "status": "pendente_integracao_verificada",
                "observacao": (
                    "O IFDM foi definido como base metodológica desejada, mas sua integração no painel "
                    "só deve ocorrer após validação documental e ingestão verificada da série oficial."
                ),
            },
        },
        "territorios_identidade": {
            "metodologia": [
                "Agrupamento preliminar por UF com ordenação espacial a partir dos centroides do mapa municipal.",
                "Uso de população, autonomia fiscal, dependência de transferências e Bolsa Família para síntese do território.",
                "Modelo exploratório e revisável, adequado para discussão programática inicial e não para decisão final.",
            ],
            "parametro_populacional_referencia": POP_REFERENCIA,
            "parametro_populacional_otimo": POP_OTIMA_REFERENCIA,
            "territorios": territorios,
        },
        "cenarios_amalgama": {
            "descricao": (
                "Os cenários preliminares usam o parâmetro de 120 mil habitantes como referência flexível "
                "para agregação e priorizam municípios pequenos, dependentes e com menor autonomia."
            ),
            "parametro_populacional_referencia": POP_REFERENCIA,
            "parametro_editavel": True,
            "municipios_prioritarios": prioridades,
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
    }
    return programa


def main():
    programa = build_program()
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(programa, handle, ensure_ascii=False, separators=(",", ":"))
    print("Programa de reforma gerado.")
    print(f"Territórios preliminares: {len(programa['territorios_identidade']['territorios'])}")
    print(f"Municípios prioritários: {len(programa['cenarios_amalgama']['municipios_prioritarios'])}")


if __name__ == "__main__":
    main()
