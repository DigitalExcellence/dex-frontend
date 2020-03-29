import { Project } from './project';
import { LinkedService } from './linked-service';

export interface User {
  id: number;
  name: string;
  email: string;
  projects: Project[];
  Services: LinkedService[];
  profileUrl: string;
}
