import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChartLink = () => {
  const navigate = useNavigate();
  return (
    <button className="btn btn-primary" onClick={() => navigate('/chart')}>
      CHART
    </button>
  );
};

export default ChartLink;
