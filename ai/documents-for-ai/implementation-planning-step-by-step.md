# Implementation Plan

## Project Setup and Configuration

- [x] Step 1: Update project configuration
  - **Task**: Update package.json, next.config.ts, and environment variables for the Legal AI Assistant project
  - **Files**:
    - `package.json`: Updated project name and description
    - `next.config.ts`: Configured for document handling with increased size limits and additional image domains
    - `.env.example`: Updated with Anthropic API key and document-related environment variables
    - `README.md`: Updated with project information and features
  - **Step Dependencies**: None
  - **User Instructions**: After implementing this step, run `npm install` or `pnpm install` to ensure all dependencies are installed
  - **Comments**: Completed on February 27 2025. Updated all configuration files to reflect the Legal AI Assistant project. Added document handling configuration and removed references to other model providers.

- [x] Step 2: Configure AI model integration
  - **Task**: Update AI model configuration to use Anthropic Claude 3.7 Sonnet exclusively
  - **Files**:
    - `lib/ai/models.ts`: Replaced existing models with Claude 3.7 Sonnet as the primary model, with Claude 3.5 Sonnet and Haiku as alternatives
    - `package.json`: Added Anthropic SDK dependency and removed OpenAI and Fireworks dependencies
    - `lib/ai/prompts.ts`: Updated system prompt to include legal assistant capabilities
  - **Step Dependencies**: Step 1
  - **User Instructions**: You'll need to obtain an Anthropic API key for testing
  - **Comments**: Completed on [current date]. Configured the application to use Anthropic Claude models exclusively, with Claude 3.7 Sonnet as the default. Added a specialized legal assistant prompt to guide the AI's behavior.

- [x] Step 3: Set up document processing utilities
  - **Task**: Create utilities for handling document uploads and text extraction
  - **Files**:
    - `lib/document-processing/extraction.ts`: Create utility for text extraction from different file types
    - `lib/document-processing/types.ts`: Define document-related types
    - `package.json`: Add dependencies for PDF and DOCX processing
  - **Step Dependencies**: Step 1
  - **User Instructions**: None
  - **Comments**: Completed on February 27, 2025. Created document processing utilities for extracting text from PDF, DOCX, TXT, and MD files. Added mammoth and pdf-parse libraries for document processing. Created type definitions for document-related data structures and a custom type declaration file for the mammoth library.

## Database Schema and Storage

- [x] Step 4: Update database schema
  - **Task**: Modify the database schema to support document storage and analysis
  - **Files**:
    - `lib/db/schema.ts`: Update schema with document-related tables
    - `lib/db/migrate.ts`: Update migration script
  - **Step Dependencies**: Step 1
  - **User Instructions**: After implementation, run `npm run db:migrate` to apply the schema changes
  - **Comments**: Completed on February 27, 2025. Updated the document table with additional fields for legal document processing (fileName, fileType, fileSize, blobUrl, pageCount, wordCount, lastModified, isAnalyzed). Added new tables for document sections (DocumentSection) and annotations (DocumentAnnotation) to support document structure analysis and issue highlighting. Updated the migration script to log information about the schema changes. 
    
    **Database Setup**: For local development, PostgreSQL 15 was installed and configured. The setup process included:
    1. Installing PostgreSQL 15 using Homebrew: `brew install postgresql@15`
    2. Starting the PostgreSQL service: `brew services start postgresql@15`
    3. Creating the `legal_assistant` database: `createdb legal_assistant`
    4. Updating the `.env.local` file with the correct PostgreSQL connection URL
    5. Generating migration files with Drizzle Kit: `npx drizzle-kit generate --schema=./lib/db/schema.ts --out=./lib/db/migrations --dialect=postgresql`
    6. Running the migration: `npm run db:migrate`

- [x] Step 5: Implement document storage
  - **Task**: Create utilities for storing and retrieving documents using Vercel Blob Storage
  - **Files**:
    - `lib/document-processing/storage.ts`: Create document storage utilities
    - `lib/db/queries.ts`: Add document-related database queries
  - **Step Dependencies**: Step 4
  - **User Instructions**: None
  - **Comments**: Completed on February 27, 2025. Created document storage utilities for uploading, deleting, and listing documents using Vercel Blob Storage. Implemented functions for handling document metadata and content extraction during upload. Added comprehensive database queries for document management, including functions for saving documents with blob information, retrieving documents by user ID, updating document analysis status, and managing document sections and annotations. The implementation ensures proper integration between blob storage and database persistence.

## Core Components

- [ ] Step 6: Create document viewer component
  - **Task**: Implement a document viewer component that can display text documents with annotations
  - **Files**:
    - `components/document-viewer/document-viewer.tsx`: Main document viewer component
    - `components/document-viewer/annotation.tsx`: Annotation component for highlighting issues
    - `components/document-viewer/document-navigation.tsx`: Navigation component for document sections
  - **Step Dependencies**: None
  - **User Instructions**: None

