import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const FoodDetail = () => {
  const userId = localStorage.getItem("userId");
  const [food, setFood] = useState(null);
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/foods/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFood(data);
      });

    fetch(`http://127.0.0.1:8000/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      });
  }, [id]);

  const handelAddToCart = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/cart/add/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            foodId: food.id,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        toast.success(result.message || "Item added to cart");

        setTimeout(() => {
          navigate("/cart");
        }, 2000);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  const handelReviewSubmit = async () => {
    if (!userId) {
      toast.warning("Please login first to submit review");
      navigate("/login");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select rating from 1 to 5");
      return;
    }

    const payload = {
      user_id: userId,
      food: id,
      rating,
      comment,
    };

    const url = editId
      ? `http://127.0.0.1:8000/api/review_edit/${editId}/`
      : `http://127.0.0.1:8000/api/reviews/add/${id}/`;

    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editId ? "Review Updated" : "Review Submitted");
        setComment("");
        setRating(0);
        setEditId(null);

        const updatedReviews = await fetch(
          `http://127.0.0.1:8000/api/reviews/${id}/`
        ).then((res) => res.json());

        setReviews(updatedReviews);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }
  };

  const fetchReviews = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`);
    const data = await res.json();
    setReviews(data);
  };

  const handelDeleteReview = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete");
    if (!confirmDelete) return;

    const res = await fetch(
      `http://127.0.0.1:8000/api/review_edit/${id}/`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      toast.success("Review Deleted");
      fetchReviews();
    } else {
      toast.error("Failed To Delete");
    }
  };

  const renderStars = (count, clickable = false) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa-star ${
            i <= (hoverRating || count)
              ? "fas text-warning"
              : "far text-secondary"
          }`}
          style={{
            cursor: clickable ? "pointer" : "default",
            fontSize: "20px",
            marginRight: "4px",
          }}
          onClick={clickable ? () => setRating(i) : undefined}
          onMouseEnter={clickable ? () => setHoveredRating(i) : undefined}
          onMouseLeave={clickable ? () => setHoveredRating(0) : undefined}
        ></i>
      );
    }

    return stars;
  };

  const handelEditReview = (rev) => {
    setRating(rev.rating);
    setComment(rev.comment);
    setEditId(rev.id);
  };

  if (!food) return <div>Loading.....</div>;

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #ffffff 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="container">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5">
            <div className="row align-items-center g-5">
              <div className="col-md-5 text-center">
                <div className="rounded-4 overflow-hidden shadow-sm">
                  <Zoom>
                    <img
                      src={`http://127.0.0.1:8000${food.image}`}
                      alt={food.item_name}
                      className="img-fluid"
                      style={{
                        width: "100%",
                        maxHeight: "420px",
                        objectFit: "cover",
                      }}
                    />
                  </Zoom>
                </div>
              </div>

              <div className="col-md-7">
                <span className="badge bg-primary mb-3 px-3 py-2 rounded-pill">
                  {food.category_name}
                </span>

                <h2 className="fw-bold mb-3">{food.item_name}</h2>

                <p className="text-muted fs-6 mb-3">
                  {food.item_description}
                </p>

                <h3 className="fw-bold text-success mb-3">
                  ₹ {food.item_price}
                </h3>

                <div className="mb-4">
                  <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                    🚚 Free Shipping
                  </span>
                </div>

                {food.is_available ? (
                  <button
                    className="btn btn-warning btn-lg px-5 rounded-4 shadow-sm"
                    onClick={handelAddToCart}
                  >
                    <i className="fas fa-cart-plus me-2"></i>
                    Add to Cart
                  </button>
                ) : (
                  <button className="btn btn-outline-secondary rounded-4">
                    <i className="fas fa-times-circle me-2"></i>
                    Currently Unavailable
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mt-5">
            <h4 className="fw-bold mb-4">
              <i className="fas fa-star text-warning me-2"></i>
              Customer Reviews
            </h4>

            {reviews.length === 0 ? (
              <p className="text-muted fst-italic">
                No reviews yet. Be the first to share your thoughts...
              </p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border-bottom pb-4 mb-4 last:border-0"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-bold mb-1">{rev.user_name}</h6>
                      <div>{renderStars(rev.rating)}</div>
                    </div>

                    {rev.user_id === parseInt(userId) && (
                      <div>
                        <i
                          className="fas fa-edit text-info me-3"
                          style={{
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                          onClick={() => handelEditReview(rev)}
                          title="Edit"
                        ></i>

                        <i
                          className="fas fa-trash-alt text-danger"
                          style={{
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                          onClick={() => handelDeleteReview(rev.id)}
                          title="Delete"
                        ></i>
                      </div>
                    )}
                  </div>

                  <p className="text-muted mt-3 mb-2">{rev.comment}</p>

                  <small className="text-muted">
                    {new Date(rev.created_at).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mt-5">
            <h4 className="fw-bold mb-4">
              <i className="fas fa-pen me-2 text-success"></i>
              Write a Review
            </h4>

            <div className="mb-4">
              <label className="form-label fw-semibold">Your Rating</label>
              <div>{renderStars(rating, true)}</div>
            </div>

            <div className="mb-4">
              <textarea
                className="form-control rounded-4 p-3"
                rows={4}
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button
              className="btn btn-success px-4 py-2 rounded-4 fw-semibold"
              onClick={handelReviewSubmit}
            >
              <i className="fas fa-paper-plane me-2"></i>
              {editId ? "Update Review" : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodDetail;