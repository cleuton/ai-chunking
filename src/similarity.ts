// Os embeddings da Voyage ja vem normalizados (comprimento 1), entao
// o produto escalar simples ja funciona como similaridade de cosseno.
export function similarity(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}
