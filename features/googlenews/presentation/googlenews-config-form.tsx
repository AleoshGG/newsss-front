'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { saveGoogleNewsConfigAction } from '../googlenews.actions';

export function GoogleNewsConfigForm({ currentConfig }: { currentConfig: any }) {
  const [q, setQ] = useState(currentConfig?.q || 'Inteligencia Artificial OR IA');
  const [hl, setHl] = useState(currentConfig?.hl || 'es-419');
  const [gl, setGl] = useState(currentConfig?.gl || 'MX');
  const [ceid, setCeid] = useState(currentConfig?.ceid || 'MX:es-419');
  const [when, setWhen] = useState(currentConfig?.when || '1d');
  const [site, setSite] = useState(currentConfig?.site || '');
  const [intitle, setIntitle] = useState(currentConfig?.intitle || '');
  const [maxResults, setMaxResults] = useState(currentConfig?.maxResults || 100);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append('q', q);
    formData.append('hl', hl);
    formData.append('gl', gl);
    formData.append('ceid', ceid);
    formData.append('when', when);
    formData.append('site', site);
    formData.append('intitle', intitle);
    formData.append('maxResults', maxResults.toString());

    const result = await saveGoogleNewsConfigAction(formData);
    
    setIsSaving(false);
    
    if (result.success) {
      toast.success('Configuración de Google News guardada');
    } else {
      toast.error('Error al guardar la configuración');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label htmlFor="q">Término de búsqueda principal</Label>
        <p className="text-xs text-muted-foreground mb-1">
          La base de la búsqueda. Puedes usar operadores lógicos si lo deseas.
        </p>
        <Input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej: Inteligencia Artificial"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-y py-6 my-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="hl">Idioma de la interfaz</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Recomendado: Español Latinoamericano o Inglés.
          </p>
          <select
            id="hl"
            value={hl}
            onChange={(e) => setHl(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="es-419" className="bg-background">Español (Latinoamérica)</option>
            <option value="es" className="bg-background">Español (España)</option>
            <option value="en" className="bg-background">Inglés (Global)</option>
            <option value="en-US" className="bg-background">Inglés (EE. UU.)</option>
            <option value="en-GB" className="bg-background">Inglés (Reino Unido)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="gl">Región Geográfica</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Priorizar fuentes de un país.
          </p>
          <select
            id="gl"
            value={gl}
            onChange={(e) => setGl(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="MX" className="bg-background">México</option>
            <option value="US" className="bg-background">Estados Unidos</option>
            <option value="ES" className="bg-background">España</option>
            <option value="AR" className="bg-background">Argentina</option>
            <option value="CO" className="bg-background">Colombia</option>
            <option value="CL" className="bg-background">Chile</option>
            <option value="GB" className="bg-background">Reino Unido</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ceid">Edición</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Combinación preferida de Región e Idioma.
          </p>
          <select
            id="ceid"
            value={ceid}
            onChange={(e) => setCeid(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="MX:es-419" className="bg-background">México (Español)</option>
            <option value="US:en" className="bg-background">Estados Unidos (Inglés)</option>
            <option value="ES:es" className="bg-background">España (Español)</option>
            <option value="AR:es-419" className="bg-background">Argentina (Español)</option>
            <option value="CO:es-419" className="bg-background">Colombia (Español)</option>
            <option value="CL:es-419" className="bg-background">Chile (Español)</option>
            <option value="GB:en" className="bg-background">Reino Unido (Inglés)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="when">Antigüedad límite</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Volumen y vigencia de las noticias.
          </p>
          <select
            id="when"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="1h" className="bg-background">Última hora</option>
            <option value="1d" className="bg-background">Último día</option>
            <option value="7d" className="bg-background">Últimos 7 días</option>
            <option value="1y" className="bg-background">Último año</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="site">Restringir a Dominio</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Dejar vacío para múltiples fuentes, o buscar un nicho.
          </p>
          <Input
            id="site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="Ej: xataka.com.mx"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="intitle">Palabra estricta en título</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Opcional. Exige que esta palabra aparezca en el título de la nota.
          </p>
          <Input
            id="intitle"
            value={intitle}
            onChange={(e) => setIntitle(e.target.value)}
            placeholder="Ej: Google"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 border-t pt-6 mt-2">
        <div className="flex flex-col gap-2 sm:w-1/3">
          <Label htmlFor="maxResults">Límite de Noticias</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Máximo a guardar (1 a 100).
          </p>
          <Input
            id="maxResults"
            type="number"
            min={1}
            max={100}
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </div>
    </form>
  );
}
