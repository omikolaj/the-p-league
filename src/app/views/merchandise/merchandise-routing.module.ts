import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesResolver } from 'src/app/core/resolvers/roles/roles-resolver.resolver';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { MerchandiseDialogContainerComponent } from './merchandise-dialog-container/merchandise-dialog-container.component';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';

const routes: Routes = [
	{
		path: '',
		component: MerchandiseListComponent,
		data: { animation: 'MerchandiseListPage' },
		resolve: { roles: RolesResolver, merchandiseItems: MerchandiseService }
	},
	{
		path: ':id/edit',
		outlet: 'modal',
		component: MerchandiseDialogContainerComponent
	},
	{
		path: ':id/pre-order',
		outlet: 'modal',
		component: MerchandiseDialogContainerComponent
	},
	{
		path: 'new',
		outlet: 'modal',
		component: MerchandiseDialogContainerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MerchandiseRoutingModule {}
