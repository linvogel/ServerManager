import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { nextTick } from "process";


const jwt_secret = "1234_1";

async function auth(req: Request, res: Response) {
	
	try {
		if (req.cookies['auth-token'] !== undefined)
			res.locals.token = jwt.verify(req.cookies['auth-token'], jwt_secret);
	} catch (err) {
		return false;
	}
	
	return true;
	
}

export async function auth_handler(req: Request, res: Response) {
	if (!auth(req, res)) {
		// this request is notauthorized, so redirect to the loginscreen
		res.redirect("/login.html");
	} else {
		// this request was authorized and can proceed
		if (req.next !== undefined) req.next(); 
	}
}

export async function login_handler(req: Request, res: Response) {
	
	// check the validity of the provided credentials
	
	let token = { user: req.body.user }
	
	res.cookie("auth-token", jwt.sign(token, jwt_secret, { expiresIn: 10 }));
	res.redirect("/home.html");
}