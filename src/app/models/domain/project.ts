import { User } from './user';

export interface Project {
  id: number;
  user: User;
  name: string;
  shortDescription?: string;
  description: string;
  createdDate: Date;
  url: string;
  contributors: string[];
}
