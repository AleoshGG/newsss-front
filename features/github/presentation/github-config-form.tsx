'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { X, Plus, Loader2 } from 'lucide-react';
import { saveGithubConfigAction } from '../github.actions';

const COMMON_AI_TOPICS = [
  { id: 'ai', label: 'AI' },
  { id: 'machine-learning', label: 'Machine Learning' },
  { id: 'deep-learning', label: 'Deep Learning' },
  { id: 'llm', label: 'LLM (Large Language Models)' },
  { id: 'generative-ai', label: 'Generative AI' },
  { id: 'agent', label: 'AI Agents' },
];

const PROGRAMMING_LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'rust', label: 'Rust' },
  { id: 'cpp', label: 'C++' },
  { id: 'go', label: 'Go' },
];

export function GithubConfigForm({ currentConfig }: { currentConfig: any }) {
  const [isPending, startTransition] = useTransition();

  const [keywords, setKeywords] = useState<string[]>(
    typeof currentConfig.keywords === 'string' ? JSON.parse(currentConfig.keywords) : []
  );
  const [newKeyword, setNewKeyword] = useState('');
  
  const [daysActive, setDaysActive] = useState(currentConfig.daysActive || 2);
  const [minStars, setMinStars] = useState(currentConfig.minStars || 50);
  const [minForks, setMinForks] = useState(currentConfig.minForks || 10);
  const [requireLicense, setRequireLicense] = useState(currentConfig.requireLicense || false);
  const [maxResults, setMaxResults] = useState(currentConfig.maxResults || 50);
  
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    typeof currentConfig.selectedTopics === 'string' ? JSON.parse(currentConfig.selectedTopics) : []
  );
  const [newTopic, setNewTopic] = useState('');
  
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    typeof currentConfig.selectedLanguages === 'string' ? JSON.parse(currentConfig.selectedLanguages) : []
  );
  const [newLanguage, setNewLanguage] = useState('');

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleAddCustomTopic = () => {
    const trimmed = newTopic.trim().toLowerCase();
    if (trimmed && !selectedTopics.includes(trimmed)) {
      setSelectedTopics([...selectedTopics, trimmed]);
    }
    setNewTopic('');
  };

  const handleRemoveTopic = (topicId: string) => {
    setSelectedTopics(selectedTopics.filter(id => id !== topicId));
  };

  const toggleLanguage = (langId: string) => {
    if (selectedLanguages.includes(langId)) {
      setSelectedLanguages(selectedLanguages.filter(id => id !== langId));
    } else {
      setSelectedLanguages([...selectedLanguages, langId]);
    }
  };

  const handleAddCustomLanguage = () => {
    const trimmed = newLanguage.trim().toLowerCase();
    if (trimmed && !selectedLanguages.includes(trimmed)) {
      setSelectedLanguages([...selectedLanguages, trimmed]);
    }
    setNewLanguage('');
  };

  const handleRemoveLanguage = (langId: string) => {
    setSelectedLanguages(selectedLanguages.filter(id => id !== langId));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await saveGithubConfigAction({
          keywords: JSON.stringify(keywords),
          daysActive,
          minStars,
          minForks,
          requireLicense,
          maxResults,
          selectedTopics: JSON.stringify(selectedTopics),
          selectedLanguages: JSON.stringify(selectedLanguages),
        });
        toast.success('Configuración de GitHub guardada exitosamente');
      } catch (error) {
        toast.error('Error al guardar la configuración');
        console.error(error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Keywords */}
      <div className="flex flex-col gap-3">
        <Label>Palabras clave en descripción o README</Label>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddKeyword();
              }
            }}
            placeholder="Añadir palabra clave (ej. anthropic)"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleAddKeyword}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
      </div>

      {/* Topics */}
      <div className="flex flex-col gap-3">
        <Label>Temas (Topics) a buscar</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {COMMON_AI_TOPICS.map((topic) => (
            <div key={topic.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`topic-${topic.id}`} 
                checked={selectedTopics.includes(topic.id)}
                onCheckedChange={() => toggleTopic(topic.id)}
              />
              <label 
                htmlFor={`topic-${topic.id}`} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {topic.label}
              </label>
            </div>
          ))}
        </div>
        
        {selectedTopics.filter(id => !COMMON_AI_TOPICS.find(t => t.id === id)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTopics
              .filter(id => !COMMON_AI_TOPICS.find(t => t.id === id))
              .map(topic => (
              <div key={topic} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <span>{topic}</span>
                <button type="button" onClick={() => handleRemoveTopic(topic)} className="text-primary/60 hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-1">
          <Input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomTopic();
              }
            }}
            placeholder="Añadir otro tema (ej. react, web3)"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleAddCustomTopic}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
      </div>

      {/* Activity & Popularity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-y py-6 my-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="daysActive">Actividad reciente (días máximos)</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Solo buscar repositorios que hayan recibido commits en los últimos X días.
          </p>
          <Input
            id="daysActive"
            type="number"
            min={1}
            max={30}
            value={daysActive}
            onChange={(e) => setDaysActive(Number(e.target.value))}
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="minStars">Mínimo de Estrellas (Stars)</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Filtrar proyectos pequeños. Solo mostrar repositorios con tracción.
          </p>
          <Input
            id="minStars"
            type="number"
            min={0}
            step={10}
            value={minStars}
            onChange={(e) => setMinStars(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="minForks">Mínimo de Forks</Label>
          <p className="text-xs text-muted-foreground mb-1">
            Filtrar por cantidad de forks para asegurar que haya una comunidad activa.
          </p>
          <Input
            id="minForks"
            type="number"
            min={0}
            step={5}
            value={minForks}
            onChange={(e) => setMinForks(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox 
            id="requireLicense" 
            checked={requireLicense}
            onCheckedChange={(checked) => setRequireLicense(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <label 
              htmlFor="requireLicense" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Requiere Licencia (Open Source)
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Excluir repositorios sin una licencia especificada.
            </p>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="flex flex-col gap-3">
        <Label>Lenguajes de programación preferidos</Label>
        <p className="text-xs text-muted-foreground mb-1">
          Filtra los resultados para mostrar herramientas en estos lenguajes. Si no seleccionas ninguno, se buscarán todos.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <div key={lang.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`lang-${lang.id}`} 
                checked={selectedLanguages.includes(lang.id)}
                onCheckedChange={() => toggleLanguage(lang.id)}
              />
              <label 
                htmlFor={`lang-${lang.id}`} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {lang.label}
              </label>
            </div>
          ))}
        </div>
        
        {selectedLanguages.filter(id => !PROGRAMMING_LANGUAGES.find(l => l.id === id)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedLanguages
              .filter(id => !PROGRAMMING_LANGUAGES.find(l => l.id === id))
              .map(lang => (
              <div key={lang} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <span>{lang}</span>
                <button type="button" onClick={() => handleRemoveLanguage(lang)} className="text-primary/60 hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-1">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomLanguage();
              }
            }}
            placeholder="Añadir otro lenguaje (ej. java, swift)"
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleAddCustomLanguage}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
      </div>

      {/* Limites */}
      <div className="flex flex-col gap-3 border-t pt-6">
        <Label htmlFor="maxResults">Límite de resultados</Label>
        <p className="text-xs text-muted-foreground mb-1">
          Máximo número de repositorios a guardar por cada sincronización.
        </p>
        <div className="w-full sm:w-1/3">
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

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </div>
    </form>
  );
}
