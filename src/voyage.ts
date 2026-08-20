// Cliente simples pra API de embeddings da Voyage AI.
// Docs: https://docs.voyageai.com/reference/embeddings-api

const VOYAGE_URL = "https://api.voyageai.com/v1/embeddings";
const MODEL = "voyage-3.5";

type InputType = "query" | "document";

export async function embed(
  texts: string[],
  inputType: InputType,
  apiKey: string
): Promise<number[][]> {
  const res = await fetch(VOYAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: texts,
      model: MODEL,
      input_type: inputType,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Voyage API falhou (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { data: { embedding: number[] }[] };
  return data.data.map((item) => item.embedding);
}
