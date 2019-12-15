import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ScheduleState } from 'src/app/store/state/schedule.state';
import Match from 'src/app/views/schedule/models/classes/match.model';

@Injectable({
	providedIn: 'root'
})
export class LeaguesSchedulesDataSourceService implements DataSource<Match> {
	//private matchesSubject = new BehaviorSubject<Match[]>([]);
	@Select(ScheduleState.getMatches) matches$: Observable<Match[]>;

	constructor(private store: Store) {}

	/**
	 * @description Connect is called once when the table is bootstrap to receive its initial set of values
	 * @param [collectionViewer]
	 * @returns connect
	 */
	connect(collectionViewer?: CollectionViewer): Observable<Match[] | readonly Match[]> {
		//return this.store.select(ScheduleState.getMatches);
		return this.matches$;
	}
	disconnect(collectionViewer?: CollectionViewer): void {
		//this.matchesSubject.complete();
	}

	loadMatches(): void {
		const matches = this.store.select(ScheduleState.getMatches)
	}
}
