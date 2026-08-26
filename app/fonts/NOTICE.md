# Google Sans (self-hosted)

Files here are the **latin** subset of the Google Sans variable font (weights
400–700), fetched from the Google Fonts CDN on 2026-08-26:

| File | Source |
| --- | --- |
| `GoogleSans-Variable-latin.woff2` | `css2?family=Google+Sans:GRAD,opsz,wght@0,18,400..700` → latin `@font-face` |
| `GoogleSans-VariableItalic-latin.woff2` | same request, `ital` axis = 1, latin `@font-face` |

To refresh them, request the CSS with a modern-browser User-Agent (an older UA
gets `.ttf` instead of `.woff2`) and take the `src:` URL out of the block
commented `/* latin */`:

```
curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36" \
  "https://fonts.googleapis.com/css2?family=Google+Sans:ital,GRAD,opsz,wght@0,0,18,400..700;1,0,18,400..700&display=swap"
```

Only the latin subset is shipped, matching the subset Inter was previously
loaded with. Google's font metadata marks Google Sans `isOpenSource: true`, but
it is also a Google **brand** font and is not published in the open
`google/fonts` repository, so no license text ships alongside it. If that
matters for this deployment, swap `localFont` in `app/layout.tsx` for a
`<link>` to `fonts.googleapis.com` and let Google serve the binaries.
