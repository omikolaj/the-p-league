import { Component, Input } from '@angular/core';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import 'hammerjs';
import { EmitEvent } from 'src/app/core/services/event-bus/EmitEvent';
import { EventBusService, Events } from 'src/app/core/services/event-bus/event-bus.service';

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
