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
### NPM Package Manager (Package Manager Package Manager Package Manager...)
The repository is configured to work with the *node_modules* directory created by [NPM](https://www.npmjs.com/) package manager. If using another package manager, you will need to refer to official documentation for packages for proper configuration.

### Airbnb Style Guide
This project adheres to the [Airbnb style guide](https://github.com/airbnb/javascript), and uses the official [NPM package](https://www.npmjs.com/package/eslint-config-airbnb) for managing linting rules.

Ensure that the *.eslintrc.js* file in the root directory contains the following rule exceptions:
```javascript
"import/no-extraneous-dependencies": ["error", {
  "devDependencies": [
    "spec/**",
  ]
}],
"comma-dangle": ["error", "never"]
```
The `no-extraneous-dependencies` rule is specifically ignored for unit test files so that particular *Chai* `expect` tests can be used. The `comma-dangle` rule is ignored as it annoys me.

*Note that the configuration in the repository runs for the Atom text editor. Sublime Text users may need to edit the `"extends"` line in *.eslintrc.js* to the below snippet in order to properly utilize the linting rules:
```javascript
"extends": "./node_modules/eslint-config-airbnb-base/index.js"
```

### PostgresQL Database
The user information is stored in a PostgresQL database. Refer to the table below for guidance on the users table schema:

| id | joinDate | age | paidStatus | genreGroup | favoriteArtists | favoriteGenres | locationId |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2017-10-10 14:47:20.872-07 | 25 | true | 3 | [4, 2, 6, 8] | [1, 67, 21, 2] | 1 |
- **Age** is the age of the user between 18 - 70
- **paidStatus** is true if the user pays for the service, false if otherwise
- **genreGroup** is an array of the user's favorite genres by ID (reference the [music-inventory](https://github.com/mixtape81/music-inventory) repository for details)
- **favoriteArtists** is an array of the user's favorite artists by ID (reference the [music-inventory](https://github.com/mixtape81/music-inventory) repository for details)
- **locationId** refers to the user's location by id, which is relational to the *locations* table schema below:

| id | name |
| --- | --- |
| 1 | San Francisco |

### GraphQL API
#### How GraphQL returns data
This service handles HTTP requests via [GraphQL](http://graphql.org/) endpoints. GraphQL allows the querying of the user database and will return only requested information for all users. For example, take a look at the following cURL command:
```
curl -X POST -H 'Content-Type:application/graphql' -d '{users {age,favoriteGenres,location {name}}}' 'localhost:3000/graphql'
```
The command will return a JSON object, with "users" being an array with the age, favorite genres, and location for each user in the database. For example, the command would return the following if the users table looked like the example above:
```javascript
{
  "data": {
    "users": [
      {
        "favoriteGenres": [
          1,
          67,
          21,
          2
        ],
        "age": 25,
        "location": {
          "name": "San Francisco"
        }
      },
    ]
  }
}
```
With the server running, you may also point your browser to **localhost:3000/graphql**. This brings up the **Graphiql** interface, which allows you to make exact queries to the graphql endpoint without using cURL commands or *Postman*.

## Other Information
The service API will be served via GraphQL querying.
