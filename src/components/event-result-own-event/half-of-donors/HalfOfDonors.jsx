import { RoundedImage } from '@/components';
import React from 'react';
import {
  PlatinumGoldSponsor,
  IndividualSponsor,
} from '@/components/event-result-other';

const HalfOfDonors = () => {
  const platinum = [
    {
      id: 1,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
    },
  ];

  const gold = [
    {
      id: 1,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
    },
    {
      id: 2,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
    },
    {
      id: 3,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
    },
    {
      id: 4,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
    },
    {
      id: 5,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
    },
    {
      id: 6,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
    },
  ];

  const individual = [
    {
      id: 1,
      name: 'James',
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      desc: 'Semangat',
    },
    {
      id: 2,
      name: 'Salim',
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      desc: 'Good Luck',
    },
    {
      id: 3,
      name: 'Adi',
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      desc: 'Bisa Yuk!',
    },
    {
      id: 4,
      name: 'Bejo',
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      desc: 'Come On!',
    },
    {
      id: 5,
      name: 'Hutama',
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      desc: 'Ayo!',
    },
    {
      id: 6,
      name: 'Lukius',
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      desc: 'Lets GO!',
    },
  ];
  return (
    <div className="flex flex-col items-center gap-5 lg:flex-row">
      <PlatinumGoldSponsor platinum={platinum} gold={gold} />

      <IndividualSponsor individual={individual} />
    </div>
  );
};

export default HalfOfDonors;
