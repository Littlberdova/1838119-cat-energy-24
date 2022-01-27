import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import svgstore from 'gulp-svgstore';
import svgo from 'gulp-svgmin';
import del from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//Html

 const html = () => {
  return gulp.src('source/*.html')

  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

// Images

 const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

 const copyimages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

//WebP

 const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({webp: {},}))
  .pipe(gulp.dest('build/img'));
}

//SVG

 const optimizesvg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/social/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}

//export const sprite = () => {
//  return gulp.src('source/img/social/*.svg')
//  .pipe(svgo())
//  .pipe(svgstore({inlineSVG:true}))
//  .pipe(rename('sprite.svg'))
//  .pipe(gulp.dest('build/img'));
//



//Copy

 const copy = () => {
  return gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico'
  ], {
    base:'source'
  })
  .pipe(gulp.dest('build'))
  done();
}

//Clean

 const clean = () => {
  return del('build');
}

// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    optimizesvg,
    createWebp
  ),
);

//Default

export default gulp.series(
  clean,
  copy,
  copyimages,
  gulp.parallel(
    styles,
    html,
    optimizesvg,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
