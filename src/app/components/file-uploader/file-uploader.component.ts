import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { UploadFile } from 'src/app/models/domain/uploadFile';
import { FileUploaderService } from 'src/app/services/file-uploader.service';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { AlertConfig } from '../../models/internal/alert-config';
import { AlertType } from '../../models/internal/alert-type';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {

  @Input() acceptMultiple: boolean;
  @Input() acceptedTypes: Array<String>;
  @Input() editFiles: Array<UploadFile>;
  @ViewChild('fileDropRef') fileInput: ElementRef;

  constructor(private uploadService: FileUploaderService,
              private alertService: AlertService) { }
  files: Array<UploadFile> = [];

  ngOnInit() {
    if (this.editFiles) {
      this.editFiles.forEach(editFile => {
        // Preview has to be changed when the infrastructure for showing the icons is in place.
        this.files.push({...editFile, preview: 'https://www.laurenillumination.com/wp-content/uploads/woocommerce-placeholder.png'});
      });
    }
  }

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
    this.prepareFilesList(files.files);
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
    const fileUploads = this.files.map(file => this.uploadService.uploadFile(file)
        .pipe(map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              // divide the (uploaded bytes * 100) by the total bytes to calculate the progress in percentage
              this.files.find(value => value.name === file.name).progress = Math.round(event.loaded * 100 / event.total);
              break;
            case HttpEventType.Response:
              return event.body;
          }}),
            catchError(() => {
              return of('Failed to upload files');
            })
        )
    );
    return forkJoin(fileUploads);
  }

  public setFiles(files: Array<UploadFile>) {
    this.files = files;
    this.prepareFilesList(files);
  }
}
