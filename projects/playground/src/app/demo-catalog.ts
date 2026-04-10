import { Type } from '@angular/core';

import { InputOutputModelDemoPage } from './input-output-model-demo-page';
import { RouterOutletDataDemoPage } from './router-outlet-data-demo-page';
import { SignalQueriesDemoPage } from './signal-queries-demo-page';

export interface DemoDefinition {
  slug: string;
  title: string;
  summary: string;
  tags: readonly string[];
  component: Type<unknown>;
}

export const demoCatalog: readonly DemoDefinition[] = [
  {
    slug: 'input-output-model',
    title: 'input(), output(), and model()',
    summary:
      'Parent-to-child inputs, child-to-parent typed events, and shared state through signal model bindings.',
    tags: ['signals', 'component APIs', 'two-way binding'],
    component: InputOutputModelDemoPage,
  },
  {
    slug: 'signal-queries',
    title: 'signal query APIs',
    summary:
      'Reactive viewChild, viewChildren, contentChild, and contentChildren queries with template and projected content.',
    tags: ['signals', 'queries', 'content projection'],
    component: SignalQueriesDemoPage,
  },
  {
    slug: 'router-outlet-data',
    title: 'routerOutletData on RouterOutlet',
    summary:
      'Pass contextual layout data from a parent outlet into routed child components without changing route definitions.',
    tags: ['router', 'context', 'nested routes'],
    component: RouterOutletDataDemoPage,
  },
];

export function findDemoBySlug(slug: string | null | undefined): DemoDefinition | undefined {
  return demoCatalog.find((demo) => demo.slug === slug);
}
