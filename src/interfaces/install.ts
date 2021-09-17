import { Tags } from './tags';

export interface InstallInstance {
  id: string;
  data: object;
  tags: Tags;
  version: string;
  expires: string;
}

export interface Install {
  items: InstallInstance[];
  total: number;
  next: string;
}
