const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const del = require('del');
const run = require('gulp-run');

function task_clean() {
	return del("./js/*");
}

function task_build() {
	return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(tsProject.rawConfig.compilerOptions.outDir));
}

function task_run() {
	return run('node ./js/main.js').exec();
}

exports.clean = task_clean;
exports.build = task_build;
exports.run = task_run;
exports.rebuild = gulp.series(task_clean, task_build);