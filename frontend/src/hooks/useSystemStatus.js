import { useState, useEffect } from 'react';
import api from '../services/api';

export const useSystemStatus = () => {
  const [status, setStatus] = useState({
    timeLimit: { value: '60m', status: 'active', lastUpdated: Date.now() },
    antiCheat: { value: 'ON', status: 'on', lastUpdated: Date.now() },
    sebMode: { value: 'INACTIVE', status: 'inactive', lastUpdated: Date.now() }
  });

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/api/system/status');
      setStatus({
        timeLimit: {
          value: response.data.timeLimit ? `${response.data.timeLimit}m` : 'OFF',
          status: response.data.timeLimit > 0 ? 'active' : 'inactive',
          lastUpdated: Date.now()
        },
        antiCheat: {
          value: response.data.antiCheat ? 'ON' : 'OFF',
          status: response.data.antiCheat ? 'on' : 'off',
          lastUpdated: Date.now()
        },
        sebMode: {
          value: response.data.sebMode ? 'ACTIVE' : 'INACTIVE',
          status: response.data.sebMode ? 'active' : 'inactive',
          lastUpdated: Date.now()
        }
      });
    } catch (err) {
      console.error('Failed to fetch system status:', err);
    }
  };

  return { status, refreshStatus: fetchStatus };
};
