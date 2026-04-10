import { Type } from '@angular/core';

import { AngularMaterialFormDemoPage } from './angular-material-form-demo-page';
import { DynamicComponentBindingsDemoPage } from './dynamic-component-bindings-demo-page';
import { HttpResourceVsHttpClientDemoPage } from './http-resource-vs-http-client-demo-page';
import { InputOutputModelDemoPage } from './input-output-model-demo-page';
import { LinkedSignalDemoPage } from './linked-signal-demo-page';
import { RicherTemplateExpressionsDemoPage } from './richer-template-expressions-demo-page';
import { RouterOutletDataDemoPage } from './router-outlet-data-demo-page';
import { SignalFormsDemoPage } from './signal-forms-demo-page';
import { SignalQueriesDemoPage } from './signal-queries-demo-page';
import { ZonelessChangeDetectionDemoPage } from './zoneless-change-detection-demo-page';

export interface DemoDefinition {
  slug: string;
  title: string;
  summary: string;
  tags: readonly string[];
  component: Type<unknown>;
}

export const demoCatalog: readonly DemoDefinition[] = [
  {
    slug: 'angular-material-form',
    title: 'Angular Material support form',
    summary:
      'Combine Tailwind layout with Angular Material form fields, toggles, validation, and snack-bar feedback in a practical intake flow.',
    tags: ['angular material', 'forms', 'tailwind'],
    component: AngularMaterialFormDemoPage,
  },
  {
    slug: 'dynamic-component-bindings',
    title: 'dynamic component creation with bindings/directives',
    summary:
      'Create a runtime component with inputBinding, twoWayBinding, outputBinding, and host directives configured up front.',
    tags: ['components', 'dynamic rendering', 'signals'],
    component: DynamicComponentBindingsDemoPage,
  },
  {
    slug: 'http-resource-vs-http-client',
    title: 'httpResource vs HttpClient',
    summary:
      'Compare eager signal-driven reads from httpResource with explicit subscription-driven flows built on HttpClient.',
    tags: ['http', 'signals', 'observables'],
    component: HttpResourceVsHttpClientDemoPage,
  },
  {
    slug: 'linked-signal',
    title: 'linkedSignal for dependent writable state',
    summary:
      'Compare a plain signal with basic and advanced linkedSignal patterns when a source list changes under user selection.',
    tags: ['signals', 'state', 'linkedSignal'],
    component: LinkedSignalDemoPage,
  },
  {
    slug: 'signal-forms',
    title: 'signal-based forms',
    summary:
      'Build a form from one writable model signal and inspect validation, field state, and submit flow through Angular Signal Forms.',
    tags: ['forms', 'signals', 'experimental'],
    component: SignalFormsDemoPage,
  },
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
  {
    slug: 'richer-template-expressions',
    title: 'richer template expressions',
    summary:
      'Arrow functions, array and object spread, rest args in function calls, regex literals, and instanceof checks directly in Angular templates.',
    tags: ['templates', 'expressions', 'parser'],
    component: RicherTemplateExpressionsDemoPage,
  },
  {
    slug: 'zoneless-change-detection',
    title: 'zoneless change detection notifications',
    summary:
      'Compare signal updates, template event callbacks, and markForCheck() as the notifications Angular reacts to in zoneless mode.',
    tags: ['zoneless', 'change detection', 'signals'],
    component: ZonelessChangeDetectionDemoPage,
  },
];

export function findDemoBySlug(slug: string | null | undefined): DemoDefinition | undefined {
  return demoCatalog.find((demo) => demo.slug === slug);
}
