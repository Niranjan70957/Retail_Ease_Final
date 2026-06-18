import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import API from "../axios";
import AppContext from "../Context/Context";

const categories = [
  "Laptop",
  "Headphone",
  "Mobile",
  "Electronics",
  "Toys",
  "Fashion",
];

const Navbar = ({ onSelectCategory }) => {
  const { cart } = useContext(AppContext);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light-theme"
  );
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleChange = async (value) => {
    setInput(value);
    setShowSearchResults(value.length > 0);

    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await API.get("/product/search", {
        params: { key: value },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    }
  };

  const handleCategorySelect = (category) => {
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top store-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={() => onSelectCategory("")}>
            <span className="brand-mark" aria-hidden="true">
              <i className="bi bi-bag-heart-fill" />
            </span>
            <span>RetailEase</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#storeNavigation"
            aria-controls="storeNavigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>

          <div className="collapse navbar-collapse" id="storeNavigation">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/add_product">
                  Add Product
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle border-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </button>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        className="dropdown-item"
                        to="/"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <div className="nav-actions">
              <div className="search-box">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="Search products"
                  aria-label="Search products"
                  value={input}
                  onChange={(event) => handleChange(event.target.value)}
                  onFocus={() => input && setShowSearchResults(true)}
                />
                {showSearchResults && (
                  <ul className="search-results">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id}>
                          <Link
                            to={`/product/${result.id}`}
                            onClick={() => setShowSearchResults(false)}
                          >
                            {result.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="search-empty">No matching products</li>
                    )}
                  </ul>
                )}
              </div>

              <button
                className="icon-button"
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark-theme"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                title={
                  theme === "dark-theme"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
              >
                <i
                  className={
                    theme === "dark-theme"
                      ? "bi bi-sun-fill"
                      : "bi bi-moon-stars-fill"
                  }
                  aria-hidden="true"
                />
              </button>

              <Link
                to="/cart"
                className="cart-link"
                aria-label={`Cart with ${cartCount} items`}
                title="Shopping cart"
              >
                <i className="bi bi-bag-fill" aria-hidden="true" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
