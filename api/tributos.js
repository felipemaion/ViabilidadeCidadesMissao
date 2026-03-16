const BASE_URL = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt//msc_orcamentaria";
const LIMIT = 10000;

function sumByPrefix(items, prefix) {
  return items
    .filter((item) => item.conta_contabil === "621200000" && typeof item.natureza_receita === "string" && item.natureza_receita.startsWith(prefix))
    .reduce((acc, item) => acc + Number(item.valor || 0), 0);
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ erro: "Método não permitido" }));
    return;
  }

  const codigoIbge = String(req.query.codigo_ibge || "").replace(/\D/g, "");
  const ano = String(req.query.ano || "").replace(/\D/g, "");

  if (codigoIbge.length !== 7 || ano.length !== 4) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ erro: "Parâmetros inválidos. Use codigo_ibge com 7 dígitos e ano com 4 dígitos." }));
    return;
  }

  const url = `${BASE_URL}?id_ente=${codigoIbge}&an_referencia=${ano}&me_referencia=12&co_tipo_matriz=MSCE&classe_conta=6&id_tv=period_change&limit=${LIMIT}`;

  try {
    const resposta = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!resposta.ok) {
      throw new Error(`Siconfi respondeu ${resposta.status}`);
    }
    const payload = await resposta.json();
    const items = Array.isArray(payload.items) ? payload.items : [];

    const tributos = {
      codigo_ibge: codigoIbge,
      ano: Number(ano),
      fonte: "API oficial Siconfi/Tesouro",
      referencia: `${ano}-12`,
      iptu: Number(sumByPrefix(items, "111250").toFixed(2)),
      itbi: Number(sumByPrefix(items, "111253").toFixed(2)),
      iss: Number(sumByPrefix(items, "111451").toFixed(2)),
    };
    tributos.receita_tributaria_municipal = Number((tributos.iptu + tributos.itbi + tributos.iss).toFixed(2));

    res.statusCode = 200;
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(tributos));
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        erro: "Falha ao consultar a API oficial do Siconfi.",
        detalhe: error.message,
      })
    );
  }
};
