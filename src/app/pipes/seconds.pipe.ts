import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seconds',
  standalone: true,
})
export class SecondsPipe implements PipeTransform {
  transform(value: string | number): number {
    if (typeof value === 'string') value = parseInt(value);
    return value / 1000;
  }
}
