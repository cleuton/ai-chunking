# Chunking Strategies Demonstration

Command-line app that runs three chunking strategies (text splitting for RAG) on the same sample document, and shows which chunk each one finds for the same question:
 * Recursive — splits by paragraph/sentence/space, without understanding meaning.
 * Semantic — splits by comparing the embedding of neighboring sentences.
 * Contextual Retrieval — uses Claude to add a context summary to each chunk before generating the embedding.

## Prerequisites
 * Node.js 20 or newer
 * An Anthropic API key (used in the contextual chunker): https://console.anthropic.com
 * A Voyage AI API key (used for all embeddings): https://dash.voyageai.com

## Installation

```npm install
cp .env.example .env```

Open .env and fill in the two keys:

```ANTHROPIC_API_KEY=sk-ant-...
VOYAGE_API_KEY=pa-...```

How to run

```npm start```

The script will:
 * Generate chunks using the three strategies on the sample text (in src/sample-text.ts — a short news piece about quarterly results and a product launch from a fictional company).
 * Generate the embedding for each chunk and for the test question.
 * Rank the chunks from each strategy by their similarity to the question.
 * Print, for each strategy: how many chunks were generated, the average size, and the chunk that ranked first in the search.

## Why the test question is interesting

The sample question (src/sample-text.ts) asks about the new product without mentioning its name. The original text also uses "it" to refer to the product in some parts. This makes the practical difference between the strategies visible: the contextual chunker tends to preserve this reference because Claude writes the product name in the summary that is prepended to the chunk; the recursive chunker does not.

## Project structure

```src/
  index.ts              entry point, runs the three strategies and compares them
  types.ts              shared types (Chunk, EmbeddedChunk)
  voyage.ts             Voyage embeddings API client
  anthropic.ts          Anthropic (Claude) API client
  similarity.ts         cosine similarity between two vectors
  sample-text.ts        sample text and question
  chunkers/
    recursive.ts        recursive splitting by separators
    semantic.ts         splitting by similarity between sentences
    contextual.ts       recursive splitting + context summary via Claude```

Known limitations
 * Chunk size is measured in characters, not tokens, to keep the code simple to read.
 * Sentence splitting (chunkers/semantic.ts) uses a simple regular expression — it does not handle abbreviations (e.g., "Mr.", "Dr.") as exceptions.
 * Each chunk in contextual mode generates a separate call to the Anthropic API; on a large document, this becomes slow and incurs per-chunk costs.
