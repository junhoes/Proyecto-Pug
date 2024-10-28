var gulp = require('gulp'),
    pug = require('gulp-pug');
    sass = require('gulp-sass');
	minifyCss = require('gulp-minify-css');
	minify = require('gulp-minify');
    concat = require('gulp-concat'); 
    rename = require('gulp-rename');
	uglify = require('gulp-uglify'); 	
	streamqueue  = require('streamqueue');	
	image  = require('gulp-image');
	connect = require('gulp-connect');
	i18n = require('gulp-html-i18n');
	flatten = require('gulp-flatten');
	clean = require('gulp-clean');
	postcss = require('gulp-postcss');
	autoprefixer = require('autoprefixer');
	compression   = require("compression");
	browserSync = require('browser-sync').create();
	mkdirp = require('mkdirp');

var path = {
    pug: ['src/pug/*.pug'],
    html: 'public/',
	sass: ['src/sass/**/main.scss'],
	//cssComponents: ['src/pug/components/**/[^_]*.scss'],
	css: 'public/css/',
	cssDestEs: 'public/css/es',
	images: 'src/images/**/*.*',
	imagesDest: 'public/images/',
	js: ['src/javascript/custom/[^_]*.js'],
	jsLibs: ['src/javascript/libs/[^_]*.js'],
	jsPrimaryLibs: ['src/javascript/primaryLibs/[^_]*.js'],
	minifyedLibs: ['src/javascript/minifyedLibs/[^_]*.js'],
	//jsPriority: ['src/javascript/priority/[^_]*.js'],
	jsDest: 'public/js/',
	//jsDestEs: 'public/es/js/',
	//jsComponents: 'src/pug/**/[^_]*.js',
	fonts: 'src/sass/fonts/**/*.*',
	fontsDest: 'public/css/fonts/',
	locale:['src/pug/locale/**/[^_]*.json'],
	localeComponents: ['src/pug/components/**/locale/**/[^_]*.json'],
	build: 'build/',
	buildCSS: 'build/css',
	buildFONTS: 'build/css/fonts',
	buildJS: 'build/js/',	
	buildIMAGES: 'build/images',
	buildLocale: 'build/locale/'
};


//var langs = ['es','en'];
var langs = ['es'];

gulp.task('connect', function() {
	connect.server({
		root: './public/',
		port: 3000,
		middleware: function(req, res, next){
			return [
						compression()
			];
		}		
	});
});

gulp.task('removeTMP', function () {
  gulp.src('public/*.html', {read: false})
    .pipe(clean());
	
  gulp.src('public/css', {read: false})
    .pipe(clean());	

  return gulp.src('public/js', {read: false})
    .pipe(clean()); 

});


gulp.task('buildPUG', function() {
    return gulp.src(path.pug)
    .pipe(pug({
        pretty: true
    })) 
    .pipe(gulp.dest(path.build));
});

gulp.task('deployPUG',['buildPUG','buildLocale','buildLocaleComponents'], function() {
    return gulp.src(path.build + '/**/*.html')
	.pipe(i18n({
	  langDir: 'build/locale/',
	  createLangDirs: true,
	  defaultLang: 'es'
	}))    
    .pipe(gulp.dest(path.html));

});


gulp.task('buildCSS', function() {

	var plugins = [
        autoprefixer({browsers: ['last 2 versions','last 2 Chrome versions','last 2 ff versions','ie >= 10']})
    ];	 

	return gulp.src(path.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(rename({
			basename: 'main',
			extname: '.min.css'
		}))
		.pipe(minifyCss({
            keepSpecialComments: 0
        }))
		.pipe(postcss(plugins))
		.pipe(gulp.dest(path.buildCSS));

});

gulp.task('deployCustomCSS', function() {

	var plugins = [
        autoprefixer({browsers: ['last 2 versions','last 2 Chrome versions','last 2 ff versions','ie >= 10']})
    ];	 

	return gulp.src(path.sass)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(rename({
			basename: 'main',
			extname: '.min.css'
		}))
		.pipe(minifyCss({
            keepSpecialComments: 0
        }))
		.pipe(postcss(plugins))
		.pipe(gulp.dest(path.cssDestEs));

});


gulp.task('copyMinifyedLibs', function() {
    return gulp.src(path.minifyedLibs)
        .pipe(gulp.dest('public/js/libs')) // Copia a la carpeta public/js/libs
        .pipe(gulp.dest('build/js/libs')); // Copia a la carpeta build/js/libs
});


/* gulp.task('buildCSSComponents', function() {
	return gulp.src(path.cssComponents)
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('components.css'))
		.pipe(rename({
			basename: 'components',
			extname: '.min.css'
		}))
		.pipe(minifyCss({
            keepSpecialComments: 0
		}))
		.pipe(gulp.dest(path.buildCSS));
}); */

gulp.task('deployCSS',['buildCSS',/* 'buildCSSComponents' */], function() {
	var files = gulp.src(path.buildCSS + '/**/*.*');

	for (var key in langs){

		files.pipe(gulp.dest('public/' + langs[key] + '/css'));

	}
	return true;
});

gulp.task('buildFONTS', function() {
	return gulp.src(path.fonts)
	.pipe(gulp.dest(path.buildFONTS));

});

gulp.task('deployFONTS',['buildFONTS'], function() {
	var files = gulp.src(path.buildFONTS + '/**/*.*');

	for (var key in langs){

		files.pipe(gulp.dest('public/' + langs[key] + '/css/fonts'));

	}

	return true;

});

gulp.task('buildJS', function() {  
    return streamqueue({ objectMode: true },
        gulp.src('src/javascript/libs/gsap.min.js'), // Cargar GSAP primero
        gulp.src('src/javascript/libs/ScrollMagic.js'), // Luego ScrollMagic
        gulp.src('src/javascript/libs/animation.gsap.js'), // Luego el plugin de ScrollMagic para GSAP
		gulp.src(path.jsPrimaryLibs),
		gulp.src(path.jsLibs),
		gulp.src(path.js)
	)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.buildJS))
    	.pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.buildJS));

});

