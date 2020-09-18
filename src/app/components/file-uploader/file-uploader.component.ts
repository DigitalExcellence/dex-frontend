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
  @Output() fileUploaded = new EventEmitter<string>();

  constructor(private uploadService: FileUploaderService) { }

  files: Array<uploadFile> = [];

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

  prepareFilesList(files: Array<uploadFile>) {
    // If the user can only select 1 image we want to reset the array
    if (!this.acceptMultiple) {
      this.files = [];
    }
    for (const file of files) {
      if (this.acceptedTypes.includes(file.type)) {
        this.generatePreview(file);
        this.formatBytes(file)
        this.files.push(file)
      }
    }
  }

  private generatePreview(file: uploadFile) {
    // We can use a FileReader to generate a base64 string based on the image
    const fileReader: FileReader = new FileReader();
    // Convert the file to base64
    fileReader.readAsDataURL(file)
    fileReader.onload = event => {
      file.preview = event.target.result as string;
    }
  }

  private formatBytes(file: uploadFile, decimals = 2) {
    let bytes: number = file.size;
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    file.readableSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  uploadFiles(cb) {
    let files = [];
    this.files.forEach(file => {
      this.uploadFile(file, (file) => {
        console.log(file)
        files.push(file);
      });
    });
      cb(files);
  }

  /**
   * Upload the file
   */
  private uploadFile(file, cb) {
    const formData: FormData = this.buildFormData(file);
    // Call the service to upload the file
    this.uploadService.uploadFile(formData)
      .pipe
      (map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            // divide the (uploaded bytes * 100) by the total bytes to calculate the progess in percentage
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
        catchError((error: HttpErrorResponse) => {
          // If the upload errors, notify the user
          return of(`${file.name} upload failed.`);
        })
      )
      .subscribe
      ((event: any) => {
        if (typeof (event) === 'object') {
          // File uploaded successfully
          console.log(`DATA: ${event.body.data}`);
            cb(event.body.data.fileName)
          }
        }
      );
  }

  private buildFormData(file): FormData {
    // Build a formdata object and add the fileData
    const formData = new FormData();
    formData.append('File', file);
    return formData;
  }
}
