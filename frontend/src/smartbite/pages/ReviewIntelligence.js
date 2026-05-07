import React, { useEffect, useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";

import SmartbiteLayout from "../layouts/SmartbiteLayout";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import {
  FaSmile,
  FaMeh,
  FaFrown,
  FaComments
} from "react-icons/fa";

const COLORS = [
  "#22c55e",
  "#facc15",
  "#ef4444"
];

const ReviewIntelligence = () => {

  const [reviewData, setReviewData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/smartbite/reviews/")
      .then((response) => {

        setReviewData(response.data);

        setLoading(false);

      })
      .catch((error) => {

        console.log(error);

        setLoading(false);

      });

  }, []);

  if (loading || !reviewData) {

    return (

      <div
        style={{
          color: "white",
          padding: "40px",
          fontSize: "24px"
        }}
      >
        Loading NLP Review Intelligence...
      </div>

    );

  }

  const sentimentData = [

    {
      name: "Positive",
      value: reviewData.positive
    },

    {
      name: "Neutral",
      value: reviewData.neutral
    },

    {
      name: "Negative",
      value: reviewData.negative
    }

  ];

  return (

    <SmartbiteLayout>

      <div className="review-page">

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          className="dashboard-header"
        >

          <h1>
            Review Intelligence
          </h1>

          <p>
            NLP-powered sentiment analysis using real customer reviews
          </p>

        </motion.div>

        <div className="row g-4 mb-4">

          <div className="col-lg-3">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon">

                <FaSmile />

              </div>

              <div>

                <h6>Positive Reviews</h6>

                <h2>
                  {reviewData.positive}
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

                <FaMeh />

              </div>

              <div>

                <h6>Neutral Reviews</h6>

                <h2>
                  {reviewData.neutral}
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

                <FaFrown />

              </div>

              <div>

                <h6>Negative Reviews</h6>

                <h2>
                  {reviewData.negative}
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

                <FaComments />

              </div>

              <div>

                <h6>Total Reviews</h6>

                <h2>
                  {reviewData.total_reviews}
                </h2>

              </div>

            </motion.div>

          </div>

        </div>

        <div className="row g-4">

          <div className="col-lg-5">

            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              className="glass-card chart-card"
            >

              <h4 className="mb-4">
                Sentiment Distribution
              </h4>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={5}
                  >

                    {
                      sentimentData.map((entry,index)=>(

                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />

                      ))
                    }

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </motion.div>

          </div>

          <div className="col-lg-7">

            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              className="glass-card chart-card"
            >

              <h4 className="mb-4">
                Trending Keywords
              </h4>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <BarChart
                  data={reviewData.keyword_chart || []}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="keyword" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#4facfe"
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
              className="glass-card"
            >

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>
                  NLP Customer Review Insights
                </h3>

                <div className="ai-badge">
                  NLP Active
                </div>

              </div>

              <div className="row g-4">

                {
                  (reviewData.reviews || []).map((item,index)=>(

                    <div
                      className="col-lg-4"
                      key={index}
                    >

                      <motion.div
                        whileHover={{ scale:1.03 }}
                        className="insight-card review-card"
                      >

                        <h5>
                          {item.user}
                        </h5>

                        <p>
                          {item.review}
                        </p>

                        <div className="review-tag">

                          {item.sentiment}

                        </div>

                        <small
                          style={{
                            color:"#94a3b8"
                          }}
                        >

                          NLP Score:
                          {" "}
                          {item.score}

                        </small>

                      </motion.div>

                    </div>

                  ))
                }

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </SmartbiteLayout>

  );

};

export default ReviewIntelligence;