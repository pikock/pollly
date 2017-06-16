import browserify from 'browserify'
import stringify from 'stringify'
import ngannotate from 'browserify-ngannotate'
import gulp from 'gulp'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import browserSync from 'browser-sync'
import gulpPlugins from 'gulp-load-plugins'
import through from 'through2'
import uglifyify from 'uglifyify'
import envify from 'envify'
import del from 'del'
import fs from 'fs'
import mkdirp from 'mkdirp'
import { argv } from 'yargs'

const plugins = gulpPlugins({ lazy: true })
gulp.task('help', plugins.taskListing)

gulp.task('plugins', () => {
  return plugins.util.log(plugins)
})

gulp.task('default', ['help'])
gulp.task('build', [
  'js:build',
  'assets',
  'template:build',
  'less:build',
  'html'
])
gulp.task('dev', ['js:dev', 'assets', 'template:build', 'less:build', 'html'])

gulp.task('clean', () =>
  del(['dist/']).then(paths => {
    plugins.util.log('Deleted files and folders:\n', paths.join('\n'))
  })
)

const config = {
  maskIconColor: 'red',
  maskTileColor: 'red',
  maskThemeColor: '#ffffff'
}

/**
*
* BUILD
*
**/

//  TODO: move to gulp folder

const debug = process.env.NODE_ENV !== 'production' ? true : false

// add custom browserify options here
const customOpts = {
  entries: ['./src/app.js'],
  debug: debug
}

var opts = Object.assign({}, customOpts)
var bundler = browserify(opts)

bundler.transform(stringify(['.html']))
bundler.transform(ngannotate)
bundler.transform(envify)
bundler.transform(uglifyify)

gulp.task('scripts', ['js:hint', 'js:dev'])

gulp.task('js:hint', () => {
  return gulp
    .src(['src/**/*.js', '!src/js/libs/**/*'])
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish', { beep: false }))
})

gulp.task('js:dev', () => {
  return bundler
    .bundle()
    .pipe(plugins.plumber())
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(plugins.sourcemaps.init({ loadMaps: true }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('js:build', () => {
  return bundler
    .bundle()
    .pipe(plugins.plumber())
    .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('html', ['html:build'])
gulp.task('html:build', () => {
  return gulp
    .src(['src/index.html'])
    .pipe(plugins.replace(/%(.$)%/, config['$1']))
    .pipe(gulp.dest('dist/'))
})

gulp.task('assets', ['assets:fonts', 'assets:build'])

gulp.task('assets:build', () => {
  return gulp
    .src(['src/assets/**/*', '!src/assets/styles/**/*'])
    .pipe(gulp.dest('dist/assets'))
})

gulp.task('assets:fonts', () => {
  return gulp
    .src(['node_modules/bootstrap/fonts/**/*'])
    .pipe(gulp.dest('dist/assets/fonts/'))
})

gulp.task('less:build', () => {
  return gulp
    .src(['src/assets/styles/main.less'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(
      plugins.autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
      })
    )
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('dist/assets'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('template:build', () => {
  return gulp.src(['src/templates/**/*']).pipe(gulp.dest('dist/templates'))
})

gulp.task('serve', ['build'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ghostMode: false,
    https: false,
    server: {
      baseDir: ['dist'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
  gulp
    .watch(['src/assets/**/*', '!src/assets/styles/**/*'], ['assets'])
    .on('change', browserSync.reload)
  gulp.watch('src/**/*.html', ['build']).on('change', browserSync.reload)
  gulp.watch('src/**/*.less', ['less:build'])
  gulp.watch('src/**/*.js', ['scripts']).on('change', browserSync.reload)
})

gulp.task('serveBuild', ['build'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ghostMode: false,
    server: {
      baseDir: ['dist']
    }
  })
})
