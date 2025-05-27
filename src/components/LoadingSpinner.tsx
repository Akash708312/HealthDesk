
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative flex h-16 w-16">
        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></div>
        <div className="relative inline-flex rounded-full h-16 w-16 bg-primary-500 items-center justify-center text-white">
          <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
