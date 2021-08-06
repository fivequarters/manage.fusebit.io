# Fusebit Portal

## Getting started

1. Clone or fork this repo
2. `cd` into the project directory and run `npm install` or `yarn`
3. Copy `.env.example` to `.env` and update the values accordingly

## Env file configuration

### Localhost

```
REACT_APP_FUSEBIT_DEPLOYMENT=https://bruno.us-west-1.dev.fusebit.io
REACT_APP_AUTH0_DOMAIN=https://dev-zhwbl-rl.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=HXmmy0n9RWCdQkKIZiIozMbvK4DjyKRq
REACT_APP_LOGOUT_REDIRECT_URL=http://localhost:3000
REACT_APP_INTEGRATIONS_FEED_URL=http://localhost:3000/feed/integrationsFeed.json
REACT_APP_CONNECTORS_FEED_URL=http://localhost:3000/feed/connectorsFeed.json
```

### Vercel

```
REACT_APP_FUSEBIT_DEPLOYMENT=https://stage.us-west-2.fusebit.io
REACT_APP_AUTH0_DOMAIN=https://fusebit.auth0.com
REACT_APP_AUTH0_CLIENT_ID=dimuls6VLYgXpD7UYCo6yPdKAXPXjQng
REACT_APP_LOGOUT_REDIRECT_URL=https://fusebit.io
REACT_APP_INTEGRATIONS_FEED_URL=https://portal-fusebit-io.vercel.app/feed/connectorsFeed.json
REACT_APP_CONNECTORS_FEED_URL=https://portal-fusebit-io.vercel.app/feed/connectorsFeed.json
```

### Production

```
REACT_APP_FUSEBIT_DEPLOYMENT=https://api.fusebit.io
REACT_APP_AUTH0_DOMAIN=https://fusebit.auth0.com
REACT_APP_AUTH0_CLIENT_ID=dimuls6VLYgXpD7UYCo6yPdKAXPXjQng
REACT_APP_LOGOUT_REDIRECT_URL=https://fusebit.io
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

1. Build the application

```sh
npm run build
```

or

```sh
yarn build
```

2. Upload `build` folder content into the bucket

```sh
aws s3 sync ./build s3://${bucket_name} --profile ${profile} --cache-control max-age=31536000
```

3. Refresh cloudfront (optional)

```sh
aws cloudfront create-invalidation --profile ${profile} --distribution-id ${cloudfront_id} --paths '/*'
```

## Technologies used

- [ReactJS](https://reactjs.org/)
- [MaterialUI](https://material-ui.com/)
- [StyledComponents](https://styled-components.com/)
- [Constate](https://github.com/diegohaz/constate)
- [ReactQuery](https://react-query.tanstack.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)

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

## Headless

Pre-account-creation integrations template creation: `/quickstart?key={integrationTemplateKey}`

Post-account-creation integrations template creation: `/account/{accountId}/subscription/{subscriptionId}/integrations?key={integrationTemplateKey}`

Pre-account-creation connectors template creation: `/quickstart-connectors?key={integrationTemplateKey}`

Post-account-creation connectors template creation: `/account/{accountId}/subscription/{subscriptionId}/integrations?key={integrationTemplateKey}`
