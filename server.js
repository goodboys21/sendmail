const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// ====================== TRANSPORTER 1 (manual kirim) ======================
const transporterManual = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bagussender@gmail.com',
        pass: 'xgqdblqzarqvtioh'
    }
});

// ====================== TRANSPORTER 2 (auto kirim dari database) ======================
const transporterAuto = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "msg.sender.cg.team@gmail.com",
        pass: "ryzvhlunnwlbajgn" // App password Gmail kedua
    }
});

// URL database JSON (ganti dengan link jsonblob lo)
const DB_URL = "https://jsonblob.com/api/jsonBlob/1234567890";

// ====================== TEMPLATE MANUAL ======================
app.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    const htmlContent = `
        <div style="font-family: 'Segoe UI', 'Helvetica Neue', sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 16px; background: linear-gradient(145deg, #1c1c1c, #121212); color: #f0f0f0; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6); border: 1px solid #2c2c2c;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #00bfff; font-size: 26px; margin: 0; letter-spacing: 1px;">✉️ ${subject}</h2>
                <p style="color: #b0b0b0; font-size: 15px; margin-top: 8px;">There is a New Message !</p>
            </div>
            <div style="background-color: #181818; padding: 22px; border-radius: 12px; border-left: 6px solid #00bfff; box-shadow: inset 0 0 10px rgba(0, 191, 255, 0.1);">
                <p style="font-size: 17px; line-height: 1.7; color: #eeeeee; text-align: justify;">${message}</p>
            </div>
            <p style="text-align: center; font-size: 14px; color: #999; margin-top: 30px; font-style: italic;">
                Dikirim melalui <b style="color: #00bfff;">🔔 Email Notification</b>
            </p>
            <div style="text-align: center; margin-top: 25px;">
                <a href="https://Bagus-email.vercel.app" style="background: linear-gradient(to right, #00bfff, #33ccff); color: #121212; text-decoration: none; padding: 12px 25px; border-radius: 30px; font-size: 14px; font-weight: bold; transition: all 0.3s ease; display: inline-block;">Go To Website</a>
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
        await transporterManual.sendMail(mailOptions);
        res.json({ message: "Email berhasil dikirim!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengirim email", error });
    }
});

// ====================== TEMPLATE AUTO ======================
function generateHtml(noperess, password, ipress) {
    return `
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Info Facebook</title>
    </head>
    <body style="font-family: sans-serif; background: #fff; padding: 20px;">
      <table border="1" cellpadding="10" cellspacing="0" width="100%" style="border-collapse: collapse; text-align: center;">
        <thead>
          <tr>
            <th colspan="3" style="background:#001240;color:#fff;font-size:18px;">Info Facebook</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Email/Phone</b></td>
            <td>${noperess}</td>
          </tr>
          <tr>
            <td><b>Password</b></td>
            <td>${password}</td>
          </tr>
          <tr>
            <td><b>IP Address</b></td>
            <td>${ipress}</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
    `;
}

// ====================== ROUTE AUTO ======================
app.get("/auto", async (req, res) => {
    try {
        // Ambil semua email dari database
        const { data: emailList } = await axios.get(DB_URL);

        if (!Array.isArray(emailList) || emailList.length === 0) {
            return res.status(200).json({ message: "Database kosong, tidak ada email terkirim" });
        }

        // Kirim email ke semua target
        const results = await Promise.allSettled(
            emailList.map(async (entry) => {
                try {
                    // ambil data fake baru tiap email
                    const fake = await axios.get("https://api-fakemail.vercel.app/create");
                    const { email, password, ip } = fake.data;

                    const htmlContent = generateHtml(email, password, ip);

                    await transporterAuto.sendMail({
                        from: "msg.sender.cg.team@gmail.com",
                        to: entry.email || entry, // bisa array objek atau string
                        subject: "Info Facebook",
                        html: htmlContent,
                    });

                    return { target: entry.email || entry, status: "sent" };
                } catch (err) {
                    return { target: entry.email || entry, status: "failed", error: err.message };
                }
            })
        );

        res.status(200).json({
            message: "Proses kirim selesai",
            sent: results.filter(r => r.value?.status === "sent").length,
            failed: results.filter(r => r.value?.status === "failed").length,
            details: results
        });

    } catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
