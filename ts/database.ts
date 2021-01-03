import { clear } from 'console';
import * as crypto from 'crypto';

const postgres = require("postgres");
var db: any = undefined;

const pw_hash_secret = "default_secret";

function dbNotice(msg: any): void {
	console.log("[DATABASE][" + msg.severity + "] " + msg.message);
}

export async function dbSetup(): Promise<void> {
	db = await postgres({
		host: 'localhost',
		user: 'user_servermanager',
		password: 'test_pw',
		port: 5433,
		database: 'db_servermanager',
		ssl: false,
		onnotice: dbNotice
	});
	
	console.log("been here");
	
	// create the users table
	try {
		let ans = await db`CREATE TABLE IF NOT EXISTS sm_users(username TEXT UNIQUE, pw_hash TEXT, user_role TEXT NOT NULL DEFAULT 'user', PRIMARY KEY (username));`;
		console.log(JSON.stringify(ans));
	} catch (e) {
		console.log(e);
	}
	console.log("Been here!");
}

export async function dbVerifyUsernameAndPassword(username: string, password: string): Promise<boolean | string> {
	if (db === undefined) {
		console.error("ERROR: Database not running!");
		return false;
	}
	
	let ans = await db`SELECT username, pw_hash FROM sm_users WHERE username = ${username};`;
	
	// check if the user exists and the password matches and if so, return true
	if (ans.count === 1) {
		let password_hash = crypto.createHmac('sha256', pw_hash_secret).update(password).digest('hex');
		if (ans[0].username == username && ans[0].pw_hash == password_hash) return true;
	}
	
	// if the authentication did not explicitly succseed, return false
	return false;
}

export async function dbRegisterUser(username: string, password: string, role: string): Promise<boolean> {
	if (db === undefined) {
		console.error("ERROR: Database not running!");
		return false;
	}
	
	let password_hash = crypto.createHmac('sha256', pw_hash_secret).update(password).digest('hex');
	let ans = await db`INSERT INTO sm_users(username, pw_hash, user_role) VALUES (${username}, ${password_hash}, ${role});`;
	console.log(ans);
	
	// if no error occured, return undefined
	return true;
}

export async function dbQueryUserRole(username: string): Promise<string | undefined> {
	if (db === undefined) {
		console.error("ERROR: Database not running!");
		return undefined;
	}
	
	let role = await db`SELECT user_role FROM sm_users WHERE username = ${username};`;
	if (role.length > 0) {
		return role[0].user_role;
	}
	
	// if no result was returned, no user of that name exists
	return undefined;
}