import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {
  @Output() sideNavClose = new EventEmitter();
  @Input() appTitle: string;
  constructor() { }

  ngOnInit() {
  }

  onSidenavClose(): void {
    this.sideNavClose.emit();
  }

}
