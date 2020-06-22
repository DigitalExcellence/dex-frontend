import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'striphtml'
})
// strips tags from string
export class StripHtmlPipe implements PipeTransform {
    public transform(value: string): string {
        return value.replace(/<.*?>/g, '');
    }
}
