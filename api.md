# API Reference — newsss-core

Backend GraphQL corriendo en Railway.

**Endpoint:** `POST https://newsss-core-production.up.railway.app/graphql`  
**Header requerido:** `x-api-key: <GRAPHQL_API_KEY>`  
**Content-Type:** `application/json`

---

## Queries disponibles

### `getRecentYoutubeVideos`
Devuelve los videos de YouTube más recientes guardados en la base de datos.

**Args:**
| Nombre | Tipo | Default |
|--------|------|---------|
| `limit` | `Int` | `50` |
| `offset` | `Int` | `0` |

**Respuesta:**
```graphql
{
  id: String
  title: String
  channel: String
  publishedAt: String   # ISO 8601
  url: String
  thumbnailUrl: String
  transcript: String
  metrics: {
    views: Int
    likes: Int
    comments: Int
  }
}
```

---

### `getYoutubeConfig`
Devuelve la configuración activa de búsqueda de YouTube.

**Args:** ninguno

**Respuesta:**
```graphql
{
  id: Int
  keywords: [String]
  channelIds: [String]
  languages: [String]
  maxResults: Int
  lastSearchAt: String  # ISO 8601 | null
}
```

---

### `getRecentGithubRepos`
Devuelve los repositorios de GitHub más recientes guardados en la base de datos.

**Args:**
| Nombre | Tipo | Default |
|--------|------|---------|
| `limit` | `Int` | `50` |
| `offset` | `Int` | `0` |

**Respuesta:**
```graphql
{
  id: Int
  name: String
  fullName: String
  htmlUrl: String
  description: String
  stargazersCount: Int
  language: String
  updatedAt: String     # ISO 8601
  topics: [String]
  readme: String
  ownerAvatarUrl: String | null
  forksCount: Int | null
  openIssuesCount: Int | null
  license: String | null   # e.g. "mit", "apache-2.0"
}
```

---

### `getGithubConfig`
Devuelve la configuración activa de búsqueda de GitHub.

**Args:** ninguno

**Respuesta:**
```graphql
{
  id: Int
  keywords: [String]
  daysActive: Int
  minStars: Int
  minForks: Int
  requireLicense: Boolean
  selectedTopics: [String]
  selectedLanguages: [String]
  maxResults: Int
  lastSearchAt: String  # ISO 8601 | null
}
```

---

### `getRecentNewsArticles`
Devuelve los artículos de Google News más recientes guardados en la base de datos.

**Args:**
| Nombre | Tipo | Default |
|--------|------|---------|
| `limit` | `Int` | `50` |
| `offset` | `Int` | `0` |

**Respuesta:**
```graphql
{
  id: String
  title: String
  link: String
  pubDate: String       # RFC 2822 o ISO 8601
  sourceName: String
  sourceUrl: String
  fetchedAt: String     # ISO 8601
  imageUrl: String | null
  content: String | null
}
```

---

### `getGoogleNewsConfig`
Devuelve la configuración activa de búsqueda de Google News.

**Args:** ninguno

**Respuesta:**
```graphql
{
  id: Int
  q: String             # Query de búsqueda
  hl: String            # Idioma de la interfaz (e.g. "es-419")
  gl: String            # País (e.g. "MX")
  ceid: String          # Country+Edition ID (e.g. "MX:es-419")
  when: String | null   # Rango de tiempo (e.g. "1d", "7d")
  site: String | null   # Filtro por sitio
  intitle: String | null
  maxResults: Int
  lastSearchAt: String  # ISO 8601 | null
}
```

---

## Queries pendientes (sin vista aún)

| Query | Args |
|-------|------|
| `getMarketingCampaigns` | `limit: Int = 20`, `status: String?` |
| `getContentClusters` | `limit: Int = 10` |

---

## Ejemplo de llamada

```bash
curl -X POST https://newsss-core-production.up.railway.app/graphql \
  -H "Content-Type: application/json" \
  -H "x-api-key: $GRAPHQL_API_KEY" \
  -d '{"query":"{ getRecentYoutubeVideos(limit: 5) { id title channel publishedAt } }"}'
```

---

## Variables de entorno requeridas (frontend)

| Variable | Descripción |
|----------|-------------|
| `GRAPHQL_API_URL` | URL del endpoint GraphQL |
| `GRAPHQL_API_KEY` | API key para el header `x-api-key` |

Configurar en `.env.local` para desarrollo y en Railway/Vercel para producción.
