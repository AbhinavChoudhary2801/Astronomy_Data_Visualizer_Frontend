// src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ showPlanets, setShowPlanets, showConstellations, setShowConstellations, filters, setFilters }) => {
  return (
    <div className="sidebar">
      <h3>Filters</h3>

      <label>Magnitude:</label>
      <input type="range" min="-2" max="6" value={filters.mag}
        onChange={e => setFilters(f => ({ ...f, mag: e.target.value }))} />

      <label>Type:</label>
      <select onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
        <option value="">All</option>
        <option value="Star">Star</option>
        <option value="Planet">Planet</option>
      </select>

      <br /><br />
      <input type="checkbox" checked={showPlanets} onChange={() => setShowPlanets(prev => !prev)} /> Show Planets
      <br />
      <input type="checkbox" checked={showConstellations} onChange={() => setShowConstellations(prev => !prev)} /> Show Constellations
    </div>
  );
};

export default Sidebar;
