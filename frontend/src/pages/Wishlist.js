import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWishlist } from "../contest/WishlistContext";
import ChatBot from "../components/ChatBot";
import {
  FaHeart,
  FaShoppingBasket,
  FaTimesCircle,
  FaHeartBroken,
} from "react-icons/fa";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { wishlistCount, setWishlistCount } = useWishlist();

  const userId = localStorage.getItem("userId");

  // Fetch Wishlist Items
  const fetchWishlist = async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/wishlist/${userId}/`
      );

      const data = await res.json();

      setWishlist(data);
      setWishlistCount(data.length);
    } catch (error) {
      toast.error("Failed to load wishlist");
      console.log(error);
    }
  };

  // Remove Item From Wishlist
  const removeFromWishlist = async (foodId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/wishlist/remove/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            food_id: foodId,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Removed from wishlist");
        fetchWishlist();
      } else {
        toast.error(result.message || "Failed to remove item");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  return (
    <PublicLayout>
      <ChatBot />
      <ToastContainer position="top-center" autoClose={2000} />

      <div
        className="min-vh-100"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #ffffff 100%)",
          padding: "40px 0",
        }}
      >
        <div className="container">
          {/* PAGE HEADER */}
          <div className="text-center mb-5">
            <div
              className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: "80px",
                height: "80px",
                background: "#ffffff",
                fontSize: "30px",
              }}
            >
              <FaHeart className="text-danger" />
            </div>

            <h2 className="fw-bold mb-2">My Wishlist</h2>
            <p className="text-muted mb-0">
              Save your favorite dishes and order them anytime
            </p>
          </div>

          {/* EMPTY STATE */}
          {wishlist.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg rounded-4 text-center p-5">
                  <FaHeartBroken
                    className="text-danger mx-auto mb-3"
                    size={60}
                  />

                  <h4 className="fw-bold mb-2">Your Wishlist is Empty</h4>

                  <p className="text-muted">
                    You haven’t added any food items yet.
                    Start exploring and save your favorites.
                  </p>

                  <div className="mt-3">
                    <Link
                      to="/"
                      className="btn btn-dark px-4 py-2 rounded-4 fw-semibold"
                    >
                      Browse Foods
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* WISHLIST ITEMS */
            <div className="row">
              {wishlist.map((item) => (
                <div className="col-lg-4 col-md-6 mb-4" key={item.food_id}>
                  <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                    {/* IMAGE SECTION */}
                    <div className="position-relative">
                      <img
                        src={`http://127.0.0.1:8000${item.image}`}
                        alt={item.item_name}
                        className="card-img-top"
                        style={{
                          height: "240px",
                          objectFit: "cover",
                        }}
                      />

                      {/* REMOVE HEART BUTTON */}
                      <button
                        className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
                        style={{
                          background: "#ffffff",
                          width: "45px",
                          height: "45px",
                        }}
                        onClick={() =>
                          removeFromWishlist(item.food_id)
                        }
                      >
                        <FaHeart className="text-danger" />
                      </button>
                    </div>

                    {/* CARD BODY */}
                    <div className="card-body p-4 d-flex flex-column">
                      <h5 className="fw-bold mb-2">
                        <Link
                          to={`/food/${item.food_id}`}
                          className="text-decoration-none text-dark"
                        >
                          {item.item_name}
                        </Link>
                      </h5>

                      <p className="text-muted small mb-3 flex-grow-1">
                        {item.item_description
                          ? item.item_description.slice(0, 80)
                          : "No description available"}
                        ...
                      </p>

                      {/* PRICE + ACTION */}
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                          <h5 className="fw-bold text-success mb-0">
                            ₹ {item.item_price}
                          </h5>
                        </div>

                        {item.is_available ? (
                          <Link
                            to={`/food/${item.food_id}`}
                            className="btn btn-dark rounded-4 px-3"
                          >
                            <FaShoppingBasket className="me-2" />
                            Order
                          </Link>
                        ) : (
                          <button className="btn btn-outline-secondary rounded-4 px-3">
                            <FaTimesCircle className="me-2" />
                            Unavailable
                          </button>
                        )}
                      </div>
                    </div>

                    {/* BOTTOM COLOR STRIP */}
                    <div
                      style={{
                        height: "6px",
                        background:
                          "linear-gradient(to right, #dc3545, #fd7e14)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Wishlist;