import { Request, Response } from "express";
import { dbQueryUserRole, dbVerifyUsernameAndPassword } from './database';
import * as jwt from 'jsonwebtoken';
import { nextTick } from "process";


const jwt_secret = "1234_1";

async function auth(req: Request, res: Response) {
	try {
		if (req.cookies['auth-token'] !== undefined) {
			res.locals.token = jwt.verify(req.cookies['auth-token'], jwt_secret);
			res.locals.role = dbQueryUserRole(res.locals.token.user);
			return true;
		} else {
			console.log("unauthorized");
			return false;
		}
	} catch (err) {
		console.log("unauthorized: " + err)
		return false;
	}
	
}

export async function auth_handler(req: Request, res: Response) {
	if (await auth(req, res) == false) {
		// this request is not authorized, so redirect to the loginscreen
		res.redirect("/login.html");
	} else {
		// this request was authorized and can proceed
		if (req.next !== undefined) req.next(); 
	}
}

export async function login_handler(req: Request, res: Response) {
	
	// check the validity of the provided credentials
	
	let username = req.body.username;
	let password = req.body.password;
	
	let valid = await dbVerifyUsernameAndPassword(username, password);
	
	if (valid == true) {
		let user_role = await dbQueryUserRole(username);
		let token = {user: username, role: user_role};
		res.cookie("auth-token", jwt.sign(token, jwt_secret, { expiresIn: 10 }));
		res.redirect("/home.html");
	} else {
		res.redirect("/login.html");
	}
}