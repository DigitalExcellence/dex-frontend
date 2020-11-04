export interface UploadFile extends File {
    id: number;
    name: string;
    path: string;
    preview: string;
    progress: number;
    inProgress: boolean;
    readableSize: string;
}
