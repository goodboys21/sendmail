const express = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "msg.sender.cg.team@gmail.com",
    pass: "ryzvhlunnwlbajgn", // app password gmail
  },
});

const DB_URL = "http://jsonblob.com/api/jsonBlob/1413877719128793088";

// Fungsi generate HTML email
function generateHtml(noperess, password, ipress) {
  return `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Info Facebook</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
</head>
<body class="bg-white font-sans w-[90%] mx-auto">
  <div class="result fixed inset-0 z-50 overflow-y-auto rounded-lg bg-white">
    <table class="tblResult w-full border-collapse bg-gray-50 text-left text-black">
      <thead>
        <tr>
          <th
            colspan="3"
            class="bg-[#001240] border-2 border-[#001240] px-4 py-4 text-center text-white text-lg font-semibold"
          >
            Info Facebook
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border-2 border-[#001240] border-r-0 px-4 py-3 font-bold">
            Email/Phone
          </td>
          <td class="border-2 border-[#001240] px-4 py-3 text-center font-bold">
            ${noperess}
          </td>
          <td class="border-2 border-[#001240] border-l-0"></td>
        </tr>
        <tr>
          <td class="border-2 border-[#001240] border-r-0 px-4 py-3 font-bold">
            Password
          </td>
          <td class="border-2 border-[#001240] px-4 py-3 text-center font-bold">
            ${password}
          </td>
          <td class="border-2 border-[#001240] border-l-0"></td>
        </tr>
        <tr>
          <td class="border-2 border-[#001240] border-r-0 px-4 py-3 font-bold">
            IP Address
          </td>
          <td class="border-2 border-[#001240] px-4 py-3 text-center font-bold">
            ${ipress}
          </td>
          <td class="border-2 border-[#001240] border-l-0"></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="border-2 border-[#001240] bg-[#001240] px-4 py-4 text-center">
            <div class="flex justify-center space-x-6">
              <a
                href="https://instagram.com/your_instagram_link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-md bg-pink-600 p-3 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                aria-label="Instagram"
              >
                <i class="fab fa-instagram fa-lg"></i>
              </a>
              <a
                href="https://t.me/your_telegram_link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-md bg-blue-500 p-3 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="Telegram"
              >
                <i class="fab fa-telegram-plane fa-lg"></i>
              </a>
              <a
                href="https://wa.me/your_whatsapp_number"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center rounded-md bg-green-600 p-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="WhatsApp"
              >
                <i class="fab fa-whatsapp fa-lg"></i>
              </a>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</body>
</html>
`;
}

// Kirim email ke semua target
async function sendAllEmails() {
  try {
    // Ambil semua email target dari JSONBlob
    const { data } = await axios.get(DB_URL);
    if (!Array.isArray(data) || data.length === 0) {
      console.log("❌ Database kosong");
      return;
    }

    // Loop semua target
    for (const target of data) {
      try {
        // Ambil data random dari API
        const fake = await axios.get("https://api-fakemail.vercel.app/create");
        const { email, password, ip } = fake.data;

        const htmlContent = generateHtml(email, password, ip);

        await transporter.sendMail({
          from: `"Bagus Email Sender" <${process.env.EMAIL_USER}>`,
          to: target,
          subject: "Info Facebook",
          html: htmlContent,
        });

        console.log(`✅ Email terkirim ke ${target} | fake: ${email}/${password}/${ip}`);
      } catch (err) {
        console.error(`❌ Gagal kirim ke ${target}:`, err.message);
      }
    }
  } catch (err) {
    console.error("❌ Gagal ambil database:", err.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di port ${PORT}`);

  // Jalanin otomatis setiap 2 menit
  setInterval(sendAllEmails, 2 * 60 * 1000);
});
