import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdminAdd } from '../../../models/admin-add-type.model';
import { Sport } from '../../../../schedule/models/sport.enum'; 
import { EmitEvent } from 'src/app/core/services/event-bus/EmitEvent';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.scss']
})
export class AdminAddComponent implements OnInit {  
  @Input('type') addType: AdminAdd;
  @Output() itemAdded = new EventEmitter<FormGroup>();

  addItemForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {  
    switch (this.addType.kind) {
      case 'team':        
        const leagueControls = []
        const leagues = this.addType.leagues.forEach(league => leagueControls.push(league))

        this.addItemForm = new FormGroup({
          teamName: new FormControl(null, Validators.required),
          leagues: new FormArray([], Validators.required)
        })
        break;
      case 'league':        
        // TODO
      default:
        break;
    }
  }

  onAddItem(){    
    this.itemAdded.emit(this.addItemForm);
  }
}
