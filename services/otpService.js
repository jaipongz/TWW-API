const nodemailer = require('nodemailer');

let otps = [];
let otpRequests = {};

const otpService = {
    generateOTP: () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    sendOtp: async (email, otp) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'Thanwiwa app',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
    },

    saveOTP: async (email, otp) => {
        try {
            const expirationTime = new Date(Date.now() + 1 * 60000);

            const otpData = {
                email,
                otp,
                createdAt: new Date(),
                expirationTime,
            };
            otps.push(otpData);
            const oneMinute = 60 * 1000;
            otpRequests[email] = { lastRequestTime: new Date().getTime() };
            return otpData;
        } catch (error) {
            console.log('Save OTP Error:', error);
        }
    },
    verifyOTP: async (email, otp) => {
        console.log(otps);
        const otpEntry = otps.find(entry => entry.email === email && entry.otp === otp);
        if (!otpEntry) {
            return false;
        }
        const currentTime = new Date().getTime();
        const otpExpirationTime = new Date(otpEntry.createdAt).getTime() + 1 * 60 * 1000;
        if (currentTime > otpExpirationTime) {
            return false;
        }
        return true;
    }
};

module.exports = otpService;
