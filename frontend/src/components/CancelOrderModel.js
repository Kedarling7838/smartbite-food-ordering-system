import React, { useState } from "react";

const CancelOrderModel = ({
    show,
    handelClose,
    orderNumber,
    paymentMode
}) => {
    const [remark, setRemark] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handelSubmit = async () => {
        if (!remark.trim()) {
            setError("Please provide a reason for cancellation");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/cancel_order/${orderNumber}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        remark,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                let msg = data.message;

                if (paymentMode === "online") {
                    msg +=
                        "\nSince you paid online, your amount will be refunded to your account within 2 days.";
                }

                setMessage(msg);
                setRemark("");
                setError("");
            } else {
                setError(data.message || "Failed to cancel order");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div
            className={`modal fade ${show ? "show d-block" : ""}`}
            tabIndex="-1"
            style={{
                background: show ? "rgba(0,0,0,0.55)" : "transparent",
                backdropFilter: show ? "blur(4px)" : "none",
            }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div
                    className="modal-content border-0 shadow-lg rounded-4"
                    style={{
                        overflow: "hidden",
                    }}
                >
                    <div
                        className="modal-header border-0 text-white"
                        style={{
                            background:
                                "linear-gradient(135deg, #dc3545, #b02a37)",
                            padding: "20px 24px",
                        }}
                    >
                        <div>
                            <h5 className="modal-title fw-bold mb-1">
                                <i className="fas fa-times-circle me-2"></i>
                                Cancel Order #{orderNumber}
                            </h5>
                            <small className="opacity-75">
                                Please confirm your cancellation request
                            </small>
                        </div>

                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handelClose}
                        ></button>
                    </div>

                    <div className="modal-body p-4">
                        {message ? (
                            <div
                                className="alert alert-success border-0 rounded-4 shadow-sm"
                                style={{
                                    background: "#f0fff4",
                                }}
                            >
                                <h6 className="fw-bold mb-2">
                                    <i className="fas fa-check-circle me-2"></i>
                                    Cancellation Successful
                                </h6>
                                <div style={{ whiteSpace: "pre-line" }}>
                                    {message}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="fas fa-comment-dots me-2 text-danger"></i>
                                        Reason For Cancellation
                                    </label>

                                    <textarea
                                        className="form-control rounded-4 shadow-sm"
                                        rows="5"
                                        value={remark}
                                        onChange={(e) =>
                                            setRemark(e.target.value)
                                        }
                                        placeholder="Please tell us why you want to cancel this order..."
                                        style={{
                                            resize: "none",
                                            border: "1px solid #dee2e6",
                                            padding: "14px",
                                        }}
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="alert alert-danger border-0 rounded-4">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        {error}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="modal-footer border-0 px-4 pb-4">
                        <button
                            type="button"
                            className="btn btn-light border rounded-pill px-4"
                            onClick={handelClose}
                        >
                            Close
                        </button>

                        {!message && (
                            <button
                                type="button"
                                className="btn btn-danger rounded-pill px-4 shadow-sm"
                                onClick={handelSubmit}
                            >
                                <i className="fas fa-ban me-2"></i>
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModel;