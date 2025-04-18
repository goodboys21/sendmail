const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bagussender@gmail.com',
        pass: 'xgqdblqzarqvtioh'
    }
});

app.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    const htmlContent = `
        <div style="
    font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 30px;
    border-radius: 16px;
    background: linear-gradient(145deg, #1c1c1c, #121212);
    color: #f0f0f0;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
    border: 1px solid #2c2c2c;
">
    <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="
            color: #00bfff;
            font-size: 26px;
            margin: 0;
            letter-spacing: 1px;
        ">
           ✉️ ${subject}
        </h2>
        <p style="
            color: #b0b0b0;
            font-size: 15px;
            margin-top: 8px;
        ">
            There is a New Message !
        </p>
    </div>

    <div style="
        background-color: #181818;
        padding: 22px;
        border-radius: 12px;
        border-left: 6px solid #00bfff;
        box-shadow: inset 0 0 10px rgba(0, 191, 255, 0.1);
    ">
        <p style="
            font-size: 17px;
            line-height: 1.7;
            color: #eeeeee;
            text-align: justify;
        ">
            ${message}
        </p>
    </div>

    <p style="
        text-align: center;
        font-size: 14px;
        color: #999;
        margin-top: 30px;
        font-style: italic;
    ">
        Dikirim melalui <b style="color: #00bfff;">🔔 Email Notification</b>
    </p>

    <div style="text-align: center; margin-top: 25px;">
        <a href="https://Bagus-email.vercel.app" style="
            background: linear-gradient(to right, #00bfff, #33ccff);
            color: #121212;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            display: inline-block;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            Go To Website
        </a>
    </div>
</div>
    `;

    const mailOptions = {
        from: `"Bagus Email Sender" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Email berhasil dikirim!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengirim email", error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
