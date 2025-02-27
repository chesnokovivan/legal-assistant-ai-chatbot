# Legal AI Assistant Technical Specification

## 1. System Overview
- **Core Purpose and Value Proposition**: An AI-powered web application for legal document analysis, structuring, and information retrieval designed for Russian-speaking legal professionals.
- **Key Workflows**:
  1. Document upload and management
  2. Document analysis for structure and content correctness
  3. Information search and extraction within documents
  4. Problem area identification and highlighting
  5. Document summaries and recommendations generation
- **System Architecture**: Next.js application with server components for data processing and client components for UI interactions, integrated with Anthropic Claude API for AI processing.

## 2. Project Structure
```
Legal AI Assistant/
├── app/                          # Next.js application routes and API handlers
│   ├── (chat)/                   # Main application routes
│   │   ├── api/                  # API endpoints
│   │   │   ├── chat/             # Chat interaction endpoints
│   │   │   ├── document/         # Document processing endpoints
│   │   │   └── files/            # File upload and management endpoints
│   │   └── chat/                 # Chat interface routes
│   ├── layout.tsx                # Root layout component
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # Basic UI components
│   ├── document-viewer/          # Document viewing components
│   ├── document-analysis/        # Document analysis components
│   ├── chat/                     # Chat interface components
│   └── legal-tools/              # Legal-specific tool components
├── lib/                          # Utility functions and services
│   ├── ai/                       # AI integration with Anthropic Claude
│   │   ├── models.ts             # Model configuration (Anthropic Claude only)
│   │   ├── prompts.ts            # System prompts for different features
│   │   └── tools/                # AI tools for document processing
│   ├── db/                       # Database queries and schema
│   ├── document-processing/      # Document processing utilities
│   │   ├── analysis.ts           # Document structure analysis
│   │   ├── extraction.ts         # Information extraction
│   │   └── highlighting.ts       # Problem area highlighting
│   └── utils.ts                  # General utility functions
└── public/                       # Static assets
```

## 3. Feature Specification

### 3.1 Document Upload and Management
- **User Story**: As a legal professional, I want to upload and manage legal documents so I can analyze them and extract information.
- **Implementation Steps**:
  1. Create document upload component using the Vercel Blob storage
  2. Implement file type validation (PDF, DOCX, TXT)
  3. Extract text content from documents (PDF-to-text, DOCX-to-text)
  4. Store document metadata and content in the database
  5. Create document list view for uploaded documents
- **Error Handling**:
  - Invalid file type detection with user feedback
  - File size limitations (max 10MB)
  - Document text extraction failures with fallback options
  - Proper error messaging in Russian for all error cases

### 3.2 Document Analysis
- **User Story**: As a legal professional, I want to analyze the structure and content of legal documents to identify potential issues.
- **Implementation Steps**:
  1. Create document structure analysis prompt for Claude
  2. Implement document analysis request handler
  3. Create analysis results display component with in-document highlighting
  4. Develop document structure visualization component
  5. Create interactive document navigation for identified issues
- **Error Handling**:
  - Handling documents with complex structures
  - Fallback analysis methods for partial document issues
  - Clear messaging for analysis limitations
  - API failure handling with retry options

### 3.3 Information Search and Extraction
- **User Story**: As a legal professional, I want to search for specific information within legal documents and extract key details.
- **Implementation Steps**:
  1. Create search interface with Russian language support
  2. Implement document search functionality with Claude
  3. Develop information extraction prompts for different information types
  4. Create component to display extracted information in structured format
  5. Implement search history functionality
- **Error Handling**:
  - Handling ambiguous search queries
  - Managing search timeout scenarios
  - Providing feedback when information cannot be found
  - Alternative search suggestions for failed searches

### 3.4 Document Summary Generation
- **User Story**: As a legal professional, I want to generate concise summaries of legal documents to quickly understand their content.
- **Implementation Steps**:
  1. Create document summarization prompt for Claude
  2. Implement summary generation request handler
  3. Develop summary display component with different granularity options
  4. Add summary export functionality
  5. Implement customizable summary focus options
- **Error Handling**:
  - Managing summarization for very large documents
  - Handling documents with unusual structures
  - Providing partial summaries when complete summary fails
  - Clear feedback on summarization limitations

