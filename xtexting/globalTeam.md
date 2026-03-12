<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Team Section – Pure Norway</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  /* ── Variables & base (already in your other pages) ── */
  :root {
    --teal:      #00B4C8;
    --teal-dark: #007A8C;
    --navy:      #0D1B2A;
    --off-white: #F4F8FA;
    --white:     #FFFFFF;
    --text:      #182530;
    --muted:     #6B8090;
    --border:    #DDE8EE;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0D1B2A; }
  .eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--teal); }

  /* ── TEAM SECTION ── */
  .team-section { background: var(--navy); padding: 88px 56px; }
  .team-inner { max-width: 1160px; margin: 0 auto; }
  .team-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 56px; }
  .team-header-text .eyebrow { margin-bottom: 12px; }
  .team-header-text h2 { font-family: 'Fraunces', serif; font-size: clamp(28px, 3vw, 44px); font-weight: 900; color: #fff; letter-spacing: -1px; line-height: 1.05; }
  .team-header-text h2 em { color: var(--teal); font-style: italic; }
  .team-header > p { font-size: 14px; color: rgba(255,255,255,.35); max-width: 260px; text-align: right; line-height: 1.65; }

  /* HQ full-width card */
  .hq-card {
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px; padding: 36px 40px; margin-bottom: 16px;
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px;
    transition: border-color .2s;
  }
  .hq-card:hover { border-color: rgba(0,180,200,.3); }
  .hq-left { border-right: 1px solid rgba(255,255,255,.07); padding-right: 40px; }
  .hq-label { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--teal); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .hq-flag { font-size: 20px; }
  .hq-left h3 { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -.4px; margin-bottom: 10px; }
  .hq-left address { font-style: normal; font-size: 13px; color: rgba(255,255,255,.35); line-height: 1.8; }
  .hq-left address a { color: var(--teal); text-decoration: none; }
  .hq-left address a:hover { text-decoration: underline; }
  .hq-person-name { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 3px; }
  .hq-person-role { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--teal); margin-bottom: 10px; opacity: .8; }
  .hq-person-links { display: flex; flex-direction: column; gap: 5px; }
  .hq-person-links a { font-size: 12.5px; color: rgba(255,255,255,.4); text-decoration: none; transition: color .18s; }
  .hq-person-links a:hover { color: var(--teal); }

  /* Region cards */
  .regions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .region-card {
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px; padding: 28px 28px 32px;
    transition: border-color .2s, background .2s;
    position: relative; overflow: hidden;
  }
  .region-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--teal), transparent);
    transform: scaleX(0); transform-origin: left; transition: transform .3s;
  }
  .region-card:hover { border-color: rgba(0,180,200,.25); background: rgba(0,180,200,.04); }
  .region-card:hover::before { transform: scaleX(1); }
  .region-top { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .region-flag { font-size: 26px; line-height: 1; }
  .region-name { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--teal); margin-bottom: 2px; }
  .region-card h3 { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -.3px; }
  .region-contacts { display: flex; flex-direction: column; gap: 14px; }
  .r-person { padding-top: 14px; border-top: 1px solid rgba(255,255,255,.06); }
  .r-person:first-child { padding-top: 0; border-top: none; }
  .r-person-name { font-size: 13px; font-weight: 700; color: rgba(255,255,255,.85); margin-bottom: 2px; }
  .r-person-company { font-size: 11px; color: rgba(255,255,255,.3); margin-bottom: 6px; font-weight: 500; }
  .r-links { display: flex; flex-direction: column; gap: 3px; }
  .r-links a { font-size: 12px; color: rgba(255,255,255,.4); text-decoration: none; transition: color .18s; }
  .r-links a:hover { color: var(--teal); }

  /* Responsive */
  @media (max-width: 1024px) {
    .team-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .team-header > p { text-align: left; }
    .hq-card { grid-template-columns: 1fr; gap: 24px; }
    .hq-left { border-right: none; border-bottom: 1px solid rgba(255,255,255,.07); padding-right: 0; padding-bottom: 24px; }
    .regions-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 700px) {
    .team-section { padding-left: 20px; padding-right: 20px; }
    .regions-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<section class="team-section">
  <div class="team-inner">

    <div class="team-header">
      <div class="team-header-text">
        <div class="eyebrow">Our Global Team</div>
        <h2>People behind<br><em>Pure Norway.</em></h2>
      </div>
      <p>Headquartered in Kristiansand with partners across 5 regions worldwide.</p>
    </div>

    <!-- HQ FULL ROW -->
    <div class="hq-card">
      <div class="hq-left">
        <div class="hq-label"><span class="hq-flag">🇳🇴</span> Headquarters</div>
        <h3>Norway Office</h3>
        <address>
          BigWater<br>
          Skibaasen 28<br>
          4636 Kristiansand, Norway<br><br>
          <a href="tel:+4738044030">+47 38 04 40 30</a><br>
          <a href="mailto:post@purenorway.no">post@purenorway.no</a><br>
          <a href="https://www.purenorwaywater.com">purenorwaywater.com</a>
        </address>
      </div>
      <div class="hq-person">
        <div class="hq-person-name">David Severinsen</div>
        <div class="hq-person-role">CEO</div>
        <div class="hq-person-links">
          <a href="tel:+4745890684">+47 458 90 684</a>
          <a href="mailto:david@purenorwaywater.com">david@purenorwaywater.com</a>
        </div>
      </div>
      <div class="hq-person">
        <div class="hq-person-name">Øystein Frustøl</div>
        <div class="hq-person-role">Co-founder</div>
        <div class="hq-person-links">
          <a href="tel:+4790915907">+47 909 15 907</a>
          <a href="mailto:oystein@purenorway.no">oystein@purenorway.no</a>
        </div>
      </div>
    </div>

    <!-- REGIONS -->
    <div class="regions-grid">

      <div class="region-card">
        <div class="region-top">
          <span class="region-flag">🇦🇪</span>
          <div class="region-meta">
            <div class="region-name">Middle East</div>
            <h3>Dubai</h3>
          </div>
        </div>
        <div class="region-contacts">
          <div class="r-person">
            <div class="r-person-name">Birol Can</div>
            <div class="r-person-company">Fjord Norway Source LLC</div>
            <div class="r-links">
              <a href="tel:+4740050684">+47 400 50 684</a>
              <a href="mailto:post@fjordnorway.ae">post@fjordnorway.ae</a>
              <a href="https://fjordnorway.ae">fjordnorway.ae</a>
            </div>
          </div>
        </div>
      </div>

      <div class="region-card">
        <div class="region-top">
          <span class="region-flag">🇬🇧</span>
          <div class="region-meta">
            <div class="region-name">UK / France</div>
            <h3>IFL</h3>
          </div>
        </div>
        <div class="region-contacts">
          <div class="r-person">
            <div class="r-person-name">Chris Smith</div>
            <div class="r-person-company">IFL</div>
            <div class="r-links">
              <a href="tel:+447898853171">+44 789 885 3171</a>
              <a href="mailto:chris@purenorwaywater.com">chris@purenorwaywater.com</a>
            </div>
          </div>
        </div>
      </div>

      <div class="region-card">
        <div class="region-top">
          <span class="region-flag">🌏</span>
          <div class="region-meta">
            <div class="region-name">Asia Pacific</div>
            <h3>Vietnam · Singapore · Taiwan</h3>
          </div>
        </div>
        <div class="region-contacts">
          <div class="r-person">
            <div class="r-person-name">BUY2SELL</div>
            <div class="r-person-company">Vietnam / Singapore</div>
            <div class="r-links">
              <a href="mailto:support@buy2sell.vn">support@buy2sell.vn</a>
            </div>
          </div>
          <div class="r-person">
            <div class="r-person-name">UFL Shipping Agency</div>
            <div class="r-person-company">Taiwan</div>
            <div class="r-links">
              <a href="tel:+88673389963">+886 7 338 9963</a>
              <a href="mailto:shippingagency@uni-logistics.com">shippingagency@uni-logistics.com</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

</body>
</html>