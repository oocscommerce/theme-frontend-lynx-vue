# Lynx Vue

`oocscommerce/theme-frontend-lynx-vue`

The Vue 3 storefront theme of Lynx, styled with Tailwind CSS 4 and daisyUI 5.

## Features

- Assign it in Content > Design > Configuration
- Child themes with `bin/magento lynx:theme:create Vendor_Name`; a child overrides any component or script
- Each theme is its own npm project: `bin/magento lynx:theme:setup`, then `bin/magento lynx:static:deploy`

## Installation

Part of [Lynx](https://docs.oocscommerce.com/lynx/), installed with the metapackage:

```bash
composer require oocscommerce/magento2-lynx-community
```

See [Installation](https://docs.oocscommerce.com/lynx/developer/installation) for the full setup.

## Dependencies

- [`oocscommerce/module-lynx-theme`](https://github.com/oocscommerce/module-lynx-theme)
- [`oocscommerce/theme-frontend-lynx-blank`](https://github.com/oocscommerce/theme-frontend-lynx-blank)

## Documentation

https://docs.oocscommerce.com/lynx/

Building on Lynx with Claude Code: the [Lynx skills](https://github.com/oocscommerce/claude-skills) teach it to write components, providers, checkout methods and more.

## Community

Questions, ideas and help: join [Lynx on Slack](https://join.slack.com/t/lynxmagento/shared_invite/zt-4dd3wdz3k-DILaGAowU_p3nevNLJ1gbw).

## License

[OSL-3.0](LICENSE.txt) or [AFL-3.0](LICENSE_AFL.txt).
