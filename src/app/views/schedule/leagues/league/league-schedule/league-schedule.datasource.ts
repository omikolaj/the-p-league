import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { Team, TEAMS } from '../../../models/team.model';
import { Match } from '../../../models/match.model';
import { SportSession } from '../../../models/sport-session.model';
import { ScheduleService } from 'src/app/core/services/schedule/schedule.service';

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

    loadSchedule(sportSession?: SportSession): void{
      const matches: Match[] = this.scheduleService.generateSchedule(8, TEAMS);

      this.matchSubject$.next(matches);
    }
      
}
