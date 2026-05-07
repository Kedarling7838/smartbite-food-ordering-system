import React from "react";

import { motion } from "framer-motion";

const LoadingScreen = () => {

  return (

    <div className="smartbite-loading-screen">

      <div className="loading-background-glow"></div>

      <motion.div
        animate={{
          rotate:360
        }}
        transition={{
          duration:2,
          repeat:Infinity,
          ease:"linear"
        }}
        className="loading-ring"
      ></motion.div>

      <motion.h1
        animate={{
          opacity:[0.5,1,0.5]
        }}
        transition={{
          duration:1.5,
          repeat:Infinity
        }}
      >

        SmartBite AI Loading...

      </motion.h1>

      <p>
        Initializing intelligence modules
      </p>

    </div>

  );

};

export default LoadingScreen;