export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Rendezvous form webhook is active.", {
        status: 200,
      });
    }

    try {
      const data = await request.json();

      const name = data.name || data["Enter your name"] || "";
      const email = data.email || data["Enter your email"] || "";
      const phone = data.phone || data["Enter your phone number"] || "";
      const message = data.message || data["Your message"] || "";

      const text =
        `New Rendezvous Form Submission\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n\n` +
        `Message:\n${message}`;

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: text,
          }),
        }
      );

      if (!telegramResponse.ok) {
        return new Response("Telegram submission failed.", {
          status: 502,
        });
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      return new Response("Invalid form submission.", {
        status: 400,
      });
    }
  },
};
