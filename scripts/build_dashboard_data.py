#!/usr/bin/env python3

import csv
import json
import math
import re
import struct
import sys
import unicodedata
import zipfile
from collections import Counter
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "dashboard" / "data"
RAW_DIR = ROOT / "data" / "raw"
SOURCE_DIR = ROOT / "data" / "fontes"
BOUNDARY_ZIP = RAW_DIR / "BR_Municipios_2024.zip"

FINANCE_XLSX = SOURCE_DIR / "07.03_indicadores_base_completa_20260217.xlsx"
ENRICHED_CSV = SOURCE_DIR / "municipios_enriquecidos6.csv"
BOLSA_CSV = SOURCE_DIR / "beneficios_bolsa_familia.csv"
DOCX_FILE_ETAPA_1 = SOURCE_DIR / "Cartilha - Redução dos Municípios.docx"
DOCX_FILE_ETAPA_2 = SOURCE_DIR / "Cartilha de Redução de Municípios - Segunda Etapa.docx"
DOCX_FILE = DOCX_FILE_ETAPA_1
DOCX_FILE_2 = DOCX_FILE_ETAPA_2
IFDM_XLSX = SOURCE_DIR / "Ranking-IFDM-2025-ano-base-2023.xlsx"
IFDM_CAPITAIS_XLSX = SOURCE_DIR / "Ranking-IFDM-Capitais-2025-ano-base-2023.xlsx"
CLIMATE_PREC_XLSX = SOURCE_DIR / "Normal-Climatologica-PREC.xlsx"
CLIMATE_TMAX_XLSX = SOURCE_DIR / "Normal-Climatologica-TMAX.xlsx"
CLIMATE_UR_XLSX = SOURCE_DIR / "Normal-Climatologica-URHORA.xlsx"

MAP_WIDTH = 980
MAP_HEIGHT = 1100
MAP_PADDING = 24
SIMPLIFY_TOLERANCE = 0.01
MAX_DOC_CHARS = 2000

NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

SELECTED_FIELDS = [
    "cod_ibge",
    "nome_municipio",
    "uf",
    "populacao",
    "exercicio",
    "faixa_populacional",
    "receita_total_bruta",
    "receita_corrente_bruta",
    "receita_total_liquida",
    "receita_corrente_liquida",
    "Federal",
    "Estadual",
    "Municipal",
    "Outras",
    "Outras_corrente",
    "receita_sem_transf_federal_estadual",
    "pct_federal_bruta",
    "pct_estadual_bruta",
    "pct_municipal_bruta",
    "pct_outras_bruta",
    "autonomia_fiscal",
    "pct_dependencia_transf",
    "receita_propria_per_capita",
    "status_viabilidade",
    "status_viabilidade_lrf",
    "status_autonomia",
    "dependencia_federal",
    "dependencia_estadual",
    "capacidade_investimento",
    "margem_orcamentaria",
    "transferencias_total",
    "IPTU",
    "ISS",
    "ITBI",
    "receita_tributaria_mun",
    "pct_tributaria_bruta",
    "pct_receita_tributaria",
    "despesa_pessoal",
    "despesa_custeio",
    "despesa_investimento",
    "despesa_total",
    "razao_pessoal_propria",
    "razao_pessoal_lrf",
    "fpm_valor",
    "fundeb_valor",
    "sus_valor",
    "icms_valor",
    "ipva_valor",
    "fpm_pct_bruta",
    "fundeb_pct_bruta",
    "sus_pct_bruta",
    "icms_pct_bruta",
    "ipva_pct_bruta",
    "pessoal_per_capita",
    "tem_rgf",
    "aviso_indicadores",
]

NUMERIC_FIELDS = {
    "populacao",
    "autonomia_fiscal",
    "pct_dependencia_transf",
    "receita_propria_per_capita",
    "receita_total_bruta",
    "receita_corrente_bruta",
    "receita_total_liquida",
    "receita_corrente_liquida",
    "Federal",
    "Estadual",
    "Municipal",
    "Outras",
    "Outras_corrente",
    "receita_sem_transf_federal_estadual",
    "pct_federal_bruta",
    "pct_estadual_bruta",
    "pct_municipal_bruta",
    "pct_outras_bruta",
    "dependencia_federal",
    "dependencia_estadual",
    "capacidade_investimento",
    "margem_orcamentaria",
    "transferencias_total",
    "IPTU",
    "ISS",
    "ITBI",
    "receita_tributaria_mun",
    "pct_tributaria_bruta",
    "pct_receita_tributaria",
    "despesa_pessoal",
    "despesa_custeio",
    "despesa_investimento",
    "despesa_total",
    "razao_pessoal_propria",
    "razao_pessoal_lrf",
    "fpm_valor",
    "fundeb_valor",
    "sus_valor",
    "icms_valor",
    "ipva_valor",
    "fpm_pct_bruta",
    "fundeb_pct_bruta",
    "sus_pct_bruta",
    "icms_pct_bruta",
    "ipva_pct_bruta",
    "pessoal_per_capita",
}

STATUS_ORDER = ["OK", "FRAGILIDADE", "CRITICA", "INVIAVEL", "Sem dado"]


def excel_col_to_index(ref):
    match = re.match(r"([A-Z]+)", ref)
    if not match:
        return -1
    value = 0
    for char in match.group(1):
        value = value * 26 + ord(char) - 64
    return value - 1


def load_shared_strings(archive):
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    values = []
    for item in root.findall("a:si", NS):
        pieces = [node.text or "" for node in item.iterfind(".//a:t", NS)]
        values.append("".join(pieces))
    return values


def first_sheet_path(archive):
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    rel_map = {node.attrib["Id"]: node.attrib["Target"] for node in relationships}
    sheet = workbook.find("a:sheets/a:sheet", NS)
    rel_id = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
    return "xl/" + rel_map[rel_id]