- [ ] Step 7: Create document analysis components
  - **Task**: Implement components for displaying document analysis results
  - **Files**:
    - `components/document-analysis/analysis-panel.tsx`: Panel for displaying analysis results
    - `components/document-analysis/issue-list.tsx`: Component for listing document issues
    - `components/document-analysis/structure-view.tsx`: Component for visualizing document structure
  - **Step Dependencies**: Step 6
  - **User Instructions**: None

- [ ] Step 8: Create document upload components
  - **Task**: Implement components for document upload and management
  - **Files**:
    - `components/document-upload/upload-form.tsx`: Form for uploading documents
    - `components/document-upload/document-list.tsx`: List of uploaded documents
    - `components/document-upload/file-type-validator.ts`: Utility for validating file types
  - **Step Dependencies**: None
  - **User Instructions**: None

- [ ] Step 9: Create API key management components
  - **Task**: Implement components for managing Anthropic API key
  - **Files**:
    - `components/api-key/api-key-form.tsx`: Form for entering API key
    - `components/api-key/api-key-storage.ts`: Utility for securely storing API key in session
  - **Step Dependencies**: None
  - **User Instructions**: None

## API Routes and Server Actions

- [ ] Step 10: Implement document upload API
  - **Task**: Create API endpoint for document upload and processing
  - **Files**:
    - `app/(chat)/api/document/upload/route.ts`: API route for document upload
    - `app/(chat)/api/document/actions.ts`: Server actions for document processing
  - **Step Dependencies**: Steps 3, 5
  - **User Instructions**: None

- [ ] Step 11: Implement document analysis API
  - **Task**: Create API endpoint for document analysis
  - **Files**:
    - `app/(chat)/api/document/analyze/route.ts`: API route for document analysis
    - `lib/ai/prompts.ts`: Add document analysis prompts
  - **Step Dependencies**: Step 2, Step 10
  - **User Instructions**: None

- [ ] Step 12: Implement document search API
  - **Task**: Create API endpoint for searching within documents
  - **Files**:
    - `app/(chat)/api/document/search/route.ts`: API route for document search
    - `lib/ai/tools/search.ts`: Create search tool for AI
  - **Step Dependencies**: Step 2, Step 10
  - **User Instructions**: None

- [ ] Step 13: Implement document summarization API
  - **Task**: Create API endpoint for document summarization
  - **Files**:
    - `app/(chat)/api/document/summarize/route.ts`: API route for document summarization
    - `lib/ai/tools/summarize.ts`: Create summarization tool for AI
  - **Step Dependencies**: Step 2, Step 10
  - **User Instructions**: None

## Page Components and Routes

- [ ] Step 14: Create document upload page
  - **Task**: Implement the document upload page
  - **Files**:
    - `app/(chat)/document/upload/page.tsx`: Document upload page
    - `app/(chat)/document/upload/actions.ts`: Server actions for the upload page
  - **Step Dependencies**: Steps 8, 10
  - **User Instructions**: None

- [ ] Step 15: Create document viewer page
  - **Task**: Implement the document viewer page with analysis capabilities
  - **Files**:
    - `app/(chat)/document/[id]/page.tsx`: Document viewer page
    - `app/(chat)/document/[id]/actions.ts`: Server actions for the document viewer
  - **Step Dependencies**: Steps 6, 7, 11
  - **User Instructions**: None

- [ ] Step 16: Create document search page
  - **Task**: Implement the document search page
  - **Files**:
    - `app/(chat)/document/[id]/search/page.tsx`: Document search page
    - `app/(chat)/document/[id]/search/actions.ts`: Server actions for search
  - **Step Dependencies**: Step 12
  - **User Instructions**: None

- [ ] Step 17: Update chat interface for document analysis
  - **Task**: Modify the existing chat interface to support document analysis
  - **Files**:
    - `components/chat.tsx`: Update chat component
    - `components/message.tsx`: Update message component to display document analysis
    - `app/(chat)/chat/[id]/page.tsx`: Update chat page
  - **Step Dependencies**: Steps 11, 12, 13
  - **User Instructions**: None

## Document Analysis Features

- [ ] Step 18: Implement document structure analysis
  - **Task**: Create functionality for analyzing document structure
  - **Files**:
    - `lib/document-processing/analysis.ts`: Create document structure analysis utility
    - `lib/ai/tools/structure-analysis.ts`: Create structure analysis tool for AI
  - **Step Dependencies**: Step 2, Step 3
  - **User Instructions**: None

- [ ] Step 19: Implement duplicate content detection
  - **Task**: Create functionality for detecting duplicate content in documents
  - **Files**:
    - `lib/document-processing/duplicate-detection.ts`: Create duplicate detection utility
    - `lib/ai/tools/duplicate-detection.ts`: Create duplicate detection tool for AI
  - **Step Dependencies**: Step 18
  - **User Instructions**: None

- [ ] Step 20: Implement information extraction
  - **Task**: Create functionality for extracting specific information from documents
  - **Files**:
    - `lib/document-processing/extraction.ts`: Enhance extraction utility
    - `lib/ai/tools/information-extraction.ts`: Create information extraction tool for AI
  - **Step Dependencies**: Step 3
  - **User Instructions**: None

