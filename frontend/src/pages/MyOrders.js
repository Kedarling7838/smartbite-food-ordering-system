import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaInfoCircle,
  FaMapMarkedAlt,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";

const MyOrders = () => {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/orders/${userId}/`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, [userId, navigate]);

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("delivered")) return "success";
    if (statusLower.includes("cancel")) return "danger";
    if (statusLower.includes("confirmed")) return "info";
    if (statusLower.includes("prepared")) return "primary";

    return "secondary";
  };

  return (
    <PublicLayout>
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
              <FaClipboardList className="text-primary" />
            </div>

            <h2 className="fw-bold mb-2">My Orders</h2>
            <p className="text-muted mb-0">
              View, track and manage all your food orders
            </p>
          </div>

          {/* EMPTY STATE */}
          {orders.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg rounded-4 text-center p-5">
                  <FaBoxOpen
                    className="text-warning mx-auto mb-3"
                    size={60}
                  />

                  <h4 className="fw-bold mb-2">No Orders Yet</h4>

                  <p className="text-muted">
                    You have not placed any orders yet.
                    Start exploring delicious meals now.
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
            /* ORDERS LIST */
            <div className="row">
              {orders.map((order, index) => (
                <div className="col-12 mb-4" key={index}>
                  <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        {/* LEFT ICON */}
                        <div className="col-md-1 text-center mb-3 mb-md-0">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                            style={{
                              width: "70px",
                              height: "70px",
                              background: "#f8f9fa",
                            }}
                          >
                            <FaBoxOpen
                              className="text-warning"
                              size={28}
                            />
                          </div>
                        </div>

                        {/* ORDER INFO */}
                        <div className="col-md-7">
                          <h4 className="fw-bold mb-2">
                            <Link
                              to={`/order-details/${order.order_number}`}
                              className="text-decoration-none"
                            >
                              Order #{order.order_number}
                            </Link>
                          </h4>

                          <div className="d-flex align-items-center flex-wrap gap-3 mb-2">
                            <div className="text-muted">
                              <FaCalendarAlt className="me-2" />
                              {new Date(
                                order.order_time
                              ).toLocaleString()}
                            </div>
                          </div>

                          <span
                            className={`badge bg-${getStatusBadge(
                              order.order_final_status
                            )} px-3 py-2 rounded-pill`}
                            style={{ fontSize: "14px" }}
                          >
                            {order.order_final_status}
                          </span>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="col-md-4 text-md-end mt-4 mt-md-0">
                          <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                            <Link
                              to={`/track-order/${order.order_number}`}
                              className="btn btn-outline-dark rounded-4 px-4"
                            >
                              <FaMapMarkedAlt className="me-2" />
                              Track
                            </Link>

                            <Link
                              to={`/order-details/${order.order_number}`}
                              className="btn btn-dark rounded-4 px-4"
                            >
                              <FaInfoCircle className="me-2" />
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM STRIP */}
                    <div
                      style={{
                        height: "6px",
                        background:
                          "linear-gradient(to right, #0d6efd, #6f42c1)",
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

export default MyOrders;