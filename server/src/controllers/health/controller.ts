import { Request, Response } from 'express'

export const ruok = (req: Request, res: Response) => {
    res.status(200).send('iamok');
}
