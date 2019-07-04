import { Directive, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appIosVH]'
})
export class IosVHDirective implements OnInit {
  setVHFunc: Function = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.setVHFunc();
  }
  constructor() { }

  ngOnInit() {
    this.setVHFunc();
  }
}
