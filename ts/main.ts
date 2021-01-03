import express from 'express';
import * as jwt from 'jsonwebtoken';
import * as body_parser from 'body-parser'

const cookie_parser = require("cookie-parser");

import * as auth from './auth';
import { handle_request } from './requests';
import * as db from './database';
import * as dashboard from './dashboard';
import { abort } from 'process';

const app = express();

console.log("Starting server...");


app.use(body_parser.json());
app.use(body_parser.text());
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.raw());

app.use(cookie_parser());

// list all routes that need to be accessible without login
app.get('/login.html', handle_request);
app.get('/login.js', handle_request);
app.get('/base.css', handle_request);

app.post('/action_login', auth.login_handler);

app.use(auth.auth_handler);

app.use(handle_request);

app.get('dashboard.js', dashboard.script_handler);


app.listen(8081, async () => {
	console.log("Setting up database...");
	await db.dbSetup();
	try {await db.dbRegisterUser("user", "password", "admin");} catch(e) {}
	try {await db.dbRegisterUser("test", "test", "user");} catch(e) {}
	console.log("Server started...");
});