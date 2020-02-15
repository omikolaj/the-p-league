import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[appClearElementValue]'
})
export class ClearElementValueDirective {
	// Attribute directive which sets the host element value to an empty string.
	// Example | selecting an image for upload stores the path of the
	// file to be uploaded in the elements value property.
	// If user removes that file from the upload array, and then tries to upload the
	// same file, the 'change' event will not be triggered because the path has not changed
	@HostListener('click', ['$event']) onclick(event: MouseEvent) {
		this.clearValue();
	}
	constructor(private el: ElementRef) {}

	clearValue() {
		const element = this.el.nativeElement as HTMLInputElement;
		element.value = '';
	}
}
