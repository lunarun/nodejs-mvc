module.exports = function(grunt) {

  grunt.config.set('jshint', {
    all: {
      src: ['api/**/*.js'],
      options: {
        jshintrc: true,
        node: true,
        mocha: true,
        jasmine: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};
