import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../UI/Button";
import L from "leaflet";
const isMobile = window.innerWidth < 768;

// رنگ بر اساس ترافیک
const getColorByTraffic = (value) => {
  switch (String(value).trim()) {
    case "5":
      return "#d73027";
    case "4":
      return "#fc8d59";
    case "3":
      return "#fee08b";
    case "2":
      return "#d9ef8b";
    case "1":
      return "#1a9850";
    default:
      return "#999";
  }
};

// رنگ بر اساس عرض معبر
const getColorByWidth = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "#ccc";
  if (num > 20) return "#084081";
  if (num > 15) return "#0868ac";
  if (num > 10) return "#2b8cbe";
  if (num > 5) return "#4eb3d3";
  return "#7bccc4";
};

// استایل خطوط
const layerStyles = {
  traffic: (feature) => ({
    color: getColorByTraffic(feature.properties.trafic),
    weight: 5,
    opacity: 0.9,
    dashArray: "4", // افزودن افکت Dash برای تنوع
  }),
  width: (feature) => ({
    color: getColorByWidth(feature.properties.Width),
    weight: 5,
    opacity: 0.9,
    dashArray: "4", // افزودن افکت Dash برای تنوع
  }),
};

// راهنما
const Legend = ({ type }) => {
  const legends = {
    traffic: [
      { color: "#d73027", label: "ترافیک خیلی زیاد (۵)" },
      { color: "#fc8d59", label: "ترافیک زیاد (۴)" },
      { color: "#fee08b", label: "ترافیک متوسط (۳)" },
      { color: "#d9ef8b", label: "ترافیک کم (۲)" },
      { color: "#1a9850", label: "ترافیک خیلی کم (۱)" },
    ],
    width: [
      { color: "#084081", label: "> 20 متر" },
      { color: "#0868ac", label: "15 - 20 متر" },
      { color: "#2b8cbe", label: "10 - 15 متر" },
      { color: "#4eb3d3", label: "5 - 10 متر" },
      { color: "#7bccc4", label: "< 5 متر" },
    ],
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white backdrop-blur-md p-4 rounded-xl shadow-lg z-[1000] text-sm border border-gray-200 w-56 pointer-events-auto">
      <div className="font-bold text-center text-gray-800 mb-3">
        راهنمای نقشه
      </div>
      <div className="space-y-2">
        {legends[type].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md border"
              style={{ backgroundColor: item.color }}></div>
            <div className="text-gray-700 text-xs">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// کامپوننت مخصوص تعویض BaseMap
function BaseMapSwitcher({ setBaseLayerUrl }) {
  const tileUrls = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    light:
      "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    esri: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{x}/{y}",
  };

  return (
    <select
      onChange={(e) =>
        setBaseLayerUrl(tileUrls[e.target.value] || tileUrls.light)
      }
      style={{
        padding: "10px",
        borderRadius: "6px",
        fontSize: "14px",
        border: "1px solid #ccc",
        marginTop: "5px",
        color: "black",
      }}
      className="text-sm p-1 border rounded-md transition-all ease-in-out hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="carto">osm کلاسیک</option>
      <option value="light">Light (سبک)</option>
      <option value="dark">Dark (تاریک)</option>
      <option value="carto">Carto Streets</option>
    </select>
  );
}

// ✅ کامپوننت اصلی
export default function MapStreet({ center, draggable = true }) {
  const [geoData, setGeoData] = useState(null);
  const [layerType, setLayerType] = useState("traffic");
  const [baseLayerUrl, setBaseLayerUrl] = useState(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );
  const mapRef = useRef(null);

  useEffect(() => {
    fetch("./data/mabaar_5ord_tr_FeaturesToJSO1.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // مرکز نقشه را از prop دریافت کن، اگر نبود مقدار پیش‌فرض قبلی را استفاده کن
  const mapCenter = center || [37.4777, 57.3232];

  return (
    <div
      className="relative w-full h-full lg:h-[100%]"
      id="map"
      ref={mapRef}
      style={{
        borderRadius: "10px",
        height: isMobile ? "740px" : "full",
        width: "100%",
      }}>
      {/* کنترل‌ها */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setLayerType("traffic")}
            variant={layerType === "traffic" ? "default" : "outline"}
            className="transition-all ease-in-out hover:bg-blue-500 hover:text-white">
            ترافیک
          </Button>
          <Button
            onClick={() => setLayerType("width")}
            variant={layerType === "width" ? "default" : "outline"}
            className="transition-all ease-in-out hover:bg-blue-500 hover:text-white">
            عرض معبر
          </Button>
        </div>
        <BaseMapSwitcher setBaseLayerUrl={setBaseLayerUrl} />
      </div>

      {/* نقشه */}
      <MapContainer
        center={mapCenter}
        zoom={17}
        minZoom={17}
        maxZoom={19}
        scrollWheelZoom={false}
        dragging={draggable}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        className="w-full h-full z-0 rounded-xl overflow-hidden"
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          setTimeout(() => mapInstance.invalidateSize(), 100);
          // فقط اگر draggable فعال باشد، رویداد بازگرداندن مرکز را اضافه کن
          if (draggable) {
            mapInstance.on("moveend", () => {
              const center = mapInstance.getCenter();
              if (
                Math.abs(center.lat - mapCenter[0]) > 0.0001 ||
                Math.abs(center.lng - mapCenter[1]) > 0.0001
              ) {
                mapInstance.setView(mapCenter, mapInstance.getZoom(), {
                  animate: true,
                });
              }
            });
          }
        }}>
        <TileLayer url={baseLayerUrl} />
        {geoData && <GeoJSON data={geoData} style={layerStyles[layerType]} />}
      </MapContainer>

      <Legend type={layerType} />
    </div>
  );
}
