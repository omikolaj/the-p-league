import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.scss']
})
export class AdminControlComponent implements OnInit{  
  constructor() { 
    
  }

  ngOnInit() {
    console.log("Create AdminControlComponent")
  }

}