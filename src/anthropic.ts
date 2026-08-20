// Cliente simples pra API da Anthropic. So usamos ela pra gerar o
// resuminho de contexto no chunker de "contextual retrieval".

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-5";

export async function askClaude(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API falhou (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  const textBlock = data.content.find((block) => block.type === "text");
  return textBlock?.text?.trim() ?? "";
}
