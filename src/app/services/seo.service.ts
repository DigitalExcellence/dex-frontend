import { Injectable } from '@angular/core';
import { Meta, Title} from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
  })
  export class SEOService {
  
    constructor(private title: Title, private meta: Meta) { }
  
    updateTitle(title: string) {
      this.title.setTitle(title);
    }

    updateOgUrl(url: string) {
      this.meta.updateTag({ name: 'og:url', content: url })
    }
  
    updateDescription(desc: string) {
      this.meta.updateTag({ name: 'description', content: desc })
    }
  }