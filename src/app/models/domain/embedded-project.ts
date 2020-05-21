import { User } from "./user";
import { Project } from './project';

export interface EmbeddedProject {
    id: number;
    UserId: number;
    User: User;
    ProjectId: number;
    Project: Project;
    guid: string;
}
