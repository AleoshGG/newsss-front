'use client';

import { useState, useTransition } from 'react';
import { updateSearchConfigAction } from '../youtube.controller';
import { YouTubeSearchConfig } from '../data/youtube.config.db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';

interface Props {
  currentConfig: YouTubeSearchConfig;
}

const AI_CHANNELS = [
  { id: '@googledeepmind', label: 'Google DeepMind' },
  { id: '@OpenAI', label: 'OpenAI' },
  { id: '@anthropic-ai', label: 'Anthropic' },
  { id: '@huggingface', label: 'Hugging Face' },
  { id: '@midjourney', label: 'Midjourney' },
  { id: '@lexfridman', label: 'Lex Fridman' },
  { id: '@mkbhd', label: 'MKBHD' },
  { id: '@a16z', label: 'a16z' },
];

const DEFAULT_KEYWORDS = ['OpenAI', 'Anthropic', 'Claude', 'ChatGPT', 'LLM'];

export function YoutubeConfigForm({ currentConfig }: Props) {
  const [isPending, startTransition] = useTransition();

  const initialKeywords = (currentConfig.keywords && currentConfig.keywords.length > 0) ? currentConfig.keywords : DEFAULT_KEYWORDS;
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [newKeyword, setNewKeyword] = useState('');

  const [maxResults, setMaxResults] = useState(currentConfig.maxResults);
  
  const predefinedIds = AI_CHANNELS.map(c => c.id);
  const initialCustomChannels = (currentConfig.channelIds || []).filter(id => !predefinedIds.includes(id));
  const [customChannels, setCustomChannels] = useState<string[]>(initialCustomChannels);
  const [newChannel, setNewChannel] = useState('');

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const handleAddChannel = () => {
    const trimmed = newChannel.trim();
    if (trimmed && !customChannels.includes(trimmed) && !predefinedIds.includes(trimmed)) {
      setCustomChannels([...customChannels, trimmed]);
    }
    setNewChannel('');
  };

  const handleRemoveChannel = (ch: string) => {
    setCustomChannels(customChannels.filter(c => c !== ch));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await updateSearchConfigAction(null, formData);
      toast.success('Configuración guardada exitosamente');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="keywords" value={keywords.join(',')} />
      {customChannels.map(c => (
        <input key={c} type="hidden" name="channelIds" value={c} />
      ))}

      {/* Keywords */}
      <div className="flex flex-col gap-3">
        <Label>Palabras clave</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {keywords.map(kw => (
            <div key={kw} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              <span>{kw}</span>
              <button type="button" onClick={() => handleRemoveKeyword(kw)} className="text-secondary-foreground/60 hover:text-secondary-foreground">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
            placeholder="Añadir palabra clave (ej. Machine Learning)"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleAddKeyword}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
      </div>

      {/* Predefined Channels */}
      <div className="flex flex-col gap-3">
        <Label>Canales de IA destacados</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AI_CHANNELS.map((channel) => (
            <div key={channel.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`channel-${channel.id}`} 
                name="channelIds" 
                value={channel.id} 
                defaultChecked={(currentConfig.channelIds || []).includes(channel.id)} 
              />
              <label 
                htmlFor={`channel-${channel.id}`} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {channel.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Channels */}
      <div className="flex flex-col gap-3">
        <Label>Canales personalizados</Label>
        {customChannels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {customChannels.map(ch => (
              <div key={ch} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <span>{ch}</span>
                <button type="button" onClick={() => handleRemoveChannel(ch)} className="text-primary/60 hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChannel())}
            placeholder="Añadir canal (ej. @CanalEjemplo)"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleAddChannel}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
      </div>

      {/* Languages */}
      <div className="flex flex-col gap-3 border-b pb-6">
        <Label>Idiomas del contenido</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lang-es" 
              name="languages" 
              value="es" 
              defaultChecked={(currentConfig.languages || []).includes('es')} 
            />
            <label htmlFor="lang-es" className="text-sm font-medium leading-none">Español (Latinoamérica y Europa)</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lang-en" 
              name="languages" 
              value="en" 
              defaultChecked={(currentConfig.languages || []).includes('en')} 
            />
            <label htmlFor="lang-en" className="text-sm font-medium leading-none">Inglés (Estados Unidos, Europa, etc.)</label>
          </div>
        </div>
      </div>

      {/* Max Results */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="maxResults">Cantidad de resultados (por búsqueda/canal)</Label>
        <Input
          id="maxResults"
          name="maxResults"
          type="number"
          min={1}
          max={10}
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="max-w-[200px]"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </div>
    </form>
  );
}
