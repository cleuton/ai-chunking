import type { Chunk } from "../types.js";

// Divisao recursiva: tenta cortar por paragrafo primeiro, depois por
// frase, depois por espaco. So corta "no bruto" se nao sobrar opcao.
// Tamanho medido em caracteres, pra manter o exemplo simples (em
// producao normalmente se usa contagem de tokens).

const SEPARATORS = ["\n\n", "\n", ". ", " "];

function splitOnce(text: string, separator: string): string[] {
  return text.split(separator).filter((piece) => piece.length > 0);
}

function recursiveSplit(text: string, maxSize: number, separators: string[]): string[] {
  if (text.length <= maxSize) return [text];
  if (separators.length === 0) {
    // Sem mais separadores: corta no tamanho maximo mesmo.
    const pieces: string[] = [];
    for (let i = 0; i < text.length; i += maxSize) {
      pieces.push(text.slice(i, i + maxSize));
    }
    return pieces;
  }

  const [current, ...rest] = separators;
  const pieces = splitOnce(text, current);

  // Agrupa os pedacos pequenos ate perto do limite, e quebra
  // recursivamente os pedacos que ainda sao grandes demais.
  const result: string[] = [];
  let buffer = "";
  for (const piece of pieces) {
    const candidate = buffer ? buffer + current + piece : piece;
    if (candidate.length <= maxSize) {
      buffer = candidate;
    } else {
      if (buffer) result.push(buffer);
      if (piece.length > maxSize) {
        result.push(...recursiveSplit(piece, maxSize, rest));
        buffer = "";
      } else {
        buffer = piece;
      }
    }
  }
  if (buffer) result.push(buffer);
  return result;
}

export function chunkRecursive(text: string, maxSize = 500, overlap = 60): Chunk[] {
  const rawChunks = recursiveSplit(text.trim(), maxSize, SEPARATORS);

  // Aplica uma sobreposicao simples: pega o final do chunk anterior
  // e cola no comeco do proximo, pra nao perder uma ideia na fronteira.
  const withOverlap: string[] = [];
  for (let i = 0; i < rawChunks.length; i++) {
    if (i === 0) {
      withOverlap.push(rawChunks[i]);
      continue;
    }
    const previousTail = rawChunks[i - 1].slice(-overlap);
    withOverlap.push(previousTail + " " + rawChunks[i]);
  }

  return withOverlap.map((text, i) => ({
    text: text.trim(),
    label: `recursivo #${i + 1}`,
  }));
}
