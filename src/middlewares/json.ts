import { Request, Response, NextFunction } from 'express';

export function json(req: Request, res: Response, next: NextFunction) {
    const buffers: Buffer[] = [];

    req.on('data', (chunk) => {
        buffers.push(chunk);
    });

    req.on('end', () => {
        try {
            req.body = JSON.parse(Buffer.concat(buffers).toString());
        } catch (error) {
            req.body = null;
        }
        next(); // Chama o próximo middleware
    });
}
