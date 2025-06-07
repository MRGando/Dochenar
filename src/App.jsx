// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Identify from "./components/Identify";
import History from "./components/History";
import Priorities from "./components/Priorities";
import PhysicalAnalysis from "./components/PhysicalAnalysis";
import FunctionalAnalysis from "./components/FunctionalAnalysis";
import QualityOfLife from "./components/QualityOfLife";
import ImageGallery from "./components/ImageGallery";
import Container from "./components/Container";
import Accesses from "./components/Accesses";
import Summary from "./components/Summary";
import SideBar from "./components/SideBar";

function App() {
  return (
    <div className="relative font-modam font-normal text-base bg-[var(--background)] text-stone-800">
      <SideBar />
      <div className="pl-[8-px] pr-[8px] pb-5  md:pr-60 md:pl-5 ">
        {" "}
        {/* حاشیه راست برای نوبار */}
        <Container>
          <div id="identify">
            <Identify />
          </div>
          <div id="history">
            <History />
          </div>
          <div id="physical">
            <PhysicalAnalysis />
          </div>
          <div id="functional">
            <FunctionalAnalysis />
          </div>
          <div id="accesses">
            <Accesses />
          </div>
          <div id="quality">
            <QualityOfLife />
          </div>
          <div id="priorities">
            <Priorities />
          </div>
          <div id="summary">
            <Summary />
          </div>
          <div id="images">
            <ImageGallery />
          </div>
        </Container>
      </div>
    </div>
  );
}

export default App;
