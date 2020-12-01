import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  public transform(date: string): string {
    return date ? moment(date).format('DD-MM-YYYY') : 'Never ending';
  }
}
