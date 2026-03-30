import Link from 'next/link';
import AdminSidebar from './_components/AdminSidebar';
import AdminFooter from './_components/AdminFooter';

const quickLinks = [
  {
    href: '/blog',
    title: 'Blog & Stories',
    desc: 'Create and manage published and draft news posts.',
  },
  {
    href: '/gallery',
    title: 'Gallery Slides',
    desc: 'Control gallery media ordering and visibility.',
  },
  {
    href: '/products',
    title: 'Products',
    desc: 'Manage product cards and store-facing item details.',
  },
  {
    href: '/reviews',
    title: 'Reviews',
    desc: 'Moderate pending reviews and control featured feedback.',
  },
  {
    href: '/newsletter',
    title: 'Newsletter Users',
    desc: 'View and manage newsletter subscribers from your list.',
  },
];

export default function DashboardPage() {
  return (
    <>
      <AdminSidebar />

      <main className="main">
        <div className="view active">
          <div className="topbar">
            <h2>Dashboard</h2>
            <div className="topbar-actions">
              <a
                className="btn btn-ghost"
                href="https://purenorwaywater.com/"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 5h6v2H7v10h10v-4h2v6H5V5z" />
                  <path d="M14 5h5v5h-2V8.41l-6.29 6.3-1.42-1.42L15.59 7H14V5z" />
                </svg>
                Open Main Website
              </a>
            </div>
          </div>

          <div className="content dashboard-content">
            <section className="dashboard-hero-card">
              <p className="dashboard-kicker">PURENORWAY ADMIN</p>
              <h1>Welcome back</h1>
              <p>
                This is your temporary admin home. Use the shortcuts below to quickly jump into content management.
              </p>
            </section>

            <section className="dashboard-grid" aria-label="Admin quick links">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="dashboard-link-card">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span>Open</span>
                </Link>
              ))}
            </section>
          </div>
        </div>

        <AdminFooter />
      </main>
    </>
  );
}
