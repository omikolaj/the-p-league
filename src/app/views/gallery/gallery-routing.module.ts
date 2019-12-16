import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesResolver } from 'src/app/core/resolvers/roles/roles-resolver.resolver';
import { GalleryService } from 'src/app/core/services/gallery/gallery.service';
import { GalleryGridListComponent } from './gallery-grid-list.component';

const routes: Routes = [
	{
		path: '',
		component: GalleryGridListComponent,
		// data: { animation: "GalleryGridListPage" },
		resolve: { roles: RolesResolver, leaguePictures: GalleryService }
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GalleryRoutingModule {}
