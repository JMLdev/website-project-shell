# Quick Project Startpoint

This is my quick and dirty project setup which includes a Sass compiler, Mustache templating through Handlebars.js, and maybe some babel stuff. 

This will be my first run at Gulp, since I've heard it is a better alternative to Grunt. Forgive me if it's poop.

I'm using this to quickly get to work on one-off project requests and minimal page count sites.

Feel free to use it if you like it. 

## Prerequisite

- [NPM](https://www.npmjs.com/get-npm) - duh!
- [Gulp](https://gulpjs.com/docs/en/getting-started/quick-start). This one is a bit problematic. Refer to [this answer on Stack Overflow](https://stackoverflow.com/questions/24027551/gulp-command-not-found-error-after-installing-gulp) if Gulp is giving you problems.

## Installation

Once you're sure you have the prerequisites in order, run `npm install` after cloning

## Use

`gulp sass` compile scss files

`gulp connect` start a development server with no auto-reload

`gulp watch` watch the src and scss directories for changes and compile/transpile as needed

`gulp connect watch` the most useful one, start the server with live reload and watch for changes

Happy hacking.