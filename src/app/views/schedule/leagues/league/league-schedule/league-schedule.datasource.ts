import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { ILeagueSessionSchedule } from 'src/app/core/services/schedule/interfaces/Ileague-session-schedule.model';
import { SessionScheduleService } from 'src/app/core/services/schedule/session-schedule/session-schedule.service';
import Match from '../../../models/classes/match.model';

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

	createSchedule(leagueSessionSchedule: ILeagueSessionSchedule): void {				
		const matches: Match[] = this.scheduleService.generateSchedule(leagueSessionSchedule);

		this.matchSubject$.next(matches);
	}

}
