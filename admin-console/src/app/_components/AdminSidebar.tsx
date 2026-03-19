'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/temp-auth/logout', { method: 'POST' });
    sessionStorage.removeItem('temp_admin_session');
    sessionStorage.removeItem('temp_admin_last_path');
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">
          <svg viewBox="0 0 24 24">
            <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
          </svg>
        </div>
        <div className="logo-text">
          PURENorway<span>Admin Panel</span>
        </div>
      </div>

      <div className="nav-section">Content</div>

      <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24">
          <path d="M12 3 2 9v2h2v9h6v-6h4v6h6v-9h2V9L12 3z" />
        </svg>
        Dashboard
      </Link>

      <Link href="/blog" className={`nav-item ${pathname === '/blog' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
        Blog &amp; Stories
      </Link>

      <Link href="/reviews" className={`nav-item ${pathname === '/reviews' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16l4-3 4 3 4-3 4 3V8l-6-6zm1 7V3.5L19.5 9H15zM8.8 15.2 7.3 14l-1.5 1.2.6-1.8-1.5-1.1h1.9l.5-1.8.6 1.8h1.9l-1.5 1.1.5 1.8zm5 0-1.5-1.2-1.5 1.2.6-1.8-1.5-1.1h1.9l.5-1.8.6 1.8h1.9l-1.5 1.1.5 1.8z" />
        </svg>
        Reviews
      </Link>

      <Link href="/gallery" className={`nav-item ${pathname === '/gallery' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24">
          <path d="M22 16V4c0-1.1-.9-2-2-2H8C6.9 2 6 2.9 6 4v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zM11 12l2.03 2.71L16 11l4 5H8l3-4zm-7 4V8H2v10c0 1.1.9 2 2 2h10v-2H4z" />
        </svg>
        Gallery
      </Link>

      <div className="nav-section">Store</div>

      <Link href="/products" className={`nav-item ${pathname === '/products' ? 'active' : ''}`}>
        <svg viewBox="0 0 24 24">
          <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3z" />
        </svg>
        Products
      </Link>

      <div className="sidebar-footer">
        <button type="button" className="logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 17v-2h5V9h-5V7h7v10h-7zm-1 3H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h4v2H5v12h4v2zm11.59-5L18 12.41V11h-7v2h7v-1.41L20.59 15z" />
          </svg>
          Logout
        </button>

        <div className="user">
          <div className="avatar">AD</div>
          <div>
            <div className="user-name">Admin User</div>
            <div className="user-role">Temporary Access</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
