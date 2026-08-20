// Um chunk simples: o texto e um rotulo pra identificar de onde ele veio.
export interface Chunk {
  text: string;
  label: string;
}

// Um chunk depois de ter recebido um embedding.
export interface EmbeddedChunk extends Chunk {
  embedding: number[];
}