## UI Enhancements and Localization

- [ ] Step 21: Implement Russian language interface
  - **Task**: Create Russian language translations for the interface
  - **Files**:
    - `lib/i18n/ru.ts`: Create Russian language translations
    - `lib/i18n/index.ts`: Create i18n utility
    - `components/ui/language-provider.tsx`: Create language provider component
  - **Step Dependencies**: None
  - **User Instructions**: None

- [ ] Step 22: Update UI components for Russian language
  - **Task**: Update UI components to use Russian language translations
  - **Files**:
    - `app/layout.tsx`: Update root layout with language provider
    - `components/ui/button.tsx`: Update button component
    - `components/ui/input.tsx`: Update input component
    - `components/ui/dialog.tsx`: Update dialog component
  - **Step Dependencies**: Step 21
  - **User Instructions**: None

- [ ] Step 23: Create specialized legal UI components
  - **Task**: Create UI components specific to legal document analysis
  - **Files**:
    - `components/legal-tools/clause-highlighter.tsx`: Component for highlighting clauses
    - `components/legal-tools/legal-term-tooltip.tsx`: Tooltip for legal terms
    - `components/legal-tools/document-structure-tree.tsx`: Tree view for document structure
  - **Step Dependencies**: None
  - **User Instructions**: None

## Document Export and Sharing

- [ ] Step 24: Implement document export functionality
  - **Task**: Create functionality for exporting documents with annotations
  - **Files**:
    - `lib/document-processing/export.ts`: Create document export utility
    - `components/document-viewer/export-button.tsx`: Create export button component
    - `app/(chat)/api/document/export/route.ts`: API route for document export
  - **Step Dependencies**: Steps 6, 7
  - **User Instructions**: None

- [ ] Step 25: Implement document sharing functionality
  - **Task**: Create functionality for sharing document analysis results
  - **Files**:
    - `lib/document-processing/share.ts`: Create document sharing utility
    - `components/document-viewer/share-button.tsx`: Create share button component
    - `app/(chat)/api/document/share/route.ts`: API route for document sharing
  - **Step Dependencies**: Step 24
  - **User Instructions**: None

## Testing and Optimization

- [ ] Step 26: Implement error handling
  - **Task**: Add comprehensive error handling throughout the application
  - **Files**:
    - `lib/utils/error-handler.ts`: Create error handling utility
    - `components/ui/error-message.tsx`: Create error message component
    - Update various components with error handling
  - **Step Dependencies**: None
  - **User Instructions**: None

- [ ] Step 27: Optimize document processing
  - **Task**: Optimize document processing for large documents
  - **Files**:
    - `lib/document-processing/chunking.ts`: Create document chunking utility
    - `lib/document-processing/optimization.ts`: Create optimization utilities
  - **Step Dependencies**: Step 3
  - **User Instructions**: None

- [ ] Step 28: Add loading states and feedback
  - **Task**: Implement loading states and user feedback throughout the application
  - **Files**:
    - `components/ui/loading-spinner.tsx`: Create loading spinner component
    - `components/ui/progress-bar.tsx`: Create progress bar component
    - Update various components with loading states
  - **Step Dependencies**: None
  - **User Instructions**: None

## Final Integration and Cleanup

- [ ] Step 29: Remove authentication and unused features
  - **Task**: Remove authentication and other unused features from the template
  - **Files**:
    - `app/(auth)`: Remove authentication directory
    - `middleware.ts`: Update middleware to remove authentication checks
    - Remove other unused components and routes
  - **Step Dependencies**: None
  - **User Instructions**: None

- [ ] Step 30: Final integration and testing
  - **Task**: Integrate all components and perform final testing
  - **Files**:
    - `app/page.tsx`: Update landing page
    - Fix any integration issues across components
  - **Step Dependencies**: All previous steps
  - **User Instructions**: After implementation, test the application thoroughly with different document types and analysis scenarios

## Summary

This implementation plan outlines a structured approach to transforming the existing AI chat bot template into a specialized Legal AI Assistant application. The plan is organized into logical sections, starting with project setup and configuration, followed by database schema and storage, core components, API routes and server actions, page components and routes, document analysis features, UI enhancements and localization, document export and sharing, testing and optimization, and finally integration and cleanup.

Key considerations for the implementation:

1. **Single AI Model Approach**: The plan focuses on using Anthropic Claude 3.7 Sonnet exclusively, simplifying the model selection logic.

2. **Document Processing**: Special attention is given to document processing capabilities, including text extraction, structure analysis, and information retrieval.

3. **Russian Language Support**: The plan includes comprehensive Russian language support throughout the interface.

4. **User-Provided API Key**: The application will use a user-provided Anthropic API key, stored securely in the session.

5. **No Authentication**: Authentication features from the template will be removed, focusing instead on a simpler approach with session-based chat history.

6. **Progressive Enhancement**: The plan follows a progressive enhancement approach, starting with core functionality and adding more advanced features in later steps.

By following this implementation plan, the development team can systematically transform the existing template into a fully functional Legal AI Assistant application that meets the requirements specified in the technical specification.
