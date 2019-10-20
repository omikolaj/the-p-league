import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { HttpClient } from '@angular/common/http';
import { Team, TEAMS } from '../../../../views/schedule/models/interfaces/team.model';
import { ScheduleAdministrationService } from '../../schedule/schedule-administration/schedule-administration.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationResolver implements Resolve<Observable<League[]>> { 
  private leaguesSubject: BehaviorSubject<League[]> = new BehaviorSubject<League[]>([]);
  leagues$ = this.leaguesSubject.asObservable();
  teams: Team[] = TEAMS;

  constructor(private http: HttpClient, private scheduleAdminService: ScheduleAdministrationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<League[]> | Observable<Observable<League[]>> | Promise<Observable<League[]>> {
    console.log("Inside ScheduleAdministrationResolver");
    this.scheduleAdminService.sportTypes = [ 
      {
        name: "Basketball",
        leagues: [
          { name: "Monday", id:"1", type: { name: "Basketball" }, teams: [...this.teams] }, { name: "Friday", id: "2", type: { name: "Basketball" }, teams: [...this.teams] }, { name: "Sunday", id: "3", type: { name: "Basketball" }, teams: [...this.teams] }
        ]
      },
      {
        name: "Volleyball",
        leagues: [
          { name: "Monday", id: "6", type: { name: "Volleyball" }, teams: [...this.teams] }, { name: "Friday", id: "5", type: { name: "Volleyball" }, teams: [...this.teams] }, { name: "Saturday", id: "4", type: { name: "Volleyball" }, teams: [...this.teams] }
        ]
      },
      {
        name: "Soccer",
        leagues: [          
        ]
      }
    ];
    return of(this.scheduleAdminService.sportTypes)
  }
}
