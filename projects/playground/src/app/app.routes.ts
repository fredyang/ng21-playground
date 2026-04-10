import { Routes } from '@angular/router';

import { DemoPage } from './demo-page';
import {
  RouterOutletActivityPanel,
  RouterOutletDataDemoPage,
  RouterOutletInspectorPanel,
  RouterOutletSummaryPanel,
} from './router-outlet-data-demo-page';

export const routes: Routes = [
  {
    path: 'demo/router-outlet-data',
    component: RouterOutletDataDemoPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'summary' },
      { path: 'summary', component: RouterOutletSummaryPanel },
      { path: 'inspector', component: RouterOutletInspectorPanel },
      { path: 'activity', component: RouterOutletActivityPanel },
    ],
  },
  { path: 'demo/:slug', component: DemoPage },
];
