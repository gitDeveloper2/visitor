
import React from 'react';
import { Capitalize } from '../../../lib/TextLib';

const Citation = ({ index, url, text }) => (
  <p>
    [{index}] <a href={url} target="_blank" rel="noopener noreferrer">{Capitalize(text)}</a>
  </p>
);

export default Citation;
