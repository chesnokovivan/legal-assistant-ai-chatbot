'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DocumentUpload } from '@/components/document-upload';

interface DocumentUploadButtonProps {
  onDocumentUploaded?: (documentUrl: string, filename: string) => void;
}

export function DocumentUploadButton({
  onDocumentUploaded,
}: DocumentUploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUploadComplete = (documentUrl: string, filename: string) => {
    if (onDocumentUploaded) {
      onDocumentUploaded(documentUrl, filename);
    }
    
    // Close the dialog after a short delay to show the success message
    setTimeout(() => {
      setIsOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          title="Upload Document"
        >
          <FileText className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Legal Document</DialogTitle>
        </DialogHeader>
        <DocumentUpload onUploadComplete={handleUploadComplete} />
      </DialogContent>
    </Dialog>
  );
} 