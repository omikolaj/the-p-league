import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'about',
				loadChildren: () => import('./views/about/about.module').then((m) => m.AboutModule)
			},
			{
				path: 'team',
				loadChildren: () => import('./views/about/components/team-signup/team-signup.module').then((m) => m.TeamSignupModule)
			},
			{
				path: 'schedules',
				loadChildren: () => import('./views/schedule/schedule.module').then((m) => m.ScheduleModule)
			},
			{
				path: 'merchandise',
				loadChildren: () => import('./views/merchandise/merchandise.module').then((m) => m.MerchandiseModule)
			},
			{
				path: 'gallery',
				loadChildren: () => import('./views/gallery/gallery.module').then((m) => m.GalleryModule)
			},
			{
				path: 'admin',
				loadChildren: () => import('./views/admin/admin.module').then((m) => m.AdminModule)
			},
			{
				path: 'logout',
				loadChildren: () => import('./core/components/logout/logout.module').then((m) => m.LogoutModule)
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
export class AppRoutingModule {}
