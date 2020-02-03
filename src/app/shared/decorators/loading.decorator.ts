import { HttpStatusService } from 'src/app/core/services/http-status/http-status.service';
import { rootInjector } from './../../root-injector';
export function Loading() {
	return function(target: any, key: string): void {
		const service = rootInjector.get(HttpStatusService);
		target[key] = service.loading$;
	};
}
