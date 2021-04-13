/*
 *
 *  Digital Excellence Copyright (C) 2020 Brend Smits
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published
 *   by the Free Software Foundation version 3 of the License.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU Lesser General Public License for more details.
 *
 *   You can find a copy of the GNU Lesser General Public License
 *   along with this program, in the LICENSE.md file in the root project directory.
 *   If not, see https://www.gnu.org/licenses/lgpl-3.0.txt
 *
 */

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { FileUploaderService } from 'src/app/services/file-uploader.service';
import { UploadFile } from 'src/app/models/domain/uploadFile';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';

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
  @Input() showPreview: Boolean;

  /**
   * The maximum size of a file in bytes
   */
  private maxFileSize = 2097152;

  /**
   * The maximum size of a file in a readable format
   */
  private maxFileSizeReadable: string = this.formatBytes(this.maxFileSize, 0);

  constructor(
    private uploadService: FileUploaderService,
    private alertService: AlertService,
    private fileRetrieverService: FileRetrieverService) { }

  public files: Array<UploadFile> = new Array<UploadFile>();

  /**
   * handle onFileDrop event
   */
  public onFileDropped(event): void {
    this.prepareFilesList(event);
  }

  /**
   * handle file from the file explorer
   */
  public fileBrowseHandler(files): void {
    if (files.files !== this.files) {
      this.prepareFilesList(files.files);
    }
  }

  /**
   * Delete file from files list
   * @param index The index of the file to delete
   */
  public deleteFile(index: number): void {
    this.files.splice(index, 1);
    this.fileInput.nativeElement.value = '';
  }


  /**
   * This will finalize the data from the uploadForm and do some filetype and -size checks.
   * @param files The uploaded files from the uploadForm
   */
  private prepareFilesList(files: Array<UploadFile>): void {
    // If the user can only select 1 image we want to reset the array
    if (!this.acceptMultiple) {
      this.files = [];
    }
    for (const file of files) {
      if (file.size < this.maxFileSize) {
        if (this.acceptedTypes.includes(file.type)) {
          this.generatePreview(file);
          file.readableSize = this.formatBytes(file.size);
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
          mainMessage: `File ${file.name} is too big, the max size is ${this.maxFileSizeReadable}`,
          dismissible: true,
          timeout: this.alertService.defaultTimeout
        };
        this.alertService.pushAlert(alertConfig);
        this.deleteFile(this.files.indexOf(file));
      }

    }
  }

  /**
   * Converts the image to a base64 string
   * @param file The file to convert
   */
  private generatePreview(file: UploadFile) {
    // We can use a FileReader to generate a base64 string based on the image
    const fileReader: FileReader = new FileReader();
    // Convert the file to base64
    fileReader.readAsDataURL(file);
    fileReader.onload = event => {
      file.preview = event.target.result as string;
    };
  }

  /**
   * Converts the bytes to a user-readable format
   * @param bytes The bytes to convert
   * @param decimals The amount of decimals to display
   */
  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) {
      return '0 bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  /**
   * Send the selected files to the API and return the id's
   * @return Observable<Array<UploadFile>>
   */
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
            }
          })
        )
      );
      // forkJoin the observables so they can be uploaded at the same time
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


  /**
   * Populates the fileList
   * @param files files that have been uploaded
   */
  public setFiles(uploadedFiles: Array<UploadFile>): void {
    uploadedFiles.forEach(uploadedFile => {
      if (uploadedFile) {
        this.files.push({
          ...uploadedFile,
          preview: this.fileRetrieverService.getIconUrl(uploadedFile)
        });
      }
    });
  }
}