### 3.5 Document Viewer with Annotations
- **User Story**: As a legal professional, I want to view documents with annotations highlighting potential issues or important elements.
- **Implementation Steps**:
  1. Enhance document viewer component with annotation support
  2. Create annotation overlay system for highlighting issues
  3. Implement interactive annotation navigation
  4. Develop annotation filtering by type/severity
  5. Add annotation export functionality
- **Error Handling**:
  - Handling document viewing for different file types
  - Managing annotation placement in complex layouts
  - Fallback viewing options for problematic documents
  - Performance optimization for heavily annotated documents

### 3.6 API Key Management
- **User Story**: As a user, I want to securely provide and manage my Anthropic API key to use the application.
- **Implementation Steps**:
  1. Create API key input form with secure storage
  2. Implement API key validation
  3. Add usage tracking to prevent unexpected charges
  4. Create API key management interface
  5. Implement API key removal functionality
- **Error Handling**:
  - Secure handling of API keys
  - Clear error messaging for invalid API keys
  - Graceful handling of API key usage limitations
  - User feedback on API cost and usage

## 4. Server Actions

### 4.1 Document Processing Actions
- **Document Text Extraction**:
  - Endpoint: `/api/document/extract`
  - Method: POST
  - Request: `{documentId: string, fileType: string}`
  - Response: `{documentId: string, text: string, success: boolean}`

- **Document Analysis**:
  - Endpoint: `/api/document/analyze`
  - Method: POST
  - Request: `{documentId: string, analysisType: "structure" | "content" | "all"}`
  - Response: `{documentId: string, analysis: AnalysisResult[]}`

- **Information Search**:
  - Endpoint: `/api/document/search`
  - Method: POST
  - Request: `{documentId: string, query: string, searchType: "information" | "entity" | "date" | "obligation"}`
  - Response: `{documentId: string, results: SearchResult[]}`

- **Document Summarization**:
  - Endpoint: `/api/document/summarize`
  - Method: POST
  - Request: `{documentId: string, length: "short" | "medium" | "detailed"}`
  - Response: `{documentId: string, summary: string}`

### 4.2 Anthropic AI Integration
- **Integration Implementation**:
  - Model: Claude 3.7 Sonnet (single model approach)
  - Authentication: User-provided API key
  - Request format: JSON with document text and instructions
  - Response handling: Streaming responses for real-time feedback
  - Error handling: Graceful degradation with feedback

- **System Prompts**:
  - Document structure analysis prompt:
    ```
    Ты - эксперт по юридическим документам на русском языке. Проанализируй структуру следующего документа, оцени его логическую целостность и найди потенциальные проблемы в структуре. Укажи разделы, которые отсутствуют или расположены в неправильном порядке. Выдели дублирующийся контент. Твой ответ должен быть структурированным и содержать конкретные рекомендации по улучшению.
    ```
  - Information extraction prompt:
    ```
    Изучи следующий юридический документ и извлеки из него следующую информацию: [информация для извлечения]. Представь результаты в структурированном виде с указанием разделов и номеров страниц, где находится эта информация.
    ```
  - Document summarization prompt:
    ```
    Создай четкое и лаконичное резюме следующего юридического документа. Выдели основные положения, обязательства сторон, сроки и ключевые условия. Твоё резюме должно быть [короткое/среднее/детальное] и сохранять все существенные аспекты документа.
    ```

### 4.3 File Handling
- **File Upload**:
  - Endpoint: `/api/files/upload`
  - Method: POST
  - Request: FormData with file
  - Response: `{documentId: string, fileName: string, fileType: string, uploadSuccess: boolean}`
  - Storage: Vercel Blob Storage

- **File Processing Pipeline**:
  1. File validation (type, size, integrity)
  2. Text extraction based on file type
  3. Initial content processing and storage
  4. Document metadata creation
  5. Response with document reference

## 5. Design System

### 5.1 Visual Style
- **Color Palette**:
  - Primary: `#1E40AF` (Dark Blue)
  - Secondary: `#3B82F6` (Blue)
  - Accent: `#60A5FA` (Light Blue)
  - Background: `#F9FAFB` (Off-White)
  - Text: `#111827` (Almost Black)
  - Error: `#EF4444` (Red)
  - Warning: `#F59E0B` (Amber)
  - Success: `#10B981` (Green)
  - Gray scale: `#F3F4F6`, `#E5E7EB`, `#D1D5DB`, `#9CA3AF`, `#6B7280`, `#4B5563`, `#374151`

