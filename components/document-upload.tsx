'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, FileText, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentUploadProps {
  onUploadComplete?: (documentUrl: string, filename: string) => void;
  maxSizeMB?: number;
}

export function DocumentUpload({
  onUploadComplete,
  maxSizeMB = 10,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  const allowedExtensions = ['.pdf', '.docx', '.txt'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setSuccess(false);

    if (!selectedFile) return;

    // Validate file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        `Invalid file type. Please upload one of the following: ${allowedExtensions.join(
          ', '
        )}`
      );
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);
  };

  const uploadDocument = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(10);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 300);

      // Updated API route path to match Next.js app directory structure
      const response = await fetch('/api/document/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload document');
      }

      setProgress(100);
      const data = await response.json();
      setSuccess(true);
      
      if (onUploadComplete) {
        onUploadComplete(data.url, data.filename);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="text-lg font-medium">Upload Document</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload legal documents for analysis (PDF, DOCX, TXT)
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <FileText className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Upload Successful</AlertTitle>
          <AlertDescription>
            Your document has been uploaded successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          disabled={uploading}
          className="cursor-pointer"
        />

        {file && !success && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            {uploading && <Progress value={progress} className="h-2" />}
          </div>
        )}

        <div className="flex gap-2">
          {file && !uploading && !success && (
            <Button onClick={uploadDocument} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          )}

          {(success || error) && (
            <Button variant="outline" onClick={resetUpload}>
              Upload Another Document
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 