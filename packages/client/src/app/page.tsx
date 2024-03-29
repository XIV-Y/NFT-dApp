'use client';

import React from 'react';
import { useCardPack } from '@/hooks/useCardPack';

const Home: React.FC = () => {
  const a = useCardPack();

  console.log(a);
  return (
    <div
      style={{
        backgroundImage:
          'linear-gradient(40deg, rgba(243, 221, 254, 1), rgba(255, 188, 212, 1) 20%, rgba(243, 221, 254, 0.75) 50%, rgba(237, 188, 245, 1) 84%, rgba(194, 109, 238, 1) 94%);',
      }}
    >
      {a}
    </div>
  );
};

export default Home;