- **Typography**:
  - Primary font: Inter, sans-serif
  - Headings:
    - H1: 32px, 700 weight
    - H2: 24px, 700 weight
    - H3: 20px, 600 weight
    - H4: 18px, 600 weight
    - H5: 16px, 600 weight
    - H6: 14px, 600 weight
  - Body:
    - Regular: 16px, 400 weight
    - Small: 14px, 400 weight
    - Tiny: 12px, 400 weight
  - Line heights:
    - Headings: 1.2
    - Body: 1.5

- **Component Styling Patterns**:
  - Tailwind CSS for component styling
  - Shadcn/ui for core UI components
  - Custom component extensions for legal-specific UI needs
  - Consistent border radius (6px)
  - Subtle drop shadows for elevated components
  - Consistent spacing system (4px increments)

- **Spacing and Layout**:
  - Base unit: 4px
  - Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
  - Layout grid: 12-column system
  - Container max-width: 1200px
  - Sidebar width: 280px
  - Document viewer width: flexible, min 680px

### 5.2 Core Components

- **Layout Structure**:
  ```
  +----------------------------------+
  | Header (with API key input)      |
  +--------+-----------------------+
  |        |                       |
  |        |                       |
  |        |                       |
  |        |                       |
  |        |     Main Content      |
  |        |     Area (Document    |
  | Sidebar|     Viewer / Chat)    |
  |        |                       |
  |        |                       |
  |        |                       |
  |        |                       |
  +--------+-----------------------+
  |           Footer               |
  +----------------------------------+
  ```

- **Navigation Patterns**:
  - Sidebar for document list and navigation
  - Top navigation bar for main app sections
  - Breadcrumbs for document navigation
  - Tab-based navigation for analysis views

- **Shared Components**:
  - Button:
    ```tsx
    interface ButtonProps {
      variant: 'primary' | 'secondary' | 'outline' | 'text';
      size: 'sm' | 'md' | 'lg';
      children: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      loading?: boolean;
    }
    ```
  - Input:
    ```tsx
    interface InputProps {
      label: string;
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      error?: string;
      type?: 'text' | 'password' | 'email' | 'number';
      disabled?: boolean;
      required?: boolean;
    }
    ```
  - Select:
    ```tsx
    interface SelectProps {
      label: string;
      options: Array<{value: string, label: string}>;
      value: string;
      onChange: (value: string) => void;
      placeholder?: string;
      error?: string;
      disabled?: boolean;
      required?: boolean;
    }
    ```
  - DocumentCard:
    ```tsx
    interface DocumentCardProps {
      id: string;
      title: string;
      dateAdded: Date;
      fileType: string;
      thumbnailUrl?: string;
      hasAnalysis: boolean;
      onClick: () => void;
    }
    ```

- **Interactive States**:
  - Hover: 10% darker/lighter than base color
  - Active/Focus: Accent color border (2px)
  - Disabled: 30% opacity, cursor not-allowed
  - Loading: Pulse animation, disabled interaction

## 6. Component Architecture

### 6.1 Server Components
- **DocumentProcessor**:
  ```tsx
  // Data fetching strategy: Uses server-side processing for document analysis
  // Props interface
  interface DocumentProcessorProps {
    documentId: string;
    analysisType: 'structure' | 'content' | 'all';
  }
  ```

- **SearchProcessor**:
  ```tsx
  // Data fetching strategy: Uses server-side processing for document search
  // Props interface
  interface SearchProcessorProps {
    documentId: string;
    query: string;
    searchType: 'information' | 'entity' | 'date' | 'obligation';
  }
  ```

- **SummaryGenerator**:
  ```tsx
  // Data fetching strategy: Uses server-side processing for summary generation
  // Props interface
  interface SummaryGeneratorProps {
    documentId: string;
    length: 'short' | 'medium' | 'detailed';
  }
  ```

- **Error Handling**:
  - Error boundary components for each major feature
  - Fallback UI for failed analysis/search operations
  - User guidance for resolving common errors
  - Logging for server-side errors

### 6.2 Client Components
- **DocumentViewer**:
  ```tsx
  // State management: Uses React state for document viewing state
  // Props interface
  interface DocumentViewerProps {
    documentId: string;
    highlights?: Array<{
      id: string,
      type: 'error' | 'warning' | 'info',
      startPosition: number,
      endPosition: number,
      message: string
    }>;
    onHighlightClick?: (highlightId: string) => void;
    scale?: number;
    showAnnotations?: boolean;
  }
  ```

