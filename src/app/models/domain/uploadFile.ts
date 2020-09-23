export interface UploadFile extends File {
    id: string;
    path: string;
    preview: string;
    progress: number;
    inProgress: boolean;
    readableSize: string;
}
