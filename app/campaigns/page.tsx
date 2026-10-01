import { getCampaignsAction } from '@/features/campaigns/campaigns.actions';
import { CampaignForm } from '@/features/campaigns/presentation/campaign-form';
import { CampaignList } from '@/features/campaigns/presentation/campaign-list';

export default async function CampaignsPage() {
  const campaigns = await getCampaignsAction(20);

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-12 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading font-semibold tracking-tight">Campañas de Marketing</h1>
        <p className="text-muted-foreground">Genera campañas y contenido para redes sociales a partir de los datos recolectados usando LLMs.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 sticky top-6">
          <CampaignForm />
        </div>
        
        <div className="lg:col-span-8">
          <CampaignList campaigns={campaigns} />
        </div>
      </div>
    </div>
  );
}
