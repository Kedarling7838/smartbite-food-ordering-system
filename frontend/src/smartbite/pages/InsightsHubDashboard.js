import React, { useEffect, useState } from "react";

import axios from "axios";

import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

import SmartbiteLayout from "../layouts/SmartbiteLayout";

import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

const COLORS = [
  "#4facfe",
  "#7b2ff7",
  "#00f2fe"
];

const InsightsHubDashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/api/smartbite/dashboard/")
      .then((response) => {

        setDashboardData(response.data);

        setLoading(false);

      })
      .catch((error) => {

        console.log(error);

        setLoading(false);

      });

  }, []);

  if (loading || !dashboardData) {

    return (

      <div
        style={{
          color: "white",
          padding: "40px",
          fontSize: "24px"
        }}
      >
        Loading SmartBite Intelligence...
      </div>

    );

  }

  const statCards = [

    {
      title: "Total Orders",
      value: dashboardData.total_orders,
      icon: <FaShoppingCart />,
    },

    {
      title: "Revenue",
      value: `₹${dashboardData.total_revenue}`,
      icon: <FaMoneyBillWave />,
    },

    {
      title: "Users",
      value: dashboardData.active_users,
      icon: <FaUsers />,
    },

    {
      title: "Growth",
      value: "+18%",
      icon: <FaChartLine />,
    },

  ];

  return (

    <SmartbiteLayout>

      <div className="dashboard-page">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-header"
        >

          <h1>
            SmartBite Intelligence Hub
          </h1>

          <p>
            AI-powered analytics and futuristic business intelligence
          </p>

        </motion.div>

        <div className="row g-4 mb-4">

          {
            statCards.map((card, index) => (

              <div
                className="col-lg-3 col-md-6"
                key={index}
              >

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="glass-card stat-card"
                >

                  <div className="stat-icon">

                    {card.icon}

                  </div>

                  <div>

                    <h6>{card.title}</h6>

                    <h2>{card.value}</h2>

                  </div>

                </motion.div>

              </div>

            ))
          }

        </div>

        <div className="row g-4">

          <div className="col-lg-8">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card chart-card"
            >

              <div className="chart-header">

                <h4>
                  Revenue Analytics
                </h4>

              </div>

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <AreaChart
                  data={dashboardData.revenue_chart || []}
                >

                  <defs>

                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#4facfe"
                        stopOpacity={0.8}
                      />

                      <stop
                        offset="95%"
                        stopColor="#4facfe"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00f2fe"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </motion.div>

          </div>

          <div className="col-lg-4">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card chart-card"
            >

              <h4 className="mb-4">
                Order Status
              </h4>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={dashboardData.order_status || []}
                    dataKey="value"
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={5}
                  >

                    {
                      (dashboardData.order_status || []).map((entry, index) => (

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

        </div>

      </div>

    </SmartbiteLayout>

  );

};

export default InsightsHubDashboard;