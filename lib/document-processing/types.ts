/**
 * Document processing types for the Legal AI Assistant
 */

/**
 * Supported document file types
 */
export enum DocumentFileType {
  PDF = "pdf",
  DOCX = "docx",
  TXT = "txt",
  MD = "md",
}

/**
 * Document metadata
 */
export interface DocumentMetadata {
  fileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  uploadedAt: Date;
  lastModified?: Date;
  pageCount?: number;
  wordCount?: number;
}

/**
 * Document content with extracted text
 */
export interface DocumentContent {
  text: string;
  metadata: DocumentMetadata;
  pages?: DocumentPage[];
}

/**
 * Document page for paginated documents
 */
export interface DocumentPage {
  pageNumber: number;
  text: string;
  imageUrl?: string;
}

/**
 * Document extraction options
 */
export interface ExtractionOptions {
  extractPages?: boolean;
  extractImages?: boolean;
  preserveFormatting?: boolean;
}

/**
 * Document extraction result
 */
export interface ExtractionResult {
  success: boolean;
  content?: DocumentContent;
  error?: string;
}

/**
 * Document section for structured documents
 */
export interface DocumentSection {
  id: string;
  title: string;
  level: number;
  content: string;
  startIndex: number;
  endIndex: number;
  parentId?: string;
  children: DocumentSection[];
}

/**
 * Document structure representing the hierarchical organization
 */
export interface DocumentStructure {
  sections: DocumentSection[];
  metadata: DocumentMetadata;
}

/**
 * Document annotation for highlighting issues or important parts
 */
export interface DocumentAnnotation {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  type: AnnotationType;
  comment?: string;
  severity?: AnnotationSeverity;
  createdAt: Date;
}

/**
 * Types of document annotations
 */
export enum AnnotationType {
  ISSUE = "issue",
  HIGHLIGHT = "highlight",
  COMMENT = "comment",
  SUGGESTION = "suggestion",
}

/**
 * Severity levels for annotations
 */
export enum AnnotationSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
} 