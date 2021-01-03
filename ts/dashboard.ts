import { Request, Response } from 'express';
import { readFileSync } from 'fs';


export async function script_handler(req: Request, res: Response) {
	let role = res.locals.token.role;
}