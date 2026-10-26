import { defineLynxEslint } from '@oocs/module-lynx-theme'

// Logic rules only, formatting is Prettier's. Configs passed after the directory are appended and override its rules.
export default defineLynxEslint(import.meta.dirname)
