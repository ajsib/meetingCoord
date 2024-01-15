import React from 'react';

const LoadingAndError = ({ loading, error }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return null;
};

export default LoadingAndError;
