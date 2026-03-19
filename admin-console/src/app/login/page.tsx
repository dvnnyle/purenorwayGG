import { Suspense } from "react";
import Script from "next/script";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="temp-login-page">
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
