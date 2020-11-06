import {Injectable} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {RESOURCE_CONFIG} from 'src/app/config/resource-config';
import {UploadFile} from 'src/app/models/domain/uploadFile';

@Injectable({
    providedIn: 'root'
  })
export class FileRetrieverService {

    constructor(
        private sanitizer: DomSanitizer
    ) {}

   /**
   * Method to get the url of the icon of the project. This urls can be the local
   * image for a default or a specified icon stored on the server.
   * @param file retrieving the icon url of the specified file.
   */
    public getIconUrl(file: UploadFile): SafeUrl {
    if (file != null) {
      return this.sanitizer.sanitize(4, RESOURCE_CONFIG.url + file.path);
    }
    return 'assets/images/placeholder.svg';
  }
}
