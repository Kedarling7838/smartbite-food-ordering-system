import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBot from "../components/ChatBot";

import {
  motion,
  AnimatePresence
} from "framer-motion";

import {
  FaCreditCard,
  FaUniversity,
  FaCheckCircle,
  FaSpinner,
  FaMobileAlt,
  FaMoneyBillWave,
  FaTimes
} from "react-icons/fa";

import "./PaymentPage.css";

const PaymentPage = () => {

  const userId = localStorage.getItem("userId");

  const uploadedQR = "/images/QR_CODE.jpeg";

  const navigate = useNavigate();

  const [paymentMode, setPaymentMode] = useState("");

  const [address, setAddress] = useState("");

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const [transactionId, setTransactionId] = useState("");

  const [paymentStep, setPaymentStep] = useState("");

  const [paymentReady, setPaymentReady] = useState(false);

  const [addressSuggestions, setAddressSuggestions] = useState([]);

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

const cityList = [

  "Afzalpur", "Aland", "Almel", "Alnavar", "Alur", "Anekal",
  "Ankola", "Annigeri", "Arkalgud", "Arsikere", "Athani", "Aurad",

  "Badami", "Bagalkot", "Bagepalli", "Bailhongal", "Bantwal", "Basavakalyan",
  "Basavana Bagewadi", "Belagavi", "Bellary", "Belthangady", "Belur", "Bhadravati",

  "Bhatkal", "Bidar", "Bilgi", "Brahmavara", "Byadgi", "Challakere",
  "Chamarajanagar", "Channagiri", "Channapatna", "Channarayapatna", "Chikkaballapur", "Chikkamagaluru",

  "Chikkanayakanahalli", "Chikodi", "Chincholi", "Chintamani", "Chitradurga", "Dandeli",
  "Davanagere", "Devadurga", "Devanahalli", "Dharwad", "Doddaballapura", "Gadag",

  "Gajendragad", "Gangavathi", "Gokak", "Gubbi", "Gudibanda", "Gundlupet",
  "Gurumitkal", "Hadagali", "Hagaribommanahalli", "Haliyal", "Hanagal", "Hanur",

  "Harapanahalli", "Harihar", "Hassan", "Haveri", "Hebri", "Heggadadevanakote",
  "Hirekerur", "Hiriyur", "Holalkere", "Holenarasipura", "Honavar", "Hosadurga",

  "Hosakote", "Hosapete", "Hubballi", "Hukkeri", "Huliyar", "Hungund",
  "Hunsur", "Indi", "Jagalur", "Jamkhandi", "Jevargi", "Kadaba",

  "Kalaburagi", "Kalghatgi", "Kamalapur", "Kanakapura", "Kapu", "Karatagi",
  "Karkala", "Karwar", "Khanapur", "Kolar", "Kollegala", "Koppal",

  "Koratagere", "Krishnarajanagara", "Krishnarajapete", "Kudligi", "Kumta", "Kundapura",
  "Kundgol", "Kunigal", "Kushtagi", "Lakshmeshwar", "Lingasugur", "Maddur",

  "Madhugiri", "Madikeri", "Magadi", "Mahalingpur", "Malavalli", "Malur",
  "Mandya", "Mangaluru", "Manvi", "Maski", "Molakalmuru", "Moodabidri",

  "Mudalagi", "Muddebihal", "Mudhol", "Mudigere", "Mulbagal", "Mundargi",
  "Mysuru", "Nagamangala", "Nanjangud", "Naragund", "Navalgund", "Nelamangala",

  "Nidagundi", "Pandavapura", "Pavagada", "Periyapatna", "Puttur", "Raibag",
  "Raichur", "Ramanagara", "Ranebennur", "Ron", "Sagar", "Sakaleshpura",

  "Sandur", "Saundatti", "Sedam", "Shahabad", "Shahapur", "Shiggaon",
  "Shikaripura", "Shivamogga", "Shorapur", "Siddapur", "Sidlaghatta", "Sindagi",

  "Sindhanur", "Sira", "Sirsi", "Siruguppa", "Somwarpet", "Soraba",
  "Srirangapatna", "Sulya", "Tarikere", "Terdal", "Thirthahalli", "Tiptur",

  "Tirumakudal Narsipur", "Tumakuru", "Turuvekere", "Udupi", "Vijayapura", "Virajpet",
  "Yadgir", "Yelandur", "Yelburga", "Yelahanka", "Yellapur"

];

  useEffect(() => {

    if (showPaymentModal && paymentMode === "upi") {

      setPaymentReady(false);

      const timer = setTimeout(() => {

        setPaymentReady(true);

      }, 5000);

      return () => clearTimeout(timer);

    }

  }, [showPaymentModal, paymentMode]);

  const generateTransactionId = () => {

    return (
      "TXN" + Math.floor(Math.random() * 999999999)
    );

  };

  const handelPlaceOrder = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/place_order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId,
            address,
            paymentMode,
            transactionId
          })
        }
      );

      const result = await response.json();

      if (response.status === 201) {

        toast.success(result.message);

        setTimeout(() => {

          navigate("/my-orders");

        }, 2500);

      }

      else {

        toast.error(result.message);

      }

    }

    catch (error) {

      console.log(error);

      toast.error("Server error");

    }

  };

  const startPaymentSimulation = async () => {

    if (!address) {

      toast.error("Address is required");

      return;

    }

    if (!paymentMode) {

      toast.error("Please select payment mode");

      return;

    }

    // ================= CARD =================

    if (paymentMode === "online") {

      if (
        !cardDetails.cardNumber ||
        !cardDetails.expiry ||
        !cardDetails.cvv
      ) {

        toast.error("Please enter complete card details");

        return;

      }

      setShowPaymentModal(true);

      setPaymentLoading(true);

      setPaymentStep("Verifying card details...");

      await new Promise(resolve =>
        setTimeout(resolve, 2000)
      );

      setPaymentStep("Authenticating bank gateway...");

      await new Promise(resolve =>
        setTimeout(resolve, 2500)
      );

      setPaymentStep("Processing secure payment...");

      await new Promise(resolve =>
        setTimeout(resolve, 2500)
      );

      const txn = generateTransactionId();

      setTransactionId(txn);

      setPaymentLoading(false);

      setPaymentSuccess(true);

      await handelPlaceOrder();

      return;

    }

    // ================= COD =================

    if (paymentMode === "cod") {

      const orderId =
        "ORD" + Math.floor(Math.random() * 999999);

      setTransactionId(orderId);

      setShowPaymentModal(true);

      setPaymentLoading(true);

      setPaymentStep("Confirming your order...");

      await new Promise(resolve =>
        setTimeout(resolve, 1500)
      );

      setPaymentStep("Assigning delivery partner...");

      await new Promise(resolve =>
        setTimeout(resolve, 1500)
      );

      setPaymentStep("Preparing your order...");

      await new Promise(resolve =>
        setTimeout(resolve, 1500)
      );

      setPaymentLoading(false);

      setPaymentSuccess(true);

      await handelPlaceOrder();

      return;

    }

    // ================= UPI =================

    if (paymentMode === "upi") {

      setShowPaymentModal(true);

    }

  };

  return (

    <PublicLayout>

      <ToastContainer
        position="top-center"
        autoClose={2000}
      />

      <ChatBot />

      <div className="payment-page-wrapper">

        <div className="container py-5">

          <div className="row justify-content-center">

            <div className="col-lg-7">

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="payment-main-card"
              >

                <div className="checkout-header">

                  <h2>Secure Checkout</h2>

                  <p>
                    Complete your SmartBite order securely
                  </p>

                </div>

                <div className="mb-4 position-relative">

                  <label className="checkout-label">
                    Delivery Address
                  </label>

                  <textarea
                    className="checkout-input"
                    rows="4"
                    placeholder="Enter delivery address"
                    value={address}
                    onChange={(e) => {

                      const value = e.target.value;

                      setAddress(value);

                      if (value.length > 1) {

                        const filtered = cityList.filter(city =>
                          city.toLowerCase().includes(
                            value.toLowerCase()
                          )
                        );

                        setAddressSuggestions(filtered);

                      }

                      else {

                        setAddressSuggestions([]);

                      }

                    }}
                  ></textarea>

                  {
                    addressSuggestions.length > 0 && (

                      <div className="address-suggestion-box">

                        {
                          addressSuggestions.map((city, index) => (

                            <div
                              key={index}
                              className="address-suggestion-item"
                              onClick={() => {

                                setAddress(city);

                                setAddressSuggestions([]);

                              }}
                            >
                              📍 {city}
                            </div>

                          ))
                        }

                      </div>

                    )
                  }

                </div>

                <div className="mb-4">

                  <label className="checkout-label">
                    Payment Method
                  </label>

                  <div className="payment-method-grid">

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`payment-method-card ${
                        paymentMode === "online"
                          ? "active-payment"
                          : ""
                      }`}
                      onClick={() => setPaymentMode("online")}
                    >

                      <FaCreditCard />

                      <h6>Card Payment</h6>

                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`payment-method-card ${
                        paymentMode === "upi"
                          ? "active-payment"
                          : ""
                      }`}
                      onClick={() => setPaymentMode("upi")}
                    >

                      <FaMobileAlt />

                      <h6>UPI Payment</h6>

                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`payment-method-card ${
                        paymentMode === "cod"
                          ? "active-payment"
                          : ""
                      }`}
                      onClick={() => setPaymentMode("cod")}
                    >

                      <FaMoneyBillWave />

                      <h6>Cash On Delivery</h6>

                    </motion.div>

                  </div>

                </div>

                {
                  paymentMode === "online" && (

                    <div className="card-details-box">

                      <h5>
                        Card Details
                      </h5>

                      <input
                        className="checkout-input mb-3"
                        placeholder="Card Number"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: e.target.value,
                          })
                        }
                      />

                      <div className="row g-3">

                        <div className="col-md-6">

                          <input
                            className="checkout-input"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                expiry: e.target.value,
                              })
                            }
                          />

                        </div>

                        <div className="col-md-6">

                          <input
                            className="checkout-input"
                            placeholder="CVV"
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                cvv: e.target.value,
                              })
                            }
                          />

                        </div>

                      </div>

                    </div>

                  )
                }

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="place-order-btn"
                  onClick={startPaymentSimulation}
                >

                  Place Secure Order

                </motion.button>

              </motion.div>

            </div>

          </div>

        </div>

        <AnimatePresence>

          {
            showPaymentModal && (

              <motion.div
                className="payment-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >

                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="payment-modal-box"
                >

                  <button
                    className="close-modal-btn"
                    onClick={() => setShowPaymentModal(false)}
                  >

                    <FaTimes />

                  </button>

                  {
                    !paymentSuccess ? (

                      <>

                        <div className="payment-animation">

                          <FaUniversity className="bank-icon" />

                          <h3>

                            {
                              paymentMode === "cod"
                                ? "Order Confirmation"
                                : "Secure Payment Verification"
                            }

                          </h3>

                          <p>

                            {
                              paymentMode === "cod"
                                ? "Preparing your Cash On Delivery order"
                                : "Your payment is protected with encryption"
                            }

                          </p>

                          {
                            paymentLoading && (

                              <>
                                <div className="processing-loader">

                                  <FaSpinner className="spinner-icon" />

                                </div>

                                <div className="live-payment-step">

                                  {paymentStep}

                                </div>
                              </>

                            )
                          }

                        </div>

                        {
                          paymentMode === "upi" && (

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="advanced-upi-box"
                            >

                              <div className="upi-header">

                                <div className="upi-live-badge">
                                  🟢 UPI VERIFIED
                                </div>

                                <h4>
                                  Scan & Pay Securely
                                </h4>

                                <p>
                                  Scan this QR using any UPI app
                                </p>

                              </div>

                              <div className="scanner-main-wrapper">

                                <div className="upi-qr-container">

                                  <div className="real-qr-preview">

                                    <img
                                      src={uploadedQR}
                                      alt="QR"
                                      className="uploaded-qr-image"
                                    />

                                  </div>

                                </div>

                              </div>

                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: .95 }}
                                disabled={!paymentReady}
                                className="confirm-payment-btn"
                                onClick={async () => {

                                  setPaymentLoading(true);

                                  setPaymentStep("Verifying UPI payment...");

                                  await new Promise(resolve =>
                                    setTimeout(resolve, 2500)
                                  );

                                  setPaymentStep("Confirming with bank servers...");

                                  await new Promise(resolve =>
                                    setTimeout(resolve, 2500)
                                  );

                                  setPaymentStep("Generating secure receipt...");

                                  await new Promise(resolve =>
                                    setTimeout(resolve, 2000)
                                  );

                                  const txn = generateTransactionId();

                                  setTransactionId(txn);

                                  setPaymentLoading(false);

                                  setPaymentSuccess(true);

                                  await handelPlaceOrder();

                                }}
                              >

                                {
                                  paymentReady
                                    ? "✅ I Have Paid"
                                    : "⏳ Waiting for payment scan..."
                                }

                              </motion.button>

                            </motion.div>

                          )
                        }

                      </>

                    ) : (

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="payment-success-box"
                      >

                        <FaCheckCircle className="success-payment-icon" />

                        <h2>

                          {
                            paymentMode === "cod"
                              ? "Order Confirmed"
                              : "Payment Successful"
                          }

                        </h2>

                        <p>

                          {
                            paymentMode === "cod"
                              ? "Your Cash On Delivery order has been confirmed successfully."
                              : "Your payment has been completed successfully."
                          }

                        </p>

                        {
                          paymentMode === "cod" ? (

                            <div className="transaction-box">

                              <div>

                                <strong>Order ID</strong>

                                <p>{transactionId}</p>

                              </div>

                              <div>

                                <strong>Payment Mode</strong>

                                <p>Cash On Delivery</p>

                              </div>

                              <div>

                                <strong>Delivery Status</strong>

                                <p>Preparing Order</p>

                              </div>

                            </div>

                          ) : (

                            <div className="transaction-box">

                              <div>

                                <strong>Transaction ID</strong>

                                <p>{transactionId}</p>

                              </div>

                              <div>

                                <strong>Payment Method</strong>

                                <p>{paymentMode.toUpperCase()}</p>

                              </div>

                              <div>

                                <strong>Status</strong>

                                <p>SUCCESS</p>

                              </div>

                            </div>

                          )
                        }

                      </motion.div>

                    )
                  }

                </motion.div>

              </motion.div>

            )
          }

        </AnimatePresence>

      </div>

    </PublicLayout>

  );

};

export default PaymentPage;