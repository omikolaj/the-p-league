import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Observable, of, throwError } from 'rxjs';
import { Team, TEAMS } from 'src/app/views/schedule/models/interfaces/team.model';
import { delay } from 'rxjs/internal/operators/delay';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { ScheduleAsyncService } from '../schedule-async.service';
import * as cuid from 'cuid';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationAsyncService extends ScheduleAsyncService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  //#region

  addSport(newSportType: SportType): Observable<SportType> {
    newSportType.id = cuid();
    return of(newSportType).pipe(delay(1000));
  }

  updateSportTypes(updatedSportType: SportType): Observable<SportType> {
    return of(updatedSportType).pipe(delay(100));
  }

  deleteSportType(id: string): Observable<string> {
    return of(id).pipe(delay(100));
  }

  //#endregion

  //#region

  addLeague(newLeague: League): Observable<League> {
    newLeague.id = cuid();
    return of(newLeague).pipe(delay(100));
  }

  updateLeagues(updatedLeagues: League[]): Observable<League[]> {
    return of(updatedLeagues).pipe(delay(100));
  }

  deleteLeagues(leaguesToDelete: string[]): Observable<string[]> {
    return of(leaguesToDelete).pipe(delay(100));
  }

  //#endregion

  //#region Teams

  addTeam(newTeam: Team): Observable<Team> {
    newTeam.id = cuid();
    return of(newTeam).pipe(delay(100));
  }

  updateTeams(updatedTeams: Team[]): Observable<Team[]> {
    return of(updatedTeams).pipe(delay(100));
  }

  unassignTeams(teamsToUnassign: string[]): Observable<string[]> {
    return of(teamsToUnassign).pipe(delay(100));
  }

  assignTeams(teamsToAssign: Team[]) {
    return of(teamsToAssign).pipe(delay(100));
  }

  deleteTeams(teamsToDelete: string[]): Observable<string[]> {
    return of(teamsToDelete).pipe(delay(100));
  }

  //#endregion
}
