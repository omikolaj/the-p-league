import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { ScheduleState } from 'src/app/shared/store/state/schedule.state';

export class LeaguesSchedulesDataSourceService implements DataSource<Match>, OnDestroy {
	private matchesSubject$ = new BehaviorSubject<Match[]>([]);
	private unsubscribe$ = new Subject();
	@Select(ScheduleState.getActiveSessionsMatches) private matches$: Observable<Match[]>;

	constructor() {
		// sync up this subject with the observable stream of matches inside the store
		this.matches$.pipe(takeUntil(this.unsubscribe$)).subscribe(this.matchesSubject$);
	}

	/**
	 * @description Connect is called once when the table is bootstrap to receive its initial set of values
	 * @param [collectionViewer]
	 * @returns connect
	 */
	connect(collectionViewer: CollectionViewer): Observable<Match[] | readonly Match[]> {
		console.log('inside connect method');
		return this.matchesSubject$.asObservable();
	}
	disconnect(collectionViewer: CollectionViewer): void {
		this.matchesSubject$.complete();
	}

	/**
	 * @description on destroy is the only life cycle hook called inside services.
	 * Using it to clean up logic
	 */
	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	filterOnLeagueID(leagueID: string): void {
		let matches = this.matchesSubject$.getValue();
		matches = matches.filter((match) => match.leagueID === leagueID);
		this.matchesSubject$.next(matches);
	}
}
