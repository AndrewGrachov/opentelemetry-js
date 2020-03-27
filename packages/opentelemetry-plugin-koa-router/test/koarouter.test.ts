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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either koa-router or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { context } from '@opentelemetry/api';
import { NoopLogger } from '@opentelemetry/core';
import { NodeTracerProvider } from '@opentelemetry/node';
import { AsyncHooksScopeManager } from '@opentelemetry/scope-async-hooks';

import * as koaRouter from '@koa/router';

import {
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/tracing';

import { plugin } from '../src';

describe('Koa router plugin', () => {
  const logger = new NoopLogger();
  const provider = new NodeTracerProvider();
  const memoryExporter = new InMemorySpanExporter();
  const spanProcessor = new SimpleSpanProcessor(memoryExporter);
  provider.addSpanProcessor(spanProcessor);
  const tracer = provider.getTracer('default');
  let scopeManager: AsyncHooksScopeManager;

  before(() => {
    plugin.enable(koaRouter, provider, logger);
  });

  beforeEach(() => {
    scopeManager = new AsyncHooksScopeManager();
    context.setGlobalContextManager(scopeManager.enable());
  });

  afterEach(() => {
    memoryExporter.reset();
    scopeManager.disable();
  });
  describe('Instrumenting normal get operations', () => {});
});
