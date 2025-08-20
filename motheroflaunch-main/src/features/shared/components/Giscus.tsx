'use client';
import Giscus from '@giscus/react';


type GiscusCommentsProps = {
  term: string; // slug, id, etc.
};

export default function GiscusComments({ term }: GiscusCommentsProps) {
  return (
    <Giscus
      repo="gitDeveloper2/giscus"
      repoId="R_kgDOO0S-wA"
      category="Announcements"
      categoryId="DIC_kwDOO0S-wM4Cq6G7"
      mapping="specific"
      term={term}
      reactionsEnabled="0"
      emitMetadata="0"
      inputPosition="bottom"
      theme="light"
      lang="en"
      loading="lazy"
      strict='0'

    />
  );
 
}
