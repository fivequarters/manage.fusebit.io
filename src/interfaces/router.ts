import { FC } from 'react';

export interface RouteItem {
  key: string;
  path: string;
  component: FC;
}
