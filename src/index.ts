import "dotenv/config";
import { chunkRecursive } from "./chunkers/recursive.js";
import { chunkSemantic } from "./chunkers/semantic.js";
import { chunkContextual } from "./chunkers/contextual.js";
import { embed } from "./voyage.js";
import { similarity } from "./similarity.js";
import { sampleText, sampleQuery } from "./sample-text.js";
import type { Chunk } from "./types.js";

const voyageKey = process.env.VOYAGE_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

if (!voyageKey || !anthropicKey) {
  console.error("Faltam chaves de API. Copie .env.example para .env e preencha VOYAGE_API_KEY e ANTHROPIC_API_KEY.");
  process.exit(1);
}

// Depois do check acima o TypeScript ainda acha que pode ser undefined,
// entao guardamos numa constante nao-opcional.
const VOYAGE_KEY: string = voyageKey;
const ANTHROPIC_KEY: string = anthropicKey;

function preview(text: string, length = 90): string {
  const flat = text.replace(/\n/g, " ").trim();
  return flat.length > length ? flat.slice(0, length) + "..." : flat;
}

async function evaluateStrategy(name: string, chunks: Chunk[], query: string) {
  const chunkTexts = chunks.map((c) => c.text);
  const chunkEmbeddings = await embed(chunkTexts, "document", VOYAGE_KEY);
  const [queryEmbedding] = await embed([query], "query", VOYAGE_KEY);

  const scored = chunks.map((chunk, i) => ({
    chunk,
    score: similarity(queryEmbedding, chunkEmbeddings[i]),
  }));
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const avgLength = Math.round(chunkTexts.reduce((sum, t) => sum + t.length, 0) / chunkTexts.length);

  console.log(`\n=== ${name} ===`);
  console.log(`chunks gerados: ${chunks.length}   tamanho medio: ${avgLength} caracteres`);
  console.log(`melhor resultado (score ${best.score.toFixed(4)}): "${best.chunk.label}"`);
  console.log(`  ${preview(best.chunk.text)}`);
}

async function main() {
  console.log("Pergunta usada na busca:");
  console.log(`  "${sampleQuery}"`);

  const started = Date.now();

  console.log("\nGerando chunks (recursivo, semantico e contextual retrieval)...");
  const recursiveChunks = chunkRecursive(sampleText);
  const semanticChunks = await chunkSemantic(sampleText, VOYAGE_KEY);
  const contextualChunks = await chunkContextual(sampleText, ANTHROPIC_KEY);

  await evaluateStrategy("Recursivo", recursiveChunks, sampleQuery);
  await evaluateStrategy("Semantico", semanticChunks, sampleQuery);
  await evaluateStrategy("Contextual Retrieval", contextualChunks, sampleQuery);

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\nTempo total: ${elapsed}s`);
}

main().catch((err) => {
  console.error("\nErro ao rodar a demonstracao:", err.message);
  process.exit(1);
});
