/**
 * Document extraction utilities for the Legal AI Assistant
 */

import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { 
  DocumentFileType, 
  DocumentMetadata, 
  DocumentContent, 
  DocumentPage, 
  ExtractionOptions, 
  ExtractionResult 
} from './types';

/**
 * Extract text from a document file
 * @param filePath Path to the document file
 * @param options Extraction options
 * @returns Extraction result with document content
 */
export async function extractTextFromFile(
  filePath: string,
  options: ExtractionOptions = {}
): Promise<ExtractionResult> {
  try {
    const fileStats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath).toLowerCase().replace('.', '');
    
    // Determine file type based on extension
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
    
    // Create metadata
    const metadata: DocumentMetadata = {
      fileName,
      fileType,
      fileSize: fileStats.size,
      uploadedAt: new Date(),
      lastModified: fileStats.mtime
    };
    
    // Extract text based on file type
    let text = '';
    let pages: DocumentPage[] = [];
    
    switch (fileType) {
      case DocumentFileType.PDF:
        const pdfResult = await extractFromPdf(filePath, options);
        text = pdfResult.text;
        pages = pdfResult.pages;
        metadata.pageCount = pages.length;
        break;
      case DocumentFileType.DOCX:
        const docxResult = await extractFromDocx(filePath, options);
        text = docxResult.text;
        metadata.wordCount = countWords(text);
        break;
      case DocumentFileType.TXT:
      case DocumentFileType.MD:
        text = fs.readFileSync(filePath, 'utf-8');
        metadata.wordCount = countWords(text);
        break;
    }
    
    // Create document content
    const content: DocumentContent = {
      text,
      metadata,
      ...(pages.length > 0 && { pages })
    };
    
    return {
      success: true,
      content
    };
  } catch (error) {
    return {
      success: false,
      error: `Error extracting text: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Extract text from a PDF file
 * @param filePath Path to the PDF file
 * @param options Extraction options
 * @returns Extracted text and pages
 */
async function extractFromPdf(
  filePath: string,
  options: ExtractionOptions
): Promise<{ text: string; pages: DocumentPage[] }> {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  
  let pages: DocumentPage[] = [];
  
  if (options.extractPages) {
    // Extract individual pages
    // Note: This is a simplified implementation
    // For a more accurate page extraction, a more sophisticated PDF library would be needed
    const pageTexts = pdfData.text.split(/\f/); // Form feed character often separates pages
    
    pages = pageTexts.map((pageText, index) => ({
      pageNumber: index + 1,
      text: pageText.trim()
    }));
  }
  
  return {
    text: pdfData.text,
    pages
  };
}

/**
 * Extract text from a DOCX file
 * @param filePath Path to the DOCX file
 * @param options Extraction options
 * @returns Extracted text
 */
async function extractFromDocx(
  filePath: string,
  options: ExtractionOptions
): Promise<{ text: string }> {
  const result = await mammoth.extractRawText({
    path: filePath,
    preserveStyles: options.preserveFormatting
  });
  
  return {
    text: result.value
  };
}

/**
 * Extract text from a buffer
 * @param buffer File buffer
 * @param fileName Original file name
 * @param options Extraction options
 * @returns Extraction result with document content
 */
export async function extractTextFromBuffer(
  buffer: Buffer,
  fileName: string,
  options: ExtractionOptions = {}
): Promise<ExtractionResult> {
  try {
    const fileExtension = path.extname(fileName).toLowerCase().replace('.', '');
    
    // Determine file type based on extension
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
    
    // Create metadata
    const metadata: DocumentMetadata = {
      fileName,
      fileType,
      fileSize: buffer.length,
      uploadedAt: new Date()
    };
    
    // Extract text based on file type
    let text = '';
    let pages: DocumentPage[] = [];
    
    switch (fileType) {
      case DocumentFileType.PDF:
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
        
        if (options.extractPages) {
          // Extract individual pages
          const pageTexts = pdfData.text.split(/\f/);
          
          pages = pageTexts.map((pageText, index) => ({
            pageNumber: index + 1,
            text: pageText.trim()
          }));
        }
        
        metadata.pageCount = pages.length || Math.max(1, pdfData.numpages);
        break;
      case DocumentFileType.DOCX:
        const result = await mammoth.extractRawText({
          buffer,
          preserveStyles: options.preserveFormatting
        });
        text = result.value;
        metadata.wordCount = countWords(text);
        break;
      case DocumentFileType.TXT:
      case DocumentFileType.MD:
        text = buffer.toString('utf-8');
        metadata.wordCount = countWords(text);
        break;
    }
    
    // Create document content
    const content: DocumentContent = {
      text,
      metadata,
      ...(pages.length > 0 && { pages })
    };
    
    return {
      success: true,
      content
    };
  } catch (error) {
    return {
      success: false,
      error: `Error extracting text: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Count words in a text
 * @param text Text to count words in
 * @returns Number of words
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Extract text content from a document
 * This is a convenience function that handles both file paths and buffers
 * @param source File path or buffer
 * @param fileName Original file name (required if source is a buffer)
 * @param options Extraction options
 * @returns Extraction result with document content
 */
export async function extractDocument(
  source: string | Buffer,
  fileName?: string,
  options: ExtractionOptions = {}
): Promise<ExtractionResult> {
  if (typeof source === 'string') {
    return extractTextFromFile(source, options);
  } else if (Buffer.isBuffer(source) && fileName) {
    return extractTextFromBuffer(source, fileName, options);
  } else {
    return {
      success: false,
      error: 'Invalid source or missing fileName for buffer'
    };
  }
} 