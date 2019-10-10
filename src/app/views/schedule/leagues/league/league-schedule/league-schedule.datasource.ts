import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { SessionScheduleService } from 'src/app/core/services/schedule/session-schedule/session-schedule.service';
import Match from '../../../models/classes/match.model';
import SessionSchedule from 'src/app/core/services/schedule/models/session-schedule.model';

export default class LeagueScheduleDataSource implements DataSource<Match>{
	private matchSubject$ = new BehaviorSubject<Match[]>([]);	

	constructor(private scheduleService: SessionScheduleService) {
	}

	connect(collectionViewer: CollectionViewer): Observable<Match[]> {
		return this.matchSubject$.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.matchSubject$.complete();
	}

	createSchedule(SessionSchedule: SessionSchedule): void {				
		const matches: Match[] = this.scheduleService.generateSchedule(SessionSchedule);

		this.matchSubject$.next(matches);
	}

}
