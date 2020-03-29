import { ServiceType } from './service-type';

export interface LinkedService {
  service: ServiceType;
  refreshToken: string;
}
