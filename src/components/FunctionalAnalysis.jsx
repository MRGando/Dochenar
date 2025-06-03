import FunctionalPieChart from "./FunctionalPieChart";
import MapFunctionalAnalysis from "./MapFunctionalAnalysis";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import details from "../config/details";

export default function FunctionalAnalysis() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:mb-5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}>
      {/* ستون 1: متن و نمودار */}
      <div className="col-span-1 text-gray-700 bg-white rounded-2xl shadow-sm pl-6 pr-6 pt-6 border border-gray-200 mt-5 text-xl w-full">
        <h3 className="font-extrabold text-3xl sm:text-2xl text-[#4F7C6B] text-center mb-4 leading-snug font-modam">
          تحلیل عملکردی محله {details.alley.name}
        </h3>
        <p className="text-justify text-sm sm:text-base leading-loose ">
          {details.functionalAnalysis}
        </p>
        <div className="mt-4">
          <FunctionalPieChart />
        </div>
      </div>

      {/* ستون 2 و 3: نقشه */}
      <motion.div
        className="md:col-span-2 md:mt-5 shadow-md rounded-xl mb-5"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}>
        <MapFunctionalAnalysis />
      </motion.div>
    </motion.div>
  );
}
