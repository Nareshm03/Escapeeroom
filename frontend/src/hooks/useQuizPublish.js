import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../utils/ToastContext';

export const useQuizPublish = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const publishQuiz = async (quizData) => {
    setLoading(true);
    try {
      const response = await api.post('/quiz/create', quizData);
      
      if (response.status === 201) {
        toast.success('Quiz Published Successfully!');
        navigate('/quiz-list');
        return { success: true, data: response.data };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to publish quiz';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { publishQuiz, loading };
};
