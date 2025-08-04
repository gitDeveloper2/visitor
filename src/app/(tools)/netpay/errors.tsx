'use client'; // Error boundaries must be Client Components

import { useEffect, useState } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (error.name === 'DatabaseError') {
      setMessage(`DatabaseError - Message: ${error.message}, Code: ${error.message}`);
    } else {
      setMessage(`Error - Message: ${error.message}`);
    }
  
    console.error(error);
  }, [error]);
  

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{message}</p>
      <button
        onClick={() => {
          setMessage(''); // Reset the message when retrying
          reset(); // Attempt to recover by re-rendering the segment
        }}
      >
        Try again
      </button>
    </div>
  );
}
