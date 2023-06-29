import { KontentWebpackPlugin } from './plugin'
import type { NextConfig } from 'next'
import type webpack from 'webpack'

export type NextPluginOptions = {
  config?: string
}
export const defaultPluginOptions: NextPluginOptions = {}

export const createKontentPlugin =
  (pluginOptions: NextPluginOptions = defaultPluginOptions) =>
  (nextConfig: Partial<NextConfig> = {}): Partial<NextConfig> => ({
    ...nextConfig,
    onDemandEntries: {
      maxInactiveAge: 60 * 60 * 1000,
      ...nextConfig.onDemandEntries,
    },
    webpack(config: webpack.Configuration, options: any) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules/!(.kontent)/**/*'],
      }

      config.plugins!.push(new KontentWebpackPlugin(pluginOptions))

      // NOTE workaround for https://github.com/vercel/next.js/issues/17806#issuecomment-913437792
      // https://github.com/contentlayerdev/contentlayer/issues/121
      config.module?.rules?.push({
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
