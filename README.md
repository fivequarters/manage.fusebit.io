# Fusebit Portal

## Getting started

1. Clone or fork this repo
2. `cd` into the project directory and run `npm install` or `yarn`

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