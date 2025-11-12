import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import './ResultsTable.css';

const ResultsTable = ({ results, onExport }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const sortedResults = useMemo(() => {
    const sorted = [...results].sort((a, b) => {
      if (sortConfig.key === 'score') {
        return sortConfig.direction === 'asc' ? a.score - b.score : b.score - a.score;
      }
      if (sortConfig.key === 'time') {
        return sortConfig.direction === 'asc' ? a.time - b.time : b.time - a.time;
      }
      if (sortConfig.key === 'team') {
        return sortConfig.direction === 'asc'
          ? a.team.localeCompare(b.team)
          : b.team.localeCompare(a.team);
      }
      return sortConfig.direction === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
    return sorted;
  }, [results, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="results-table-container">
      <div className="table-header">
        <h2>Results</h2>
        <div className="export-buttons">
          <button className="btn-export" onClick={() => onExport('csv')}>
            📄 Export CSV
          </button>
          <button className="btn-export" onClick={() => onExport('pdf')}>
            📑 Export PDF
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th></th>
              <th onClick={() => handleSort('team')} className="sortable">
                Team Name {sortConfig.key === 'team' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('quiz')} className="sortable">
                Quiz Name {sortConfig.key === 'quiz' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('score')} className="sortable">
                Final Score {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('time')} className="sortable">
                Time {sortConfig.key === 'time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result) => (
              <React.Fragment key={result.id}>
                <tr className="result-row">
                  <td>
                    <button
                      className="expand-btn"
                      onClick={() => toggleRow(result.id)}
                      aria-label={expandedRows.has(result.id) ? 'Collapse' : 'Expand'}
                    >
                      {expandedRows.has(result.id) ? '▼' : '▶'}
                    </button>
                  </td>
                  <td className="team-name">{result.team}</td>
                  <td>{result.quiz}</td>
                  <td className="score">{result.score}%</td>
                  <td className="time">{formatTime(result.time)}</td>
                  <td>
                    <span className={`status-badge ${result.status.toLowerCase()}`}>
                      {result.status}
                    </span>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedRows.has(result.id) && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="expanded-row"
                    >
                      <td colSpan="6">
                        <div className="timeline">
                          {result.questions?.map((q, idx) => (
                            <div key={idx} className="timeline-item">
                              <div className="timeline-marker">
                                {q.correct ? '✓' : '✗'}
                              </div>
                              <div className="timeline-content">
                                <div className="timeline-question">Q{idx + 1}: {q.question}</div>
                                <div className="timeline-meta">
                                  Time: {formatTime(q.time)} • Hints: {q.hints || 0}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ResultsTable.propTypes = {
  results: PropTypes.array.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default ResultsTable;
