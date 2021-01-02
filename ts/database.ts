import * as crypto from 'crypto';

const postgres = require("postgres");
var db: any = undefined;

const pw_hash_secret = "default_secret";

function dbNotice(msg: any): void {
	console.log(msg.severity + ": " + msg.message);
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
		let ans = await db`CREATE TABLE IF NOT EXISTS sm_users(username TEXT UNIQUE, pw_hash TEXT, PRIMARY KEY (username));`;
		console.log(JSON.stringify(ans));
	} catch (e) {
		console.log(e);
	}
	console.log("Been here!");
}

export async function dbVerifyUsernameAndPassword(username: string, password: string): Promise<boolean | string> {
	if (db === undefined) return "database_not_running";
	let ans = await db`SELECT username, pw_hash FROM sm_users WHERE username = ${username};`;
	
	// check if the user exists and the password matches and if so, return true
	if (ans.count === 1) {
		let password_hash = crypto.createHmac('sha256', pw_hash_secret).update(password).digest('hex');
		if (ans[0].username == username && ans[0].pw_hash == password_hash) return true;
	}
	
	// if the authentication did not explicitly succseed, return false
	return false;
}

export async function dbRegisterUser(username: string, password: string): Promise<undefined | string> {
	if (db === undefined) return "database_not_running";
	
	let password_hash = crypto.createHmac('sha256', pw_hash_secret).update(password).digest('hex');
	let ans = await db`INSERT INTO sm_users(username, pw_hash) VALUES (${username}, ${password_hash});`;
	console.log(ans);
	
	// if no error occured, return undefined
	return undefined;
}