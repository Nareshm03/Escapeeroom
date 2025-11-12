import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import NotificationBanner from '../components/NotificationBanner';
import './TeamsPage.css';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [memberFilter, setMemberFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: '', members: ['', '', ''] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setNotification(null);
      
      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      const response = await api.get('/api/teams');
      
      // Handle empty or invalid response
      if (!response || !response.data) {
        throw new Error('Invalid server response');
      }

      setTeams(Array.isArray(response.data) ? response.data : []);
      
      // Cache successful response
      localStorage.setItem('teamsCache', JSON.stringify(response.data));
      localStorage.setItem('teamsCacheTime', Date.now().toString());
      
    } catch (error) {
      console.error('Teams fetch error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        timestamp: new Date().toISOString(),
      });

      // Try to load from cache
      const cached = localStorage.getItem('teamsCache');
      if (cached) {
        setTeams(JSON.parse(cached));
        setNotification({
          message: 'Using cached data (offline mode)',
          type: 'warning',
          onRetry: fetchTeams,
        });
      } else {
        setNotification({
          message: error.message === 'No internet connection' 
            ? 'No internet connection. Please check your network.'
            : `Failed to load teams: ${error.response?.data?.message || error.message}`,
          type: 'error',
          onRetry: fetchTeams,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate =
        (!dateRange.from || new Date(team.created_at) >= new Date(dateRange.from)) &&
        (!dateRange.to || new Date(team.created_at) <= new Date(dateRange.to));
      const matchesMembers =
        memberFilter === 'all' ||
        (memberFilter === '1-3' && team.members <= 3) ||
        (memberFilter === '4-6' && team.members > 3 && team.members <= 6) ||
        (memberFilter === '7+' && team.members > 6);

      return matchesSearch && matchesDate && matchesMembers;
    });
  }, [teams, searchTerm, dateRange, memberFilter]);

  const sortedTeams = useMemo(() => {
    const sorted = [...filteredTeams].sort((a, b) => {
      if (sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc'
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });
    return sorted;
  }, [filteredTeams, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setNotification({ message: 'Access code copied!', type: 'success' });
    setTimeout(() => setNotification(null), 2000);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/api/teams', {
        name: modalData.name,
        members: modalData.members.filter((m) => m.trim()),
      });

      setShowModal(false);
      setModalData({ name: '', members: ['', '', ''] });
      fetchTeams();
      setNotification({ message: 'Team created successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Failed to create team',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ from: '', to: '' });
    setMemberFilter('all');
  };

  return (
    <div className="teams-page">
      <NotificationBanner
        {...notification}
        onDismiss={() => setNotification(null)}
      />

      <div className="teams-header">
        <h1>Teams Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Create Team
        </button>
      </div>

      <div className="teams-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
        />
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
        />
        <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}>
          <option value="all">All Members</option>
          <option value="1-3">1-3 Members</option>
          <option value="4-6">4-6 Members</option>
          <option value="7+">7+ Members</option>
        </select>
        <button className="btn-clear" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading teams...</div>
      ) : sortedTeams.length === 0 && !notification ? (
        <div className="empty-state">
          <h3>No teams found</h3>
          <p>Create your first team to get started</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create Team
          </button>
        </div>
      ) : (
        <div className="teams-table-container">
          <table className="teams-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Team Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Members</th>
                <th onClick={() => handleSort('created_at')} className="sortable">
                  Created At {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Access Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team) => (
                <tr key={team.id}>
                  <td className="team-name">{team.name}</td>
                  <td className="members-cell">
                    <span className="member-count" title={team.memberNames?.join(', ')}>
                      {team.members || 0} members
                    </span>
                  </td>
                  <td>{new Date(team.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="copy-code"
                      onClick={() => handleCopyCode(team.access_code)}
                      title="Click to copy"
                    >
                      {team.access_code} 📋
                    </button>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-action">View</button>
                    <button className="btn-action danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="modal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Create New Team</h2>
              <form onSubmit={handleCreateTeam}>
                <div className="form-group">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    value={modalData.name}
                    onChange={(e) => setModalData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                {modalData.members.map((member, idx) => (
                  <div key={idx} className="form-group">
                    <label>Member {idx + 1} Email</label>
                    <input
                      type="email"
                      value={member}
                      onChange={(e) => {
                        const newMembers = [...modalData.members];
                        newMembers[idx] = e.target.value;
                        setModalData((prev) => ({ ...prev, members: newMembers }));
                      }}
                    />
                  </div>
                ))}
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Team'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamsPage;