- **DocumentAnalysisPanel**:
  ```tsx
  // State management: Uses React state for analysis result display
  // Props interface
  interface DocumentAnalysisPanelProps {
    documentId: string;
    analysisResults: Array<{
      id: string,
      type: 'structure' | 'content' | 'duplicate',
      severity: 'high' | 'medium' | 'low',
      message: string,
      position?: {
        startPosition: number,
        endPosition: number
      }
    }>;
    onAnalysisItemClick: (analysisItemId: string) => void;
  }
  ```

- **SearchInterface**:
  ```tsx
  // State management: Uses React state and SWR for search results
  // Props interface
  interface SearchInterfaceProps {
    documentId: string;
    onSearchComplete: (results: SearchResult[]) => void;
    searchHistory?: Array<{
      query: string,
      timestamp: Date
    }>;
  }
  ```

- **Event Handlers**:
  - Document navigation events
  - Analysis item selection events
  - Search query submission events
  - Highlight navigation events

## 7. API Key Management

- **API Key Management**:
  - Storage: Session storage for temporary use
  - Validation: Validate API key on entry and before each request
  - Security: Never store API key in database or cookies
  - UI flow: 
    1. Key entry form on first use
    2. Temporary storage during session
    3. Clear on session end or manual logout

## 8. Data Flow

- **Server/Client Data Flow**:
  1. Client uploads document to server
  2. Server processes document and stores metadata
  3. Client requests document analysis
  4. Server processes analysis with Anthropic Claude
  5. Server streams analysis results to client
  6. Client displays analysis results with document view

- **State Management Architecture**:
  - Server state: Document metadata, analysis results
  - Client state: UI interactions, view preferences
  - Real-time updates: Streaming responses from Claude
  - Persistence: Local storage for session data and chat history

## 9. Artifact System for Legal Documents

- **Legal Document Artifacts**:
  - Purpose: Store and manage legal documents as artifacts
  - Types of artifacts:
    1. Original document (PDF, DOCX, TXT)
    2. Extracted text content
    3. Analysis results
    4. Document summaries
    5. Extracted information collections
  - Artifact relationships:
    - Parent-child relationships between original documents and derived artifacts
    - Version tracking for document revisions
    - Linking between related documents

- **Artifact Actions**:
  - Create: Upload new legal document
  - Read: View document content and metadata
  - Update: Add annotations or analysis results
  - Delete: Remove document and related artifacts
  - Export: Download document with or without annotations
  - Share: Generate shareable link (optional)

## 10. Model Configuration

- **Anthropic Claude Integration**:
  - Model: Claude 3.7 Sonnet (fixed, not user-selectable)
  - Configuration in `lib/ai/models.ts`:
    ```typescript
    import { customProvider } from 'ai';
    
    export const DEFAULT_CHAT_MODEL: string = 'claude-legal-assistant';
    
    export const myProvider = customProvider({
      languageModels: {
        'claude-legal-assistant': {
          provider: 'anthropic',
          model: 'claude-3-7-sonnet-20250219',
          apiKey: process.env.ANTHROPIC_API_KEY || '',
        },
      },
    });
    
    // No model selector needed as we're using a single fixed model
    ```

## 11. Code Modifications

### 11.1 Removing User Authentication
- Comment out or remove authentication-related code:
  - Remove `app/(auth)` directory
  - Remove authentication checks in API routes
  - Remove user-related database queries
  - Update middleware to skip authentication checks

### 11.2 Removing Image Generation
- Remove image generation functionality:
  - Remove image model definitions from `lib/ai/models.ts`
  - Remove image generation components
  - Remove image-related API endpoints
  - Update UI to remove image generation options

### 11.3 Simplifying Model Selection
- Remove model selection UI:
  - Remove `model-selector.tsx` component from UI
  - Update chat interface to use fixed model
  - Remove model selection state management
  - Update API routes to use the fixed Claude model

## 12. Internationalization

- **Russian Language Support**:
  - All UI text in Russian
  - Error messages in Russian
  - Date/time formatting for Russian locale
  - Document analysis optimized for Russian legal text

- **Localization Strategy**:
  - Translation files for all UI text
  - Russian language as default and only option initially
  - Content detection for Russian language documents
  - Specialized legal terminology handling
