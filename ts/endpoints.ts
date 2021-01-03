import { Request, Response } from 'express';

interface IEndpoint {
	getPanel: () => Promise<string | undefined>
}