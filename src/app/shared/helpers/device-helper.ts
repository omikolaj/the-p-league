import { DeviceDetectorService } from "ngx-device-detector";

export const epicFunction = (
  deviceService: DeviceDetectorService
): DeviceInformation => {
  return {
    isMobile: deviceService.isMobile(),
    isTablet: deviceService.isTablet(),
    isDesktop: deviceService.isDesktop()
  };
};

export interface DeviceInformation {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
