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
    copy: {
        html: {
            expand: true,
            cwd: 'src/',
            src: '*',
            dest: 'build/'
        }
    },

    imagemin: {
        jpg: {
            options: {
                progressive: true
            },

            files: [{
                expand: true,
                cwd: 'src/',
                src: ['**/*.jpg'],
                dest: 'build'
            }]
        },
        png: {
            options: {
                optimizationLevel: 7
            },

            files: [{
                expand: true,
                cwd: 'src/',
                src: ['**/*.png'],
                dest: 'build'
            }]
        }
    },

    cssmin: {
        target: {
            files: [{
                expand: true,
                cwd: 'src',
                src: ['**/*.css'],
                dest: 'build',
            }]
        }
    },

    uglify: {
        my_target: {
            files: [{
                expand: true,
                cwd: 'src',
                src: ['**/*.js'],
                dest: 'build'
            }]
        }
    }
});

//  npm install grunt-contrib-imagemin --save-dev
grunt.loadNpmTasks('grunt-contrib-imagemin');
// npm install grunt-contrib-uglify --save-dev
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-cssmin');

grunt.registerTask('default',
    'Main build task', ['imagemin', 'cssmin', 'uglify', 'copy:html']);