def sheet_path_by_name(archive, sheet_name):
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    rel_map = {node.attrib["Id"]: node.attrib["Target"] for node in relationships}
    for sheet in workbook.findall("a:sheets/a:sheet", NS):
        if sheet.attrib.get("name") == sheet_name:
            rel_id = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
            return "xl/" + rel_map[rel_id]
    raise KeyError(f"Sheet not found: {sheet_name}")


def xlsx_rows(path):
    with zipfile.ZipFile(path) as archive:
        shared_strings = load_shared_strings(archive)
        sheet_path = first_sheet_path(archive)
        context = ET.iterparse(archive.open(sheet_path), events=("end",))
        headers = None
        for _, elem in context:
            if elem.tag != "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row":
                continue
            row_map = {}
            for cell in elem.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"):
                ref = cell.attrib.get("r", "")
                idx = excel_col_to_index(ref)
                if idx < 0:
                    continue
                value = ""
                cell_type = cell.attrib.get("t")
                if cell_type == "inlineStr":
                    text_node = cell.find(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                    value = text_node.text if text_node is not None else ""
                else:
                    value_node = cell.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
                    if value_node is None:
                        continue
                    value = value_node.text or ""
                    if cell_type == "s":
                        index = int(value)
                        value = shared_strings[index] if index < len(shared_strings) else value
                row_map[idx] = value
            if headers is None:
                if not row_map:
                    continue
                max_idx = max(row_map)
                headers = [row_map.get(idx, "").strip() for idx in range(max_idx + 1)]
            else:
                yield [row_map.get(idx, "") for idx in range(len(headers))], headers
            elem.clear()


def xlsx_rows_sheet(path, sheet_name):
    with zipfile.ZipFile(path) as archive:
        shared_strings = load_shared_strings(archive)
        sheet_path = sheet_path_by_name(archive, sheet_name)
        context = ET.iterparse(archive.open(sheet_path), events=("end",))
        headers = None
        for _, elem in context:
            if elem.tag != "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row":
                continue
            row_map = {}
            for cell in elem.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"):
                ref = cell.attrib.get("r", "")
                idx = excel_col_to_index(ref)
                if idx < 0:
                    continue
                value = ""
                cell_type = cell.attrib.get("t")
                if cell_type == "inlineStr":
                    text_node = cell.find(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                    value = text_node.text if text_node is not None else ""
                else:
                    value_node = cell.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
                    if value_node is None:
                        continue
                    value = value_node.text or ""
                    if cell_type == "s":
                        index = int(value)
                        value = shared_strings[index] if index < len(shared_strings) else value
                row_map[idx] = value
            if headers is None:
                if not row_map:
                    continue
                max_idx = max(row_map)
                headers = [row_map.get(idx, "").strip() for idx in range(max_idx + 1)]
            else:
                yield [row_map.get(idx, "") for idx in range(len(headers))], headers
            elem.clear()


def raw_xlsx_rows(path):
    with zipfile.ZipFile(path) as archive:
        shared_strings = load_shared_strings(archive)
        sheet_path = first_sheet_path(archive)
        context = ET.iterparse(archive.open(sheet_path), events=("end",))
        for _, elem in context:
            if elem.tag != "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row":
                continue
            row_map = {}
            for cell in elem.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"):
                ref = cell.attrib.get("r", "")
                col = re.match(r"([A-Z]+)", ref)
                if not col:
                    continue
                value = ""
                cell_type = cell.attrib.get("t")
                if cell_type == "inlineStr":
                    text_node = cell.find(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                    value = text_node.text if text_node is not None else ""
                else:
                    value_node = cell.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
                    if value_node is None:
                        continue
                    value = value_node.text or ""
                    if cell_type == "s":
                        index = int(value)
                        value = shared_strings[index] if index < len(shared_strings) else value
                row_map[col.group(1)] = value
            if row_map:
                yield row_map
            elem.clear()


def extract_doc_plain_text(path):
    with zipfile.ZipFile(path) as archive:
        xml = archive.read("word/document.xml").decode("utf-8", errors="ignore")
    text = re.sub(r"<[^>]+>", " ", xml)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def crop_excerpt(text):
    excerpt = text[:MAX_DOC_CHARS].strip()
    if len(text) > MAX_DOC_CHARS:
        excerpt += "..."
    return excerpt


def load_doc_text(path):
    text = extract_doc_plain_text(path)
    summary = (
        "A cartilha enquadra o debate sobre redução de municípios a partir da dependência fiscal, "
        "da autonomia arrecadatória, da capacidade administrativa e da concentração de cidades muito pequenas."
    )
    return {
        "summary": summary,
        "excerpt": crop_excerpt(text),
        "themes": [
            "Dependência de transferências federais e estaduais",
            "Autonomia fiscal e capacidade de investimento",
            "Pressão de pequenos municípios sobre a estrutura federativa",
        ],
    }


def build_cartilha_bundle():
    cartilha_1 = extract_doc_plain_text(DOCX_FILE_ETAPA_1)
    cartilha_2 = extract_doc_plain_text(DOCX_FILE_ETAPA_2)

    primeira = {
        "id": "primeira_etapa",
        "titulo": "Cartilha 1: diagnóstico da redução de municípios",
        "arquivo": str(DOCX_FILE_ETAPA_1.relative_to(ROOT)),
        "resumo": (
            "A primeira cartilha estrutura o diagnóstico do problema. Ela enfatiza dependência de "
            "transferências, baixa autonomia arrecadatória, pressão de municípios muito pequenos sobre "
            "o pacto federativo e necessidade de reorganização territorial."
        ),
        "foco": "Diagnóstico fiscal, histórico e federativo",
        "temas": [
            "Dependência de transferências federais e estaduais",
            "Autonomia fiscal e capacidade de investimento",
            "Pressão de municípios muito pequenos sobre a estrutura federativa",
            "Histórico de expansão municipal e distorções do desenho territorial",
        ],
        "trecho": crop_excerpt(cartilha_1),
    }

    segunda = {
        "id": "segunda_etapa",
        "titulo": "Cartilha 2: segunda etapa e plano de implementação",
        "arquivo": str(DOCX_FILE_ETAPA_2.relative_to(ROOT)),
        "resumo": (
            "A segunda cartilha avança do diagnóstico para implementação. Ela adiciona critérios "
            "socioeconômicos, base jurídica para fusão/extinção, reorganização territorial, gestão de "
            "risco climático e referências internacionais para orientar decisão pública."
        ),
        "foco": "Critérios de decisão, base jurídica e plano de ação",
        "temas": [
            "Indicadores socioeconômicos para priorização territorial",
            "Parecer jurídico sobre fusão, incorporação e extinção",
            "Consórcios de gestão de risco climático e reorganização regional",
            "Plano de integração territorial e experiências internacionais",
        ],
        "trecho": crop_excerpt(cartilha_2),
        "novidades": [
            "Uso explícito de indicadores socioeconômicos como homicídios, SAEB, IDEB, IDH-M e pluviometria para apoiar decisão.",
            "Parecer jurídico sobre fusão, incorporação e extinção de municípios com base em doutrina, jurisprudência e arcabouço legal.",
            "Introdução de consórcios de gestão de risco climático e reorganização territorial como estratégia complementar.",
            "Plano de integração regional e referências internacionais para desenhar implementação.",
        ],
    }

    comparativo = {
        "resumo_geral": (
            "As duas cartilhas formam uma narrativa em duas etapas: a primeira explica por que o sistema "
            "municipal atual gera fragilidades; a segunda adiciona critérios operacionais, jurídicos e "
            "territoriais para transformar esse diagnóstico em plano de ação."
        ),
        "o_que_mudou": [
            "A análise sai do diagnóstico fiscal e passa a incluir critérios de decisão socioeconômicos.",
            "O debate deixa de ser apenas descritivo e ganha uma frente jurídica e institucional.",
            "A climatologia passa a aparecer como insumo territorial, não apenas como contexto.",
            "A segunda etapa aproxima o problema de um plano de implementação regionalizado.",
        ],
        "implementado_no_dashboard": [
            "Seção climática destacada, tratada com cautela metodológica por ser uma base por estação e não por município.",
            "Painéis comparativos e insights automáticos para apoiar leitura territorial além da métrica isolada.",
            "Explicitação da origem de cada indicador, de sua base de dados e do que entra na leitura.",
            "Novo bloco final com resumo comparativo das duas cartilhas, mudanças conceituais e desdobramentos práticos.",
        ],
        "criterios_territoriais": [
            "Dependência fiscal e autonomia arrecadatória permanecem o núcleo do diagnóstico.",
            "Porte populacional e composição das transferências ajudam a diferenciar fragilidade estrutural de escala.",
            "Indicadores sociais e de integração regional entram como filtros de priorização e desenho de política pública.",
            "Clima e risco territorial devem orientar cooperação regional e consórcios, não leitura municipal artificial.",
        ],
    }

    return {
        "summary": comparativo["resumo_geral"],
        "excerpt": segunda["trecho"],
        "themes": segunda["temas"],
        "cartilhas": [primeira, segunda],
        "comparativo": comparativo,
    }


def clean_string(value):
    return str(value).strip() if value is not None else ""


def normalize_label(value):
    text = clean_string(value)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = re.sub(r"[^a-zA-Z0-9]+", " ", text).strip().lower()
    return re.sub(r"\s+", " ", text)


def parse_number(value):
    text = clean_string(value)
    if not text or text == "-":
        return None
    text = text.replace(".", "") if text.count(",") == 1 and text.count(".") > 1 else text
    text = text.replace(",", ".")
    try:
        number = float(text)
    except ValueError:
        return None
    if number.is_integer():
        return int(number)
    return number


def normalize_code(value, digits=7):
    text = re.sub(r"\D", "", clean_string(value))
    return text.zfill(digits) if text else ""


def load_finance_rows():
    records = []
    years = set()
    for values, headers in xlsx_rows(FINANCE_XLSX):
        row = {headers[idx]: values[idx] if idx < len(values) else "" for idx in range(len(headers))}
        code = normalize_code(row.get("cod_ibge"), digits=7)
        if len(code) != 7:
            continue
        municipality_name = clean_string(row.get("nome_municipio"))
        if not municipality_name or municipality_name.lower() == "união":
            continue
        record = {
            "codigo_ibge": code,
            "codigo_ibge6": code[:6],
            "nome_municipio": municipality_name,
            "uf": clean_string(row.get("uf")),
            "ano": int(parse_number(row.get("exercicio")) or 0),
            "faixa_populacional": clean_string(row.get("faixa_populacional")),
        }
        for field in SELECTED_FIELDS:
            if field not in row or field in {"cod_ibge", "nome_municipio", "uf", "exercicio", "faixa_populacional"}:
                continue
            if field in NUMERIC_FIELDS:
                record[field] = parse_number(row.get(field))
            else:
                record[field] = clean_string(row.get(field))
        years.add(record["ano"])
        records.append(record)
    return records, sorted(years)


def load_enriched_rows():
    enriched = {}
    with ENRICHED_CSV.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            code = normalize_code(row.get("id_municipio"), digits=7)
            if len(code) != 7:
                continue
            enriched[code] = {
                "regiao": clean_string(row.get("regiao_nome")),
                "uf": clean_string(row.get("uf_sigla")),
                "populacao_fonte": parse_number(row.get("populacao")),
                "alfabetizacao": parse_number(row.get("alfabetizacao")),
                "renda_media_10_mais": parse_number(row.get("renda_media_a_partir_dos_10_anos")),
                "renda_media_15_mais": parse_number(row.get("renda_media_a_partir_dos_15_anos")),
                "mortalidade_infantil": parse_number(row.get("mortalidade_infantil")),
                "pib_aproximado": parse_number(row.get("pib")),
                "proporcao_mulheres_trabalho_formal": parse_number(row.get("proporcao_mulheres_trabalhos_formais")),
                "nome_municipio_fonte": clean_string(row.get("nome_municipio")),
            }
    return enriched


def load_ifdm_rows(name_index):
    ifdm = {}
    for row in raw_xlsx_rows(IFDM_XLSX):
        ranking = clean_string(row.get("A"))
        if not ranking.isdigit():
            continue
        uf = clean_string(row.get("D"))
        municipality_name = clean_string(row.get("E"))
        key = (uf, normalize_label(municipality_name))
        code = name_index.get(key)
        if not code:
            continue
        ifdm[code] = {
            "ifdm_geral": parse_number(row.get("F")),
            "ifdm_educacao": parse_number(row.get("G")),
            "ifdm_saude": parse_number(row.get("H")),
            "ifdm_emprego_renda": parse_number(row.get("I")),
            "ifdm_ranking_nacional": parse_number(row.get("A")),
            "ifdm_ranking_estadual": parse_number(row.get("B")),
            "ifdm_ano_base": 2023,
        }
    return ifdm


def load_ifdm_capitals():
    capitals = []
    for row in raw_xlsx_rows(IFDM_CAPITAIS_XLSX):
        ranking_2023 = parse_number(row.get("C"))
        uf = clean_string(row.get("D"))
        municipality_name = clean_string(row.get("E"))
        if not uf or not municipality_name:
            continue
        if ranking_2023 is None:
            continue
        capitals.append(
            {
                "uf": uf,
                "nome_municipio": municipality_name,
                "ranking_2023": ranking_2023,
                "ifdm_geral_2023": parse_number(row.get("G")),
                "variacao_pct": parse_number(row.get("H")),
                "ifdm_emprego_renda_2023": parse_number(row.get("J")),
                "ifdm_educacao_2023": parse_number(row.get("M")),
                "ifdm_saude_2023": parse_number(row.get("P")),
                "ano_base": 2023,
            }
        )
    capitals = [item for item in capitals if item["ranking_2023"] is not None]
    capitals.sort(key=lambda item: item["ranking_2023"])
    return capitals


def latest_bolsa_rows():
    latest_month = ""
    buffered = []
    with BOLSA_CSV.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            month = clean_string(row.get("anomes_s"))
            if month > latest_month:
                latest_month = month
                buffered = [row]
            elif month == latest_month:
                buffered.append(row)
    bolsa = {}
    for row in buffered:
        code6 = normalize_code(row.get("codigo_ibge"), digits=6)
        bolsa[code6] = {
            "bolsa_familia_total": parse_number(row.get("qtd_ben_bf")) or 0,
            "referencia_bolsa_familia": latest_month,
            "detalhamento_beneficios": {
                key: parse_number(value) or 0
                for key, value in row.items()
                if key.startswith("qtd_ben_")
            },
        }
    return bolsa, latest_month


def dbf_records(handle):
    header = handle.read(32)
    if len(header) != 32:
        raise ValueError("Invalid DBF header.")
    _, _, _, _, num_records, header_length, record_length = struct.unpack("<BBBBIHH20x", header)
    fields = []
    while True:
        first = handle.read(1)
        if not first or first[0] == 0x0D:
            break
        descriptor = first + handle.read(31)
        name = descriptor[:11].split(b"\x00", 1)[0].decode("latin1").strip()
        field_type = chr(descriptor[11])
        field_length = descriptor[16]
        decimal_count = descriptor[17]
        fields.append((name, field_type, field_length, decimal_count))
    for _ in range(num_records):
        record = handle.read(record_length)
        if not record or record[0] == 0x2A:
            continue
        offset = 1
        parsed = {}
        for name, field_type, field_length, decimal_count in fields:
            raw = record[offset : offset + field_length]
            offset += field_length
            text = raw.decode("latin1", errors="ignore").strip()
            if field_type in {"N", "F"}:
                if text == "":
                    parsed[name] = None
                elif decimal_count == 0:
                    parsed[name] = int(float(text))
                else:
                    parsed[name] = float(text)
            else:
                parsed[name] = text
        yield parsed


def simplify_points(points, tolerance):
    if len(points) <= 2:
        return points[:]

    def perpendicular_distance(point, start, end):
        if start == end:
            return math.hypot(point[0] - start[0], point[1] - start[1])
        x0, y0 = point
        x1, y1 = start
        x2, y2 = end
        numerator = abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1)
        denominator = math.hypot(y2 - y1, x2 - x1)
        return numerator / denominator

    def recursive(segment):
        start = segment[0]
        end = segment[-1]
        max_distance = 0.0
        index = 0
        for idx in range(1, len(segment) - 1):
            distance = perpendicular_distance(segment[idx], start, end)
            if distance > max_distance:
                max_distance = distance
                index = idx
        if max_distance > tolerance:
            left = recursive(segment[: index + 1])
            right = recursive(segment[index:])
            return left[:-1] + right
        return [start, end]

    return recursive(points)


def simplify_ring(ring, tolerance):
    if len(ring) < 4:
        return ring
    open_ring = ring[:-1] if ring[0] == ring[-1] else ring[:]
    simplified = simplify_points(open_ring, tolerance)
    if len(simplified) < 3:
        simplified = open_ring[:3]
    simplified.append(simplified[0])
    return simplified


def mercator(point):
    lon, lat = point
    lat = max(min(lat, 89.5), -89.5)
    x = math.radians(lon)
    y = math.log(math.tan(math.pi / 4.0 + math.radians(lat) / 2.0))
    return x, y


def read_shapefile(zip_path):
    with zipfile.ZipFile(zip_path) as archive:
        shp_name = next(name for name in archive.namelist() if name.lower().endswith(".shp"))
        dbf_name = next(name for name in archive.namelist() if name.lower().endswith(".dbf"))
        with archive.open(dbf_name) as dbf_handle:
            attributes = list(dbf_records(dbf_handle))
        features = []
        projected_bounds = [float("inf"), float("inf"), float("-inf"), float("-inf")]
        with archive.open(shp_name) as shp_handle:
            shp_handle.read(100)
            for record_index, attrs in enumerate(attributes, start=1):
                header = shp_handle.read(8)
                if not header:
                    break
                _, content_length_words = struct.unpack(">2i", header)
                content = shp_handle.read(content_length_words * 2)
                shape_type = struct.unpack("<i", content[:4])[0]
                if shape_type == 0:
                    continue
                if shape_type != 5:
                    raise ValueError(f"Unsupported shape type: {shape_type}")
                _, _, _, _, num_parts, num_points = struct.unpack("<4d2i", content[4:44])
                parts = struct.unpack(f"<{num_parts}i", content[44 : 44 + num_parts * 4])
                points_offset = 44 + num_parts * 4
                raw_points = [
                    struct.unpack("<2d", content[points_offset + idx * 16 : points_offset + (idx + 1) * 16])
                    for idx in range(num_points)
                ]
                rings = []
                for part_index, start in enumerate(parts):
                    end = parts[part_index + 1] if part_index + 1 < len(parts) else len(raw_points)
                    ring = raw_points[start:end]
                    if not ring:
                        continue
                    if ring[0] != ring[-1]:
                        ring = ring + [ring[0]]
                    simplified = simplify_ring(ring, SIMPLIFY_TOLERANCE)
                    rings.append(simplified)
                    for point in simplified:
                        x, y = mercator(point)
                        projected_bounds[0] = min(projected_bounds[0], x)
                        projected_bounds[1] = min(projected_bounds[1], y)
                        projected_bounds[2] = max(projected_bounds[2], x)
                        projected_bounds[3] = max(projected_bounds[3], y)
                if not rings:
                    continue
                code = normalize_code(attrs.get("CD_MUN"), digits=7)
                features.append(
                    {
                        "codigo_ibge": code,
                        "nome_municipio": clean_string(attrs.get("NM_MUN")),
                        "uf": clean_string(attrs.get("SIGLA_UF")),
                        "rings": rings,
                        "indice_registro": record_index,
                    }
                )
    return features, projected_bounds


def feature_to_path(feature, bounds):
    min_x, min_y, max_x, max_y = bounds
    scale_x = (MAP_WIDTH - MAP_PADDING * 2) / (max_x - min_x)
    scale_y = (MAP_HEIGHT - MAP_PADDING * 2) / (max_y - min_y)
    scale = min(scale_x, scale_y)
    offset_x = MAP_PADDING + (MAP_WIDTH - MAP_PADDING * 2 - (max_x - min_x) * scale) / 2
    offset_y = MAP_PADDING + (MAP_HEIGHT - MAP_PADDING * 2 - (max_y - min_y) * scale) / 2
    pieces = []
    centroid_source = None
    for ring in feature["rings"]:
        if len(ring) < 4:
            continue
        projected = []
        for lon, lat in ring:
            x, y = mercator((lon, lat))
            px = offset_x + (x - min_x) * scale
            py = offset_y + (max_y - y) * scale
            projected.append((px, py))
        if not centroid_source:
            centroid_source = projected
        pieces.append("M " + " L ".join(f"{x:.2f},{y:.2f}" for x, y in projected) + " Z")
    if not pieces:
        return None
    centroid_x = sum(point[0] for point in centroid_source[:-1]) / max(1, len(centroid_source) - 1)
    centroid_y = sum(point[1] for point in centroid_source[:-1]) / max(1, len(centroid_source) - 1)
    return {
        "codigo_ibge": feature["codigo_ibge"],
        "nome_municipio": feature["nome_municipio"],
        "uf": feature["uf"],
        "caminho_svg": " ".join(pieces),
        "centroide": [round(centroid_x, 2), round(centroid_y, 2)],
    }


def build_interpretation(row):
    status = row.get("status_viabilidade") or "Sem dado"
    autonomy = row.get("autonomia_fiscal")
    dependence = row.get("pct_dependencia_transf")
    if status == "OK" and autonomy is not None and autonomy >= 10:
        return "Maior autonomia relativa, com quadro mais favoravel para sustentar servicos locais."
    if dependence is not None and dependence >= 85:
        return "Dependência muito alta de transferências, em linha com a preocupação central da cartilha."
    if status and status not in {"", "OK"}:
        return "Indicadores sugerem atenção fiscal e menor margem para investimento e autonomia."
    return "Município com sinais mistos entre arrecadação própria, dependência e capacidade de investimento."


def parse_climate_value(value):
    parsed = parse_number(value)
    return float(parsed) if parsed is not None else None


def aggregate_climate(variable_key, unit, stations, ranking_order):
    by_uf = {}
    for station in stations:
        uf = station["uf"]
        group = by_uf.setdefault(
            uf,
            {"estacoes": 0, "soma_anual": 0.0, "contagem_anual": 0, "mensal": {month: [] for month in station["mensal"]}},
        )
        group["estacoes"] += 1
        if station["anual"] is not None:
            group["soma_anual"] += station["anual"]
            group["contagem_anual"] += 1
        for month, value in station["mensal"].items():
            if value is not None:
                group["mensal"][month].append(value)

    ufs = {}
    all_months = {month: [] for month in stations[0]["mensal"]} if stations else {}
    all_annual = []
    for uf, group in by_uf.items():
        monthly = {
            month: round(sum(values) / len(values), 2) if values else None
            for month, values in group["mensal"].items()
        }
        for month, value in monthly.items():
            if value is not None:
                all_months[month].append(value)
        annual = round(group["soma_anual"] / group["contagem_anual"], 2) if group["contagem_anual"] else None
        if annual is not None:
            all_annual.append(annual)
        ufs[uf] = {
            "estacoes": group["estacoes"],
            "media_anual": annual,
            "mensal": monthly,
        }

    brasil = {
        "media_anual": round(sum(all_annual) / len(all_annual), 2) if all_annual else None,
        "mensal": {
            month: round(sum(values) / len(values), 2) if values else None for month, values in all_months.items()
        },
    }
    ranking = [
        {
            "codigo_estacao": station["codigo_estacao"],
            "estacao": station["estacao"],
            "uf": station["uf"],
            "valor_anual": station["anual"],
        }
        for station in stations
        if station["anual"] is not None
    ]
    ranking.sort(key=lambda item: item["valor_anual"], reverse=ranking_order == "desc")

    return {
        "variavel": variable_key,
        "unidade": unit,
        "ufs": ufs,
        "brasil": brasil,
        "ranking_estacoes": ranking[:80],
    }


def load_climate_standard(path, variable_key, unit, aggregation_mode, ranking_order):
    month_map = {
        "D": "Jan",
        "E": "Fev",
        "F": "Mar",
        "G": "Abr",
        "H": "Mai",
        "I": "Jun",
        "J": "Jul",
        "K": "Ago",
        "L": "Set",
        "M": "Out",
        "N": "Nov",
        "O": "Dez",
    }
    stations = []
    for row in raw_xlsx_rows(path):
        if row.get("A", "").strip().isdigit():
            monthly = {month: parse_climate_value(row.get(col)) for col, month in month_map.items()}
            annual = parse_climate_value(row.get("P"))
            available = [value for value in monthly.values() if value is not None]
            if annual is None and available:
                annual = round(sum(available), 2) if aggregation_mode == "sum" else round(sum(available) / len(available), 2)
            stations.append(
                {
                    "codigo_estacao": row.get("A", "").strip(),
                    "estacao": clean_string(row.get("B")),
                    "uf": clean_string(row.get("C")),
                    "mensal": monthly,
                    "anual": annual,
                }
            )
    return aggregate_climate(variable_key, unit, stations, ranking_order)


def load_climate_humidity(path):
    months = [
        ("D", "E", "F", "Jan"),
        ("G", "H", "I", "Fev"),
        ("J", "K", "L", "Mar"),
        ("M", "N", "O", "Abr"),
        ("P", "Q", "R", "Mai"),
        ("S", "T", "U", "Jun"),
        ("V", "W", "X", "Jul"),
        ("Y", "Z", "AA", "Ago"),
        ("AB", "AC", "AD", "Set"),
        ("AE", "AF", "AG", "Out"),
        ("AH", "AI", "AJ", "Nov"),
        ("AK", "AL", "AM", "Dez"),
    ]
    stations = []
    for row in raw_xlsx_rows(path):
        if row.get("A", "").strip().isdigit():
            monthly = {}
            for c1, c2, c3, month in months:
                values = [parse_climate_value(row.get(col)) for col in (c1, c2, c3)]
                values = [value for value in values if value is not None]
                monthly[month] = round(sum(values) / len(values), 2) if values else None
            annual_values = [parse_climate_value(row.get(col)) for col in ("AN", "AO", "AP")]
            annual_values = [value for value in annual_values if value is not None]
            annual = round(sum(annual_values) / len(annual_values), 2) if annual_values else None
            if annual is None:
                available = [value for value in monthly.values() if value is not None]
                annual = round(sum(available) / len(available), 2) if available else None
            stations.append(
                {
                    "codigo_estacao": row.get("A", "").strip(),
                    "estacao": clean_string(row.get("B")),
                    "uf": clean_string(row.get("C")),
                    "mensal": monthly,
                    "anual": annual,
                }
            )
    return aggregate_climate("umidade_relativa", "%", stations, "desc")


def build_climate_bundle():
    return {
        "titulo": "Climatologia por estação meteorológica",
        "escopo": "As bases climatológicas são por estação, não por município. O painel resume por UF e Brasil para evitar interpretações incorretas.",
        "fontes": {
            "precipitacao": str(CLIMATE_PREC_XLSX.relative_to(ROOT)),
            "temperatura_maxima": str(CLIMATE_TMAX_XLSX.relative_to(ROOT)),
            "umidade_relativa": str(CLIMATE_UR_XLSX.relative_to(ROOT)),
        },
        "variaveis": {
            "precipitacao": load_climate_standard(CLIMATE_PREC_XLSX, "precipitacao", "mm", "sum", "desc"),
            "temperatura_maxima": load_climate_standard(CLIMATE_TMAX_XLSX, "temperatura_maxima", "°C", "mean", "desc"),
            "umidade_relativa": load_climate_humidity(CLIMATE_UR_XLSX),
        },
    }


def build_dataset():
    finance_rows, years = load_finance_rows()
    enriched = load_enriched_rows()
    bolsa_rows, latest_month = latest_bolsa_rows()
    name_index = {}
    for code, enrich in enriched.items():
        uf = clean_string(enrich.get("uf"))
        name = clean_string(enrich.get("nome_municipio_fonte"))
        if uf and name:
            name_index[(uf, normalize_label(name))] = code
    for row in finance_rows:
        if row.get("uf") and row.get("nome_municipio"):
            name_index[(row["uf"], normalize_label(row["nome_municipio"]))] = row["codigo_ibge"]
    ifdm_rows = load_ifdm_rows(name_index)
    ifdm_capitais = load_ifdm_capitals()

    dataset = []
    status_counts = Counter()
    uf_values = set()
    region_values = set()
    coverage_missing = []

    for row in finance_rows:
        code = row["codigo_ibge"]
        enrich = enriched.get(code, {})
        if not enrich:
            continue
        bolsa = bolsa_rows.get(row["codigo_ibge6"], {})
        ifdm = ifdm_rows.get(code, {})
        municipality_name = row["nome_municipio"] or enrich.get("nome_municipio_fonte") or ""
        uf = row["uf"] or enrich.get("uf") or ""
        region = enrich.get("regiao") or ""
        if not region:
            coverage_missing.append(code)
        population = row.get("populacao")
        if population is None:
            population = enrich.get("populacao_fonte")
        item = {
            "codigo_ibge": code,
            "codigo_ibge6": row["codigo_ibge6"],
            "nome_municipio": municipality_name,
            "uf": uf,
            "regiao": region,
            "ano": row["ano"],
            "faixa_populacional": row.get("faixa_populacional") or "",
            "status_viabilidade": row.get("status_viabilidade") or "Sem dado",
            "status_viabilidade_lrf": row.get("status_viabilidade_lrf") or "",
            "status_autonomia": row.get("status_autonomia") or "",
            "autonomia_fiscal": row.get("autonomia_fiscal"),
            "pct_dependencia_transf": row.get("pct_dependencia_transf"),
            "receita_propria_per_capita": row.get("receita_propria_per_capita"),
            "receita_total_bruta": row.get("receita_total_bruta"),
            "receita_corrente_bruta": row.get("receita_corrente_bruta"),
            "receita_total_liquida": row.get("receita_total_liquida"),
            "receita_corrente_liquida": row.get("receita_corrente_liquida"),
            "federal_valor": row.get("Federal"),
            "estadual_valor": row.get("Estadual"),
            "municipal_valor": row.get("Municipal"),
            "outras_receitas_valor": row.get("Outras"),
            "outras_receitas_correntes_valor": row.get("Outras_corrente"),
            "receita_sem_transferencias_principais": row.get("receita_sem_transf_federal_estadual"),
            "pct_federal_bruta": row.get("pct_federal_bruta"),
            "pct_estadual_bruta": row.get("pct_estadual_bruta"),
            "pct_municipal_bruta": row.get("pct_municipal_bruta"),
            "pct_outras_bruta": row.get("pct_outras_bruta"),
            "populacao": population,
            "bolsa_familia_total": bolsa.get("bolsa_familia_total", 0),
            "referencia_bolsa_familia": bolsa.get("referencia_bolsa_familia", latest_month),
            "dependencia_federal": row.get("dependencia_federal"),
            "dependencia_estadual": row.get("dependencia_estadual"),
            "capacidade_investimento": row.get("capacidade_investimento"),
            "margem_orcamentaria": row.get("margem_orcamentaria"),
            "transferencias_total": row.get("transferencias_total"),
            "IPTU": row.get("IPTU"),
            "ISS": row.get("ISS"),
            "ITBI": row.get("ITBI"),
            "receita_tributaria_mun": row.get("receita_tributaria_mun"),
            "pct_tributaria_bruta": row.get("pct_tributaria_bruta"),
            "pct_receita_tributaria": row.get("pct_receita_tributaria"),
            "despesa_pessoal": row.get("despesa_pessoal"),
            "despesa_custeio": row.get("despesa_custeio"),
            "despesa_investimento": row.get("despesa_investimento"),
            "despesa_total": row.get("despesa_total"),
            "razao_pessoal_propria": row.get("razao_pessoal_propria"),
            "razao_pessoal_lrf": row.get("razao_pessoal_lrf"),
            "fpm_valor": row.get("fpm_valor"),
            "fundeb_valor": row.get("fundeb_valor"),
            "sus_valor": row.get("sus_valor"),
            "icms_valor": row.get("icms_valor"),
            "ipva_valor": row.get("ipva_valor"),
            "fpm_pct_bruta": row.get("fpm_pct_bruta"),
            "fundeb_pct_bruta": row.get("fundeb_pct_bruta"),
            "sus_pct_bruta": row.get("sus_pct_bruta"),
            "icms_pct_bruta": row.get("icms_pct_bruta"),
            "ipva_pct_bruta": row.get("ipva_pct_bruta"),
            "pessoal_per_capita": row.get("pessoal_per_capita"),
            "tem_rgf": row.get("tem_rgf"),
            "aviso_indicadores": row.get("aviso_indicadores") or "",
            "alfabetizacao": enrich.get("alfabetizacao"),
            "renda_media_10_mais": enrich.get("renda_media_10_mais"),
            "renda_media_15_mais": enrich.get("renda_media_15_mais"),
            "mortalidade_infantil": enrich.get("mortalidade_infantil"),
            "pib_aproximado": enrich.get("pib_aproximado"),
            "proporcao_mulheres_trabalho_formal": enrich.get("proporcao_mulheres_trabalho_formal"),
            "ifdm_geral": ifdm.get("ifdm_geral"),
            "ifdm_educacao": ifdm.get("ifdm_educacao"),
            "ifdm_saude": ifdm.get("ifdm_saude"),
            "ifdm_emprego_renda": ifdm.get("ifdm_emprego_renda"),
            "ifdm_ranking_nacional": ifdm.get("ifdm_ranking_nacional"),
            "ifdm_ranking_estadual": ifdm.get("ifdm_ranking_estadual"),
            "ifdm_ano_base": ifdm.get("ifdm_ano_base"),
        }
        item["interpretacao"] = build_interpretation(item)
        status_counts[item["status_viabilidade"]] += 1
        uf_values.add(uf)
        region_values.add(region)
        dataset.append(item)

    dataset.sort(key=lambda row: (row["ano"], row["uf"], row["nome_municipio"]))
    return {
        "linhas": dataset,
        "anos": years,
        "ufs": sorted(value for value in uf_values if value),
        "regioes": sorted(value for value in region_values if value),
        "contagem_status": dict(status_counts),
        "ultima_referencia_bolsa_familia": latest_month,
        "sem_regiao": sorted(set(coverage_missing)),
        "ifdm_capitais": ifdm_capitais,
        "total_ifdm_com_match": len(ifdm_rows),
    }


def build_map_rows(dataset_rows, geometry_features):
    geometry_by_code = {feature["codigo_ibge"]: feature for feature in geometry_features}
    joined_codes = set()
    by_year = {}
    for row in dataset_rows:
        feature = geometry_by_code.get(row["codigo_ibge"])
        if not feature:
            continue
        joined_codes.add(row["codigo_ibge"])
        key = str(row["ano"])
        by_year.setdefault(key, []).append(
            {
                "codigo_ibge": row["codigo_ibge"],
                "ano": row["ano"],
                "caminho_svg": feature["caminho_svg"],
                "rotulo": f"{row['nome_municipio']} ({row['uf']})",
                "centroide": feature["centroide"],
            }
        )
    for year in by_year:
        by_year[year].sort(key=lambda item: item["codigo_ibge"])
    missing_geometry = sorted(
        {
            row["codigo_ibge"]
            for row in dataset_rows
            if row["codigo_ibge"] not in joined_codes
        }
    )
    return by_year, missing_geometry


def main():
    if not BOUNDARY_ZIP.exists():
        raise SystemExit(
            f"Missing official boundary archive at {BOUNDARY_ZIP}. "
            "Download BR_Municipios_2024.zip from IBGE before building."
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    narrative = build_cartilha_bundle()
    dataset_bundle = build_dataset()
    climate_bundle = build_climate_bundle()
    geometry_source, bounds = read_shapefile(BOUNDARY_ZIP)
    geometry_features = [feature_to_path(feature, bounds) for feature in geometry_source]
    geometry_features = [feature for feature in geometry_features if feature]
    map_by_year, missing_geometry = build_map_rows(dataset_bundle["linhas"], geometry_features)

    metadata = {
        "mapa": {
            "largura": MAP_WIDTH,
            "altura": MAP_HEIGHT,
            "padding": MAP_PADDING,
            "ano_malha": 2024,
            "fonte": "IBGE Malhas Municipais 2024",
        },
        "fontes": {
            "financeiro": str(FINANCE_XLSX.relative_to(ROOT)),
            "municipios_enriquecidos": str(ENRICHED_CSV.relative_to(ROOT)),
            "bolsa_familia": str(BOLSA_CSV.relative_to(ROOT)),
            "ifdm_municipios": str(IFDM_XLSX.relative_to(ROOT)),
            "ifdm_capitais": str(IFDM_CAPITAIS_XLSX.relative_to(ROOT)),
            "cartilha": str(DOCX_FILE_ETAPA_1.relative_to(ROOT)),
            "cartilha_segunda_etapa": str(DOCX_FILE_ETAPA_2.relative_to(ROOT)),
            "malha_municipal": str(BOUNDARY_ZIP.relative_to(ROOT)),
        },
        "narrativa": narrative,
        "ultima_referencia_bolsa_familia": dataset_bundle["ultima_referencia_bolsa_familia"],
        "filtros": {
            "anos": dataset_bundle["anos"],
            "ufs": dataset_bundle["ufs"],
            "regioes": dataset_bundle["regioes"],
            "status": [status for status in STATUS_ORDER if status in dataset_bundle["contagem_status"]],
        },
        "qualidade": {
            "linhas": len(dataset_bundle["linhas"]),
            "municipios_com_geometria": len({item["codigo_ibge"] for year in map_by_year.values() for item in year}),
            "total_sem_geometria": len(missing_geometry),
            "total_sem_regiao": len(dataset_bundle["sem_regiao"]),
            "total_ifdm_com_match": dataset_bundle["total_ifdm_com_match"],
            "amostra_sem_geometria": missing_geometry[:25],
        },
        "ifdm_capitais": dataset_bundle["ifdm_capitais"],
    }

    with (OUTPUT_DIR / "metadata.json").open("w", encoding="utf-8") as handle:
        json.dump(metadata, handle, ensure_ascii=False, separators=(",", ":"))
    with (OUTPUT_DIR / "municipality_data.json").open("w", encoding="utf-8") as handle:
        json.dump(dataset_bundle["linhas"], handle, ensure_ascii=False, separators=(",", ":"))
    with (OUTPUT_DIR / "map_paths_by_year.json").open("w", encoding="utf-8") as handle:
        json.dump(map_by_year, handle, ensure_ascii=False, separators=(",", ":"))
    with (OUTPUT_DIR / "climatologia.json").open("w", encoding="utf-8") as handle:
        json.dump(climate_bundle, handle, ensure_ascii=False, separators=(",", ":"))

    print("Built dashboard data.")
    print(f"Linhas: {len(dataset_bundle['linhas'])}")
    print(f"Anos: {dataset_bundle['anos'][0]}-{dataset_bundle['anos'][-1]}")
    print(f"Última referência Bolsa Família: {dataset_bundle['ultima_referencia_bolsa_familia']}")
    print(f"Sem geometria: {len(missing_geometry)}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
