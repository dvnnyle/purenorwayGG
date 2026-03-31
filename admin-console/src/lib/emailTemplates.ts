export function generateNewsletterTemplate({
  subject,
  preheader = 'Pure Norwegian water. Packaged responsibly. I CARE.',
  eyebrow,
  heading,
  body,
  imageUrl,
  imageAlt,
  subscriberEmail,
  baseUrl = 'https://purenorwaywater.com',
}: {
  subject?: string;
  preheader?: string;
  eyebrow?: string;
  heading: string;
  body: string;        // Plain text — auto-converted to paragraphs
  imageUrl?: string;
  imageAlt?: string;
  subscriberEmail?: string;
  baseUrl?: string;
}) {
  const unsubscribeUrl = subscriberEmail
    ? `${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`
    : '#';
  // Convert plain text to HTML paragraphs
  const bodyHtml = body
    .split('\n\n')
    .filter(para => para.trim())
    .map(para => `<p style="margin:0 0 16px;">${para.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');

  const image = imageUrl
    ? `<img src="${imageUrl}" alt="${imageAlt ?? ''}" width="520" style="display:block;max-width:100%;border-radius:10px;margin:0 0 28px;" />`
    : '';

  const cta = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
        <tr>
          <td style="border-radius:8px;background:#12a0ec;">
            <a href="https://purenorwaywater.com" target="_blank"
               style="display:inline-block;padding:13px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:.2px;">
              Visit Our Website &rarr;
            </a>
          </td>
          <td style="width:16px;"></td>
          <td style="border-radius:8px;background:#12a0ec;">
            <a href="https://purenorwaywater.com/products" target="_blank"
               style="display:inline-block;padding:13px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:.2px;">
              Go to Shop &rarr;
            </a>
          </td>
        </tr>
      </table>`;

  const eyebrowHtml = eyebrow
    ? `<p style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#12a0ec;">${eyebrow}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject ?? heading}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
    img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}
    body{margin:0;padding:0;width:100%!important;min-width:100%}
    @media only screen and (max-width:600px){
      .wrapper{padding:12px!important}
      .container{border-radius:0!important}
      .content-pad{padding:28px 20px!important}
      .footer-pad{padding:24px 20px!important}
      h1{font-size:24px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F4F8FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

  <!-- preheader -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F4F8FA;">${preheader}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="wrapper" style="padding:32px 16px;background-color:#F4F8FA;">
    <tr>
      <td align="center">

        <!-- CONTAINER -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="container" style="width:100%;background-color:#ffffff;border-radius:0;overflow:hidden;border:none;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background-color:#0D1B2A;padding:28px 40px;text-align:center;">
              <a href="https://purenorwaywater.com" target="_blank" style="display:inline-block;text-decoration:none;">
                <img src="https://firebasestorage.googleapis.com/v0/b/bigwaterh2o.firebasestorage.app/o/internal%2Flogo%2FlogoWhite.png?alt=media&token=e9cd821e-c837-493c-be8e-bc7170f8a36c"
                     alt="PURE Norway WATER" width="160" height="auto"
                     style="display:inline-block;max-width:160px;height:auto;" />
              </a>
            </td>
          </tr>

          <!-- ── TEAL ACCENT LINE ── -->
          <tr>
            <td style="height:3px;background:#12a0ec;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- ── CONTENT ── -->
          <tr>
            <td class="content-pad" style="padding:60px 40px 48px;min-height:400px;">
              ${eyebrowHtml}
              <h1 style="margin:0 0 18px;font-size:36px;font-weight:900;color:#0d1b2a;line-height:1.02;letter-spacing:-1.5px;">${heading}</h1>
              ${image}
              <div style="font-size:15px;color:#4a5a68;line-height:1.8;">
                ${bodyHtml}
              </div>
              ${cta}
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="height:3px;background-color:#12a0ec;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td class="footer-pad" style="background-color:#0D1B2A;padding:28px 40px;text-align:center;">

              <!-- logo -->
              <img src="https://firebasestorage.googleapis.com/v0/b/bigwaterh2o.firebasestorage.app/o/internal%2Flogo%2FlogoWhite.png?alt=media&token=e9cd821e-c837-493c-be8e-bc7170f8a36c"
                   alt="PURE Norway WATER" width="120"
                   style="display:inline-block;max-width:120px;height:auto;margin-bottom:16px;opacity:.85;" />

              <!-- tagline -->
              <p style="margin:0 0 20px;font-size:12px;color:rgba(255,255,255,.4);letter-spacing:.3px;">
                Pure Norwegian water. Packaged responsibly. I CARE.
              </p>

              <!-- social icons -->
              <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,.6);">
                <a href="https://www.instagram.com/purenorwaywaterno/" target="_blank" style="color:#12a0ec;text-decoration:none;margin:0 12px;">Instagram</a>
                <span style="color:rgba(255,255,255,.3);">·</span>
                <a href="https://www.facebook.com/PureNorwayWaterNO/" target="_blank" style="color:#12a0ec;text-decoration:none;margin:0 12px;">Facebook</a>
                <span style="color:rgba(255,255,255,.3);">·</span>
                <a href="https://www.linkedin.com/company/purenorwayno" target="_blank" style="color:#12a0ec;text-decoration:none;margin:0 12px;">LinkedIn</a>
                <span style="color:rgba(255,255,255,.3);">·</span>
                <a href="https://www.tiktok.com/@purenorwaywaterno" target="_blank" style="color:#12a0ec;text-decoration:none;margin:0 12px;">TikTok</a>
              </p>

              <!-- links -->
              <p style="margin:0 0 20px;font-size:12px;">
                <a href="https://purenorwaywater.com" style="color:#12a0ec;text-decoration:none;font-weight:700;">PURENorwayWATER.COM</a>
              </p>

              <!-- flag divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
                <tr>
                  <td style="height:3px;background:#ef3340;width:40%;"></td>
                  <td style="height:3px;background:#ffffff;width:7%;"></td>
                  <td style="height:3px;background:#002868;width:13%;"></td>
                  <td style="height:3px;background:#ffffff;width:7%;"></td>
                  <td style="height:3px;background:#ef3340;width:33%;"></td>
                </tr>
              </table>

              <!-- unsubscribe -->
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,.25);">
                You're receiving this because you subscribed to Pure Norway updates.
                <br>
                <a href="${unsubscribeUrl}" style="color:rgba(255,255,255,.4);text-decoration:underline;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="https://purenorwaywater.com/contact" style="color:rgba(255,255,255,.4);text-decoration:underline;">Contact Us</a>
                &nbsp;·&nbsp;
                <a href="https://purenorwaywater.com/privacy" style="color:rgba(255,255,255,.4);text-decoration:underline;">Privacy Policy</a>
              </p>

            </td>
          </tr>

        </table>
        <!-- /CONTAINER -->

        <!-- below-container note -->
        <p style="margin:20px 0 0;font-size:11px;color:#9aacb8;text-align:center;">
          &copy; 2026 BigWater AS &nbsp;·&nbsp; Skibaasen 28, 4636 Kristiansand, Norway
        </p>

      </td>
    </tr>
  </table>

</body>
</html>`.trim();
}