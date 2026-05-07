import React, { useEffect, useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";

import SmartbiteLayout from "../layouts/SmartbiteLayout";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

import {
  FaBrain,
  FaChartLine,
  FaFire,
  FaClock
} from "react-icons/fa";

const Predictions = () => {

  const [predictionData, setPredictionData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/smartbite/predictions/")
      .then((response) => {

        setPredictionData(response.data);

        setLoading(false);

      })
      .catch((error) => {

        console.log(error);

        setLoading(false);

      });

  }, []);

  if (loading || !predictionData) {

    return (

      <div
        style={{
          color: "white",
          padding: "40px",
          fontSize: "24px"
        }}
      >
        Loading AI Predictions...
      </div>

    );

  }

  return (

    <SmartbiteLayout>

      <div className="predictions-page">

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          className="dashboard-header"
        >

          <h1>
            Predictions
          </h1>

          <p>
            AI-powered food demand forecasting
          </p>

        </motion.div>

        <div className="row g-4 mb-4">

          <div className="col-lg-3">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon">
                <FaBrain />
              </div>

              <div>

                <h6>ML Model</h6>

                <h4>Linear Regression</h4>

              </div>

            </motion.div>

          </div>

          <div className="col-lg-3">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon">
                <FaChartLine />
              </div>

              <div>

                <h6>Prediction Accuracy</h6>

                <h2>92%</h2>

              </div>

            </motion.div>

          </div>

          <div className="col-lg-3">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon">
                <FaFire />
              </div>

              <div>

                <h6>Trending Food</h6>

                <h2>

                  {
                    predictionData.food_predictions[0]?.food || "N/A"
                  }

                </h2>

              </div>

            </motion.div>

          </div>

          <div className="col-lg-3">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon">
                <FaClock />
              </div>

              <div>

                <h6>Peak Time</h6>

                <h2>

                  {
                    predictionData.peak_predictions[0]?.time || "N/A"
                  }

                </h2>

              </div>

            </motion.div>

          </div>

        </div>

        <div className="row g-4">

          <div className="col-lg-7">

            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              className="glass-card chart-card"
            >

              <h4 className="mb-4">
                Food Demand Prediction
              </h4>

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <LineChart
                  data={predictionData.food_predictions || []}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="food" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="current_orders"
                    stroke="#4facfe"
                    strokeWidth={4}
                    name="Current Orders"
                  />

                  <Line
                    type="monotone"
                    dataKey="predicted_orders"
                    stroke="#7b2ff7"
                    strokeWidth={4}
                    name="Predicted Orders"
                  />

                </LineChart>

              </ResponsiveContainer>

            </motion.div>

          </div>

          <div className="col-lg-5">

            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              className="glass-card chart-card"
            >

              <h4 className="mb-4">
                Peak Order Timing
              </h4>

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <BarChart
                  data={predictionData.peak_predictions || []}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="orders"
                    fill="#00f2fe"
                    radius={[10,10,0,0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </motion.div>

          </div>

        </div>

        <div className="row mt-4">

          <div className="col-lg-12">

            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              className="glass-card ai-insight-box"
            >

              <h3>
                AI Prediction Insight
              </h3>

              <div className="mt-4">

                <div className="insight-card">

                  <h5>
                    🤖 Future Analysis
                  </h5>

                  <p>

                    {predictionData.ai_message}

                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </SmartbiteLayout>

  );

};

export default Predictions;