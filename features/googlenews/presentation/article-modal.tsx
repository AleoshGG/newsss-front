"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ArticleModalProps {
  title: string;
  content?: string;
  link: string;
  children: React.ReactNode;
}

export function ArticleModal({ title, content, link, children }: ArticleModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Contenido copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar", err);
      toast.error("Error al copiar");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="inline-flex p-0 m-0 border-0 bg-transparent text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl w-[95vw] sm:w-[90vw] max-h-[85vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="pr-12 text-xl leading-snug">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 mt-2">
          {content ? (
            <div className="whitespace-pre-wrap text-sm md:text-base text-foreground/90 leading-relaxed font-serif">
              {content}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              El contenido de este artículo no está disponible para lectura local.
              <br />
              <a href={link} target="_blank" rel="noreferrer" className="text-primary hover:underline mt-4 inline-block">
                Leer en la fuente original
              </a>
            </div>
          )}
        </div>
        {content && (
          <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
            <Button variant="outline" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
            <a href={link} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "default" })}>
              Fuente original
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
