'use client';

// Metrics functionality removed to prevent CORS errors
const withMetrics = (WrappedComponent) => {
  return (props) => {
    // No metrics tracking - just return the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withMetrics;
