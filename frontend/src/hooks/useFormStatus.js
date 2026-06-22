import { useState } from 'react';

/**
 * Custom hook for managing form success/error message state.
 * Eliminates repeated useState + clear logic across form pages.
 */
function useFormStatus() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearStatus = () => {
    setMessage('');
    setError('');
  };

  return { message, error, setMessage, setError, clearStatus };
}

export default useFormStatus;
