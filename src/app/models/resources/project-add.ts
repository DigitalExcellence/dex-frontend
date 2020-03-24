export interface ProjectAdd {
  userId: number;
  name: string;
  contributors: string[];
  shortDescription: string;
  description?: string;
  url: string;
}
