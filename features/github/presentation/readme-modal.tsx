'use client';

import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export function ReadmeModal({ readme, repoName }: { readme: string; repoName: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(readme);
    setCopied(true);
    toast.success('README copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4 font-semibold" })}>
        Ver README completo
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] w-[95vw] h-[95vh] flex flex-col p-4 md:p-6 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <DialogTitle className="text-lg line-clamp-1 pr-4">{repoName} - README.md</DialogTitle>
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
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/10 rounded-md mt-4 text-base leading-relaxed">
          <article className="prose prose-sm sm:prose-base dark:prose-invert prose-pre:bg-muted prose-pre:border prose-a:text-primary max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                td: ({ node, vAlign, ...props }: any) => <td valign={vAlign} {...props} />,
                th: ({ node, vAlign, ...props }: any) => <th valign={vAlign} {...props} />,
                tr: ({ node, vAlign, ...props }: any) => <tr valign={vAlign} {...props} />,
              }}
            >
              {readme}
            </ReactMarkdown>
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
}
