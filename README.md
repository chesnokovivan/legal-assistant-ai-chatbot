<a href="https://chat.vercel.ai/">
  <img alt="Legal AI Assistant - AI-powered legal document analysis and assistant chatbot" src="app/(chat)/opengraph-image.png">
  <h1 align="center">Legal AI Assistant</h1>
</a>

<p align="center">
  An AI-powered legal document analysis and assistant chatbot built with Next.js and Anthropic Claude.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#document-analysis"><strong>Document Analysis</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Powered by Anthropic Claude 3.7 Sonnet
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Vercel Postgres powered by Neon](https://vercel.com/storage/postgres) for saving chat history and document data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient document storage
- Document Analysis
  - Upload and analyze legal documents (PDF, DOCX, TXT)
  - Extract key information and identify potential issues
  - Summarize documents and provide recommendations
- Russian Language Support
  - Full interface available in Russian
  - Document analysis for Russian legal documents

## Document Analysis

The Legal AI Assistant provides comprehensive document analysis capabilities:

- **Document Structure Analysis**: Analyze the structure of legal documents to identify sections, clauses, and hierarchical relationships.
- **Issue Identification**: Identify potential issues, inconsistencies, or ambiguities in legal documents.
- **Information Extraction**: Extract key information such as parties, dates, amounts, and obligations.
- **Document Summarization**: Generate concise summaries of legal documents.
- **Document Comparison**: Compare multiple versions of a document to identify changes.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run the Legal AI Assistant. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your Anthropic API key and other sensitive information.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your Legal AI Assistant should now be running on [localhost:3000](http://localhost:3000/).
