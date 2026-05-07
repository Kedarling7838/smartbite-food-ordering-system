import React from "react";

import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon
}) => {

  return (

    <motion.div
      whileHover={{ scale:1.03 }}
      className="glass-card stat-card"
    >

      <div className="stat-icon">

        {icon}

      </div>

      <div>

        <h6>{title}</h6>

        <h2>{value}</h2>

      </div>

    </motion.div>

  );

};

export default StatCard;