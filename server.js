const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

// Brevo Configuration (Using your SMTP Key)
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: 'moviescbox@gmail.com', // Imelo yanu
        pass: 'xsmtpsib-8a9a5ff5e4fa8c5e850c4b7bc2f4236f504aa04625153cceff770793c45fcc08-CQU1ejESzyq6Zua3' // Brevo Key yanu
    }
});

// Store OTPs temporarily (M'malo mwa database pakadali pano)
let otpStore = {};

app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6 digits
    otpStore[email] = otp;

    const mailOptions = {
        from: '"CBox Security" <no-reply@cbox.mw>',
        to: email,
        subject: 'CBox Verification Code: ' + otp,
        html: `
            <div style="font-family: Arial; padding: 20px; background: #030704; color: white; text-align: center; border-radius: 10px;">
                <h1 style="color: #22c55e;">CBOX CINEMA</h1>
                <p>Kuti mumalize kulembetsa, gwiritsani ntchito code iyi:</p>
                <h2 style="letter-spacing: 5px; font-size: 32px; background: #111; padding: 10px; display: inline-block; border: 1px solid #22c55e;">${otp}</h2>
                <p style="font-size: 12px; color: #555; margin-top: 20px;">Ngati simunapange pempholi, ignore imelo iyi.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'OTP Sent' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to send email' });
    }
});

app.listen(3000, () => console.log('CBox Server Running on port 3000'));
