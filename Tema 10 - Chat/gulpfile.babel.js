/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import nunjucks from 'gulp-nunjucks';
import gulpSass from 'gulp-sass';
import sassCompiler from 'node-sass';
const sass = gulpSass(sassCompiler);

const $ = gulpLoadPlugins();
const bsReload = browserSync.reload;
const reload = function (done) {
  bsReload();
  done();
};
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Optimize images
gulp.task('images', () =>
  gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}))
);

gulp.task('images:minify', () =>
  gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}))
);

gulp.task('fonts', () =>
  gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}))
);

// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/partials',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([

    // libs root path
    './app/scripts/libs/**/*.css',
    './app/scripts/libs/**/*.scss',

    './app/styles/**/*.scss',
    './app/styles/**/*.css'
  ])
    .pipe($.sourcemaps.init())
    .pipe(sass({
      precision: 10
    }).on('error', sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.concat('style.min.css'))
    // Concatenate and minify styles
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('styles:minify', () => {

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([

    // libs root path
    './app/scripts/libs/**/*.css',
    './app/scripts/libs/**/*.scss',

    './app/styles/**/*.scss',
    './app/styles/**/*.css'
  ])

    .pipe(sass({
      precision: 10
    }).on('error', sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.concat('style.min.css'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', () =>
  gulp.src([
    // app specific files - do not remove or comment
    './app/scripts/src/*.js',
    './app/scripts/main.js'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe($.concat('main.min.js'))
    // Output files
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts'))
);

gulp.task('scripts:bundle', () =>
  gulp.src([
    // uncomment to use optional packages
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',

    // libs root path
    './app/scripts/libs/**/*.js',
  ])
    .pipe($.babel())
    .pipe($.concat('bundle.min.js'))
    // Output files
    .pipe($.size({title: 'bundle'}))
    .pipe(gulp.dest('dist/scripts'))
);

gulp.task('scripts:minify', () =>
  gulp.src([
    // app specific files - do not remove or comment
    './app/scripts/src/*.js',
    './app/scripts/main.js'
  ])
    .pipe($.babel())
    .pipe($.concat('main.min.js'))
    .pipe($.uglify())
    // Output files
    .pipe($.size({title: 'scripts'}))
    .pipe(gulp.dest('dist/scripts'))
);

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe(nunjucks.compile())
    .pipe($.useref({
      searchPath: '{.tmp,app}',
      noAssets: true
    }))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

gulp.task('browserSync', () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'LOW',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['dist'],
    port: 3000
  });

  gulp.watch(['app/**/*.html'], gulp.series('html', reload));
  gulp.watch(['app/styles/**/*.{scss,css}'], gulp.series('styles', reload));
  gulp.watch(['app/scripts/**/*.js'], gulp.series('scripts', reload));
  gulp.watch(['app/images/**/*'], gulp.series('images', reload));
  gulp.watch(['app/fonts/**/*'], gulp.series('fonts', reload));
});

// Build production files, the default task
gulp.task('default', gulp.series(
  // remove all files from dist
  'clean',
  // generate styles
  'styles',
  // parse html, scripts, images
  'html', 'scripts:bundle', 'scripts', 'images', 'fonts',
  // move to dist
  'copy'
  )
);

// Watch files for changes & reload
gulp.task('serve', gulp.series('default', 'browserSync'));


gulp.task('build:prod', gulp.series(
  // remove all files from dist
  'clean',
  // generate styles
  'styles:minify',
  // parse html, scripts, images
  'html', 'scripts:bundle', 'scripts:minify', 'images:minify', 'fonts',
  // move to dist
  'copy'
));

// Load custom tasks from the `tasks` directory
// Run: `npm install --save-dev require-dir` from the command-line
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
