import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const adminUser = localStorage.getItem("adminUser");
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/all_reviews/")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      });
  }, []);

  const handelDelete = (id) => {
    if (window.confirm("Are you sure you want Delete")) {
      fetch(`http://127.0.0.1:8000/api/delete_review/${id}/`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message || "Review delete successfully");
          setReviews(reviews.filter((r) => r.id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid">
        <div
          className="card border-0 shadow-sm rounded-4 p-4"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div>
              <h3 className="fw-bold mb-1 text-dark">
                <i className="fas fa-star me-2 text-warning"></i>
                Manage Reviews
              </h3>
              <p className="text-muted mb-0">
                View and manage customer feedback and ratings
              </p>
            </div>

            <div
              className="px-4 py-3 rounded-4 shadow-sm"
              style={{
                background: "#ffffff",
                border: "1px solid #e9ecef",
                minWidth: "180px",
              }}
            >
              <small className="text-muted d-block mb-1">
                <i className="fas fa-database me-1"></i>
                Total Reviews
              </small>
              <h4 className="mb-0 fw-bold text-success">
                {reviews.length}
              </h4>
            </div>
          </div>

          <div
            className="table-responsive rounded-4"
            style={{
              overflow: "hidden",
              border: "1px solid #edf2f7",
            }}
          >
            <table className="table align-middle mb-0">
              <thead
                style={{
                  background: "#111827",
                  color: "#ffffff",
                }}
              >
                <tr>
                  <th className="py-3 px-3">S.No</th>
                  <th className="py-3 px-3">Food Item</th>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3">Comment</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {reviews.length > 0 ? (
                  reviews.map((r, index) => (
                    <tr
                      key={r.id}
                      style={{
                        background: "#ffffff",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <td className="px-3 fw-semibold">
                        #{index + 1}
                      </td>

                      <td className="px-3 fw-semibold text-dark">
                        {r.food_name}
                      </td>

                      <td className="px-3 text-muted">
                        {r.user_name}
                      </td>

                      <td className="px-3">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa-star me-1 ${
                              i < r.rating
                                ? "fas text-warning"
                                : "far text-secondary"
                            }`}
                          ></i>
                        ))}
                      </td>

                      <td
                        className="px-3 text-muted"
                        style={{
                          maxWidth: "250px",
                        }}
                      >
                        {r.comment}
                      </td>

                      <td className="px-3 text-muted">
                        {new Date(r.created_at).toLocaleString()}
                      </td>

                      <td className="px-3 text-center">
                        <button
                          onClick={() => handelDelete(r.id)}
                          className="btn btn-sm px-4 py-2 fw-semibold"
                          style={{
                            background:
                              "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                          }}
                        >
                          <i className="fas fa-trash-alt me-2"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-5 text-muted"
                    >
                      <i className="fas fa-comment-slash fa-2x mb-3 d-block"></i>
                      No Reviews Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageReviews;