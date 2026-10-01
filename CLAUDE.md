@AGENTS.md
Todo está alineado con la nueva estructura. El árbol final de la feature queda:

    features/youtube/
    ├── youtube.controller.ts       ← Server Actions (sync + saveConfig)
    ├── data/
    │   ├── youtube.entity.ts       ← Clase YouTubeVideo
    │   ├── youtube.db.ts           ← getVideos, saveVideo, countVideos
    │   ├── youtube.config.db.ts    ← getSearchConfig, saveSearchConfig
    │   └── youtube.fetcher.ts      ← fetchAnthropicVideos (YouTube API)
    └── presentation/
        ├── youtube-section.tsx     ← Server Component principal
        ├── youtube-card.tsx        ← Card individual
        ├── youtube-list.tsx        ← Lista de cards
        ├── youtube-config-form.tsx ← Formulario de config (ahora controlado)
        └── sync-button.tsx         ← Botón de sync (client)