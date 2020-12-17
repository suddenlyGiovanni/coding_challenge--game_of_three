const path = require('path')
const rootMain = require('../../../.storybook/main')

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(
  ...[
    '../src/components/**/*.stories.mdx',
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
  ]
)

// @ts-ignore
rootMain.addons.push(
  ...[
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          test: [/\.stories\.tsx?$/], // This is default
          include: [path.resolve(__dirname, '../src')], // You can specify directories
        },
        loaderOptions: {
          prettierConfig: { printWidth: 80, singleQuote: true },
          injectStoryParameters: false,
        },
      },
    },
  ]
)

module.exports = rootMain
