import { getSearchConfig as getYoutubeConfig } from '@/features/youtube/data/youtube.config.db';
import { getGithubSearchConfig } from '@/features/github/data/github.config.db';
import { getGoogleNewsConfig } from '@/features/googlenews/data/googlenews.config.db';
import { YoutubeConfigForm } from '@/features/youtube/presentation/youtube-config-form';
import { GithubConfigForm } from '@/features/github/presentation/github-config-form';
import { GoogleNewsConfigForm } from '@/features/googlenews/presentation/googlenews-config-form';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default async function SettingsPage() {
  const youtubeConfig = await getYoutubeConfig();
  const githubConfig = await getGithubSearchConfig();
  const googleNewsConfig = await getGoogleNewsConfig();

  return (
    <div className="flex flex-col min-h-screen p-6 sm:p-12 gap-12 bg-background text-foreground">
      <header className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">
          Configuracion de búsqueda
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Define que buscar en cada plataforma. Los cambios se aplican en la siguiente sincronizacion.
        </p>
      </header>

      <div className="w-full max-w-3xl mx-auto">
        <Accordion className="w-full flex flex-col gap-6">
          <Card>
            <AccordionItem value="item-youtube" className="border-none px-6">
              <AccordionTrigger className="text-xl font-bold hover:no-underline py-6">YouTube</AccordionTrigger>
              <AccordionContent className="pb-6">
                <YoutubeConfigForm currentConfig={youtubeConfig} />
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card>
            <AccordionItem value="item-github" className="border-none px-6">
              <AccordionTrigger className="text-xl font-bold hover:no-underline py-6">GitHub</AccordionTrigger>
              <AccordionContent className="pb-6">
                <GithubConfigForm currentConfig={githubConfig} />
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card>
            <AccordionItem value="item-googlenews" className="border-none px-6">
              <AccordionTrigger className="text-xl font-bold hover:no-underline py-6">Google News</AccordionTrigger>
              <AccordionContent className="pb-6">
                <GoogleNewsConfigForm currentConfig={googleNewsConfig} />
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card className="opacity-50">
            <div className="px-6 py-6 flex justify-between items-center text-xl font-bold text-muted-foreground">
              X / Twitter <span className="text-sm font-normal">Próximamente</span>
            </div>
          </Card>

          <Card className="opacity-50">
            <div className="px-6 py-6 flex justify-between items-center text-xl font-bold text-muted-foreground">
              LinkedIn <span className="text-sm font-normal">Próximamente</span>
            </div>
          </Card>
        </Accordion>
      </div>
    </div>
  );
}
