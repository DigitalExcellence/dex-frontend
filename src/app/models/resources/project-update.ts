export interface ProjectUpdate {
  id: number;
  userId: number;
  contributors: string[];
  name: string;
  shortDescription: string;
  description: string;
  url: string;
}
