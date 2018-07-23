'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the finest ${chalk.red('generator-node-express-typescript-api')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Would you like to root name to be called?',
        default: 'my-project'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_nodemon.json'),
      this.destinationPath(this.props.name + '/nodemon.json')
    );

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath(this.props.name + '/package.json')
    );

    this.fs.copyTpl(
      this.templatePath('_tsconfig.json'),
      this.destinationPath(this.props.name + '/tsconfig.json')
    );

    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath(this.props.name + '/README.md')
    );

    this.fs.copyTpl(
      this.templatePath('_tslint.json'),
      this.destinationPath(this.props.name + '/tslint.json')
    );

    this.fs.copyTpl(
      this.templatePath('LICENSE'),
      this.destinationPath(this.props.name + '/LICENSE')
    );

    this.fs.copy(
      this.templatePath('src/'),
      this.destinationPath(this.props.name + '/src/')
    );
  }
};
