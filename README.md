# Demonstração de estratégias de chunking

App de linha de comando que roda três estratégias de chunking (divisão de texto
para RAG) sobre o mesmo documento de exemplo, e mostra qual chunk cada uma
encontra pra uma mesma pergunta:

1. **Recursivo** — corta por parágrafo/frase/espaço, sem entender significado.
2. **Semântico** — corta comparando o embedding de frases vizinhas.
3. **Contextual Retrieval** — usa o Claude pra adicionar um resumo de contexto
   em cada chunk antes de gerar o embedding.

## Pré-requisitos

- Node.js 20 ou mais recente
- Uma chave de API da Anthropic (usada no chunker contextual): https://console.anthropic.com
- Uma chave de API da Voyage AI (usada em todos os embeddings): https://dash.voyageai.com

## Instalação

```bash
npm install
cp .env.example .env
```

Abra o `.env` e preencha as duas chaves:

```
ANTHROPIC_API_KEY=sk-ant-...
VOYAGE_API_KEY=pa-...
```

## Como rodar

```bash
npm start
```

O script vai:

1. Gerar os chunks com as três estratégias sobre o texto de exemplo (em
   `src/sample-text.ts` — uma notícia curta sobre resultados trimestrais e
   lançamento de produto de uma empresa fictícia).
2. Gerar o embedding de cada chunk e da pergunta de teste.
3. Rankear os chunks de cada estratégia pela similaridade com a pergunta.
4. Imprimir, pra cada estratégia: quantos chunks foram gerados, o tamanho
   médio, e o chunk que ficou em primeiro lugar na busca.

## Por que a pergunta de teste é interessante

A pergunta de exemplo (`src/sample-text.ts`) pergunta sobre o produto novo sem
citar o nome dele. O texto original também usa "ele" pra se referir ao
produto em alguns trechos. Isso deixa visível a diferença prática entre as
estratégias: o chunker contextual tende a preservar essa referência porque o
Claude escreve o nome do produto no resumo que é colado na frente do chunk;
o chunker recursivo, não.

## Estrutura do projeto

```
src/
  index.ts              ponto de entrada, roda as três estratégias e compara
  types.ts               tipos compartilhados (Chunk, EmbeddedChunk)
  voyage.ts               cliente da API de embeddings da Voyage
  anthropic.ts             cliente da API da Anthropic (Claude)
  similarity.ts             similaridade de cosseno entre dois vetores
  sample-text.ts             texto e pergunta de exemplo
  chunkers/
    recursive.ts               divisão recursiva por separadores
    semantic.ts                  divisão por similaridade entre frases
    contextual.ts                  divisão recursiva + resumo de contexto via Claude
```

## Limitações conhecidas

- O tamanho dos chunks é medido em caracteres, não em tokens, pra manter o
  código simples de ler.
- A divisão em frases (`chunkers/semantic.ts`) usa uma expressão regular
  simples — não trata abreviações (ex: "Sr.", "Dra.") como exceção.
- Cada chunk do modo contextual gera uma chamada separada à API da Anthropic;
  em um documento grande isso fica lento e tem custo por chunk.
