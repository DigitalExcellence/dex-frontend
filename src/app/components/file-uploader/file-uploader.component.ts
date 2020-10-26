import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { FileUploaderService } from 'src/app/services/file-uploader.service';
import { UploadFile } from 'src/app/models/domain/uploadFile';

/**
 * Component that will function as a form to upload files of any type
 */
@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {

  @ViewChild('fileDropRef') fileInput: ElementRef;
  @Input() acceptMultiple: boolean;
  @Input() acceptedTypes: Array<String>;

  private maxFileSize = 2097152;

  constructor(private uploadService: FileUploaderService,
              private alertService: AlertService) { }

  files: Array<UploadFile> = new Array<UploadFile>();

  /**
   * on file drop handler
   */
  onFileDropped(event) {
    this.prepareFilesList(event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
     if (files.files !== this.files) {
      this.prepareFilesList(files.files);
     }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.fileInput.nativeElement.value = '';
  }

  private prepareFilesList(files: Array<UploadFile>) {
    // If the user can only select 1 image we want to reset the array
    if ( !this.acceptMultiple) {
      this.files = [];
    }
    for (const file of files) {
      if (file.size < this.maxFileSize) {
        if (this.acceptedTypes.includes(file.type)) {
          this.generatePreview(file);
          this.formatBytes(file);
          this.files.push(file);
        } else {
          const alertConfig: AlertConfig = {
            type: AlertType.danger,
            preMessage: 'This file type is not allowed',
            mainMessage: `File ${file.name} is of type that is not allowed please pick one of these ${this.acceptedTypes.join(', ')}`,
            dismissible: true,
            timeout: this.alertService.defaultTimeout
          };
          this.alertService.pushAlert(alertConfig);
          this.deleteFile(this.files.indexOf(file));
        }
      } else {
        const alertConfig: AlertConfig = {
          type: AlertType.danger,
          preMessage: 'This file is too big',
          mainMessage: `File ${file.name} is too big, the max size is 2mb`,
          dismissible: true
        };
        this.alertService.pushAlert(alertConfig);
        this.deleteFile(this.files.indexOf(file));
      }

    }
  }

  private generatePreview(file: UploadFile) {
    // We can use a FileReader to generate a base64 string based on the image
    const fileReader: FileReader = new FileReader();
    // Convert the file to base64
    fileReader.readAsDataURL(file);
    fileReader.onload = event => {
      file.preview = event.target.result as string;
    };
  }

  private formatBytes(file: UploadFile, decimals = 2) {
    const bytes: number = file.size;
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    file.readableSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  public uploadFiles(): Observable<Array<UploadFile>> {
    // Check if any files were uploaded
    if (this.fileInput.nativeElement.value !== '') {
      // Map all the files to an observable
       const fileUploads = this.files.map(file => this.uploadService.uploadFile(file)
          .pipe(
              map(event => {
                switch (event.type) {
                  case HttpEventType.UploadProgress:
                    // divide the (uploaded bytes * 100) by the total bytes to calculate the progress in percentage
                    this.files.find(value => value.name === file.name).progress = Math.round(event.loaded * 100 / event.total);
                    break;
                  case HttpEventType.Response:
                    return event.body;
                  default:
                    return;
                }})
          )
      );
       return forkJoin(fileUploads);
    }
    // If no files were updated return original list

    // If there are any files left in the list
    if (this.files.length) {
      // Return the original list
      return of(this.files);
    } else {
      // If there are no files in the list return undefined
      return of(undefined);
    }
  }

  public setFiles(editFiles: Array<UploadFile>) {
    editFiles.forEach(editFile => {
      // TODO: Preview has to be changed when the infrastructure for showing the icons is in place.
      // See https://github.com/DigitalExcellence/dex-frontend/issues/311
      this.files.push({
        ...editFile,
        preview: '/assets/images/project-icon-placeholder.png'});
    });
  }
}