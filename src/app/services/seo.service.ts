import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class SEOService {

  constructor(private title: Title, private meta: Meta) { }

  updateTitle(title: string) {
    this.title.setTitle(title + ' - DeX');
  }

  updateDescription(desc: string) {
    if (desc.length > 155) {
      desc = desc.substring(0, 155);
    }
    this.meta.updateTag({ name: 'description', content: desc });
  }
}
