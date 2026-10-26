import { resolve, sep } from 'node:path'
import {
    createChunkNaming,
    CORE_UTIL_CHUNKS,
    defineLynxConfig,
    GLOBAL_STORES_DIR,
    REGISTRY_KEY,
    resolveSourceDirs,
} from '@oocs/module-lynx-theme'

const allSrcDirs = resolveSourceDirs(import.meta.dirname)

const { sourceKey, utilChunkName } = createChunkNaming(allSrcDirs)

// Every page needs them first: bundled into components.min.js (logical keys, so overrides match)
const CORE_COMPONENTS = ['OOCS_LynxTheme/Components/DynamicNode.vue', 'OOCS_LynxTheme/Pages/Default.vue']

// Entry and chunk grouping; group names pair with the preloads in OOCS_LynxInertia/templates/inertia.phtml
export default defineLynxConfig(import.meta.dirname, {
    build: {
        rollupOptions: {
            input: resolve(import.meta.dirname, 'src/main.ts'),
            output: {
                // ".min": static deploy copies it instead of re-minifying
                entryFileNames: 'main.min.js',
                // codeSplitting, not manualChunks (which treats names as hints)
                codeSplitting: {
                    groups: [
                        {
                            name: 'vendor-vue',
                            test: /node_modules\/(?:vue|pinia|@vue\/[^/]+)\//,
                            priority: 100,
                        },
                        {
                            name: 'vendor-inertia',
                            test: /node_modules\/(?:es-toolkit|@inertiajs\/[^/]+)\/|precognition-stub\.js$/,
                            priority: 100,
                        },
                        {
                            // Same name = same chunk; null = a chunk per component/page
                            priority: 1,
                            debugName: 'shared',
                            name(id) {
                                // One vendor-<pkg> chunk per library
                                if (id.includes('node_modules')) {
                                    // braintree-web: one chunk per SDK
                                    const braintreeSub = id.match(
                                        /node_modules\/braintree-web\/(?:dist\/browser\/)?([^/.]+)/
                                    )?.[1]
                                    if (braintreeSub) {
                                        return 'vendor-braintree-web-' + braintreeSub
                                    }
                                    const pkg = id.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1] ?? ''
                                    return 'vendor-' + pkg.replace('@', '').replace('/', '-')
                                }
                                if (id.includes('plugin-vue:export-helper')) {
                                    return 'components'
                                }
                                if (
                                    id === '\0virtual:lynx-components' ||
                                    id === '\0virtual:lynx-pages' ||
                                    sourceKey(id) === REGISTRY_KEY ||
                                    CORE_COMPONENTS.includes(sourceKey(id))
                                ) {
                                    return 'components'
                                }
                                // One chunk per util, the always-loaded ones into components
                                const util = utilChunkName(id)
                                if (util) {
                                    return CORE_UTIL_CHUNKS.includes(util) ? 'components' : util
                                }
                                if (id.includes(GLOBAL_STORES_DIR)) {
                                    return 'components'
                                }

                                return null
                            },
                        },
                    ],
                },
                chunkFileNames: chunk => {
                    // CommonJS interop helpers: only built with a CommonJS package, never preloaded
                    if (chunk.name === 'rolldown-runtime') {
                        return 'runtime.min.js'
                    }
                    // Component/page chunks named after their source key
                    const id = chunk.facadeModuleId
                    if (id) {
                        for (const { dir, prefix } of allSrcDirs) {
                            const d = resolve(dir)
                            if (id.startsWith(d + '/') || id.startsWith(d + sep)) {
                                const logical = id.slice(d.length + 1).replace(/\.vue$|\.tsx?$/, '.min.js')
                                return prefix ? `${prefix}/${logical}` : logical
                            }
                        }
                    }
                    return '[name].min.js'
                },
                assetFileNames: info => (info.name?.endsWith('.css') ? 'styles.min.css' : '[name].[ext]'),
            },
        },

        cssCodeSplit: false,
    },
})
