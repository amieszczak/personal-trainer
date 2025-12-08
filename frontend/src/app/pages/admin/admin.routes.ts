import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminTransformationsComponent } from './admin-transformations/admin-transformations.component';
import { AdminAchievementsComponent } from './admin-achievements/admin-achievements.component';

export const adminRoutes: Routes = [
  {
    path: 'admin-panel',
    component: AdminPanelComponent
  },
  {
    path: 'admin-panel/transformations',
    component: AdminTransformationsComponent
  },
  {
    path: 'admin-panel/achievements',
    component: AdminAchievementsComponent
  }
];
