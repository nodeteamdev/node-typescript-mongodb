'use strict';
const Generator = require('yeoman-generator');

const authGenerator = class extends Generator {
    writing() {
        const {
            name,
            authentication,
            clientId,
            clientSecret,
            redirectUris
        } = this.options;
        const templates = {
            authentication: authentication === 'jwt-auth' ? 'jwtAuth.ts' : (authentication === 'oauth2.0' ? 'oAuth.ts' : 'passport.ts')
        };
        this.fs.copyTpl(
            this.templatePath(`src/**/**/${templates.authentication}`),
            this.destinationPath(name + '/src/'), {
                name: name
            }
        );

        if (authentication === 'oauth2.0') {
            this.fs.copyTpl(
                this.templatePath(`src/config/oauth`),
                this.destinationPath(name + '/src/config/oauth'), {
                    name,
                    clientId,
                    clientSecret,
                    redirectUris
                }
            )
        }
    }
}

module.exports = authGenerator;
