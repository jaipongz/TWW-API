import { Request, Response } from 'express';

export class memberController {
    public static async membership(req: Request, res: Response) {
        // #swagger.tags = ['Member']
        try {
            const {userId,memberType,period} = req.body;
             console.log(`Membership`);
             console.log(userId);
             console.log(memberType);
             
            return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: 'Logout failed' });
        }
    }
}