import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import StarMap from '../components/StarMap';
import SearchBar from '../components/SearchBar';
import InfoPanel from '../components/InfoPanel.js';
import '../styles/Home.css';

const Home = () => {
  const [showPlanets, setShowPlanets] = useState(true);
  const [showConstellations, setShowConstellations] = useState(true);
  const [selectedObject, setSelectedObject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ mag: 6, type: '', distance: 1000 });
  console.log({ Sidebar, StarMap, SearchBar, InfoPanel })
  console.log("InfoPanel Type:", typeof InfoPanel);
  console.log("SearchBar Type:", typeof SearchBar);
  return (
    <div className="home-container">
      <h1>Astronomy Data Visualizer 🌌</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="main-layout">
        <Sidebar
          showPlanets={showPlanets}
          setShowPlanets={setShowPlanets}
          showConstellations={showConstellations}
          setShowConstellations={setShowConstellations}
          filters={filters}
          setFilters={setFilters}
        />
        <StarMap
          showPlanets={showPlanets}
          showConstellations={showConstellations}
          onSelect={setSelectedObject}
          searchTerm={searchTerm}
          filters={filters}
        />
        <InfoPanel selected={selectedObject} />
      </div>
    </div>
  );
};

export default Home;
