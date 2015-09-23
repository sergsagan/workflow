module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    imagemin: {
      development: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: './app/images/',
          src: ['**/*.{png,jpg}'],
          dest: './build/img/'
        }]
      },
      production: {
        options: {
          optimizationLevel: 7
        },
        files: [{
          expand: true,
          cwd: './build/img/',
          src: ['*.{png,jpg}', '!icons/'],
          dest: './production/img/'
        }]
      }
    },

    uglify: {
      production: {
        options: {},
        files: { './production/js/production.js': './build/js/main.js' }
      }
    },

    sprite: {
      development: {
        src: './build/img/icons/*.png',
        dest: './build/img/sprite.png',
        destCss: './build/css/sprite.css'
      },
      production: {}
    },

    concat: {
      options: {},
      dist: {
        src: ['./build/css/normalize.css','build/css/main.css','build/css/sprite.css'],
        dest: './production/css/production.css'
      }
    },

    csso: {
      compress: {
        options: {
          restructure: true,
          report: 'gzip'
        },
        files: {
          'production/css/production.min.css':'production/css/production.css'
        }
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      file: {
        files: {
          './production/index.html':'./build/index.html'
        }
      }
    },

    replace: {
      css: {
        dist: {
          options: {
            usePrefix: false,
              patterns: [{
                match: '+',
                replacement: ' +'
              }]
          },
          files: [
            { expand: true, flatten: true, src: ['./production/css/production.min.css'], dest: './production/css/' }
          ]
        }
      },

      html: {
        options: {
          usePrefix: false,
          patterns: [
          {
            match: 'main.css',
            replacement: 'production.min.css'
          },
          {
            match: 'main.js',
            replacement: 'production.js'
          },
          {
            match: /<link\srel="stylesheet"\shref="css\/normalize.css">/,
            replacement: ''
          },
          {
            match: /<link\srel="stylesheet"\shref="css\/sprite.css">/,
            replacement: ''
          }
          ]
        },
        files: [
          { expand: true, flatten: true, src: ['./production/index.html'], dest: './production/' }
        ]
      }
    },

    copy: {
      fontsDev: {
        files: [
          { expand: true, cwd: './app/fonts/', src: ['**/*'], dest: './build/fonts/' }
        ]
      },
      fontsProd: {
        files: [
          { expand: true, cwd: './build/fonts/', src: ['**/*'], dest: './production/fonts/' }
        ]
      },
      normalize: {
        files: [
          {
            expand: true,
            cwd: './app/styles/0-tools/',
            src: ['normalize.scss'],
            dest: './build/css/',
            rename: function(dest, src) {
              return dest + src.substring(0, src.indexOf('.')) + '.css';
            }
          }
        ]
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('dev', ['imagemin:development','sprite:development', 'copy:fontsDev', 'copy:normalize']);
  grunt.registerTask('default', ['htmlmin','concat','csso','replace','imagemin:production','copy:fontsProd','uglify:production']);
};