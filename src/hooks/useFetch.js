import { useState, useEffect } from 'react';
import { API_STATUS } from '../utils/constants';

/**
 * Custom hook for fetching data from API
 * @param {Function} fetchFn - Async function that fetches the data
 * @param {any[]} dependencies - Dependency array for useEffect
 * @returns {{data: any, status: string, error: Error | null, refetch: Function}}
 */
const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(API_STATUS.IDLE);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setStatus(API_STATUS.LOADING);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      setStatus(API_STATUS.SUCCESS);
    } catch (err) {
      setError(err);
      setStatus(API_STATUS.ERROR);
    }
  };

  useEffect(() => {
    if (fetchFn) {
      refetch();
    }
  }, dependencies);

  return { data, status, error, refetch };
};

export default useFetch;
