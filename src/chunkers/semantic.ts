import type { Chunk } from "../types.js";
import { embed } from "../voyage.js";
import { similarity } from "../similarity.js";

// Divisao semantica: quebra o texto em frases, gera um embedding pra
// cada frase, e vai juntando frases vizinhas enquanto elas continuam
// parecidas. Quando a similaridade cai abaixo do limite, fecha um
// chunk e comeca outro.

function splitIntoSentences(text: string): string[] {
  // Quebra simples por ponto final, exclamacao ou interrogacao
  // seguidos de espaco. Suficiente pro texto de exemplo.
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function chunkSemantic(
  text: string,
  voyageApiKey: string,
  breakpointThreshold = 0.55
): Promise<Chunk[]> {
  const sentences = splitIntoSentences(text.trim());
  const embeddings = await embed(sentences, "document", voyageApiKey);

  const chunks: string[][] = [[sentences[0]]];
  for (let i = 1; i < sentences.length; i++) {
    const sim = similarity(embeddings[i - 1], embeddings[i]);
    if (sim >= breakpointThreshold) {
      // Assunto continua parecido: fica no mesmo chunk.
      chunks[chunks.length - 1].push(sentences[i]);
    } else {
      // Assunto mudou: comeca um chunk novo.
      chunks.push([sentences[i]]);
    }
  }

  return chunks.map((sentenceGroup, i) => ({
    text: sentenceGroup.join(" "),
    label: `semantico #${i + 1}`,
  }));
}
