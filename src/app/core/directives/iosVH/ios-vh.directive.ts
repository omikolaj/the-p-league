import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appIosVH]'
})
export class IosVHDirective {
  setVHFunc: Function = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  @HostListener('window:resize', ['$event']) onResize(){
    this.setVHFunc();
  }
  constructor() 
  { }

  ngOnInit(){
    this.setVHFunc();
  }

}
