import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import api from '../services/api';
import './AdminControlCenter.css';

const AdminControlCenter = () => {
  const [eventStatus, setEventStatus] = useState('active');
  const [teams, setTeams] = useState([]);
  const [violations, setViolations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('scoreUpdate', (data) => {
      setTeams((prev) =>
        prev.map((team) => (team.id === data.teamId ? { ...team, score: data.score } : team))
      );
    });

    newSocket.on('violation', (data) => {
      setViolations((prev) => [...prev, data]);
    });

    fetchTeams();

    return () => newSocket.close();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/api/admin/teams');
      setTeams(response.data || []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handlePauseResume = async () => {
    const newStatus = eventStatus === 'active' ? 'paused' : 'active';
    try {
      await api.post('/api/admin/event-status', { status: newStatus });
      setEventStatus(newStatus);
      socket?.emit('eventStatusChange', newStatus);
    } catch (error) {
      console.error('Failed to update event status:', error);
    }
  };

  const handleResetScores = () => {
    setConfirmDialog({
      title: 'Reset All Scores?',
      message: 'This will reset all team scores to zero. This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.post('/api/admin/reset-scores');
          fetchTeams();
          setConfirmDialog(null);
        } catch (error) {
          console.error('Failed to reset scores:', error);
        }
      },
    });
  };

  const handleDisqualify = (teamId, teamName) => {
    setConfirmDialog({
      title: `Disqualify ${teamName}?`,
      message: 'Enter reason for disqualification:',
      input: true,
      onConfirm: async (reason) => {
        try {
          await api.post('/api/admin/disqualify', { teamId, reason });
          fetchTeams();
          setConfirmDialog(null);
        } catch (error) {
          console.error('Failed to disqualify team:', error);
        }
      },
    });
  };

  return (
    <div className="admin-control-center">
      <div className="control-header">
        <h1>Admin Control Center</h1>
        <div className="status-indicator">
          <span className={`status-dot ${eventStatus}`}></span>
          Event: {eventStatus}
        </div>
      </div>

      <div className="control-actions">
        <button
          className={`btn-control ${eventStatus === 'paused' ? 'resume' : 'pause'}`}
          onClick={handlePauseResume}
        >
          {eventStatus === 'paused' ? '▶️ Resume Event' : '⏸️ Pause Event'}
        </button>
        <button className="btn-control danger" onClick={handleResetScores}>
          🔄 Reset All Scores
        </button>
      </div>

      <div className="monitoring-grid">
        <div className="monitor-card">
          <h3>Active Teams</h3>
          <div className="metric-value">{teams.filter((t) => t.status === 'active').length}</div>
        </div>
        <div className="monitor-card">
          <h3>Total Submissions</h3>
          <div className="metric-value">{teams.reduce((sum, t) => sum + (t.submissions || 0), 0)}</div>
        </div>
        <div className="monitor-card">
          <h3>Violations</h3>
          <div className="metric-value danger">{violations.length}</div>
        </div>
        <div className="monitor-card">
          <h3>Avg Score</h3>
          <div className="metric-value">
            {teams.length ? Math.round(teams.reduce((sum, t) => sum + t.score, 0) / teams.length) : 0}%
          </div>
        </div>
      </div>

      <div className="teams-monitor">
        <h2>Team Activity</h2>
        <table className="monitor-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Score</th>
              <th>Status</th>
              <th>Submissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td className="team-name">{team.name}</td>
                <td className="score">{team.score}%</td>
                <td>
                  <span className={`status-badge ${team.status}`}>{team.status}</span>
                </td>
                <td>{team.submissions || 0}</td>
                <td>
                  <button
                    className="btn-action danger"
                    onClick={() => handleDisqualify(team.id, team.name)}
                  >
                    Disqualify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="violations-log">
        <h2>Violation Log</h2>
        <div className="violations-list">
          {violations.map((v, idx) => (
            <motion.div
              key={idx}
              className="violation-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="violation-time">{new Date(v.timestamp).toLocaleTimeString()}</span>
              <span className="violation-team">{v.teamName}</span>
              <span className="violation-type">{v.type}</span>
              <span className="violation-desc">{v.description}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {confirmDialog && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDialog(null)} />
          <div className="confirm-dialog">
            <h3>{confirmDialog.title}</h3>
            <p>{confirmDialog.message}</p>
            {confirmDialog.input && (
              <input
                type="text"
                placeholder="Enter reason..."
                id="reason-input"
                className="reason-input"
              />
            )}
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDialog(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const reason = confirmDialog.input
                    ? document.getElementById('reason-input').value
                    : null;
                  confirmDialog.onConfirm(reason);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminControlCenter;
