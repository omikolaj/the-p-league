import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'log'
})
export class LogPipe implements PipeTransform {
	transform(value: any, ...args: any[]): any {
		console.log('From log pipe: ', value);
		return;
	}
}
