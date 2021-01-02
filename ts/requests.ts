import { Response, Request } from 'express';
import * as fs from 'fs';
import { stringify } from 'querystring';


export async function handle_request(req: Request, res: Response) {
	let path: string = "./sites" + req.url;
	
	console.log("Requested: " + path);
		
	// check if the path points up the directory structure
	if (path.match(/\.\./)) {
		res.status(403).send();
		return;
	}
	
	if (fs.existsSync(path) && fs.statSync(path).isFile()) {
		let content = fs.readFileSync(path).toString();
		let tmp = path.split('.');
		let ext = tmp[tmp.length-1];
		let type = "text/plain";
		
		
		switch (ext) {
			case "html": type = "text/html"; break;
			case "js": type = "application/javascript"; break;
			case "css": type = "text/css"; break;
		}
		
		// set the type of the content
		res.setHeader("Content-Type", type);
		
		// send the answer
		res.status(200).send(content);
	} else {
		// this resource was not found, so 404
		res.status(404).send();
	}
}