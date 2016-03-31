module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    jscs: {
      src: './**/*.js',
      options: {
        config: '.jscsrc',
        fix: true,
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'nyan',
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'jscs', 'mochaTest']);
};
