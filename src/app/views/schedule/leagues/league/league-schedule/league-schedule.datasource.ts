import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { Team, TEAMS } from '../../../models/team.model';
import { Match } from '../../../models/match.model';
import { SportSession } from '../../../models/sport-session.model';
import { ScheduleService } from 'src/app/core/services/schedule/schedule.service';
import { MatchDays } from '../../../models/match-days.enum';
import * as moment from 'moment';
import { DateTimeRanges } from '../../../models/match-time-ranges.model';

export default class LeagueScheduleDataSource implements DataSource<Match>{
	private matchSubject$ = new BehaviorSubject<Match[]>([]);	

	constructor(private scheduleService: ScheduleService) {
	}

	connect(collectionViewer: CollectionViewer): Observable<Match[]> {
		return this.matchSubject$.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		throw new Error("Method not implemented.");
	}

	loadSchedule(sportSession?: SportSession): void {
		const dateTimeRanges: DateTimeRanges = {
			days: [
				MatchDays.Monday		
			],
			times: [
				{ hour: 21, minute: 0o0 },
				{ hour: 18, minute: 30 },
				{ hour: 16, minute: 45 }				
			],
			sportSession: {
				startDate: moment(new Date("9-29-2019")),
				endDate: moment(new Date("11-29-2019"))
			}
		}
		const matches: Match[] = this.scheduleService.generateSchedule(TEAMS, dateTimeRanges);

		this.matchSubject$.next(matches);
	}

}
