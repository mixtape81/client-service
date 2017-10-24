# Mixtape
## Client Service

Mixtape looks to track the performance of music playlists overtime. The client service is responsible for storing user details, as well as serving playlists to frontend requests as quickly and efficiently as possible.

## Roadmap

View the project roadmap [here](LINK_TO_DOC)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)

## Usage

For development:
- npm start: start node server using *nodemon*
- npm test: run mocha tests for server, database, and GraphQL endpoints

## Requirements
Main Dependencies:
- Express 4.16.2
- Express-GraphQL 0.6.11
- GraphQL 0.11.7
- Node 8.3.0
- PG 7.3.0
- Sequelize 4.15.1

Development Dependencies:
- Babel
- Chai
- Eslint
- Mocha
- Nodemon
- Supertest

## Development
### Airbnb Style Guide
*Note that the following instructions are written for setting up the [Airbnb eslint] (https://www.npmjs.com/package/eslint-config-airbnb) package with npm. If using another package manager for dependencies such as [Yarn] (https://yarnpkg.com/en/) or [Bower] (https://bower.io/), refer to official documentation for instructions on installing and configuring the following packages.*

This project adheres to the format rules as laid out in the [Airbnb Style Guide] (https://github.com/airbnb/javascript). Once the [eslint] (https://www.npmjs.com/package/eslint) dependency is installed, ensure the [Airbnb eslint] (https://www.npmjs.com/package/eslint-config-airbnb) package is installed, with its dependencies, by running the following command in the root directory of the repo:
```
npm i --save-dev eslint-config-airbnb eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y
```
Ensure that the *.eslintrc.js* file in the root directory contains the following rule exceptions:
```javascript
"import/no-extraneous-dependencies": ["error", {
  "devDependencies": [
    "spec/**",
  ]
}],
"comma-dangle": ["error", "never"]
```


## Other Information
The service API will be served via GraphQL querying.
