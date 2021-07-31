# Fusebit Portal

## Getting started

1. Clone or fork this repo
2. `cd` into the project directory and run `npm install` or `yarn`
3. Copy `.env.example` to `.env` and edit integration and connector feed url

## Env file configuration

### Localhost
```
REACT_APP_INTEGRATIONS_FEED_URL=http://localhost:3000/feed/integrationsFeed.json
REACT_APP_CONNECTORS_FEED_URL=http://localhost:3000/feed/connectorsFeed.json
```

### Vercel

```
REACT_APP_INTEGRATIONS_FEED_URL=https://portal-fusebit-io.vercel.app/feed/connectorsFeed.json
REACT_APP_CONNECTORS_FEED_URL=https://portal-fusebit-io.vercel.app/feed/connectorsFeed.json
```

### Production
```
REACT_APP_INTEGRATIONS_FEED_URL=https://manage.fusebit.io/feed/integrationsFeed.json
REACT_APP_CONNECTORS_FEED_URL=https://manage.fusebit.io/feed/connectorsFeed.json
```

## Running and serving a dev build

```sh
npm run start
```

or

```sh
yarn start
```

Browse to [http://localhost:3000](http://localhost:3000).

## Running a prod build

```sh
npm i -g http-server
npm run build
http-server -p 5000 build
```

or

```sh
yarn add -g http-server
yarn build
http-server -p 5000 build
```

Browse to [http://localhost:5000](http://localhost:5000).

## Deploy in S3

1) Build the application

```sh
npm run build
```

or

```sh
yarn build
```

2) Upload `build` folder content into the bucket

```sh
aws s3 sync ./build s3://${bucket_name} --profile ${profile} --cache-control max-age=31536000
```

3) Refresh cloudfront (optional)
```sh
aws cloudfront create-invalidation --profile ${profile} --distribution-id ${cloudfront_id} --paths '/*'
```


## Technologies used

* [ReactJS](https://reactjs.org/)
* [MaterialUI](https://material-ui.com/)
* [StyledComponents](https://styled-components.com/)
* [Constate](https://github.com/diegohaz/constate)
* [ReactQuery](https://react-query.tanstack.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [ESLint](https://eslint.org/)

## Project structure

```
public/
    index.html and meta assets
src/
  assets/
    Images of te project
  components/
    All UI partials
  config/
    Configuration files
  hooks/
    Api calls and custom hooks
  pages/
    Each individual page template
  theme/
    MaterialUI Theming
  utils/
    Utility files
Configuration and build files
```