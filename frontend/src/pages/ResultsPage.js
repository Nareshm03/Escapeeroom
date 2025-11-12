import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FilterBar from '../components/FilterBar';
import DataCards from '../components/DataCards';
import ResultsTable from '../components/ResultsTable';
import EmptyResults from '../components/EmptyResults';

const ResultsPage = () => {
  const [allResults, setAllResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    setTimeout(() => {
      setAllResults([
        {
          id: 1,
          team: 'Team Alpha',
          quiz: 'Escape Challenge 1',
          score: 95,
          time: 1200,
          status: 'Completed',
          date: '2024-01-15',
          questions: [
            { question: 'What is 2+2?', correct: true, time: 120, hints: 0 },
            { question: 'Capital of France?', correct: true, time: 180, hints: 1 },
          ],
        },
        {
          id: 2,
          team: 'Team Beta',
          quiz: 'Escape Challenge 1',
          score: 80,
          time: 1500,
          status: 'Completed',
          date: '2024-01-14',
          questions: [
            { question: 'What is 2+2?', correct: true, time: 150, hints: 1 },
            { question: 'Capital of France?', correct: false, time: 200, hints: 2 },
          ],
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredResults = useMemo(() => {
    return allResults.filter((result) => {
      if (filters.quiz && result.quiz !== filters.quiz) return false;
      if (filters.team && result.team !== filters.team) return false;
      if (filters.dateFrom && new Date(result.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(result.date) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [allResults, filters]);

  const analytics = useMemo(() => {
    const uniqueTeams = new Set(filteredResults.map((r) => r.team)).size;
    const avgScore = filteredResults.length
      ? Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length)
      : 0;
    const fastest = filteredResults.reduce(
      (min, r) => (!min || r.time < min.time ? r : min),
      null
    );

    return {
      totalTeams: uniqueTeams,
      averageScore: avgScore,
      fastestEscape: fastest ? { team: fastest.team, time: fastest.time } : null,
    };
  }, [filteredResults]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleExport = (format) => {
    if (format === 'csv') {
      const csv = [
        ['Team', 'Quiz', 'Score', 'Time', 'Status'],
        ...filteredResults.map((r) => [r.team, r.quiz, r.score, r.time, r.status]),
      ]
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'results.csv';
      a.click();
    } else if (format === 'pdf') {
      alert('PDF export would be implemented with a library like jsPDF');
    }
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const quizzes = [{ id: 'Escape Challenge 1', name: 'Escape Challenge 1' }];
  const teams = [
    { id: 'Team Alpha', name: 'Team Alpha' },
    { id: 'Team Beta', name: 'Team Beta' },
  ];

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px' }}>Results & Analytics</h1>

      <FilterBar quizzes={quizzes} teams={teams} onFilterChange={handleFilterChange} />

      <DataCards {...analytics} />

      {filteredResults.length > 0 ? (
        <ResultsTable results={filteredResults} onExport={handleExport} />
      ) : (
        <EmptyResults onReset={handleResetFilters} />
      )}
    </div>
  );
};

export default ResultsPage;
