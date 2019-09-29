import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'about',
        loadChildren: './views/about/about.module#AboutModule'
      },
      {
        path: 'team',
        loadChildren:
          './views/about/components/team-signup/team-signup.module#TeamSignupModule'
      },
      {
        path: 'schedule',
        loadChildren: './views/schedule/schedule.module#ScheduleModule'
      },
      {
        path: 'merchandise',
        loadChildren: './views/merchandise/merchandise.module#MerchandiseModule'
      },
      {
        path: 'gallery',
        loadChildren: './views/gallery/gallery.module#GalleryModule'
      },
      {
        path: 'admin-login',
        loadChildren: './views/admin/admin.module#AdminModule'
      },
      {
        path: 'logout',
        loadChildren: './components/logout/logout.module#LogoutModule'
      },
      {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      enableTracing: false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
