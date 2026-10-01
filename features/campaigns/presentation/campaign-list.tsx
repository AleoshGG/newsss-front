'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CampaignList({ campaigns }: { campaigns: any[] }) {
  const handlePublish = (id: string) => {
    toast.success(`Campaña publicada exitosamente (Mock)`);
  };

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-6 text-center text-muted-foreground flex flex-col items-center justify-center h-full min-h-[300px]">
        No hay campañas generadas.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {campaigns.map((c) => (
        <div key={c.id} className="bg-card rounded-xl border overflow-hidden flex flex-col">
          <div className="p-5 border-b bg-muted/20 flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                {c.campaignType} • Clúster {c.clusterId || '-'}
              </div>
              <h3 className="font-heading font-medium text-lg leading-tight">
                {c.topicLabel}
              </h3>
            </div>
            <Button size="sm" onClick={() => handlePublish(c.id)}>Publicar</Button>
          </div>
          
          <div className="p-5 flex flex-col gap-4">
            {c.hook && (
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">Hook:</span>
                <p className="text-sm mt-1">{c.hook}</p>
              </div>
            )}
            
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Body:</span>
              <p className="text-sm mt-1 whitespace-pre-wrap leading-relaxed">{c.body}</p>
            </div>

            {c.cta && (
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">CTA:</span>
                <p className="text-sm mt-1">{c.cta}</p>
              </div>
            )}
            
            {c.hashtags && c.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {c.hashtags.map((tag: string, i: number) => (
                  <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
