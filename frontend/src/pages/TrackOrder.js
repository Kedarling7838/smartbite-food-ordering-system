import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import "../styles/track.css";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBot from "../components/ChatBot";

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState([]);

  const { paramOrderNumber } = useParams();

  useEffect(() => {
    if (paramOrderNumber) {
      setOrderNumber(paramOrderNumber);
      handleTrack(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleTrack = async (orderNum) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/track_order/${orderNum}/`
      );

      if (response.ok) {
        const data = await response.json();
        setTrackingData(data);
      } else {
        toast.error("Order Not found or placed yet..!");
        setTrackingData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getBadge = (status) => {
    switch (status.toLowerCase()) {
      case "order confirmed":
        return "bg-info";

      case "food being prepared":
        return "bg-warning";

      case "food pickup":
        return "bg-primary";

      case "food delivered":
        return "bg-success";

      case "order cancelled":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
        <ChatBot />
      <div
        className="min-vh-100"
        style={{
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #ffffff 100%)",
          padding: "40px 0",
        }}
      >
        <div className="container">
          {/* HEADER */}
          <div className="text-center mb-5">
            <h2 className="fw-bold">
              <i className="fas fa-map-marker-alt text-primary me-2"></i>
              Track Your Order
            </h2>
            <p className="text-muted">
              Stay updated with your food delivery in real time
            </p>
          </div>

          {/* SEARCH CARD */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="fas fa-search-location me-2 text-primary"></i>
                    Enter Order Details
                  </h5>

                  <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fas fa-receipt text-muted"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Enter your Order Number"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      onClick={() => handleTrack(orderNumber)}
                      className="btn btn-dark py-3 rounded-4 fw-bold"
                    >
                      <i className="fas fa-truck me-2"></i>
                      Track Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TRACKING RESULT */}
          {trackingData.length > 0 && (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                  <div className="card-body p-4 p-md-5">
                    {/* TITLE */}
                    <div className="mb-5">
                      <h4 className="fw-bold text-primary">
                        <i className="fas fa-stream me-2"></i>
                        Order Status Timeline
                      </h4>
                      <p className="text-muted mb-0">
                        Live progress of your order journey
                      </p>
                    </div>

                    {/* TIMELINE */}
                    <div className="position-relative mb-5">
                      <div
                        style={{
                          position: "absolute",
                          top: "28px",
                          left: "0",
                          right: "0",
                          height: "4px",
                          background: "#e9ecef",
                          zIndex: "1",
                          borderRadius: "20px",
                        }}
                      ></div>

                      <div className="row text-center position-relative">
                        {trackingData.map((entry, index) => (
                          <div
                            key={index}
                            className="col-md text-center"
                            style={{ zIndex: "2" }}
                          >
                            <div
                              className={`rounded-circle ${getBadge(
                                entry.status
                              )} text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow`}
                              style={{
                                width: "55px",
                                height: "55px",
                                fontSize: "18px",
                              }}
                            >
                              <i className="fas fa-check"></i>
                            </div>

                            <h6 className="fw-bold small">
                              {entry.status}
                            </h6>

                            <small className="text-muted">
                              {new Date(
                                entry.status_date
                              ).toLocaleDateString()}
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DETAILED HISTORY */}
                    <div>
                      <h5 className="fw-bold mb-4">
                        <i className="fas fa-history me-2 text-primary"></i>
                        Detailed History
                      </h5>

                      <div className="row g-3">
                        {trackingData.map((entry, index) => (
                          <div key={index} className="col-md-12">
                            <div className="card border-0 shadow-sm rounded-4">
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start flex-wrap">
                                  <div>
                                    <span
                                      className={`badge ${getBadge(
                                        entry.status
                                      )} px-3 py-2 rounded-pill`}
                                    >
                                      {entry.status}
                                    </span>

                                    {entry.order_cancelled_by_user && (
                                      <span className="badge bg-danger ms-2 px-3 py-2 rounded-pill">
                                        Cancelled By User
                                      </span>
                                    )}

                                    <p className="mt-3 mb-1">
                                      {entry.remark}
                                    </p>
                                  </div>

                                  <small className="text-muted">
                                    {new Date(
                                      entry.status_date
                                    ).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* END HISTORY */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default TrackOrder;