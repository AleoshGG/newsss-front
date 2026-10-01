'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function TranscriptModal({ transcript, title }: { transcript: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    toast.success('Transcripción copiada al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="text-primary text-xs font-semibold cursor-pointer hover:underline mt-2 inline-block">
          Ver transcripción completa
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-[95vw] h-[95vh] flex flex-col p-4 md:p-6">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-lg line-clamp-1 pr-4">{title}</DialogTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="flex-shrink-0 gap-2 mr-8 md:mr-10"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar todo'}
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/30 rounded-md mt-4 text-base leading-relaxed whitespace-pre-wrap font-medium">
          {transcript}
        </div>
      </DialogContent>
    </Dialog>
  );
}
