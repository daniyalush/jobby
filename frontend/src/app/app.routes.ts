import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'profile',
    component: Profile,
  },
  {
    path: 'settings',
    component: Settings,
  },
];
