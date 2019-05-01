import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderService } from 'src/app/core/services/header/header.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavToggle = new EventEmitter();
  @Input() appTitle: string;
  @Input() logo: string;  
  isSticky: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService
    ) 
  {
  }

  ngOnInit(){   
    this.headerService.isSticky$.subscribe(isSticky => this.isSticky = isSticky);
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

  

}
