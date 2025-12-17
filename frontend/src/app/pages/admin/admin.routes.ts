import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminTransformationsComponent } from './admin-transformations/admin-transformations.component';
import { AdminAchievementsComponent } from './admin-achievements/admin-achievements.component';
import { authGuard } from '../../shared/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin-panel',
    component: AdminPanelComponent
  },
  {
    path: 'admin-panel/transformations',
    component: AdminTransformationsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin-panel/achievements',
    component: AdminAchievementsComponent,
    canActivate: [authGuard]
  }
];
