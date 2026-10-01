'use server';

import { gqlFetch } from '@/lib/graphql-client';
import { RUN_MARKETING_PIPELINE, GET_MARKETING_CAMPAIGNS } from '@/lib/graphql-queries';
import { revalidatePath } from 'next/cache';

export async function getCampaignsAction(limit = 20) {
  try {
    const result: any = await gqlFetch(GET_MARKETING_CAMPAIGNS, { limit });
    return result?.getMarketingCampaigns || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
}

export async function generateCampaignAction(formData: FormData) {
  try {
    const limitPerSource = parseInt(formData.get('limitPerSource') as string, 10);
    const nClusters = parseInt(formData.get('nClusters') as string, 10);
    const minIntentScore = parseFloat(formData.get('minIntentScore') as string);
    const campaignType = formData.get('campaignType') as string;
    const translateNonEnglish = formData.get('translateNonEnglish') === 'on';

    const result: any = await gqlFetch(RUN_MARKETING_PIPELINE, {
      limitPerSource,
      nClusters,
      minIntentScore,
      campaignType,
      translateNonEnglish
    });

    revalidatePath('/campaigns');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al generar la campaña' };
  }
}
