# Main Landing Page Templating Project

The purpose of this module is to create an environment in which we can quickly build and stylize landing page templates, while still enabling templating technology like Sass and Handlebars. Please follow the Installation and Use sections. 

## Prerequisite

- [NPM](https://www.npmjs.com/get-npm) - duh!
- [Gulp](https://gulpjs.com/docs/en/getting-started/quick-start). This one is a bit problematic. Refer to [this answer on Stack Overflow](https://stackoverflow.com/questions/24027551/gulp-command-not-found-error-after-installing-gulp) if Gulp is giving you problems.

## Installation

Once you're sure you have the prerequisites in order, run `npm install` after cloning

## Use

Each command below requires an instance varable to passed through as a suffix to the command. In addition to the instance parameter, there is also a production parameter. Use this when finished developing locally and you are ready to deploy to Marketo. It runs a series of tasks such as changing local URLs to the correct server URLS, minifying CSS and JS, etc.

The available params are
- prod

So an example of a command if you want to deploy a template for CL would be:

`gulp connect watch --something --prod`

Here is a full list of local gulp commands that are supported:

`gulp sass <params>` transpile scss files

`gulp prefix <params>` run browser prefixing on transpiled css files and concatenate them into a single file with sourcemaps

`gulp css <params>` run both the Sass build and the browser prefix

`gulp connect <params>` start a development server with no auto-reload

`gulp watch <params>` watch the src and scss directories for changes and compile/transpile as needed

`gulp connect watch <params>` the most useful one, start the server with live reload and watch for changes

Happy hacking.