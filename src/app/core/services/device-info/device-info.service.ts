import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Injectable({
	providedIn: 'root'
})
export class DeviceInfoService {
	private _mobile: boolean = true;

	get mobile(): boolean {
		return this._mobile;
	}
	set mobile(value: boolean) {
		this._mobile = value;
	}
	constructor(brekpointObserver: BreakpointObserver) {
		brekpointObserver.observe(['(min-width: 425px)']).subscribe((state: BreakpointState) => {
			if (state.matches) {
				this.mobile = false;
			} else {
				this.mobile = true;
			}
		});
	}

	// 	mobileFunction(): boolean {
	// 		this.mobile = this.deviceInfo.isMobile() || this.deviceInfo.isTablet();

	// 		return this.mobile;
	// 	}
}
