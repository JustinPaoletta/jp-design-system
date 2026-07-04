import type { StorybookConfig } from '@storybook/angular';
import type { Configuration } from 'webpack';
import webpack from 'webpack';

function isDefinePlugin(
  plugin: NonNullable<Configuration['plugins']>[number],
): plugin is InstanceType<typeof webpack.DefinePlugin> {
  return (
    Boolean(plugin) &&
    typeof plugin === 'object' &&
    plugin.constructor?.name === 'DefinePlugin' &&
    'definitions' in plugin
  );
}

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (webpackConfig: Configuration) => {
    const definitions: Record<string, unknown> = {};
    const plugins = webpackConfig.plugins ?? [];

    for (const plugin of plugins) {
      if (isDefinePlugin(plugin)) {
        Object.assign(
          definitions,
          plugin.definitions as Record<string, unknown>,
        );
      }
    }

    webpackConfig.plugins = plugins.filter((plugin) => !isDefinePlugin(plugin));

    delete definitions['process.env'];
    for (const key of Object.keys(definitions)) {
      if (key === 'process.env.NODE_ENV' || key.startsWith('process.env.')) {
        delete definitions[key];
      }
    }

    definitions['process.env.NODE_ENV'] = JSON.stringify(
      process.env.NODE_ENV ?? 'development',
    );

    webpackConfig.plugins.push(
      new webpack.DefinePlugin(
        definitions as ConstructorParameters<typeof webpack.DefinePlugin>[0],
      ),
    );

    webpackConfig.ignoreWarnings = [
      ...(webpackConfig.ignoreWarnings ?? []),
      (warning) =>
        typeof warning.message === 'string' &&
        warning.message.includes(
          "Conflicting values for 'process.env.NODE_ENV'",
        ),
    ];

    return webpackConfig;
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
