// فایل GhedmatChart.jsx

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#E76F51",
  "#EE8959",
  "#F4A261",
  "#E9C46A",
  "#2A9D8F",
  "#287271",
  "#264653",
];

export default function GhedmatChartSelector() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const response = await fetch("./data/QEDMAT.xlsx"); // مسیر فایل قدمت
        if (!response.ok) throw new Error("خطا در دریافت فایل");

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const chartData = jsonData
          .map((row) => ({
            name: row["قدمت"]?.toString().trim() || "نامشخص",
            تعداد: Number(row["تعداد"]) || 0,
          }))
          .filter((item) => !isNaN(item.تعداد));

        setData(chartData);
        setLoading(false);
      } catch (err) {
        console.error("خطا:", err);
        setLoading(false);
      }
    };

    loadExcel();
  }, []);

  const renderChart = () => {
    if (data.length === 0)
      return (
        <div className="no-data-message">داده‌ای برای نمایش وجود ندارد</div>
      );

    switch (chartType) {
      case "bar":
        return (
          <BarChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="start"
              interval={0}
              height={60}
            />
            <YAxis width={10} tick={{ textAnchor: "satrt", fontSize: 13 }} />
            <Tooltip
              contentStyle={{
                fontFamily: "Modam",
                direction: "rtl",
                textAlign: "right",
              }}
              formatter={(value) => [`${value} واحد`, "تعداد"]}
            />
            <Legend wrapperStyle={{ direction: "rtl", padding: "20px" }} />
            <Bar
              dataKey="تعداد"
              name="تعداد ساختمان‌ها"
              barSize={25}
              radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        );
      case "line":
        return (
          <LineChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="start"
              interval={0}
              height={60}
            />
            <YAxis width={10} tick={{ textAnchor: "satrt", fontSize: 13 }} />
            <Tooltip
              contentStyle={{
                fontFamily: "Modam",
                direction: "rtl",
                textAlign: "right",
              }}
              formatter={(value) => [`${value} واحد`, "تعداد"]}
            />
            <Legend wrapperStyle={{ direction: "rtl" }} />
            <Line
              type="monotone"
              dataKey="تعداد"
              name="تعداد ساختمان‌ها"
              stroke="#4e79a7"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="تعداد"
              nameKey="name"
              label // حذف برچسب‌های داخل دایره
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontFamily: "Modam",
                direction: "rtl",
                textAlign: "right",
              }}
              formatter={(value) => `${value} واحد`}
            />
            <Legend wrapperStyle={{ direction: "rtl" }} />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chart-container bg-slate-300  w-full max-w-[1200px]">
      <div className="chart-header ">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="chart-type-select">
          <option value="bar">نمودار میله‌ای</option>
          <option value="line">نمودار خطی</option>
          <option value="pie">نمودار دایره‌ای</option>
        </select>
        <h2 className="chart-title text-[var(--main)]">
          نمودار قدمت ساختمان‌ها
        </h2>
      </div>

      {loading ? (
        <div className="loading-message">در حال بارگذاری داده‌ها...</div>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </div>
  );
}
