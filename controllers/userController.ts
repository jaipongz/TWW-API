import { Request, response, Response } from 'express';
const userService = require('../services/userService');
const otpService = require('../services/otpService');
const tokenBlacklist = new Set();
import jwt from 'jsonwebtoken';

export class userController {

    public static async register(req: Request, res: Response) {
        // #swagger.tags = ['Authentication']
        try {
            const { username, email, password } = req.body;

            const userNameCheck = await userService.checkUsername(username);
            if (userNameCheck) {
                return res.status(409).json({ status: 'fail', message: `Username ${username} is already in use` });
            }

            const emailCheck = await userService.checkEmail(email);
            if (emailCheck) {
                return res.status(409).json({ status: 'fail', message: `Email ${email} is already in use` });
            }

            const newUser = await userService.register(username, email, password);
            return res.status(201).json({ status: 'success', data: newUser });

        } catch (error) {
            return res.status(500).json({ status: 'fail', message: error });
        }
    }

    public static async login(req: Request, res: Response): Promise<Response> {
        // #swagger.tags = ['Authentication']
        try {
            const { username, password } = req.body;
            const response = await userService.login(username, password);
    
            if (response.error) {
                return res.status(response.code).json({ status: 'fail', message: response.message });
            }
    
            return res.status(200).json({ status: 'success', data: { token: response.token,userId : response.userId } });
        } catch (e) {
            console.error("Error in login controller:", e);
            return res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
        }
    }

    public static async logout(req: Request, res: Response): Promise<Response> {
        // #swagger.tags = ['Authentication']
        try {
            res.clearCookie('token');
            return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
        } catch (e) {
            return res.status(500).json({ status: 'fail', message: 'Logout failed' });
        }
    }

    public static async test(req: Request, res: Response) {
        /* #swagger.security = [{
            "Bearer": []
        }] */

        // This endpoint is protected by the authMiddleware
        res.status(200).json({ status: 'success', message: 'Authenticated!!!' });
    }

    public static async forgot(req: Request, res: Response) {
        // #swagger.tags = ['Authentication']
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ status: 'fail', message: 'Bad request: Email is required' });
            }

            const resultCheck = await userService.checkEmail(email);
            if (!resultCheck) {
                return res.status(404).json({ status: 'fail', message: 'Not found: Email not found' });
            }

            const otp = otpService.generateOTP();

            await otpService.sendOtp(email, otp);
            await otpService.saveOTP(email, otp);

            return res.status(200).json({ status: 'success', message: 'OTP sent to your email' });

        } catch (error) {
            console.error('Error in forgot function:', error);

            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
    
    public static async verifyEmail(req: Request, res: Response) {
        // #swagger.tags = ['Authentication']
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ status: 'fail', message: 'Bad request: Email is required' });
            }

            const emailCheck = await userService.checkEmail(email);
            if (emailCheck) {
                return res.status(409).json({ status: 'fail', message: `Email ${email} is already in use` });
            }
            
            const otp = otpService.generateOTP();

            await otpService.sendOtp(email, otp);
            await otpService.saveOTP(email, otp);

            return res.status(200).json({ status: 'success',data:email, message: 'OTP sent to your email' });

        } catch (error) {
            console.error('Error in forgot function:', error);

            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    public static async verify(req: Request, res: Response) {
        // #swagger.tags = ['Authentication']
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ status: 'fail', message: 'Bad request: Email and OTP are required' });
            }

            const isOtpValid = await otpService.verifyOTP(email, otp);

            if (!isOtpValid) {
                return res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP' });
            }

            return res.status(200).json({ status: 'success', message: 'OTP verified successfully' });

        } catch (error) {
            console.error('Error in verify function:', error);

            return res.status(500).json({ status: 'error', message: 'Internal server error. Please try again later.' });
        }
    }

    public static async resetPassword(req: Request, res: Response) {
        // #swagger.tags = ['Authentication']
        try {
            const { email, newPassword } = req.body;

            if (!email || !newPassword) {
                return res.status(400).json({ status: 'fail', message: 'Bad request: Email and newPassword are required' });
            }

            const hashedPassword = await userService.hashPassword(newPassword);

            const isPasswordUpdated = await userService.updatePassword(email, hashedPassword);

            if (!isPasswordUpdated) {
                return res.status(500).json({ status: 'fail', message: 'Failed to reset password. Please try again later.' });
            }

            return res.status(200).json({ status: 'success', message: 'Password reset successfully' });

        } catch (error) {
            console.error('Error in resetPassword function:', error);

            return res.status(500).json({ status: 'error', message: 'Internal server error. Please try again later.' });
        }
    }
    
    public static async genToken(req: Request, res: Response) {
        // #swagger.tags = ['Global']
        try {
            const token = jwt.sign({ officerId: 'DT-551204', role: 'doctor' }, process.env.JWT_SECRET + "", { expiresIn: '24h' });
            res.status(200).json({ status: 'success', data: token });
        } catch (error) {
            res.status(500).json({ status: 'fail', message: 'Internal server error' });
        }
    }
    
    public static async updateProfile(req: Request, res: Response) {
        // #swagger.tags = ['User']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { userId } = req.body;
            const profile_pic = req.file;
            console.log(userId);
            console.log(profile_pic);
            
    
            if (!profile_pic) {
                return res.status(400).json({ status: 'fail', message: 'Profile picture is required' });
            }
            const response = await userService.updateProfilePic(userId, profile_pic);
            res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error('Error updating profile picture:', error);
            res.status(500).json({ status: 'fail', message: 'Internal server error' });
        }
    }
    public static async getProfile(req: Request, res: Response) {
        // #swagger.tags = ['User']
        /* #swagger.security = [{
            "Bearer": []
        }] */
        try {
            const { userId } = req.query;
            const response = await userService.getProfile(userId);
            res.status(200).json({ status: 'success', data: response });
        } catch (error) {
            console.error('Error updating profile picture:', error);
            res.status(500).json({ status: 'fail', message: 'Internal server error' });
        }
    }
    
}
