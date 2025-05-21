import React from 'react';

const SearchSort = ({ searchText, setSearchText, sortBy, setSortBy }) => {
  return (
    <div className="search-sort-container">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="dateAddedAsc">Date Added (Ascending)</option>
        <option value="dateAddedDesc">Date Added (Descending)</option>
        <option value="dueDateAsc">Due Date (Ascending)</option>
        <option value="dueDateDesc">Due Date (Descending)</option>
        <option value="priorityAsc">Priority (Ascending)</option>
        <option value="priorityDesc">Priority (Descending)</option>
      </select>
    </div>
  );
};

export default SearchSort;
