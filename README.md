# Talk Radio Challenge

[![rafaelcascalho](https://circleci.com/gh/rafaelcascalho/talk-radio-challenge.svg?style=svg)](#)

This is a quake log file parser developed for the challenge of talk radio.
The log file used currently is based on the email and is in the folder `src/data`.

## API

Here is a link to the [api docs.](https://app.swaggerhub.com/apis/rafaelcascalho/quake-parser-api/1.0.0)

## Prerequisites

### :warning: Required :warning:

Node current LTS
To install `node` and `npm` just [download it here](https://nodejs.org/en/) or [follow this tutorial](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
To check the version run the command

```
$ node -v
v12.16.1
```

## :rocket: Getting started :rocket:

### Setup

Clone the repository and enter the repository directory

```
$ git clone git@github.com:rafaelcascalho/talk-radio-challenge.git

$ cd talk-radio-challenge
```

### Install dependencies

To install the project dependencies just run the command

```
$ npm install
```

## Run :woman_running:

To run the project in the dev environment just run the command

```
$ npm run dev
```

## :test_tube: Running the tests :test_tube:

To run the tests just use the command

```
$ npm test
```

## Using a different log file

To run the project with a different log file just replace the existent log file in the src/data directory,
and name it `game.log`.

## Built With

- [Typescript](https://www.typescriptlang.org/) - Typescript as a superset for the node environment
- [Ts-node-dev](https://www.npmjs.com/package/ts-node-dev) - To restart the node process on file changes
- [Express](https://expressjs.com/) - Express as the http requests handler
- [NodeJs](https://nodejs.org/) - Backend environment for javascript
- [Jest](https://jestjs.io/) - Automated tests library
- [Prettier](https://prettier.io/) - Code formatter
- [Editorconfig](https://editorconfig.org/) - Code style enforcer
