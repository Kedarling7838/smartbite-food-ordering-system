import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../contest/CartContext";
import ChatBot from "../components/ChatBot";
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaTrash,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaTag,
} from "react-icons/fa";

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const { cartCount, setCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/cart/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data);
        const total = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0
        );
        setGrandTotal(total);
      });
  }, [userId]);

  const updateQuantity = async (orderId, newQty) => {
    if (newQty < 1) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/cart/update_quantity/",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            quantity: newQty,
          }),
        }
      );

      if (response.status === 200) {
        const updated = await fetch(
          `http://127.0.0.1:8000/api/cart/${userId}`
        );
        const data = await updated.json();
        setCartItems(data);
        setCartCount(data.length);

        const total = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0
        );
        setGrandTotal(total);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  const deleteCartItem = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item!"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/cart/delete/${orderId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        const updated = await fetch(
          `http://127.0.0.1:8000/api/cart/${userId}`
        );
        const data = await updated.json();
        setCartItems(data);
        setCartCount(data.length);

        const total = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0
        );
        setGrandTotal(total);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
        <ChatBot/>
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <FaShoppingCart /> Shopping Cart
            </h2>
            <p className="text-muted mb-0">
              Review your items and proceed to secure checkout
            </p>
          </div>

          <div className="badge bg-dark fs-6 px-4 py-3 rounded-pill">
            {cartCount} Items in Cart
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="card border-0 shadow-lg rounded-4 p-5 text-center">
            <h4 className="fw-bold">Your cart is empty</h4>
            <p className="text-muted mb-0">
              Add delicious food items to continue your order.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div
                  className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
                  key={item.id}
                >
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={`http://127.0.0.1:8000${item.food.image}`}
                        alt={item.food.item_name}
                        className="img-fluid h-100 w-100"
                        style={{ objectFit: "cover", minHeight: "250px" }}
                      />
                    </div>

                    <div className="col-md-8">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h4 className="fw-bold mb-1">
                              {item.food.item_name}
                            </h4>
                            <p className="text-muted small mb-0">
                              {item.food.item_description}
                            </p>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger rounded-circle"
                            onClick={() => deleteCartItem(item.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div className="d-flex flex-wrap gap-3 mb-3">
                          <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                            <FaTag className="me-2" /> ₹ {item.food.item_price}
                          </span>
                          <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                            <FaClock className="me-2" /> Fast Delivery
                          </span>
                          <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                            <FaShieldAlt className="me-2" /> Quality Assured
                          </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                          <div className="d-flex align-items-center border rounded-pill px-2 py-1">
                            <button
                              className="btn btn-sm"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <FaMinus />
                            </button>

                            <span className="fw-bold px-3 fs-5">
                              {item.quantity}
                            </span>

                            <button
                              className="btn btn-sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <FaPlus />
                            </button>
                          </div>

                          <h5 className="fw-bold text-success mb-0">
                            ₹ {(item.food.item_price * item.quantity).toFixed(2)}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-lg rounded-4 sticky-top" style={{ top: "100px" }}>
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Order Summary</h4>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Items Total</span>
                    <span className="fw-semibold">₹ {grandTotal.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Delivery Fee</span>
                    <span className="text-success fw-semibold">Free</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="fw-bold">Grand Total</h5>
                    <h4 className="fw-bold text-primary">
                      ₹ {grandTotal.toFixed(2)}
                    </h4>
                  </div>

                  <button
                    className="btn btn-dark w-100 py-3 rounded-4 fw-bold"
                    onClick={() => navigate("/payment")}
                  >
                    Proceed to Payment <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Cart;
