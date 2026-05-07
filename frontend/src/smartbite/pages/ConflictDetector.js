import React from "react";

import { motion } from "framer-motion";

import SmartbiteLayout from "../layouts/SmartbiteLayout";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  FaExclamationTriangle,
  FaBan,
  FaHeartbeat,
  FaUserShield
} from "react-icons/fa";

const cancellationData = [
  { name: "Mon", cancellations: 12 },
  { name: "Tue", cancellations: 18 },
  { name: "Wed", cancellations: 10 },
  { name: "Thu", cancellations: 22 },
  { name: "Fri", cancellations: 28 },
  { name: "Sat", cancellations: 35 },
  { name: "Sun", cancellations: 30 },
];

const issueData = [
  { name: "Spam Orders", value: 25 },
  { name: "Excessive Cancels", value: 40 },
  { name: "Duplicate Orders", value: 20 },
  { name: "Risk Users", value: 15 },
];

const COLORS = [
  "#ef4444",
  "#f97316",
  "#7b2ff7",
  "#00f2fe"
];

const alerts = [
  {
    title: "Excessive Cancellation Detected",
    desc: "User ID #102 cancelled 8 orders in 2 days.",
    icon: <FaBan />,
    level: "High Risk"
  },

  {
    title: "Suspicious Ordering Pattern",
    desc: "Multiple duplicate food orders detected.",
    icon: <FaUserShield />,
    level: "Medium Risk"
  },

  {
    title: "Unhealthy Food Combination",
    desc: "High-calorie repeated order combinations found.",
    icon: <FaHeartbeat />,
    level: "Health Warning"
  }
];

const ConflictDetector = () => {

  return (

    <SmartbiteLayout>

      <div className="conflict-page">

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          className="dashboard-header"
        >

          <h1>
            Conflict Detection Center
          </h1>

          <p>
            AI-powered anomaly detection and intelligent food order monitoring
          </p>

        </motion.div>

        <div className="row g-4 mb-4">

          <div className="col-lg-4">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon danger-icon">
                <FaExclamationTriangle />
              </div>

              <div>

                <h6>Detected Issues</h6>

                <h2>128</h2>

              </div>

            </motion.div>

          </div>

          <div className="col-lg-4">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon warning-icon">
                <FaBan />
              </div>

              <div>

                <h6>Spam Orders</h6>

                <h2>42</h2>

              </div>

            </motion.div>

          </div>

          <div className="col-lg-4">

            <motion.div
              whileHover={{ scale:1.03 }}
              className="glass-card stat-card"
            >

              <div className="stat-icon health-icon">
                <FaHeartbeat />
              </div>

              <div>

                <h6>Health Alerts</h6>

                <h2>17</h2>

              </div>

            </motion.div>

          </div>

        </div>

        <div className="row g-4">

          <div className="col-lg-8">

            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              className="glass-card chart-card"
            >

              <h4 className="mb-4">
                Cancellation Activity
              </h4>

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <BarChart data={cancellationData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="cancellations"
                    fill="#ef4444"
                    radius={[10,10,0,0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </motion.div>

          </div>

          <div className="col-lg-4">

            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              className="glass-card chart-card"
            >

              <h4 className="mb-4">
                Conflict Categories
              </h4>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={issueData}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={5}
                  >

                    {
                      issueData.map((entry,index)=>(

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

        <div className="row mt-4">

          <div className="col-lg-12">

            <motion.div
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              className="glass-card"
            >

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>
                  Live AI Alerts
                </h3>

                <div className="ai-badge">
                  Monitoring Active
                </div>

              </div>

              <div className="row g-4">

                {
                  alerts.map((alert,index)=>(

                    <div
                      className="col-lg-4"
                      key={index}
                    >

                      <motion.div
                        whileHover={{ scale:1.03 }}
                        className="insight-card conflict-alert-card"
                      >

                        <div className="alert-icon">

                          {alert.icon}

                        </div>

                        <h5>
                          {alert.title}
                        </h5>

                        <p>
                          {alert.desc}
                        </p>

                        <div className="risk-level">

                          {alert.level}

                        </div>

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

export default ConflictDetector;