import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderService } from 'src/app/core/services/header/header.service';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { isString } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavToggle = new EventEmitter();
  @Input() appTitle: string;
  @Input() logo: string;  

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService,
    private scrollDispatcher: ScrollDispatcher
    ) 
  {
  }

  ngOnInit(){
    if(!this.headerService.isSticky){
      this.scrollDispatcher.scrolled().subscribe(x => console.log('I am scrolling', x));
    }    
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  

}
