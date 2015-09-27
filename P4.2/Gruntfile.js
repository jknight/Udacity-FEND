/* Hello, this is my first Grunt file. 
 * I'm writing this for Udacity FEND P4.
 * The purpose of this file is construct a pipeline
 * to optimize the sample website. 
 * */

var grunt = require('grunt');

// http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    /*
      build: {
          src: 'src/<%= pkg.name %>.js',
          dest: 'build/<%= pkg.name %>.min.js'
      },
      */
    clean: ["dest"],

    copy: {
        everything: {
            expand: true,
            cwd: 'src/',
            src: ['**/*.*'],
            dest: 'dest/'
        }

    },

    imagemin: {
        jpg: {
            options: {
                progressive: true
            },

            files: [{
                expand: true,
                cwd: 'dest/',
                src: ['**/*.jpg'],
                dest: 'dest/'
            }]
        },
        png: {
            options: {
                optimizationLevel: 7
            },

            files: [{
                expand: true,
                cwd: 'dest/',
                src: ['**/*.png'],
                dest: 'dest/'
            }]
        }
    },

    uglify: {
        javascript: {
            files: [{
                expand: true,
                cwd: 'dest/',
                src: ['**/*.js'],
                dest: 'dest/'
            }]
        }
    },

    /* we're using uncss to remove unused css. In the case of this code, since the javascript
     * does things with css classes that aren't referred to in the HTML, we need to tell uncss
     * to ignore a couple classes */
    uncss: {
        target: {
            files: [{
                'dest/css/tidy.css': ['dest/index.html']
            }]
        },
        pizza: {
            options: {
                ignore: ['.floater', '.rowDiv', '.contentItemOuter', 'li']
            },
            files: [{
                'dest/css/pizza.css': ['dest/index.html']
            }]
        }
    },

    cssmin: {
        target: {
            files: {
                'dest/css/tidy.css': ['dest/css/tidy.css']
            }
        },
        target2: {
            files: [{
                expand: true,
                cwd: 'dest/css/',
                src: ['*.css'],
                dest: 'dest/css/',
                ext: '.css'
            }]
        }
    },

    processhtml: {
        target: {
            files: [{
                expand: true,
                cwd: 'dest/',
                src: ['**/*.html'],
                dest: 'dest/'
            }]
        }
    },

    inline: {
        target1: {
            src: 'dest/index.html',
            dest: 'dest/index.html'
        }
    },

    htmlmin: {
        target: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            files: [{
                expand: true,
                cwd: 'dest/',
                src: ['**/*.html'],
                dest: 'dest/'
            }]
        }
    }


});

grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
grunt.loadNpmTasks('grunt-uncss');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-inline');
grunt.loadNpmTasks('grunt-processhtml');

//Here is our main grunt build pipeline 
grunt.registerTask('default',
    'Main build task', [
        'clean',
        'copy:everything', //do this up front. we can overwrite as needed. This lets us selectively disable subsequent steps for QA
        'imagemin',
        'uncss',
        'uglify:javascript',
        'cssmin',
        'processhtml',
        'inline',
        'htmlmin'
    ]);
