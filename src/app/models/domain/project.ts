import { User } from './user';
import { Collaborator } from './collaborator';

export interface Project {
  id: number;
  user: User;
  name: string;
  description: string;
  shortDescription?: string;
  created: Date;
  updated: Date;
  url: string;
  collaborators: Collaborator[];
}
