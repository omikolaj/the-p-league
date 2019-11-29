import { Component, Input } from '@angular/core';
import 'hammerjs';
import { NgxGalleryOptions } from 'ngx-gallery';
import { EventBusService, Events } from 'src/app/core/services/event-bus/event-bus.service';
import { EmitEvent } from 'src/app/core/services/event-bus/EmitEvent';

@Component({
	selector: 'app-gallery-viewer',
	templateUrl: './gallery-viewer.component.html',
	styleUrls: ['./gallery-viewer.component.scss']
})
export class GalleryViewerComponent {
	@Input() images: any[] = [];
	@Input() ngxGalleryOptions: NgxGalleryOptions[] = [];

	constructor(private eventbus: EventBusService) {}

	onPreviewOpen() {
		this.eventbus.emit(new EmitEvent(Events.HideScrollbar, true));
	}

	onPreviewClose() {
		this.eventbus.emit(new EmitEvent(Events.HideScrollbar, false));
	}
}
