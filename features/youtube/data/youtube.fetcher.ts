import { YoutubeTranscript } from 'youtube-transcript';
import { YouTubeVideo } from './youtube.entity';
import { getSearchConfig, YouTubeSearchConfig } from './youtube.config.db';

// Utilidad para parsear duración ISO (ej. PT15M33S a 933 segundos)
function parseIsoDuration(duration: string | undefined): number {
  if (!duration) return 0;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// Verifica el API key
function requireApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('Falta configurar YOUTUBE_API_KEY en el archivo .env');
  }
  return apiKey;
}

// Fase 1: Resolución de canales
async function resolveChannelHandles(channelIds: string[] | undefined, apiKey: string): Promise<string[]> {
  if (!channelIds || channelIds.length === 0) return [];

  const promises = channelIds.map(async (rawId) => {
    if (rawId.startsWith('@')) {
      const handle = rawId.replace('@', '');
      try {
        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return data.items[0].id as string;
        }
      } catch (e) {
        console.error(`Error resolviendo el canal ${handle}:`, e);
      }
      return null;
    }
    return rawId;
  });

  // Ejecutamos la resolución en paralelo
  const resolved = await Promise.all(promises);
  return resolved.filter((id): id is string => id !== null); // Filtramos nulos
}

// Fase 2: Descubrimiento (Búsqueda concurrente)
async function fetchSearchCandidates(config: YouTubeSearchConfig, channelIds: string[], apiKey: string): Promise<any[]> {
  let query = (config.keywords || []).join(' | ');
  query = query ? `${query} -shorts -#shorts` : '-shorts -#shorts';

  const searchBaseUrl = new URL('https://youtube.googleapis.com/youtube/v3/search');
  searchBaseUrl.searchParams.set('part', 'snippet');
  searchBaseUrl.searchParams.set('q', query);
  searchBaseUrl.searchParams.set('type', 'video');
  // Eliminamos el filtro estricto de closedCaption que bloquea el 95% de videos recientes
  
  // Pedimos el MÁXIMO permitido por YouTube (50) para tener un colchón gigante.
  // Como los filtros locales (idioma, shorts) son tan agresivos, la mayoría serán descartados.
  searchBaseUrl.searchParams.set('maxResults', '50');
  searchBaseUrl.searchParams.set('order', 'date');
  searchBaseUrl.searchParams.set('key', apiKey);

  // Para evitar que múltiples sincronizaciones consecutivas devuelvan 0 resultados,
  // SIEMPRE buscamos los últimos 2 días y dejamos que la base de datos haga "upsert" (actualice las vistas).
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  searchBaseUrl.searchParams.set('publishedAfter', twoDaysAgo.toISOString());

  const languagesToSearch: string[] = config.languages && config.languages.length > 0 ? config.languages : ['any'];
  const searchPromises: Promise<any[]>[] = [];

  const addSearchPromise = (lang: string, channelId?: string) => {
    const url = new URL(searchBaseUrl.toString());
    if (lang !== 'any') {
      url.searchParams.set('relevanceLanguage', lang);
      if (lang === 'en') url.searchParams.set('regionCode', 'US');
      if (lang === 'es') url.searchParams.set('regionCode', 'MX');
    }
    if (channelId) {
      url.searchParams.set('channelId', channelId);
    }
    
    // Agregamos cache: 'no-store' para forzar resultados frescos siempre
    const p = fetch(url.toString(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => data.items || [])
      .catch(e => {
        console.error('Error en búsqueda de YouTube API:', e);
        return [];
      });
      
    searchPromises.push(p);
  };

  // 1. Buscar en canales específicos (si los hay)
  for (const channelId of channelIds) {
    const url = new URL(searchBaseUrl.toString());
    url.searchParams.set('channelId', channelId);
    url.searchParams.delete('q');
    
    const p = fetch(url.toString(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => data.items || [])
      .catch(e => { console.error(e); return []; });
    searchPromises.push(p);
  }

  // 2. Búsqueda global por keywords e idiomas (siempre y cuando haya keywords configurados)
  if ((config.keywords || []).length > 0) {
    for (const lang of languagesToSearch) {
      addSearchPromise(lang);
    }
  }

  // Disparamos TODAS las búsquedas al mismo tiempo
  const resultsMatrix = await Promise.all(searchPromises);
  let searchItems = resultsMatrix.flat();

  // Deduplicación
  const seenIds = new Set();
  searchItems = searchItems.filter(item => {
    const id = item.id?.videoId;
    if (!id || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  // Ordenar de más nuevo a más viejo globalmente
  searchItems.sort((a, b) => new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime());

  return searchItems;
}

// Fase 3: Enriquecimiento en Batch (Evita N llamadas a la API)
async function enrichVideoDetailsInBatch(searchItems: any[], apiKey: string): Promise<any[]> {
  const validItems = searchItems.filter(item => item.id?.videoId);
  
  if (validItems.length === 0) return [];

  // La API permite hasta 50 IDs en una sola petición
  const chunkSize = 50;
  const enrichedVideos: any[] = [];

  for (let i = 0; i < validItems.length; i += chunkSize) {
    const chunk = validItems.slice(i, i + chunkSize);
    const videoIds = chunk.map(item => item.id.videoId).join(',');
    
    const statsUrl = new URL('https://youtube.googleapis.com/youtube/v3/videos');
    statsUrl.searchParams.set('part', 'statistics,contentDetails,snippet');
    statsUrl.searchParams.set('id', videoIds);
    statsUrl.searchParams.set('key', apiKey);

    try {
      const res = await fetch(statsUrl.toString(), { cache: 'no-store' });
      const data = await res.json();
      
      if (data.items) {
        enrichedVideos.push(...data.items);
      }
    } catch (e) {
      console.error('Error enriqueciendo videos en batch:', e);
    }
  }
  
  // Re-ordenar basado en validItems (que ya venía ordenado cronológicamente)
  const orderMap = new Map();
  validItems.forEach((item, index) => orderMap.set(item.id.videoId, index));
  
  enrichedVideos.sort((a, b) => {
    return (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999);
  });

  return enrichedVideos;
}

// Fase 4: Filtrado estricto y Transcripción
async function filterAndFetchTranscripts(videosDetails: any[], config: YouTubeSearchConfig): Promise<YouTubeVideo[]> {
  const finalVideos: YouTubeVideo[] = [];
  const pushedPerChannel: Record<string, number> = {};
  let totalPushed = 0;
  
  const isGlobalSearch = !config.channelIds || config.channelIds.length === 0;
  
  const langsToTry: string[] = config.languages && config.languages.length > 0 && !config.languages.includes('any') 
      ? config.languages 
      : ['es', 'en'];

  // Regex para detectar caracteres de lenguajes no latinos (Hindi, Thai, Japonés, Coreano, Chino, Árabe, Cirílico)
  const foreignCharsRegex = /[\u0900-\u097F\u0E00-\u0E7F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\u0400-\u04FF\u0600-\u06FF]/;

  for (const item of videosDetails) {
    const videoId = item.id;
    const snippet = item.snippet;
    const channelId = snippet.channelId;
    
    // 1. Validar límite
    if (isGlobalSearch) {
      if (totalPushed >= (config.maxResults || 2)) break;
    } else {
      if ((pushedPerChannel[channelId] || 0) >= (config.maxResults || 2)) continue;
    }
    
    // 2. Filtro estricto de Idioma (Para evitar videos de Asia)
    const audioLang = snippet.defaultAudioLanguage || snippet.defaultLanguage;
    if (audioLang) {
      // Si el video declara su idioma explícitamente, debe coincidir con los que queremos
      const isAllowed = langsToTry.some(lang => audioLang.toLowerCase().startsWith(lang.toLowerCase()));
      if (!isAllowed) continue;
    } else {
      // Si no declara idioma, usamos Regex en el título para atrapar caracteres asiáticos/cirílicos/árabes
      if (foreignCharsRegex.test(snippet.title)) {
        continue;
      }
    }

    // 3. Filtro estricto de Shorts
    const contentDetails = item.contentDetails ?? {};
    const durationSeconds = parseIsoDuration(contentDetails.duration);
    if (durationSeconds <= 120) {
      continue;
    }

    // 4. Extracción de Transcripción (Opcional por solicitud del usuario)
    let transcript = 'Transcripción no disponible';

    for (const tLang of langsToTry) {
      try {
        const lines = await YoutubeTranscript.fetchTranscript(videoId, { lang: tLang });
        transcript = lines.map((l) => l.text).join(' ').trim();
        break; // Si tiene éxito, salimos del loop
      } catch {
        // Ignorar errores e intentar siguiente idioma
      }
    }

    const stats = item.statistics ?? {};

    finalVideos.push(
      new YouTubeVideo(
        videoId,
        snippet.title,
        snippet.channelTitle,
        new Date(snippet.publishedAt),
        `https://www.youtube.com/watch?v=${videoId}`,
        {
          views: parseInt(stats.viewCount ?? '0', 10),
          likes: parseInt(stats.likeCount ?? '0', 10),
          comments: parseInt(stats.commentCount ?? '0', 10),
        },
        snippet.thumbnails?.high?.url ?? snippet.thumbnails?.default?.url ?? '',
        transcript
      )
    );
    
    // 5. Contabilizamos el éxito
    pushedPerChannel[channelId] = (pushedPerChannel[channelId] || 0) + 1;
    totalPushed++;
  }
  
  return finalVideos;
}

// --- ENTRY POINTS ---

// Exportamos la nueva función con su nombre semántico
export async function searchYouTubeVideosPipeline(): Promise<YouTubeVideo[]> {
  const config = await getSearchConfig();
  const apiKey = requireApiKey();

  // Fase 1
  const channelIds = await resolveChannelHandles(config.channelIds, apiKey);

  // Fase 2
  const searchItems = await fetchSearchCandidates(config, channelIds, apiKey);
  if (searchItems.length === 0) return [];

  // Fase 3
  const enrichedVideos = await enrichVideoDetailsInBatch(searchItems, apiKey);

  // Fase 4
  return await filterAndFetchTranscripts(enrichedVideos, config);
}

// Mantenemos retrocompatibilidad con el nombre original por si se usa en otros archivos
export async function fetchAnthropicVideos(): Promise<YouTubeVideo[]> {
  return searchYouTubeVideosPipeline();
}
