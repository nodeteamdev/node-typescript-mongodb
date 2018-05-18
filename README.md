# Node.js Express API with TypeScript


![CircleCI branch](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser/master.svg?style=flat-square)
![npm](https://img.shields.io/npm/dm/localeval.svg?style=flat-square)
![Plugin on redmine.org](https://img.shields.io/redmine/plugin/stars/redmine_xlsx_format_issue_exporter.svg?style=flat-square)
![onix](https://img.shields.io/badge/onix-systems-blue.svg)

> Node.js Express API with TypeScript. Supports MongoDB

## Description
This generator will help you to build your own Node.js Express Mongodb API using TypeScript.

### Project Introduction
- suppot ES6/ES7 features
- using tslint followed [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## Installation

First, install [Yeoman](http://yeoman.io) and generator-node-express-typescript-api using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-node-express-typescript-api
```

Then generate your new project:

```bash
yo node-express-typescript-api
```
## App skeleton
```
root/
├── src
|  ├──config
|  |  ├──connection.ts
|  |  ├──middleware.ts
|  ├──controllers
|  |  ├──UserController.ts
|  ├──interfaces
|  |  ├──ServerInterface.ts
|  ├──models
|  |  ├──UserModel.ts
|  ├──router
|  |  ├──routes.ts
|  |  ├──UserRouter.ts
├── nodemon.json
├── node_modules/
├── .editorconfig
├── .tsconfig.json
├── .tslint.json
├── package.json
├── README.md
```
## Running the API
### Development
To start the application in development mode, run:

```bash
npm install -g nodemon
npm install -g ts-node
npm install -g typescript
nodemon
```
Express server listening on http://localhost:3000/, in development mode
The developer mode will watch your changes then will transpile the TypeScript code and re-run the node application automatically.

Create a user:

```bash
curl -X POST \
  http://localhost:3000/v1/users \
  -H 'content-type: application/x-www-form-urlencoded' \
  -d 'name=test&email=test%40gmail.com'
```

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
