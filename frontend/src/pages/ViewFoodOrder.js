import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewFoodOrder = () => {
  const { orderNumber } = useParams();
  const adminUser = localStorage.getItem("adminUser");
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/view-order-detail/${orderNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Order not found");
        setLoading(false);
      });
  }, [orderNumber, adminUser, navigate]);

  if (loading)
    return (
      <AdminLayout>
        <div className="text-center mt-5">Loading...</div>
      </AdminLayout>
    );

  if (!data || !data.order)
    return (
      <AdminLayout>
        <div className="text-center mt-5 text-danger">
          Order not found
        </div>
      </AdminLayout>
    );

  const order = data.order || {};
  const foods = data.foods || [];
  const tracking = data.tracking || [];

  const statusOptions = [
    "Order Confirmed",
    "Food being Prepared",
    "Food Pickup",
    "Food Delivered",
    "Order Cancelled",
  ];

  const currentStatus = order.order_final_status || "";
  const visibleOptions = statusOptions.slice(
    statusOptions.indexOf(currentStatus) + 1
  );

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={1500} />

      <div className="container py-4">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="fw-bold">Order #{orderNumber}</h3>
          <p className="text-muted">Admin Panel</p>
        </div>

        <div className="row g-4">

          {/* USER CARD */}
          <div className="col-lg-6">
            <div className="card border-0 shadow rounded-4 p-4">
              <h5 className="fw-bold mb-3">User Details</h5>

              <p><strong>Name:</strong> {order.user_first_name} {order.user_last_name}</p>
              <p><strong>Email:</strong> {order.user_email}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Time:</strong> {new Date(order.order_time).toLocaleString()}</p>

              <span className="badge bg-primary p-2">
                {order.order_final_status || "Pending"}
              </span>
            </div>
          </div>
          </div>

        {/* TRACKING */}
        <div className="card border-0 shadow rounded-4 p-4 mt-4">
          <h5 className="fw-bold mb-3">Tracking Timeline</h5>

          {tracking.length === 0 ? (
            <p>No tracking history</p>
          ) : (
            tracking.map((track, index) => (
              <div key={index} className="mb-3 border-bottom pb-2">

                <span className="badge bg-dark me-2">
                  {track.status}
                </span>

                <p className="mb-1">{track.remark}</p>

                <small className="text-muted">
                  {new Date(track.status_date).toLocaleString()}
                </small>

              </div>
            ))
          )}
        </div>

        {/* UPDATE STATUS */}
        {order?.order_final_status !== "Food Delivered" && (
          <div className="card border-0 shadow rounded-4 p-4 mt-4">
            <h5 className="fw-bold mb-3">Update Status</h5>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                const status = e.target.status.value;
                const remark = e.target.remark.value;

                fetch("http://127.0.0.1:8000/api/update_order_status/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    order_number: order.order_number,
                    status,
                    remark,
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.message) {
                      toast.success(res.message);
                      setTimeout(() => window.location.reload(), 1000);
                    } else {
                      toast.error("Failed to update");
                    }
                  })
                  .catch(() => toast.error("Server error"));
              }}
            >
              <select name="status" className="form-control mb-3" required>
                {visibleOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <textarea
                name="remark"
                className="form-control mb-3"
                rows="3"
                placeholder="Enter remark..."
                required
              ></textarea>

              <button className="btn btn-success w-100">
                Update Status
              </button>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default ViewFoodOrder;