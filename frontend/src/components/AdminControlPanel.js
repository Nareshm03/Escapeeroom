import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../utils/ToastContext';
import './AdminControlPanel.css';

const AdminControlPanel = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '' });
  const toast = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/admin/teams');
      setTeams(response.data || []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleAction = (type) => {
    const configs = {
      start: {
        title: 'Start Event',
        message: 'Are you sure you want to start the event?'
      },
      pause: {
        title: 'Pause Event',
        message: 'This will pause all active timers. Continue?'
      },
      reset: {
        title: 'Reset Event',
        message: 'This will erase all current progress. Proceed?'
      },
      disqualify: {
        title: 'Disqualify Team',
        message: selectedTeam 
          ? `Confirm disqualification for ${teams.find(t => t._id === selectedTeam)?.name}?`
          : 'Please select a team first'
      }
    };

    if (type === 'disqualify' && !selectedTeam) {
      toast.warning('Please select a team to disqualify');
      return;
    }

    setModal({ isOpen: true, type, ...configs[type] });
  };

  const executeAction = async () => {
    const { type } = modal;
    setLoading(true);
    setModal({ ...modal, isOpen: false });

    try {
      let response;
      switch (type) {
        case 'start':
          response = await api.post('/admin/event/start');
          toast.success('Event started successfully');
          break;
        case 'pause':
          response = await api.post('/admin/event/pause');
          toast.success('Event paused successfully');
          break;
        case 'reset':
          response = await api.post('/admin/event/reset');
          toast.success('Event reset successfully');
          break;
        case 'disqualify':
          response = await api.post(`/admin/teams/${selectedTeam}/disqualify`);
          toast.success('Team disqualified successfully');
          setSelectedTeam('');
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(`Failed to ${type} event: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-control-panel">
      <h2 className="panel-title">🎮 Admin Control Panel</h2>
      
      <div className="control-buttons">
        <motion.button
          className="control-btn btn-start"
          onClick={() => handleAction('start')}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          aria-label="Start event"
        >
          <span className="btn-icon">🟢</span>
          <span className="btn-text">Start Event</span>
        </motion.button>

        <motion.button
          className="control-btn btn-pause"
          onClick={() => handleAction('pause')}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          aria-label="Pause event"
        >
          <span className="btn-icon">⏸️</span>
          <span className="btn-text">Pause Event</span>
        </motion.button>

        <motion.button
          className="control-btn btn-reset"
          onClick={() => handleAction('reset')}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          aria-label="Reset event"
        >
          <span className="btn-icon">🔁</span>
          <span className="btn-text">Reset Event</span>
        </motion.button>

        <div className="disqualify-group">
          <select
            className="team-select"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            disabled={loading}
            aria-label="Select team to disqualify"
          >
            <option value="">Select Team...</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
          <motion.button
            className="control-btn btn-disqualify"
            onClick={() => handleAction('disqualify')}
            disabled={loading || !selectedTeam}
            whileTap={{ scale: 0.95 }}
            aria-label="Disqualify selected team"
          >
            <span className="btn-icon">🚫</span>
            <span className="btn-text">Disqualify</span>
          </motion.button>
        </div>
      </div>

      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={executeAction}
        onCancel={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
};

export default AdminControlPanel;
