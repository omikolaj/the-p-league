import { Component, OnInit } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Sport } from 'src/app/views/schedule/models/sport.enum';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-league-administration',
  templateUrl: './league-administration.component.html',
  styleUrls: ['./league-administration.component.scss']
})
export class LeagueAdministrationComponent implements OnInit {
  leagues: League[] = [{ name: "Monday", type: Sport.Basketball }, { name: "Friday", type: Sport.Basketball }, { name: "Sunday", type: Sport.Basketball }]
  newSessionForm: FormGroup = new FormGroup({    
    'newSportCategory': new FormControl(null),
    'selectedLeagues': new FormControl(this.leagues, Validators.required)
  })

  get sportTypes(){
    return Sport;
  }

  constructor() { }

  ngOnInit() {
  }

}
