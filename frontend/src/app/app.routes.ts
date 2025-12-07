import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminTransformationsComponent } from './components/admin-transformations/admin-transformations.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent
  },
  {
    path: 'admin-panel/transformations',
    component: AdminTransformationsComponent
  }
];
