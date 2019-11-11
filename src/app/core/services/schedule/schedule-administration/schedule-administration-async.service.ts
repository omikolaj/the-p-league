import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Observable, of, throwError } from 'rxjs';
import { Team, TEAMS } from 'src/app/views/schedule/models/interfaces/team.model';
import { delay } from 'rxjs/internal/operators/delay';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { ScheduleAsyncService } from '../schedule-async.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationAsyncService extends ScheduleAsyncService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  addSport(newSportType: SportType): Observable<SportType> {
    return of(newSportType).pipe(delay(100));
  }

  updateSportTypes(updatedSportType: SportType): Observable<SportType> {
    console.log('inside async updateSportTypes', updatedSportType);
    return of(updatedSportType).pipe(delay(100));
  }

  deleteSportType(id: string): Observable<string> {
    return of(id).pipe(delay(100));
  }

  addLeague(newLeague: League): Observable<League> {
    newLeague.id = (Math.floor(Math.random() * 100) + 1).toString();
    return of(newLeague).pipe(delay(100));
  }

  updateLeagues(updatedLeagues: League[]): Observable<League[]> {
    return of(updatedLeagues).pipe(delay(100));
  }

  deleteLeagues(leaguesToDelete: string[]): Observable<string[]> {
    return of(leaguesToDelete).pipe(delay(100));
  }

  addTeam(newTeam: Team): Observable<Team> {
    newTeam.id = (Math.floor(Math.random() * 100) + 1).toString();
    return of(newTeam).pipe(delay(100));
  }
}
