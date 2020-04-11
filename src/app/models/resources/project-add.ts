import { CollaboratorAdd } from './contributor-add';
export interface ProjectAdd {
  userId: number;
  name: string;
  collaborators: CollaboratorAdd[];
  shortDescription: string;
  description?: string;
  url: string;
}
