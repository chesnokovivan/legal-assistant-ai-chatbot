import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

// Configure for larger document uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Get file size limit from environment variable or use default (10MB)
    const maxSize = process.env.MAX_DOCUMENT_SIZE 
      ? parseInt(process.env.MAX_DOCUMENT_SIZE, 10) 
      : 10 * 1024 * 1024; // 10MB default

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Check file type (allow PDF, DOCX, TXT)
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported. Please upload PDF, DOCX, or TXT files.' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const uniqueId = nanoid();
    const filename = `${uniqueId}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
} 