import { Modal } from "react-bootstrap";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

const CheckoutPopup = ({
  show,
  handleClose,
  cartItems,
  totalPrice,
  handleCheckout,
}) => (
  <Modal
    show={show}
    onHide={handleClose}
    centered
    className="checkout-modal"
  >
    <Modal.Header closeButton>
      <Modal.Title>Review your order</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div>
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-item">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} />
            ) : (
              <span className="product-image-placeholder">
                <i className="bi bi-image" aria-hidden="true" />
              </span>
            )}
            <div>
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
            </div>
            <strong>{formatPrice(item.price * item.quantity)}</strong>
          </div>
        ))}
        <div className="checkout-total">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button className="secondary-action" type="button" onClick={handleClose}>
        Back
      </button>
      <button className="primary-action" type="button" onClick={handleCheckout}>
        <i className="bi bi-check2-circle" aria-hidden="true" />
        Confirm purchase
      </button>
    </Modal.Footer>
  </Modal>
);

export default CheckoutPopup;
