import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {
  private _mobile: boolean = undefined;

  get mobile() {
    if (this._mobile === undefined) {
      return this.mobileFunction();
    }
    return this._mobile;
  }
  set mobile(value: boolean) {
    this._mobile = value;
  }
  constructor(private deviceInfo: DeviceDetectorService) { }

  mobileFunction(): boolean {
    console.log('DeviceDetectorService is', this.deviceInfo);
    this.mobile = this.deviceInfo.isMobile() || this.deviceInfo.isTablet();

    return this.mobile;
  }
}
