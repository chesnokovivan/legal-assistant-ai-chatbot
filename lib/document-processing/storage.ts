/**
 * Document storage utilities for the Legal AI Assistant
 */

import { put, del, list } from '@vercel/blob';
import { nanoid } from 'nanoid';
import { 
  DocumentMetadata, 
  DocumentContent,
  DocumentFileType
} from './types';
import { extractTextFromBuffer } from './extraction';

/**
 * Upload a document to Vercel Blob Storage
 * @param file File to upload
 * @param options Upload options
 * @returns Upload result with blob URL and metadata
 */
export async function uploadDocument(
  file: File,
  options: {
    extractText?: boolean;
    userId: string;
  } = { extractText: true, userId: '' }
): Promise<{
  success: boolean;
  blobUrl?: string;
  metadata?: DocumentMetadata;
  content?: DocumentContent;
  error?: string;
}> {
  try {
    // Generate a unique filename
    const uniqueId = nanoid();
    const filename = `${uniqueId}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Create metadata
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    let fileType: DocumentFileType;
    
    switch (fileExtension) {
      case 'pdf':
        fileType = DocumentFileType.PDF;
        break;
      case 'docx':
        fileType = DocumentFileType.DOCX;
        break;
      case 'txt':
        fileType = DocumentFileType.TXT;
        break;
      case 'md':
        fileType = DocumentFileType.MD;
        break;
      default:
        return {
          success: false,
          error: `Unsupported file type: ${fileExtension}`
        };
    }

    const metadata: DocumentMetadata = {
      fileName: file.name,
      fileType,
      fileSize: file.size,
      uploadedAt: new Date(),
      lastModified: new Date(file.lastModified)
    };

    // Extract text if requested
    let content: DocumentContent | undefined;
    
    if (options.extractText) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extractionResult = await extractTextFromBuffer(buffer, file.name, {
        extractPages: fileType === DocumentFileType.PDF,
        preserveFormatting: true
      });
      
      if (extractionResult.success && extractionResult.content) {
        content = extractionResult.content;
        
        // Update metadata with additional information from extraction
        if (content.metadata.pageCount) {
          metadata.pageCount = content.metadata.pageCount;
        }
        
        if (content.metadata.wordCount) {
          metadata.wordCount = content.metadata.wordCount;
        }
      }
    }

    return {
      success: true,
      blobUrl: blob.url,
      metadata,
      ...(content && { content })
    };
  } catch (error) {
    return {
      success: false,
      error: `Error uploading document: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Delete a document from Vercel Blob Storage
 * @param blobUrl URL of the blob to delete
 * @returns Delete result
 */
export async function deleteDocument(
  blobUrl: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await del(blobUrl);
    
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: `Error deleting document: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * List documents in Vercel Blob Storage
 * @param prefix Optional prefix to filter blobs
 * @param limit Maximum number of blobs to return
 * @returns List of blobs
 */
export async function listDocuments(
  prefix?: string,
  limit: number = 100
): Promise<{
  success: boolean;
  blobs?: Array<{
    url: string;
    pathname: string;
    size: number;
    uploadedAt: Date;
  }>;
  error?: string;
}> {
  try {
    const { blobs } = await list({ prefix, limit });
    
    return {
      success: true,
      blobs
    };
  } catch (error) {
    return {
      success: false,
      error: `Error listing documents: ${error instanceof Error ? error.message : String(error)}`
    };
  }
} 