import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "../UI/Button";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// دکمه سفارشی حرفه‌ای

const CustomLegend = ({ payload }) => {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        textAlign: "center",
        direction: "rtl",
      }}>
      {payload.map((entry, i) => (
        <li
          key={`item-${i}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            margin: "0 12px",
          }}>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              backgroundColor: entry.color,
              borderRadius: "50%",
              marginLeft: 8,
            }}
          />
          <span
            style={{
              color: "#000",
              fontSize: 14,
              fontFamily: "Modam",
            }}>
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default function KarbariExcelPieChart() {
  const [freqData, setFreqData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState("freq"); // "freq" یا "area"

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const response = await fetch("./data/Landuse_id.xlsx");
        if (!response.ok) throw new Error("خطا در دریافت فایل");

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const grouped = {};

        rawData.forEach((row) => {
          const name = String(row["نوع کاربری"]).trim() || "نامشخص";
          const تعداد = Number(row["فراوانی"]) || 0;
          const rawArea = row["SUM_Shape_Area"] ?? 0;
          const مساحت = parseFloat(rawArea) || 0;
          const color = `rgb(${row.R}, ${row.G}, ${row.B})`;

          if (!grouped[name]) {
            grouped[name] = { تعداد: 0, مساحت: 0, color };
          }

          grouped[name].تعداد += تعداد;
          grouped[name].مساحت += مساحت;
        });

        const freqChart = [];
        const areaChart = [];

        Object.entries(grouped).forEach(([name, values]) => {
          freqChart.push({ name, تعداد: values.تعداد, color: values.color });
          areaChart.push({ name, مساحت: values.مساحت, color: values.color });
        });

        setFreqData(freqChart);
        setAreaData(areaChart);
      } catch (err) {
        console.error("خطا:", err);
      } finally {
        setLoading(false);
      }
    };

    loadExcel();
  }, []);

  const chartContainerStyle = {
    borderRadius: "1rem",
    width: "100%",
    padding: "3rem",
    flex: "1 1 400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        در حال بارگذاری داده‌ها...
      </div>
    );
  }

  if (freqData.length === 0 || areaData.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>داده‌ای برای نمایش وجود ندارد.</div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      {/* دکمه انتخاب نمودار */}
      <div className="flex gap-5 justify-center">
        <Button
          onClick={() => setSelectedChart("freq")}
          variant={selectedChart === "freq" ? "default" : "outline"}>
          بر اساس فراوانی
        </Button>
        <Button
          onClick={() => setSelectedChart("area")}
          variant={selectedChart === "area" ? "default" : "outline"}>
          بر اساس مساحت
        </Button>
      </div>
      {/* نمودار انتخاب‌شده */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={chartContainerStyle}>
          <h3
            className="text-[var(--main)]"
            style={{
              marginBottom: "1rem",
              fontSize: "1rem",
              fontWeight: "bold",
            }}>
            {selectedChart === "freq"
              ? "نمودار نوع کاربری بر اساس فراوانی"
              : "نمودار نوع کاربری بر اساس مساحت"}
          </h3>

          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={selectedChart === "freq" ? freqData : areaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey={selectedChart === "freq" ? "تعداد" : "مساحت"}
                  nameKey="name">
                  {(selectedChart === "freq" ? freqData : areaData).map(
                    (entry, idx) => (
                      <Cell key={`chart-${idx}`} fill={entry.color} />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()} ${selectedChart === "freq" ? "واحد" : "متر مربع"}`,
                    selectedChart === "freq" ? "تعداد" : "مساحت",
                  ]}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  content={<CustomLegend />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
