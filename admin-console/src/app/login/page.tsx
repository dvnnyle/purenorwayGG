import { Suspense } from "react";
import LoginForm from "./LoginForm";
import "./login.css";

export default function LoginPage() {
  return (
    <main className="temp-login-page">
      <section className="temp-login-card" aria-label="Temporary admin login">
        <p className="temp-login-kicker">PURENORWAY ADMIN</p>
        <h1>Login</h1>
        <p className="temp-login-help">Use your username and password to continue.</p>

        <Suspense fallback={<div className="temp-login-loading">Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
