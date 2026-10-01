import { SyncButton } from '@/features/youtube/presentation/sync-button';
import { GithubSyncButton } from '@/features/github/presentation/github-sync-button';
import { GoogleNewsSyncButton } from '@/features/googlenews/presentation/googlenews-sync-button';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export function FeedSection({ 
  children, 
  highlights, 
  currentTab 
}: { 
  children: React.ReactNode, 
  highlights?: React.ReactNode, 
  currentTab: string 
}) {
  return (
    <>
      {highlights && (
        <section className="flex flex-col gap-6 w-full">
          <div className="flex justify-center">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              Destacados
            </span>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {highlights}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <span className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider border-l-4 border-primary">
            Todo por plataforma
          </span>
          {currentTab === 'youtube' && <SyncButton />}
          {currentTab === 'github' && <GithubSyncButton />}
          {currentTab === 'googlenews' && <GoogleNewsSyncButton />}
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/?tab=youtube" className={buttonVariants({ variant: currentTab === 'youtube' ? 'default' : 'outline', size: 'sm' })}>
            YouTube
          </Link>
          <Link href="/?tab=x" className={buttonVariants({ variant: currentTab === 'x' ? 'default' : 'outline', size: 'sm' })}>
            X
          </Link>
          <Link href="/?tab=linkedin" className={buttonVariants({ variant: currentTab === 'linkedin' ? 'default' : 'outline', size: 'sm' })}>
            LinkedIn
          </Link>
          <Link href="/?tab=github" className={buttonVariants({ variant: currentTab === 'github' ? 'default' : 'outline', size: 'sm' })}>
            GitHub
          </Link>
          <Link href="/?tab=googlenews" className={buttonVariants({ variant: currentTab === 'googlenews' ? 'default' : 'outline', size: 'sm' })}>
            Google News
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {children}
        </div>
      </section>
    </>
  );
}
