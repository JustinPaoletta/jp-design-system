# @jp-design-system/tokens

Built design-token package with native ESM utilities, TypeScript declarations, generated CSS, and resolved token JSON. The system is dark-first, with neon/cobalt accents and default/compact density.

Import the stylesheet once in application global styles:

```css
@import '@jp-design-system/tokens/tokens.css';
```

`tokens.css` contains defaults, both accent families, and compact overrides. `@jp-design-system/tokens/tokens.compact.css` is also exported for optional separate overrides; it does not replace the default stylesheet. `@jp-design-system/tokens/tokens.json` exports resolved token data.

```ts
import { JP_DEFAULT_ACCENT, getAccentSelector, type JpAccentFamily } from '@jp-design-system/tokens';

const accent: JpAccentFamily = JP_DEFAULT_ACCENT;
const selector = getAccentSelector(accent);
```

Set `data-jp-accent="neon"` or `"cobalt"` and `data-jp-density="default"` or `"compact"` on the application root. UI styling should use semantic CSS variables rather than primitive palette values. Token utilities do not modify the DOM or install a stylesheet automatically.

Install the built local `.tgz` file; registry publication is not configured by the repository build. To edit/regenerate tokens, use the [source repository](https://github.com/JustinPaoletta/jp-design-system), where JSON sources live under `libs/tokens/src/tokens`. Build commands and source paths are for a repository checkout, not this installed package. The repository also contains distribution, API, quality, and security documentation.
