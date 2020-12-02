import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})

/**
 * This service is used for SEO within the project (Search Engine Optimization). This means that
 * all things related to modifying page metadata will be executed from this service.
 */
export class SEOService {

  constructor(private title: Title, private meta: Meta) { }

  // Updates the page title of the webpage
  public updateTitle(title: string): void {
    this.title.setTitle(title + ' - DeX');
  }

  /** Updates the meta description of the webpage */
  public updateDescription(desc: string): void {

    // Cut string if length is greater than 155
    if (desc.length > 155) {
      desc = desc.substring(0, 155);
    }
    this.meta.updateTag({ name: 'description', content: desc });
  }
}
