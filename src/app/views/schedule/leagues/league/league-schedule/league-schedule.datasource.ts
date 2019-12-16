import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import Match from 'src/app/core/models/schedule/classes/match.model';

export default class LeagueScheduleDataSource implements DataSource<Match> {
	private matchSubject$ = new BehaviorSubject<Match[]>([]);

	constructor() {}

	connect(collectionViewer: CollectionViewer): Observable<Match[]> {
		return this.matchSubject$.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.matchSubject$.complete();
	}
}
