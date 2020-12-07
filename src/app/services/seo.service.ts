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

  /** 
   * Updates the title tag of the webpage 
   * @param {string} title - Page title to be set, 1-3 word description of the page
   * @param {string} flavourText - Additional text to add, used for keywords
  */
  public updateTitle(title: string, flavourText?: string): void {
    let futuretitle = null
    // Verify if flavourtext has been passed as param
    if(flavourText){
      futuretitle =  flavourText + ' | ' + 'DeX - '  + title;
    }
    else{
      futuretitle = 'DeX - ' + title;
    }
    this.title.setTitle(futuretitle);
  }

  /**
   *  Updates the meta description of the webpage 
   * @param {string} desc - Description of the page, can be up to 155 chars
  */
  public updateDescription(desc: string): void {

    // Cut string if length is greater than 155
    if (desc.length > 155) {
      desc = desc.substring(0, 155);
    }
    this.meta.updateTag({ name: 'description', content: desc });
  }
}
