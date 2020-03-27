import { User } from './user';

export interface Project {
  id: number;
  user: User;
  name: string;
  description: string;
  shortDescription?: string;
  url: string;
  contributors: string[];
  created: Date;
  updated: Date;
}
