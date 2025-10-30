import React from 'react';

const InfoPanel = ({ selected }) => {
  return (
    <div className="info-panel">
      <h3>Object Info</h3>
      {selected ? (
        <>
          <p><strong>Name:</strong> {selected.name}</p>
          <p><strong>Type:</strong> {selected.type}</p>
          <p><strong>Magnitude:</strong> {selected.magnitude}</p>
          <p><strong>Distance:</strong> {selected.distance}</p>
        </>
      ) : <p>Click an object</p>}
    </div>
  );
};

export default InfoPanel;
