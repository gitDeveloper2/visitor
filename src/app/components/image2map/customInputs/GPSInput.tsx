import React, { useState, useEffect } from "react";

interface GPSInputProps {
  value: string;
  onChange: (newValue: string) => void;
  label: string;
}

const GPSInput: React.FC<GPSInputProps> = ({ value, onChange, label }) => {
 
  return (
   <p>test</p>
  );
};

export default React.memo(GPSInput);
