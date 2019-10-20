import { Component, OnInit, Input, Output, ViewChild, ElementRef, QueryList, EventEmitter } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { ScheduleAdministrationService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration.service';

import { SelectionModel } from '@angular/cdk/collections';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { SelectedLeagues } from 'src/app/core/services/schedule/interfaces/selected-leagues.model';

@Component({
  selector: 'app-edit-leagues-list',
  templateUrl: './edit-leagues-list.component.html',
  styleUrls: ['./edit-leagues-list.component.scss']
})
export class EditLeaguesListComponent implements OnInit {  
  @Input() leagues: League[] = [];
  @Input() sport: SportType;
  @Output() selectedLeagues = new EventEmitter<SportType>();  

  constructor() { }

  ngOnInit() {
  }

  onSelectionChange(event: MatSelectionListChange){
    const selectedLeaguesForSport = { ...this.sport };
    let leagues: League[] = [];
    for (let index = 0; index < event.source.selectedOptions.selected.length; index++) {
      const id = event.source.selectedOptions.selected[index].value;      
      leagues.push(this.leagues.find(l => l.id === id));
    }
    selectedLeaguesForSport.leagues = leagues;

    this.selectedLeagues.emit(selectedLeaguesForSport)
  }

}
