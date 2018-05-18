# Node.js Express API with TypeScript
[![NPM version][![Build Status](https://travis-ci.org/caiobsouza/ts-node-api.svg?branch=master)](https://travis-ci.org/caiobsouza/ts-node-api)
> Node.js Express API with TypeScript. Supports MongoDB

## Description
This generator will help you to build your own Node.js Express Mongodb API using TypeScript.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-ts-node-api using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-ts-node-api
```

Then generate your new project:

```bash
yo ts-node-api
```

## Running the API
### Development
To start the application in development mode, run:

```bash
nodemon
```
The developer mode will watch your changes then will transpile the TypeScript code and re-run the node application automatically.

Then, start the application or deploy the files in `build` directory:
```
tsc
npm start
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

[travis-image]: https://travis-ci.org/caiobsouza/generator-ts-node-api.svg?branch=master
[travis-url]: https://travis-ci.org/caiobsouza/generator-ts-node-api
