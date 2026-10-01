'use client';

import { useTransition } from 'react';
import { generateCampaignAction } from '../campaigns.actions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CampaignForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const toastId = toast.loading('Generando campaña (esto puede tomar un minuto)...');
      
      const result = await generateCampaignAction(formData);
      
      if (result.success) {
        toast.success('¡Campaña generada con éxito!', { id: toastId });
      } else {
        toast.error(result.error || 'Ocurrió un error', { id: toastId });
      }
    });
  }

  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="text-xl font-heading font-medium mb-6">Generar Nueva Campaña</h2>
      
      <form action={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="limitPerSource" className="text-sm font-semibold">Límite por fuente</label>
          <input 
            type="number" 
            id="limitPerSource" 
            name="limitPerSource" 
            defaultValue={10} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required 
          />
          <span className="text-xs text-muted-foreground">Cantidad de items recientes a analizar por fuente (ej. 10 videos, 10 repos).</span>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="nClusters" className="text-sm font-semibold">Número de Clústers (Temas)</label>
          <input 
            type="number" 
            id="nClusters" 
            name="nClusters" 
            defaultValue={3} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="minIntentScore" className="text-sm font-semibold">Intención mínima (0.0 - 1.0)</label>
          <input 
            type="number" 
            id="minIntentScore" 
            name="minIntentScore" 
            step="0.1" 
            min="0" 
            max="1" 
            defaultValue={0.8} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="campaignType" className="text-sm font-semibold">Tipo de Campaña</label>
          <select 
            id="campaignType" 
            name="campaignType" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="twitter">Twitter / X Thread</option>
            <option value="linkedin">LinkedIn Post</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <input 
            type="checkbox" 
            id="translateNonEnglish" 
            name="translateNonEnglish" 
            defaultChecked 
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="translateNonEnglish" className="text-sm font-semibold">Traducir a Inglés automáticamente</label>
        </div>

        <Button type="submit" disabled={isPending} className="mt-4">
          {isPending ? 'Ejecutando Pipeline AI...' : 'Generar Campaña'}
        </Button>
      </form>
    </div>
  );
}
