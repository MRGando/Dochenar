import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "./UI/Button";
const isMobile = window.innerWidth < 768;
const isLaptop = window.innerWidth < 1000;

const MapAnalysis = ({
  zoom = 16,
  minZoom = 15,
  maxZoom = 18,
  scrollWheelZoom = false,
  dragging = false,
  doubleClickZoom = false,
  boxZoom = false,
  keyboard = false,
  recenterOnDrag = false,
}) => {
  const mapRef = useRef(null);

  const baseLayerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [geoLayer, setGeoLayer] = useState(null);
  const [layerType, setLayerType] = useState("qdmt");

  const legendsData = {
    tdad_tbqe: {
      title: "تعداد طبقات",
      values: {
        0: "همکف",
        1: "۱ طبقه",
        2: "۲ طبقه",
        3: "۳ طبقه",
        4: "۴ طبقه",
        5: "۵ طبقه",
        6: "۶ طبقه",
        100: "مخروبه",
      },
      colors: [
        "#07F49E", // همکف
        "#11CC99", // ۱ طبقه
        "#1BA493",
        "#257C8E",
        "#2E5489",
        "#382C83",
        "#42047E",
        "#CCC", // مخروبه
      ],
    },

    qdmt: {
      title: "قدمت ساختمان",
      values: {
        0: "درحال ساخت",
        1: "۱ تا ۵ سال",
        2: "۵ تا ۱۵ سال",
        3: "۲۰ تا ۲۵ سال",
        4: "۲۵ تا ۳۰ سال",
        5: "۳۰ تا ۴۰  سال",
        6: "۴۰ تا ۵۰ سال",
      },
      colors: [
        "#E76F51",
        "#EE8959",
        "#F4A261",
        "#E9C46A",
        "#2A9D8F",
        "#287271",
        "#264653",
      ],
    },
    nama: {
      title: "نمای ساختمان",
      values: {
        0: "بدون نما",
        1: "نمای ساده",
        2: "نمای سنگی",
        3: "نمای آجر",
        4: "نمای سیمانی",
        5: "نمای کامپوزیت",
        6: "نمای شیشه‌ای",
        7: "نمای ترکیبی",
        8: "نمای چوبی",
      },
      colors: [
        "#A0B7CF",
        "#8CD9F8",
        "#73D3C9",
        "#96E6B3",
        "#FED35D",
        "#FFE085",
        "#DBB3B1",
        "#EA9E8D",
        "#FF7073",
      ],
    },
  };

  const baseMaps = {
    osm: () =>
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    dark: () =>
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      ),
    light: () =>
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      ),
    carto: () =>
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
      ),
    esri: () =>
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{x}/{y}"
      ),
  };

  useEffect(() => {
    const defaultCenter = [37.475, 57.327];
    const initMap = L.map(mapRef.current, {
      center: defaultCenter,
      zoom,
      minZoom,
      maxZoom,
      scrollWheelZoom,
      dragging,
      doubleClickZoom,
      boxZoom,
      keyboard,
    });
    // اجرای خودکار در بار اول
    const base = baseMaps["osm"]();
    base.addTo(initMap);
    baseLayerRef.current = base;
    setMap(initMap);

    if (recenterOnDrag && dragging) {
      initMap.on("moveend", () => {
        const center = initMap.getCenter();
        if (
          Math.abs(center.lat - defaultCenter[0]) > 0.0001 ||
          Math.abs(center.lng - defaultCenter[1]) > 0.0001
        ) {
          initMap.setView(defaultCenter, initMap.getZoom(), { animate: true });
        }
      });
    }

    fetch("./data/M15_ExportFeat_FeaturesToJSO.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        drawLayer(data, "qdmt", initMap);
        drawLegend("qdmt");
        initMap.fitBounds(L.geoJSON(data).getBounds());
      })
      .catch((error) => console.error("Error loading GeoJSON data:", error));

    return () => initMap.remove();
  }, []);
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100); // تا Leaflet بعد از render اندازه‌گیری کند
    }
  }, [map]);

  const switchBaseMap = (type) => {
    if (!map) return;
    if (baseLayerRef.current) map.removeLayer(baseLayerRef.current);
    const newBase = baseMaps[type]();
    newBase.addTo(map);
    baseLayerRef.current = newBase;
  };

  const getColor = (type, value) => {
    const val = parseInt(value);
    return legendsData[type].colors[val] || "#ccc";
  };

  const legendRef = useRef(null);

  const drawLegend = (type) => {
    if (!map) return;

    // حذف legend قبلی اگر وجود دارد
    if (legendRef.current) {
      map.removeControl(legendRef.current);
      legendRef.current = null;
    }

    const legendControl = L.control({ position: "bottomright" });

    legendControl.onAdd = () => {
      const div = L.DomUtil.create("div", "legend");
      const grades = Object.entries(legendsData[type].values);

      div.innerHTML += `<h4 class="font-bold text-sm">${legendsData[type].title}</h4>`;
      grades.forEach(([key, label]) => {
        const color = getColor(type, parseInt(key));
        div.innerHTML += `
        <div class="flex items-center gap-2 text-xs">
          <div style="width:20px;height:12px;background:${color}"></div>
          <span>${label}</span>
        </div>
      `;
      });

      return div;
    };

    legendControl.addTo(map);

    // ذخیره در ref برای دفعات بعد
    legendRef.current = legendControl;
  };

  const drawLayer = (data, type, mapInstance) => {
    if (geoLayer) {
      geoLayer.remove();
    }

    const newLayer = L.geoJSON(data, {
      style: (feature) => ({
        color: "#555",
        fontFamily: "modam",
        weight: 0.5,
        fillColor: getColor(type, feature.properties[type]),
        fillOpacity: 0.75,
      }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        const qdmtLabel = legendsData.qdmt.values[parseInt(p.qdmt)] || "-";
        const namaLabel = legendsData.nama.values[parseInt(p.nama)] || "-";

        let tbqeLabel = "-";
        if (p.tdad_tbqe !== undefined && p.tdad_tbqe !== null) {
          const tbqeVal = parseInt(p.tdad_tbqe);
          if (tbqeVal === 0) tbqeLabel = "همکف";
          else if (tbqeVal === 100) tbqeLabel = "مخروبه";
          else tbqeLabel = legendsData.tdad_tbqe.values[tbqeVal] || "-";
        }

        layer.bindPopup(`
        <b>طبقات:</b> ${tbqeLabel}<br>
        <b>قدمت:</b> ${qdmtLabel}<br>
        <b>نما:</b> ${namaLabel}
      `);
      },
    });

    newLayer.addTo(mapInstance);

    setGeoLayer(newLayer);

    // حتماً این خط باید اینجا باشد تا legend همزمان با layer رسم شود
    drawLegend(type);
  };

  const handleMapTypeChange = (type) => {
    setLayerType(type);
    if (geoData && map) drawLayer(geoData, type, map);
  };
  useEffect(() => {
    if (map && geoData) {
      drawLegend(layerType);
    }
  }, [map, geoData]);

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [currentScreenHeight, setCurrentScreenHeight] = useState(
    window.innerHeight
  );
  useEffect(() => {
    setCurrentScreenHeight(window.innerHeight);
  }, [window.innerWidth]);

  return (
    <div className="h-full" style={{ direction: "rtl", fontFamily: "Modam" }}>
      <div
        className="h-full map-wrapper"
        style={{ position: "relative", zIndex: 1, marginBottom: 24 }}>
        <div
          id="map"
          ref={mapRef}
          style={{
            borderRadius: "10px",
            height: "100%",
            width: "100%",
            zIndex: 1,
          }}></div>

        <div
          className="map-controls"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}>
          <select
            onChange={(e) => handleMapTypeChange(e.target.value)}
            style={{
              padding: "10px 5px",
              borderRadius: "10px",
              fontSize: "14px",
              border: "1px solid #ccc",
              marginTop: "5px",
              color: "black",
            }}>
            <option value="tdad_tbqe">نقشه طبقات</option>
            <option value="qdmt">نقشه قدمت</option>
            <option value="nama">نقشه نما</option>
          </select>
          <select
            onChange={(e) => switchBaseMap(e.target.value)}
            style={{
              padding: "10px 5px",
              borderRadius: "10px",
              fontSize: "14px",
              border: "1px solid #ccc",
              marginTop: "5px",
              color: "black",
            }}>
            <option value="light">Light (سبک)</option>
            <option value="osm">OSM کلاسیک</option>
            <option value="dark">Dark (تاریک)</option>
            <option value="carto">Carto Streets</option>
          </select>
        </div>
      </div>

      <style>{`
        .map-wrapper {
          height: 100%;
          margin-bottom: 24px;
          z-index: 1;
        }
        @media (max-width: 640px) {
          .map-wrapper {
            height: auto !important;
            min-height: 0 !important;
            margin-bottom: 72px !important;
            z-index: 1;
          }
          #map {
            min-height: 300px !important;
            height: 300px !important;
            max-height: 340px !important;
            z-index: 1;
          }
        }
        .legend {
          background: white;
          padding: 10px;
          line-height: 1.8;
          border-radius: 5px;
          box-shadow: 0 0 5px #aaa;
          font-size: 13px;
          max-width: 90vw;
          width: 220px;
        }
        @media (max-width: 640px) {
          .legend {
            font-size: 11px;
            padding: 6px;
            width: 140px;
            min-width: 0;
          }
          .legend h4 {
            font-size: 12px;
          }
          .map-controls {
            top: auto !important;
            bottom: 10px !important;
            right: auto !important;
            left: 10px !important;
            flex-direction: column;
            align-items: flex-start;
          }
        }
        .legend i {
          display: inline-block;
          width: 18px;
          height: 18px;
          margin-left: 6px;
          vertical-align: middle;
          border: 1px solid #999;
        }
      `}</style>
    </div>
  );
};

export default MapAnalysis;
