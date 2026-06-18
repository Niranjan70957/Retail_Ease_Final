import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import API from "../axios";
import CheckoutPopup from "./CheckoutPopup";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let active = true;
    const imageUrls = [];

    const fetchCartItems = async () => {
      if (!cart.length) {
        setCartItems([]);
        return;
      }

      try {
        const response = await API.get("/products");
        const backendProductIds = response.data.map((product) => product.id);
        const availableItems = cart.filter((item) =>
          backendProductIds.includes(item.id)
        );
        const itemsWithImages = await Promise.all(
          availableItems.map(async (item) => {
            try {
              const imageResponse = await API.get(`/product/${item.id}/image`, {
                responseType: "blob",
              });
              const imageFile = new File(
                [imageResponse.data],
                item.imageName,
                { type: imageResponse.data.type }
              );
              const imageUrl = URL.createObjectURL(imageResponse.data);
              imageUrls.push(imageUrl);
              return { ...item, imageFile, imageUrl };
            } catch (error) {
              console.error("Error fetching cart image:", error);
              return { ...item, imageUrl: "" };
            }
          })
        );

        if (active) {
          setCartItems(itemsWithImages);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchCartItems();

    return () => {
      active = false;
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [cart]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id !== itemId) {
          return item;
        }
        if (item.quantity >= item.stockQuantity) {
          alert("Cannot add more than available stock");
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const updatedProductData = {
          id: item.id,
          name: item.name,
          description: item.description,
          brand: item.brand,
          price: item.price,
          category: item.category,
          releaseDate: item.releaseDate,
          stockQuantity: item.stockQuantity - item.quantity,
          productAvailable: item.productAvailable,
        };

        const cartProduct = new FormData();
        cartProduct.append("imageFile", item.imageFile);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], {
            type: "application/json",
          })
        );

        await API.put(`/product/${item.id}`, cartProduct, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <section className="cart-page">
      <div className="cart-layout">
        <div className="cart-list">
          <div className="cart-list-header">
            <h1>Shopping bag</h1>
            <span>
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div>
                <span className="cart-empty-icon" aria-hidden="true">
                  <i className="bi bi-bag" />
                </span>
                <h2>Your bag is ready for something colorful</h2>
                <p>Browse the collection and add your favorite products.</p>
                <Link className="primary-action mt-3" to="/">
                  Browse products
                </Link>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-image"
                  />
                ) : (
                  <span className="cart-item-image product-image-placeholder">
                    <i className="bi bi-image" aria-hidden="true" />
                  </span>
                )}
                <div className="cart-item-info">
                  <div className="cart-item-brand">{item.brand}</div>
                  <h2 className="cart-item-name">{item.name}</h2>
                  <span className="cart-item-unit">
                    {formatPrice(item.price)} each
                  </span>
                </div>

                <div className="quantity-control" aria-label="Item quantity">
                  <button
                    type="button"
                    onClick={() => handleDecreaseQuantity(item.id)}
                    aria-label={`Decrease ${item.name} quantity`}
                    title="Decrease quantity"
                  >
                    <i className="bi bi-dash-lg" aria-hidden="true" />
                  </button>
                  <output aria-label="Quantity">{item.quantity}</output>
                  <button
                    type="button"
                    onClick={() => handleIncreaseQuantity(item.id)}
                    aria-label={`Increase ${item.name} quantity`}
                    title="Increase quantity"
                  >
                    <i className="bi bi-plus-lg" aria-hidden="true" />
                  </button>
                </div>

                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <button
                  className="remove-button"
                  type="button"
                  onClick={() => handleRemoveFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                  title="Remove item"
                >
                  <i className="bi bi-trash3-fill" aria-hidden="true" />
                </button>
              </article>
            ))
          )}
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
          <button
            className="primary-action checkout-button"
            type="button"
            onClick={() => setShowModal(true)}
            disabled={cartItems.length === 0}
          >
            <i className="bi bi-lock-fill" aria-hidden="true" />
            Checkout
          </button>
        </aside>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </section>
  );
};

export default Cart;
