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
        target: {
            expand: true,
            cwd: 'src/fonts/',
            src: '*.*',
            dest: 'build/fonts'
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

    htmlmin: {
        target: { // Target
            options: { // Target options
                removeComments: true,
                collapseWhitespace: true
            },
            files: [{ 
              expand: true,
              cwd: 'src',
              src: ['**/*.html'],
              dest: 'build'
            }]
        }
    },

    uglify: {
        target: {
            files: [{
                expand: true,
                cwd: 'src',
                src: ['**/*.js'],
                dest: 'build'
            }]
    }
}
});

grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-htmlmin');

grunt.registerTask('default',
    'Main build task', ['copy', 'htmlmin', 'imagemin', 'cssmin', 'uglify']);
