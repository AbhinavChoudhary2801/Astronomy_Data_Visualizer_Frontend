import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by name..." />
    </div>
  );
};

export default SearchBar;
