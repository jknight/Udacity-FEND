module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    responsive_images: {
        options: {
            engine: "gm"
      // Task-specific options go here.
        },
        your_target: {
      // Target-specific file lists and/or options go here.
        },
    },
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-responsive-images');

  // Default task(s).
  //grunt.registerTask('default', ['uglify']);

};
