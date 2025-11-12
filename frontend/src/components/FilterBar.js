import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FilterBar.css';

const FilterBar = ({ quizzes, teams, onFilterChange }) => {
  const [filters, setFilters] = useState({
    quiz: '',
    team: '',
    dateFrom: '',
    dateTo: '',
  });
  const [teamSearch, setTeamSearch] = useState('');
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(teamSearch.toLowerCase())
  );

  return (
    <div className="filter-bar" role="search">
      <div className="filter-group">
        <label htmlFor="quiz-filter">Quiz</label>
        <select
          id="quiz-filter"
          value={filters.quiz}
          onChange={(e) => handleFilterChange('quiz', e.target.value)}
          className="filter-select"
        >
          <option value="">All Quizzes</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="team-search">Team</label>
        <div className="searchable-dropdown">
          <input
            id="team-search"
            type="text"
            value={teamSearch}
            onChange={(e) => setTeamSearch(e.target.value)}
            onFocus={() => setShowTeamDropdown(true)}
            onBlur={() => setTimeout(() => setShowTeamDropdown(false), 200)}
            placeholder="Search teams..."
            className="filter-input"
          />
          {showTeamDropdown && filteredTeams.length > 0 && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  setTeamSearch('');
                  handleFilterChange('team', '');
                }}
              >
                All Teams
              </button>
              {filteredTeams.map((team) => (
                <button
                  key={team.id}
                  className="dropdown-item"
                  onClick={() => {
                    setTeamSearch(team.name);
                    handleFilterChange('team', team.id);
                  }}
                >
                  {team.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="date-from">From</label>
        <input
          id="date-from"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="date-to">To</label>
        <input
          id="date-to"
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          className="filter-input"
        />
      </div>

      <button
        className="filter-reset"
        onClick={() => {
          setFilters({ quiz: '', team: '', dateFrom: '', dateTo: '' });
          setTeamSearch('');
        }}
        aria-label="Reset filters"
      >
        Reset
      </button>
    </div>
  );
};

FilterBar.propTypes = {
  quizzes: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;
