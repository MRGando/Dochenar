/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import AccsessesArzeMabar from "./AccessesArzeMabar";
import AccsessesKyfiatMabar from "./AccsessesKyfiatMabar";
import MapStreet from "./charts/MapStreet";
import Details from "../config/details.json";
export default function Accesses() {
  return (
    <section className="">
      <div className="grid h-full grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {/* نقشه - در تبلت بالاتر از بخش متن می‌آید */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="order-1 md:order-1 md:col-span-2 lg:order-2 lg:col-span-2 rounded-xl shadow-sm min-h-[738px] lg:h-full">
          {/* Move map center slightly left (decrease longitude) */}
          <MapStreet
            center={[37.476, 57.3275]}
            draggable={true}
            scrollWheelZoom={true}
            zoom={true}
            maxZoom={20}
            maxBounds={[
              [37.474, 57.325],
              [37.478, 57.33],
            ]} // محدودیت حرکت نقشه
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}>
          <div className="text-gray-700 bg-[var(--box)] rounded-2xl shadow-sm p-6 border border-gray-200 mb-5 lg:grid-rows-2">
            <h3 className="text-3xl sm:text-2xl  font-extrabold md:text-2xl font-modam text-center text-[var(--main)] mb-4 leading-snug lg:row-span-1">
              دسترسی محله {Details.alley.name}
            </h3>
            <p className="text-sm sm:text-xs md:text-base text-justify md:leading-loose">
              {Details.accessability}
            </p>
          </div>
          <div className="flex flex-col gap-5 order-2 md:order-2 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <AccsessesArzeMabar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}>
              <AccsessesKyfiatMabar />
            </motion.div>
          </div>
        </motion.div>

        {/* متن و نمودارها */}
      </div>
    </section>
  );
}
