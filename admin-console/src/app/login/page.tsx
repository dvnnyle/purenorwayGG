import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="temp-login-page">
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
