import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Marketplace.css';

const Marketplace = () => {
  // Mock data for demonstration
  const forYouItems = [
    { id: 1, price: 350, title: 'Focusrite Clarett 2 pre' },
    { id: 2, price: 0, title: 'Free sectional couch' },
    { id: 3, price: 3000, title: 'Piano' },
    { id: 4, price: 875, title: 'Antique Pump Organ' },
    { id: 5, price: 300, title: 'Quail Cage' },
    { id: 6, price: 120, title: 'Prismatic Evolution Binders and Stickers' },
    { id: 7, price: 350, title: 'Focusrite Clarett 2 pre' },
    { id: 8, price: 0, title: 'Free sectional couch' },
    { id: 9, price: 3000, title: 'Piano' },
    { id: 10, price: 875, title: 'Antique Pump Organ' },
    { id: 11, price: 300, title: 'Quail Cage' },
    { id: 12, price: 120, title: 'Prismatic Evolution Binders and Stickers' },
  ];

  // Create 4 rows of items by repeating the array
  const repeatedItems = [
    ...forYouItems,
    ...forYouItems.map(item => ({...item, id: item.id + 6})),
    ...forYouItems.map(item => ({...item, id: item.id + 12})),
    ...forYouItems.map(item => ({...item, id: item.id + 18}))
  ];

  const categories = [
    { id: 1, name: 'Electronics', icon: '📱' },
    { id: 2, name: 'Clothing', icon: '👕' },
    { id: 3, name: 'Collectibles', icon: '🏺' },
    { id: 4, name: 'Jewelry', icon: '💍' },
    { id: 5, name: 'Sporting Goods', icon: '⚽' },
    { id: 6, name: 'Instruments', icon: '🎸' },
    { id: 7, name: 'Motor', icon: '🚗' },
    { id: 8, name: 'Gardening', icon: '🌱' },
    { id: 9, name: 'Home & Furniture', icon: '🏠' },
    { id: 10, name: 'Books & Media', icon: '📚' },
    { id: 11, name: 'Pet Supplies', icon: '🐾' },
    { id: 12, name: 'Art & Crafts', icon: '🎨' },
    { id: 13, name: 'Beauty & Health', icon: '💄' },
    { id: 14, name: 'Toys', icon: '🧸' },
    { id: 15, name: 'Video Games', icon: '🎮' },
    { id: 16, name: 'Music', icon: '🎵' }
  ];

  const sidebarItems = [
    { id: 1, name: 'Selling', icon: '🏷️', path: '/selling' },
    { id: 2, name: 'Orders', icon: '📦', path: '/orders' },
    { id: 3, name: 'Wishlist', icon: '❤️', path: '/wishlist' }
  ];

  return (
    <div className="home-container">
      {/* Fixed header */}
      <header className="header">
        <div className="logo">
          <img src="/images/Logo.jpg" alt="Logo" />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button type="submit" aria-label="Search">🔍</button>
        </div>
        <div className="header-actions">
          <Link to="/account">Account</Link>
          <Link to="/notifications">🔔</Link>
          <Link to="/cart">🛒</Link>
        </div>
      </header>

      {/* Fixed sidebar */}
      <aside className="sidebar">
        <Link to="/create-listing">
          <button className="create-listing-btn">+ Create New Listing</button>
        </Link>

        <nav className="main-nav">
          <ul>
            {sidebarItems.map(item => (
              <li key={item.id}>
                <Link to={item.path} className="nav-item">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="categories">
          <h2 className="categories-heading">Categories</h2>
          <ul>
            {categories.map(category => (
              <li key={category.id}>
                <Link to={`/category/${category.name.toLowerCase()}`} className="nav-item">
                  <span className="nav-icon">{category.icon}</span>
                  <span className="nav-text">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content to the right of the sidebar */}
      <main className="main-content">
        <h2>For You</h2>
        <div className="products">
          {repeatedItems.map(item => (
            <div key={item.id} className="product-card">
              <div className="product-image"></div>
              <div className="product-info">
                <span className="price">
                  {item.price === 0 ? 'FREE' : '$' + item.price}
                </span>
                <span className="title">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;

