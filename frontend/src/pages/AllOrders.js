import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const adminUser = localStorage.getItem("adminUser");
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/all_orders/")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      });
  }, []);

  return (
    <AdminLayout>
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
                <i className="fas fa-list-alt me-2 text-primary"></i>
                All Orders
              </h3>
              <p className="text-muted mb-0">
                Manage and monitor all customer orders
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
                Total Orders
              </small>
              <h4 className="mb-0 fw-bold text-success">
                {orders.length}
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
                  <th className="py-3 px-3">Order Number</th>
                  <th className="py-3 px-3">Order Date</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr
                      key={order.id}
                      style={{
                        background: "#ffffff",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <td className="px-3 fw-semibold">
                        #{index + 1}
                      </td>

                      <td className="px-3">
                        <span
                          className="fw-semibold"
                          style={{
                            color: "#2563eb",
                          }}
                        >
                          {order.order_number}
                        </span>
                      </td>

                      <td className="px-3 text-muted">
                        {new Date(order.order_time).toLocaleString()}
                      </td>

                      <td className="px-3 text-center">
                        <a
                          href={`/admin-view-order-detail/${order.order_number}`}
                          className="btn btn-sm px-4 py-2 fw-semibold"
                          style={{
                            background:
                              "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                          }}
                        >
                          <i className="fas fa-eye me-2"></i>
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-5 text-muted"
                    >
                      <i className="fas fa-box-open fa-2x mb-3 d-block"></i>
                      No Orders Found
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

export default AllOrders;