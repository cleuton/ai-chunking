import type { Chunk } from "../types.js";
import { chunkRecursive } from "./recursive.js";
import { askClaude } from "../anthropic.js";

// Contextual retrieval: comeca com a divisao recursiva normal, e
// depois pede pro Claude um resuminho de contexto pra cada chunk,
// olhando o documento inteiro. O resumo e colado na frente do chunk
// antes de gerar o embedding - assim o vetor final carrega esse
// contexto, mesmo que o texto original do chunk nao tivesse.

const SYSTEM_PROMPT =
  "Voce escreve resumos de contexto curtos para trechos de documentos. " +
  "Responda em uma frase, em portugues, sem introducao. " +
  "A frase deve dizer do que o trecho fala, usando os nomes proprios " +
  "necessarios para que o trecho faca sentido sozinho.";

function buildPrompt(fullDocument: string, chunkText: string): string {
  return [
    "Documento completo:",
    fullDocument,
    "",
    "Trecho a contextualizar:",
    chunkText,
    "",
    "Escreva uma frase curta de contexto para esse trecho.",
  ].join("\n");
}

export async function chunkContextual(
  text: string,
  anthropicApiKey: string,
  maxSize = 500,
  overlap = 60
): Promise<Chunk[]> {
  const baseChunks = chunkRecursive(text, maxSize, overlap);

  const contextualized: Chunk[] = [];
  for (const chunk of baseChunks) {
    const context = await askClaude(SYSTEM_PROMPT, buildPrompt(text, chunk.text), anthropicApiKey);
    contextualized.push({
      text: `${context}\n\n${chunk.text}`,
      label: chunk.label.replace("recursivo", "contextual"),
    });
  }

  return contextualized;
}
