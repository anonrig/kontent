import { runBuild, runDevelopmentServer } from '../build'
import { NextPluginOptions } from './index'
import type { Compiler, WebpackOptionsNormalized } from 'webpack'

let developmentServer = false

export class KontentWebpackPlugin {
  constructor(readonly pluginOptions: NextPluginOptions) {}

  apply(compiler: Compiler) {
    return compiler.hooks.beforeCompile.tapPromise('KontentWebpackPlugin', async () => {
      await runBeforeWebpackCompile({
        pluginOptions: this.pluginOptions,
        mode: compiler.options.mode,
      })
    })
  }
}

export const runBeforeWebpackCompile = async ({
  mode,
  pluginOptions,
}: {
  mode: WebpackOptionsNormalized['mode']
  pluginOptions: NextPluginOptions
}) => {
  const isNextDev = mode === 'development'
  const isBuild = mode === 'production'

  const { config } = pluginOptions

  if (isBuild) {
    await runBuild({ config })
  } else if (isNextDev && !developmentServer) {
    developmentServer = true
    runDevelopmentServer({ config })
  }
}
