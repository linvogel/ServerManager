import { Response, Request } from 'express';
import * as fs from 'fs';
import { stringify } from 'querystring';

export function handle_request(req: Request, res: Response) {
	let path: string = "./sites" + req.url;
	
	if (fs.existsSync(path)) {
		let content = fs.readFileSync(path).toString();
		let tmp = path.split('.');
		let ext = tmp[tmp.length-1];
		let type = "text/plain";
		
		
		switch (ext) {
			case "html": type = "text/html"; break;
			case "js": type = "application/javascript"; break;
			case "css": type = "text/css"; break;
		}
		
		// TODO: this is unsafe! Must verify that the file is in 'sites'
		
		// set the type of the content
		res.setHeader("Content-Type", type);
		
		// send the answer
		res.status(200).send(content);
	} else {
		// this resource was not found, so 404
		res.status(404).send();
	}
}