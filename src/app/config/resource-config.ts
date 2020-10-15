import { environment } from 'src/environments/environment';

export interface ResourceConfig {
    url: string;
}

export const RESOURCE_CONFIG: ResourceConfig = {
    url: `${environment.apiUrl}/resources/`
}
