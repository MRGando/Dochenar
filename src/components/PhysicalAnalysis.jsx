import Details from "../config/details";
import MapAnalysis from "./MapAnalysis";
import NamaBarChart from "./charts/NamaBarChatrSelector";
import FloorChartSelector from "./charts/FloorChartSelector";
import GhedmatChartSelector from "./charts/GhedmatChartSelector";
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

function PhysicalAnalysis() {
  return (
    <section className="">
      <motion.div
        className="grid grid-cols-1 gap-5  md:grid-cols-3  "
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}>
        <div className="col-span-1 text-gray-700  bg-[var(--box)] rounded-2xl shadow-md shadow-[rgba(0,0,0,0.05)] shadow-lg:shadow-[rgba(0,0,0,0.08)] p-6 border border-gray-200 text-xl sm:text-xlg md:text-base ">
          <h3 className="sm:text-3xl  w-full   text-3xl  font-modam font-extrabold text-center mb-4  md:text-lg text-[var(--main)]  leading-snug ">
            تحلیل کالبدی محله {Details.alley.name}
          </h3>
          <p className="text-justify md:leading-loose md:pr-6 pr-2 mt-5 md:mt-5  text-sm sm:text-xs  lg:text-base md:text-base ">
            {Details.physicalAnalysis}
          </p>
        </div>

        <motion.div
          className="col-span-1 md:col-span-2 shadow-md min-h-[220px] h-[220px] sm:min-h-[300px] sm:h-[300px] md:min-h-[500px] md:h-full lg:min-h-[738px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}>
          <MapAnalysis
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={false}
            boxZoom={true}
            keyboard={false}
            zoom={window.innerWidth < 640 ? 13 : 15}
            maxZoom={20}
            recenterOnDrag={true} // بازگشت به مرکز پس از جابجایی
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col gap-5 md:flex-row mt-5  md:gap-5 items-center justify-center "
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}>
        <FloorChartSelector />
        <GhedmatChartSelector />
        <NamaBarChart />
      </motion.div>
    </section>
  );
}

export default PhysicalAnalysis;
