import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MainNav from "../components/layout/MainNav";
import UserSidebar from "../components/layout/UserSidebar";
import MyChild from "../components/user/MyChild";

function Children() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <UserSidebar />
          </div>
          <div className="md:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MyChild />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Children; 