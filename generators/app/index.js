'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const crypto = require('crypto');

const whenAuthIsChosen = authChoises => props =>
    authChoises.indexOf(props.authentication) !== -1;
const whenSessionIs = inputs => props => {
    if (
        inputs &&
        props.authentication.includes('passport-local-strategy') &&
        props.sessionStore.includes('redis')
    ) {
        return true;
    }
    return false;
};
module.exports = class extends Generator {
    initializing() {}

    prompting() {
        // Have Yeoman greet the user.
        this.log(
            yosay(
                `Welcome to the finest ${chalk.red(
                    'generator-node-express-typescript-api'
                )} generator!`
            )
        );

        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Would you like to root name to be called?',
                default: 'my-project'
            },
            {
                type: 'list',
                name: 'authentication',
                message: 'Choose authentication type',
                default: 'passport-local-strategy',
                choices: ['passport-local-strategy', 'jwt-auth', 'oauth2.0']
            },
            {
                type: 'input',
                name: 'authentication:client_id',
                message: 'Enter your client_id',
                default: crypto.randomBytes(20).toString('hex'),
                when: whenAuthIsChosen(['oauth2.0'])
            },
            {
                type: 'input',
                name: 'authentication:client_secret',
                message: 'Enter your client_secret',
                default: crypto.randomBytes(20).toString('hex'),
                when: whenAuthIsChosen(['oauth2.0'])
            },
            {
                type: 'input',
                name: 'authentication:redirect_uris',
                suffix:
                    '(if you want to add more than one redirect uri, please, separate them by comma)',
                message:
                    'Enter your client(application) redirect uris, that handle authorization_code and make request to /auth/token ',
                default: 'http://localhost:3001/oauthExample/callback',
                when: whenAuthIsChosen(['oauth2.0'])
            },
            {
                type: 'input',
                name: 'authentication:secret',
                message: 'Enter your authentication secret key',
                default: crypto.randomBytes(20).toString('hex'),
                when: whenAuthIsChosen(['jwt-auth', 'passport-local-strategy'])
            },
            {
                type: 'list',
                name: 'sessionStore',
                message: 'Choos session store',
                default: 'mongo',
                when: whenAuthIsChosen(['passport-local-strategy']),
                choices: ['mongo', 'redis']
            },
            {
                type: 'input',
                name: 'redis:port',
                message: 'redis port: ',
                default: 6379,
                when: whenSessionIs('redis')
            },
            {
                type: 'input',
                name: 'redis:host',
                message: 'redis host: ',
                default: '127.0.0.1',
                when: whenSessionIs('redis')
            }
        ];

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this.name = props.name;
            this.authentication = props.authentication;
            this.secret = props['authentication:secret'];
            this.clientId = props['authentication:client_id'];
            this.clientSecret = props['authentication:client_secret'];
            this.redirectUris = props['authentication:redirect_uris']
                ? props['authentication:redirect_uris'].split(',')
                : '';
            this.sessionStore = props.sessionStore;
            this.redisPort = props['redis:port'];
            this.redisHost = props['redis:host'];
        });
    }

    configuring() {}

    default() {
        if (this.authentication) {
            this.composeWith('node-express-typescript-api:authentication', {
                name: this.name,
                authentication: this.authentication,
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                redirectUris: this.redirectUris
            });
        }
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('_.env'),
            this.destinationPath(this.name + '/.env')
        );

        this.fs.copyTpl(
            this.templatePath('_swaggerDef.js'),
            this.destinationPath(this.name + '/swaggerDef.js')
        );

        this.fs.copyTpl(
            this.templatePath('_nodemon.json'),
            this.destinationPath(this.name + '/nodemon.json')
        );

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath(this.name + '/package.json')
        );

        this.fs.copyTpl(
            this.templatePath('_tsconfig.json'),
            this.destinationPath(this.name + '/tsconfig.json')
        );

        this.fs.copyTpl(
            this.templatePath('_README.md'),
            this.destinationPath(this.name + '/README.md')
        );

        this.fs.copyTpl(
            this.templatePath('_eslintrc.json'),
            this.destinationPath(this.name + '/.eslintrc.json')
        );

        this.fs.copyTpl(
            this.templatePath('LICENSE'),
            this.destinationPath(this.name + '/LICENSE')
        );

        this.fs.copyTpl(
            this.templatePath('src/'),
            this.destinationPath(this.name + '/src/'),
            {
                name: this.name,
                authentication: this.authentication,
                sessionStore: this.sessionStore
            }
        );

        if (this.authentication === 'oauth2.0') {
            this.fs.copyTpl(
                this.templatePath('test/'),
                this.destinationPath(this.name + '/test/'),
                {
                    authentication: this.authentication
                }
            );
        } else {
            this.fs.copyTpl(
                this.templatePath('test/**/user.json'),
                this.destinationPath(this.name + '/test/'),
                {
                    authentication: this.authentication
                }
            );

            this.fs.copyTpl(
                this.templatePath('test/*.js'),
                this.destinationPath(this.name + '/test/'),
                {
                    authentication: this.authentication
                }
            );
        }

        if (this.secret) {
            this.fs.append(this.name + '/.env', '\nSECRET=' + this.secret);
        }

        if (this.redisPort && this.redisHost) {
            this.fs.append(
                this.name + '/.env',
                '\nREDIS_PORT=' + this.redisPort + '\nREDIS_HOST=' + this.redisHost
            );
        }

        if (this.authentication === 'oauth2.0') {
            const pkgJson = {
                devDependencies: {
                    '@types/oauth2-server': '3.0.13'
                },
                dependencies: {
                    'oauth2-server': '3.1.1'
                }
            };

            // Extend or create package.json file in destination path
            this.fs.extendJSON(
                this.destinationPath(this.name + '/package.json'),
                pkgJson
            );
        }

        if (this.authentication === 'passport-local-strategy') {
            const pkgJson = {
                devDependencies: {
                    '@types/express-session': '1.17.4',
                    '@types/passport-local': '1.0.34',
                    '@types/passport': '1.0.7'
                },
                dependencies: {
                    passport: '0.4.1',
                    'passport-local': '1.0.0',
                    'express-session': '1.17.2',
                    'connect-mongo': '4.5.0'
                }
            };
            if (this.sessionStore === 'mongo') {
                pkgJson.devDependencies['@types/connect-mongo'] = '3.1.3';
                pkgJson.dependencies['connect-mongo'] = '4.5.0';
            }

            if (this.sessionStore === 'redis') {
                pkgJson.dependencies.ioredis = '5.0.5';
                pkgJson.devDependencies['@types/connect-redis'] = '0.0.17';
                pkgJson.dependencies['connect-redis'] = '6.0.0';
            }

            // Extend or create package.json file in destination path
            this.fs.extendJSON(
                this.destinationPath(this.name + '/package.json'),
                pkgJson
            );
        }

        if (this.authentication === 'jwt-auth') {
            const pkgJson = {
                devDependencies: {
                    '@types/jsonwebtoken': '8.5.5'
                },
                dependencies: {
                    jsonwebtoken: '8.5.1'
                }
            };

            // Extend or create package.json file in destination path
            this.fs.extendJSON(
                this.destinationPath(this.name + '/package.json'),
                pkgJson
            );
        }
    }

    conflicts() {}

    install() {}

    end() {}
};
