import axios, { AxiosInstance } from 'axios';
import _startCase from 'lodash.startcase';
import { Entity, EntityComponent, Feed } from '../interfaces/feed';
import { FinalConnector } from '../interfaces/integrationDetailDevelop';
import { integrationsFeed, connectorsFeed } from '../static/feed';
import { Install } from '../interfaces/install';
import { X_USER_AGENT } from './constants';

export const findMatchingConnectorFeed = async (connector: Entity | FinalConnector) => {
  return new Promise<Feed>((accept, reject) => {
    if (connector.tags) {
      const feedtype = connector.tags['fusebit.feedType'];
      const feedId = connector.tags['fusebit.feedId'];
      if (feedtype === 'integration') {
        integrationsFeed().then((feed) => {
          feed.forEach((item) => {
            if (item.id === feedId) {
              return accept(item);
            }
          });
          return reject({});
        });
      } else {
        connectorsFeed().then((feed) => {
          feed.forEach((item) => {
            if (item.id === feedId) {
              return accept(item);
            }
          });
          return reject({});
        });
      }
    } else {
      return reject({});
    }
  });
};

export const startCase = (str: string) => {
  return _startCase(str.toLowerCase());
};

export const getConnectorsFromInstall = (install: Install) =>
  Object.keys(install.data || {}).map((key) => install?.data[key]?.parentEntityId);

export const getAllDependenciesFromFeed = (feed: Feed) => {
  const { entities } = feed?.configuration || {};

  const dependencies = Object.keys(entities).reduce<Record<string, string>>((acc, curr) => {
    const currDependencies = JSON.parse(entities[curr].data.files['package.json']).dependencies;

    Object.keys(currDependencies).forEach((key) => {
      acc[key] = currDependencies[key];
    });

    return acc;
  }, {});

  return dependencies;
};

const LINKED_DEPENDENCIES = {
  provider: 'connector',
};

export const linkPackageJson = (
  currPkgJson: Record<string, string>,
  dependencies: Record<string, string>,
  component: EntityComponent
) => {
  const newPackageJson = { ...currPkgJson };

  const [prefix, suffix] = component.provider.split('/');

  const [name, type] = suffix.split('-');

  const dependencyBaseName = `${prefix}/${name}`;

  const dependencyName = `${dependencyBaseName}-${
    LINKED_DEPENDENCIES[type as keyof typeof LINKED_DEPENDENCIES] || LINKED_DEPENDENCIES.provider
  }`;

  // @ts-ignore
  newPackageJson.dependencies[component.provider] = dependencies[dependencyName];

  return newPackageJson;
};

export const getPluralText = <T = unknown>(list: T[], noun?: string) => {
  const isPlural = list.length > 1;
  const pronoun = isPlural ? 'these' : 'this';

  return `${pronoun} ${noun}${isPlural ? 's' : ''}`;
};

export const createAxiosClient: (token?: string, skipXUserAgent?: boolean) => AxiosInstance = (
  token,
  skipXUserAgent
) => {
  const instance = axios.create({
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!skipXUserAgent) {
    instance.defaults.headers['X-User-Agent'] = X_USER_AGENT;
  }

  return instance;
};

export const urlOrSvgToImage = (img = '') =>
  img.match('^<svg') ? `data:image/svg+xml;utf8,${encodeURIComponent(img)}` : img;
