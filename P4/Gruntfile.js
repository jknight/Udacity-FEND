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

    uglify: {
        target: {
            files: [{
                expand: true,
                cwd: 'src',
                src: ['**/*.js'],
                dest: 'build'
            }]
        }
    },

    uncss: {
        dist: {
            files: {
                'tmp/tidy.css': ['src/index.html']
            }
        }
    },

    cssmin: {
        target: {
            files: {
                'build/css/tidy.min.css': ['tmp/tidy.css']
            }
        }
    },

    processhtml: {
        target: {
            files: [{
                expand: true,
                cwd: 'src',
                src: ['**/*.html'],
                dest: 'tmp'
            }]
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
                cwd: 'tmp',
                src: ['**/*.html'],
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
grunt.loadNpmTasks('grunt-uncss');
grunt.loadNpmTasks('grunt-processhtml');

grunt.registerTask('default',
    'Main build task', ['uncss', 'cssmin', 'copy', 'imagemin', 'uglify', 'processhtml','htmlmin' ]);
