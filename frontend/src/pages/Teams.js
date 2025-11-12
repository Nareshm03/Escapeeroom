import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../utils/ToastContext';
import TeamModal from '../components/TeamModal';
import EmptyTeamsState from '../components/EmptyTeamsState';
import '../styles/design-tokens.css';
import '../styles/TeamsRedesign.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [teams, searchQuery, statusFilter]);

  const filterTeams = useCallback(() => {
    let filtered = [...teams];

    if (searchQuery) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(team => team.status === statusFilter);
    }

    setFilteredTeams(filtered);
  }, [teams, searchQuery, statusFilter]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/teams');
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams. Please try again.');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (formData) => {
    try {
      await api.post('/api/teams', formData);
      fetchTeams();
      toast.success('Team created successfully!');
    } catch (error) {
      toast.error('Failed to create team. Please try again.');
    }
  };

  const handleUpdateTeam = async (formData) => {
    try {
      await api.put(`/api/teams/${editingTeam.id}`, formData);
      setEditingTeam(null);
      fetchTeams();
      toast.success('Team updated successfully!');
    } catch (error) {
      toast.error('Failed to update team. Please try again.');
    }
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    if (window.confirm(`Are you sure you want to delete ${teamName}?`)) {
      try {
        await api.delete(`/api/teams/${teamId}`);
        fetchTeams();
        toast.success('Team deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete team. Please try again.');
      }
    }
  };

  const copyAccessCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Access code copied to clipboard!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openCreateModal = () => {
    setEditingTeam(null);
    setModalOpen(true);
  };

  const openEditModal = (team) => {
    setEditingTeam(team);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTeam(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingTeam) {
      handleUpdateTeam(formData);
    } else {
      handleCreateTeam(formData);
    }
  };



  if (loading) {
    return (
      <div className="teams-container">
        <LoadingSpinner size="large" text="Loading teams..." />
      </div>
    );
  }

  return (
    <div className="teams-container">
      <div className="teams-header">
        <h1 id="teams-heading">👥 Teams Dashboard</h1>
        <button onClick={openCreateModal} className="btn-primary">
          ➕ Create Team
        </button>
      </div>

      {teams.length === 0 ? (
        <EmptyTeamsState onCreateTeam={openCreateModal} />
      ) : (
        <>
          <div className="teams-toolbar">
            <div className="search-field">
              <input
                type="search"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search teams"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
            </select>
          </div>

          <motion.div
            className="teams-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {filteredTeams.map((team, index) => (
              <motion.div
                key={team.id}
                className="team-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.15 }}
              >
                <div className="team-card-header">
                  <h3 className="team-name">🛡️ {team.name}</h3>
                  <div className="team-members">
                    {[...Array(Math.min(3, team.member_count || 1))].map((_, i) => (
                      <div key={i} className="member-avatar">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    {team.member_count > 3 && (
                      <div className="member-count">+{team.member_count - 3}</div>
                    )}
                  </div>
                </div>
                {team.description && (
                  <p className="team-description">"{team.description}"</p>
                )}
                <div className="team-card-footer">
                  <div className="access-code-container">
                    <span className="access-code-label">Access Code:</span>
                    <code className="access-code">{team.accessCode || 'ABC123'}</code>
                    <button
                      onClick={() => copyAccessCode(team.accessCode || 'ABC123')}
                      className="copy-btn"
                      aria-label="Copy access code"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                  <div className="team-date" title={new Date(team.created_at).toLocaleString()}>
                    {formatDate(team.created_at)}
                  </div>
                </div>

                <div className="team-card-actions">
                  <button
                    onClick={() => openEditModal(team)}
                    className="btn-secondary"
                    aria-label={`Edit ${team.name}`}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                    className="btn-danger"
                    aria-label={`Delete ${team.name}`}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      <TeamModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialData={editingTeam}
      />
    </div>
  );
};

export default Teams;