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
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

const COLORS = [
  "#4facfe",
  "#00f2fe",
  "#7b2ff7",
  "#38bdf8"
];

const Analytics = () => {

  const [analyticsData, setAnalyticsData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/smartbite/analytics/")
      .then((response) => {

        setAnalyticsData(response.data);

        setLoading(false);

      })
      .catch((error) => {

        console.log(error);

        setLoading(false);

      });

  }, []);

  if (loading || !analyticsData) {

    return (

      <div
        style={{
          color: "white",
          padding: "40px",
          fontSize: "24px"
        }}
      >
        Loading Analytics...
      </div>

    );

  }

  return (

    <SmartbiteLayout>

      <div className="analytics-page">

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          className="dashboard-header"
        >

          <h1>
            Advanced Analytics
          </h1>

          <p>
            Real-time food ordering intelligence and performance metrics
          </p>

        </motion.div>

        <div className="row g-4 mb-4">

          <div className="col-lg-3">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon">
                <FaMoneyBillWave />
              </div>

              <div>

                <h6>Total Revenue</h6>

                <h2>
                  ₹{analyticsData.revenue}
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
                <FaShoppingCart />
              </div>

              <div>

                <h6>Total Orders</h6>

                <h2>
                  {analyticsData.total_orders}
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
                <FaUsers />
              </div>

              <div>

                <h6>Total Users</h6>

                <h2>
                  {analyticsData.total_users}
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
                <FaChartLine />
              </div>

              <div>

                <h6>Total Foods</h6>

                <h2>
                  {analyticsData.total_foods}
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
                Category Performance
              </h4>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={analyticsData.category_performance || []}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={5}
                  >

                    {
                      (analyticsData.category_performance || []).map((entry,index)=>(

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
                Top Selling Foods
              </h4>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <BarChart
                  data={analyticsData.top_food_chart || []}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="orders"
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
              className="glass-card ai-insight-box"
            >

              <h3>
                AI Smart Insights
              </h3>

              <div className="row mt-4 g-4">

                <div className="col-lg-4">

                  <div className="insight-card">

                    <h5>
                      🔥 Trending Food
                    </h5>

                    <p>
                      Highest ordered food is dynamically detected from orders database.
                    </p>

                  </div>

                </div>

                <div className="col-lg-4">

                  <div className="insight-card">

                    <h5>
                      📈 Revenue Analysis
                    </h5>

                    <p>
                      Revenue analytics generated using real order activity.
                    </p>

                  </div>

                </div>

                <div className="col-lg-4">

                  <div className="insight-card">

                    <h5>
                      ⚡ User Activity
                    </h5>

                    <p>
                      SmartBite tracks real customer engagement and food trends.
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </SmartbiteLayout>

  );

};

export default Analytics;