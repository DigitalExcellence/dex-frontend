import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ReadVarExpr } from '@angular/compiler';
import { uploadFile } from 'src/app/models/domain/uploadFile';
import { FileUploaderService } from 'src/app/services/file-uploader.service';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {

  @Input() acceptMultiple: boolean;
  @Input() acceptedTypes: Array<String>;
  @Output() newFileEvent = new EventEmitter<File>();

  constructor(private uploadService: FileUploaderService) { }

  files: Array<uploadFile> = [];
  // local URL of the image
  url: string;

  /**
    * on file drop handler
    */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  prepareFilesList(files: Array<any>) {
    // If the user can only select 1 image we want to reset the array
    if (!this.acceptMultiple) {
      this.files = [];
    }
    for (const file of files) {
      if (this.acceptedTypes.includes(file.type)) {
        const fileReader: FileReader = new FileReader();
        fileReader.readAsDataURL(file)

        fileReader.onload = event => {
          file.preview = event.target.result;
          file.progress = 0;
        }
        this.files.push(file)
      }
      this.uploadFiles()
    }
  }

  private uploadFiles() {
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  /**
   * Upload the file
   */
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    file.inProgress = true;
    this.uploadService.uploadFile(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
        }
      });
  }
}
