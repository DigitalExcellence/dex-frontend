export interface uploadFile extends File {
    preview: string,
    progress: number,
    inProgress: boolean,
    readableSize: string
}