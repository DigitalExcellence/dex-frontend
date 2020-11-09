import { SafeUrl } from '@angular/platform-browser';

export interface UploadFile extends File {
    id: number;
    name: string;
    path: string;
    preview: SafeUrl;
    progress: number;
    inProgress: boolean;
    readableSize: string;
}
