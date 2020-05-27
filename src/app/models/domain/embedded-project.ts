import { User } from "./user";
import { Project } from './project';

export interface EmbeddedProject {
    id: number;
    userId: number;
    user: User;
    projectId: number;
    project: Project;
    guid: string;
}
