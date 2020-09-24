export interface UploadFile extends File {
    id: number;
    path: string;
    preview: string;
    progress: number;
    inProgress: boolean;
    readableSize: string;
}
