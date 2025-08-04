// components/ads/MyAdComponent.tsx
import React from "react";
import { adRegistry } from "./AdRegistry";

type MyAdComponentProps = {
  index: number;
};

const MyAdComponent: React.FC<MyAdComponentProps> = ({ index }) => {
  const ad = adRegistry[index];
  if (!ad) return null;
  return <div style={{ margin: "1rem 0" }}>{ad}</div>;
};

export default MyAdComponent;
