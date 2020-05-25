import { MappedCollaborator } from './mapped-collaborator';
export interface MappedProject {
    name: string;
    collaborators: MappedCollaborator[];
    shortDescription: string;
    description?: string;
    uri: string;
}
