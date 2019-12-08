import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ScheduleState } from 'src/app/store/state/schedules.state';
import Match from 'src/app/views/schedule/models/classes/match.model';

@Injectable({
  providedIn: 'root'
})
export class LeaguesSchedulesDataSourceService implements DataSource<Match> {
  @Select(ScheduleState.getMatches) matches$: Observable<Match[]>;

	constructor() {}

	connect(collectionViewer: CollectionViewer): Observable<Match[] | readonly Match[]> {    
    return this.matches$;
	}
	disconnect(collectionViewer: CollectionViewer): void {
		// not sure if this is necessary
    console.log('running data source disconnect')
	}
}