/* gulp.task('buildJSPriority', function() {  
    return streamqueue({ objectMode: true },
		gulp.src(path.jsPriority)
	)
        .pipe(concat('priority.js'))
        .pipe(gulp.dest(path.buildJS))
    	.pipe(rename('priority.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.buildJS));

}); */

/* gulp.task('buildJSComponents', function() {  
    return streamqueue({ objectMode: true },
		gulp.src(path.jsComponents)
	)
        .pipe(concat('components.js'))
 		.pipe(gulp.dest(path.buildJS))
		.pipe(rename('components.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.buildJS));

}); */

gulp.task('deployJS',['buildJS'/* ,'buildJSPriority' */,/* 'buildJSComponents' */], function() {  

	return gulp.start('moveLocaleJS');

});

gulp.task('deployCustomJS', function(){
	return streamqueue({ objectMode: true },
        gulp.src('src/javascript/libs/gsap.min.js'), // Cargar GSAP primero
        gulp.src('src/javascript/libs/ScrollMagic.js'), // Luego ScrollMagic
        gulp.src('src/javascript/libs/animation.gsap.js'), // Luego el plugin de ScrollMagic para GSAP
		gulp.src(path.jsPrimaryLibs),
		gulp.src(path.jsLibs),
		gulp.src(path.js)
	)
        .pipe(concat('main.js'))
        //.pipe(gulp.dest(path.jsDestEs))
    	.pipe(rename('main.min.js'))
        .pipe(uglify())
        /* .pipe(gulp.dest(path.jsDestEs)); */
		.pipe(gulp.dest(path.jsDest));
});

gulp.task('localeJS',function(){

	return gulp.src(path.buildJS + '[^_]*.js')
	.pipe(i18n({
	  langDir: 'build/locale/',
	  createLangDirs: true,
	  defaultLang: 'es'
	})) 
    .pipe(gulp.dest('public/js/'));

});

gulp.task('moveLocaleJS',['localeJS'],function(){
	for (var key in langs){
		gulp.src('public/js/' + langs[key] + '/*.js')
		.pipe(gulp.dest('public/' + langs[key] + '/js/'));
	}
	return true;
});

gulp.task('buildIMAGES', function () {
  return gulp.src(path.images)
  .pipe(gulp.dest(path.buildIMAGES));
});

gulp.task('deployIMAGES',['buildIMAGES'], function () {
  var files = gulp.src(path.buildIMAGES + '/**/*.*');

	for (var key in langs){
        files.pipe(gulp.dest('public/' + langs[key] + '/images/'));
    } 
   return true;    
});

gulp.task('buildLocale', function(done) {
    mkdirp.sync(path.buildLocale);
    return gulp.src(path.locale)
        .pipe(flatten({ includeParents: -1 }))
        .pipe(gulp.dest(path.buildLocale));
    done();
});

gulp.task('buildLocaleComponents', function(done) {
    mkdirp.sync(path.buildLocale);
    return gulp.src(path.localeComponents)
        .pipe(flatten({ includeParents: -1 }))
        .pipe(gulp.dest(path.buildLocale));
    done();
});

gulp.task('build',['buildPUG', 'buildCSS',/* 'buildCSSComponents' */,'buildFONTS','buildJS',/* 'buildJSPriority', *//* 'buildJSComponents' */,'buildIMAGES','buildLocale','buildLocaleComponents','copyMinifyedLibs']);

gulp.task('deploy',['deployPUG', 'deployCSS','deployFONTS','deployJS','deployIMAGES','copyMinifyedLibs'],function(){

	browserSync.init({
        server: {
			baseDir: "./build",
			directory: true
        }
	});

	return gulp.start('removeTMP');

});

//gulp.task('default',['deploy','connect']);

gulp.task('watch', function() {
	
	gulp.watch('src/pug/**/*.pug', ['deployPUG']);
	gulp.watch('src/sass/**/*.scss', ['deployCSS']);
	gulp.watch('src/images/**/*.*', ['deployIMAGES']);
	gulp.watch('src/javascript/**/*.js', ['deployJS']);

	gulp.watch('src/pug/locale/**/*.json', ['deployPUG']);
	gulp.watch('src/pug/components/**/locale/**/*.json', ['deployPUG']);
	gulp.watch('src/pug/components/**/*.scss', ['deployCSS']);
	gulp.watch('src/pug/components/**/*.js', ['deployJS']);

	gulp.watch('build/*.html').on('change', browserSync.reload);
	gulp.watch('build/css/**/*.css').on('change', browserSync.reload);
	gulp.watch('build/js/*.js').on('change', browserSync.reload);

});

gulp.task('default',['deploy','watch']);