import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes, RunGuardsAndResolvers } from '@angular/router';
import { Store } from '@ngxs/store';
import { ScheduleListResolver } from 'src/app/core/resolvers/schedule/schedule-list.resolver';
import { rootInjector } from 'src/app/root-injector';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';

const fetchSchedulesList: RunGuardsAndResolvers = (from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot): boolean => {
	console.log('inside predicate');
	const store = rootInjector.get(Store);
	store.selectSnapshot((state) => console.log('state', state));
	return false;
};

const routes: Routes = [
	{
		path: '',
		resolve: [ScheduleListResolver],
		component: ScheduleListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ScheduleRoutingModule {}
