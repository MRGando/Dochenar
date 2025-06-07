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
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
];

export default function EnhancedFloorChart() {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const response = await fetch("./data/TABAQAT.xlsx");
        if (!response.ok) throw new Error("خطا در دریافت فایل");

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const chartData = jsonData
          .map((row) => ({
            name: String(row["طبقه"] ?? "نامشخص"),
            تعداد: Number(row["تعداد"] ?? 0),
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
              height={70}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                fontFamily: "Modam",
                direction: "rtl",
                textAlign: "right",
              }}
              formatter={(value) => [`${value} واحد`, "تعداد"]}
            />
            <Legend wrapperStyle={{ direction: "rtl" }} />
            <Bar
              dataKey="تعداد"
              name="تعداد واحدها"
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
            <YAxis />
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
              name="تعداد واحدها"
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
              label>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value} واحد`}
              contentStyle={{
                fontFamily: "Modam",
                direction: "rtl",
                textAlign: "right",
              }}
            />
            <Legend
              wrapperStyle={{ direction: "rtl" }}
              layout="horizontal"
              verticalAlign="bottom"
            />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chart-container w-full max-w-[1200px]">
      <div className="chart-header">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="chart-type-select">
          <option value="bar">نمودار میله‌ای</option>
          <option value="line">نمودار خطی</option>
          <option value="pie">نمودار دایره‌ای</option>
        </select>
        <h2 className="chart-title text-[var(--main)]">نمودار اطلاعات طبقات</h2>
      </div>

      {loading ? (
        <div className="loading-message">در حال بارگذاری داده‌ها...</div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={500}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      )}

      <style>{`
        .chart-container {
          font-family: "Modam", Tahoma, sans-serif;
          direction: rtl;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 15px;
          flex-direction: row-reverse;
        }

        .chart-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-right: 1rem;
        }

        .chart-type-select {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid white;
          background-color: #a6c9c0;
          font-family: "Modam";
          font-size: 14px;
          color: #2f3e3b;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
        }

        .chart-type-select:hover {
          border-color: #a6c9c0;
          box-shadow: 0 0 0 1px #2f3e3b;
        }

        .chart-type-select:focus {
          outline: none;
          border-color: #2f3e3b;
          box-shadow: 0 0 0 2px rgba(78, 121, 167, 0.3);
        }

        .loading-message,
        .no-data-message {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
        }

        .chart-wrapper {
          margin-top: 20px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
