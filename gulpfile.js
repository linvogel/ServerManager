const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const del = require('del');
const run = require('gulp-run');
const nodemon = require('nodemon');

function task_clean() {
	return del("./js/*");
}

function task_build() {
	return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(tsProject.rawConfig.compilerOptions.outDir));
}

function task_run() {
	return run('node ./js/main.js').exec();
}

function task_watch() {
	gulp.watch(["ts/*", "ts/*/**"], gulp.series(task_clean, task_build));
	nodemon({
		script: "js/main.js",
		watch: ["js/*", "js/*/**"],
		ext: "js"
	}).on("restart", () => {  });
}

exports.clean = task_clean;
exports.build = task_build;
exports.run = task_run;
exports.rebuild = gulp.series(task_clean, task_build);
exports.watch = task_watch;
exports.default = gulp.series(task_build, task_run);