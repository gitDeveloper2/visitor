import React from 'react';
import ReactEmbedGist from 'react-embed-gist';

interface GistBoxProps {
  gist: `${string}/${string}`; // Type enforcing format 'username/gist-id'
}

const GistBox: React.FC<GistBoxProps> = ({ gist }) => {
  return <ReactEmbedGist gist={gist} />;
};

export default GistBox;
