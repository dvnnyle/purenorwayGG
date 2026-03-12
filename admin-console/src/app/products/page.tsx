'use client';

import AdminSidebar from '../_components/AdminSidebar';

export default function ProductsPage() {
  return (
    <>
      <AdminSidebar />

      <main className="main">
        <div className="view active">
          <div className="topbar">
            <h2>Products</h2>
            <div className="topbar-actions">
              <button className="btn btn-primary">
                <svg viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Add Product
              </button>
            </div>
          </div>
          <div className="content">
            <div className="product-grid">
              <div className="product-card">
                <div className="product-img" style={{ background: 'linear-gradient(135deg,#2a1a2e,#3d1f35)' }}>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">Strawberry Raspberry</div>
                  <div className="product-card-meta">Sparkling · 330ml</div>
                  <div className="product-card-footer">
                    <div className="product-price">NOK 19,90</div>
                    <span className="product-status active">Active</span>
                  </div>
                </div>
              </div>

              <div className="product-card">
                <div className="product-img" style={{ background: 'linear-gradient(135deg,#1f2a1a,#2e3d1f)' }}>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">Ginger Lemon</div>
                  <div className="product-card-meta">Sparkling · 330ml</div>
                  <div className="product-card-footer">
                    <div className="product-price">NOK 19,90</div>
                    <span className="product-status active">Active</span>
                  </div>
                </div>
              </div>

              <div className="product-card">
                <div className="product-img" style={{ background: 'linear-gradient(135deg,#0d1f2a,#0d2a3d)' }}>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">Smurfene Still</div>
                  <div className="product-card-meta">Still · 330ml</div>
                  <div className="product-card-footer">
                    <div className="product-price">NOK 19,90</div>
                    <span className="product-status active">Active</span>
                  </div>
                </div>
              </div>

              <div className="product-card">
                <div className="product-img" style={{ background: 'linear-gradient(135deg,#1a2a1f,#1f3d2a)' }}>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">Apple Pear</div>
                  <div className="product-card-meta">Sparkling · 330ml</div>
                  <div className="product-card-footer">
                    <div className="product-price">NOK 19,90</div>
                    <span className="product-status draft">Draft</span>
                  </div>
                </div>
              </div>

              <div className="add-product-card">
                <svg viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                <span>Add New Product</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
