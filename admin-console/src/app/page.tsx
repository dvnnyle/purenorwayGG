import Link from 'next/link';
import AdminSidebar from './_components/AdminSidebar';

const quickLinks = [
  {
    href: '/blog',
    title: 'Blog & Stories',
    desc: 'Create and manage published and draft news posts.',
  },
  {
    href: '/gallery',
    title: 'Gallery Slides',
    desc: 'Control carousel and gallery media ordering and visibility.',
  },
  {
    href: '/products',
    title: 'Products',
    desc: 'Manage product cards and store-facing item details.',
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
      </main>
    </>
  );
}
