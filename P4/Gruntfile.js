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
        png: {
            options: {
                optimizationLevel: 7
            },
            files: [{
                // Set to true to enable the following options…
                //expand: true,
                // cwd is 'current working directory'
                //cwd: 'src/img/',
                src: ['**/*.png'],
                // Could also match cwd line above. i.e. project-directory/img/
                dest: 'build/img/',
                ext: '.png'
            }]
        },
        jpg: {
            options: {
                progressive: true
            },
            files: [{
                // Set to true to enable the following options…
                //expand: true,
                // cwd is 'current working directory'
                cwd: 'src/img/',
                src: ['**/*.jpg'],
                // Could also match cwd. i.e. project-directory/img/
                dest: 'build/img',
                ext: '.jpg'
            }]
        }
    },

    cssmin: {
        target: {
            files: [{
                expand: true,
                cwd: 'src/css',
                src: ['*.css'],
                dest: 'build/css',
            }]
        }
    },

    uglify: {
        my_target: {
            files: {
                'build/js/perfmatters.js': ['src/js/perfmatters.js']
            }
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
