import { environment } from 'src/environments/environment';

export interface ApiConfig {
  url: string;
  userRoute: string;
  projectRoute: string;
  internalSearchRoute: string;
  externalSearchRoute: string;
}

export const API_CONFIG: ApiConfig = {
  url: `${environment.apiUrl}/api/`,
  userRoute: 'user',
  projectRoute: 'project',
  internalSearchRoute: 'search/internal',
  externalSearchRoute: 'search/external'
};
