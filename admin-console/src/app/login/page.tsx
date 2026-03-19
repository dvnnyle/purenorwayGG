import { Suspense } from "react";
import Script from "next/script";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="temp-login-page">
      <style>{`
        .temp-login-page{width:100%;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at top right,rgba(0,180,200,.2),transparent 28%),radial-gradient(circle at bottom left,rgba(255,255,255,.08),transparent 24%),linear-gradient(135deg,#08141f,#0d1b2a 52%,#10273a)}
        .temp-login-card{width:min(420px,100%);position:relative;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:28px;backdrop-filter:blur(14px);box-shadow:0 24px 70px rgba(0,0,0,.28)}
        .temp-login-page--transition{padding:32px}
        .temp-login-card--transition{text-align:center;padding:40px 28px 32px}
        .temp-login-card--spinner-only{display:grid;place-items:center;min-height:220px}
        .temp-login-kicker{margin:0 0 12px;color:#00b4c8;font-size:11px;letter-spacing:.16em;font-weight:700;text-transform:uppercase}
        .temp-login-card h1{margin:0;color:#fff;font-size:1.9rem}
        .temp-login-help{margin:8px 0 22px;color:rgba(255,255,255,.72);font-size:.95rem}
        .temp-login-form{display:flex;flex-direction:column;gap:10px}
        .temp-login-form label{color:rgba(255,255,255,.9);font-size:.86rem;font-weight:600}
        .temp-login-form input{height:42px;border-radius:9px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;padding:0 12px}
        .temp-login-form button{margin-top:6px;height:42px;border-radius:9px;border:none;background:#00b4c8;color:#fff;font-weight:700;cursor:pointer}
        .temp-login-error{color:#ff9ca6;font-size:.84rem;margin:2px 0}
        .temp-login-loading{display:grid;place-items:center;min-height:100px}
        .temp-login-logo{display:block;height:52px;width:auto;margin:18px auto 0;opacity:.96}
        .temp-login-spinner{width:62px;height:62px;margin:0;border-radius:50%;border:4px solid rgba(255,255,255,.14);border-top-color:#00b4c8;border-right-color:rgba(111,230,245,.9);box-shadow:0 0 0 10px rgba(255,255,255,.03);animation:temp-login-spin .85s linear infinite}
        .temp-login-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
        @keyframes temp-login-spin{to{transform:rotate(360deg)}}
      `}</style>

      <Script id="admin-strip-login-next" strategy="beforeInteractive">
        {`(function(){
  try {
    var url = new URL(window.location.href);
    if (url.pathname !== '/login' || !url.searchParams.has('next')) return;
    var requestedPath = url.searchParams.get('next');
    if (requestedPath && requestedPath.charAt(0) === '/') {
      sessionStorage.setItem('admin_next_path', requestedPath);
    }
    url.searchParams.delete('next');
    history.replaceState({}, '', url.pathname + url.search + url.hash);
  } catch (_) {}
})();`}
      </Script>

      <section className="temp-login-card" aria-label="Admin login">
        <p className="temp-login-kicker">PURENORWAY ADMIN</p>
        <h1>Login</h1>
        <p className="temp-login-help">Use your Firebase admin email and password to continue.</p>

        <Suspense
          fallback={
            <div className="temp-login-loading" aria-label="Loading login form">
              <div className="temp-login-spinner" aria-hidden="true" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <img src="/assets/logo/logoWhite.png" alt="PURENorway" className="temp-login-logo" />
      </section>
    </main>
  );
}
