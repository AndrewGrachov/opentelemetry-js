/*!
 * Copyright 2020, OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BasePlugin } from '@opentelemetry/core';
import * as koaRouter from '@koa/router';
import * as shimmer from 'shimmer';

import {
  KoaRouterPluginConfig,
  PathParams,
  KoaRouter,
  KoaLayer,
  kLayerPatched,
} from './types';
import { VERSION } from './version';

/** Koa-router instrumentation plugin for OpenTelemetry */
export class KoaRouterPlugin extends BasePlugin<typeof koaRouter> {
  static readonly component = 'koa-router';
  protected _config!: KoaRouterPluginConfig;

  constructor(readonly moduleName: string) {
    super('@opentelemetry/plugin-koa-router', VERSION);
  }
  /**
   * Patches Koa-router
   */
  protected patch() {
    this._logger.debug('Patching Koa router');

    if (this._moduleExports === undefined || this._moduleExports === null) {
      return this._moduleExports;
    }

    const routerProto = (this._moduleExports as unknown) as koaRouter;
    shimmer.wrap(routerProto, 'register', this._getRegisterPatch.bind(this));

    return this._moduleExports;
  }

  /** Unpatches all Koa router patched functions. */
  unpatch(): void {
    const routerProto = (this._moduleExports as unknown) as koaRouter;
    shimmer.unwrap(routerProto, 'register');
  }

  /**
   * Get the patch for Router.register function
   * @param original
   */
  private _getRegisterPatch(
    original: (path: PathParams) => koaRouter.IMiddleware
  ) {
    const plugin = this;
    return function route_trace(
      this: KoaRouter,
      ...args: Parameters<typeof original>
    ) {
      const route = original.apply(this, args);
      const layer = this.stack[this.stack.length - 1] as KoaLayer;
      plugin._applyPatch(
        layer,
        typeof args[0] === 'string' ? args[0] : undefined
      );
      return route;
    };
  }

  _applyPatch(layer: KoaLayer, layerPath?: string) {
    const plugin = this;

    if (layer[kLayerPatched] === true) {
      return;
    }
    layer[kLayerPatched] = true;
    let stack = layer.stack;
    if (!Array.isArray(stack)) {
      stack = [stack];
    }
    const n = stack.length;
    for (let i = 0; i < n; i++) {
      const handler = stack[n];
    }
  }

  _getRouter() {}
}

export const plugin = new KoaRouterPlugin(KoaRouterPlugin.component);
