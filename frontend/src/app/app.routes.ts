import { Routes } from '@angular/router';
import { clientRoutes } from './pages/client/client.routes';
import { adminRoutes } from './pages/admin/admin.routes';

export const routes: Routes = [
  ...clientRoutes,
  ...adminRoutes
];
