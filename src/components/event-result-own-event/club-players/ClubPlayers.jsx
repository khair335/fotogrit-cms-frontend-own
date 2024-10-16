import React from 'react';

import { BiReset } from 'react-icons/bi';
import { Tooltip, Button, Swipe } from '@/components';
import { FilterSelect, FilterSearch } from '@/components/form-input';
import { PlayerList } from '@/components/event-result-other';
import { useState } from 'react';

const ClubPlayers = () => {
  // Set the club with default id 1
  const [currentSection, setCurrentSection] = useState(1);

  // Clubs Information (id, name, club image)
  const clubs = [
    {
      id: 1,
      clubName: 'Fotogrit1',
      img: '/images/logo-fotogrit.png',
    },
    {
      id: 2,
      clubName: 'Fotogrit2',
      img: '/images/logo-fotogrit.png',
    },
    {
      id: 3,
      clubName: 'Fotogrit3',
      img: '/images/logo-fotogrit.png',
    },
  ];

  // Dummy Club Player
  const clubPlayer = [
    {
      id: 1,
      playerName: 'BEN GUTAMA',
      age: 9,
      ku: 10,
      role: 'Shooting Guard',
      jerseyNumber: 6,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit1',
    },
    {
      id: 2,
      playerName: 'ROBERT DE NIRO',
      age: 10,
      ku: 10,
      role: 'Center',
      jerseyNumber: 73,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit1',
    },
    {
      id: 3,
      playerName: 'SEBASTIAN GYM',
      age: 10,
      ku: 10,
      role: 'Point Guard',
      jerseyNumber: 13,
      isCaptain: true,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit1',
    },
    {
      id: 4,
      playerName: 'DANISH RONALD',
      age: 9,
      ku: 10,
      role: 'Point Guard',
      jerseyNumber: 73,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit1',
    },
    {
      id: 5,
      playerName: 'LEONARDO CHRIS',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 10,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit1',
    },
    {
      id: 6,
      playerName: 'ALEX ADRIAN',
      age: 10,
      ku: 10,
      role: 'Center',
      jerseyNumber: 24,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit1',
    },
    {
      id: 7,
      playerName: 'SMITH HELEN',
      age: 9,
      ku: 10,
      role: 'Center',
      jerseyNumber: 14,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit1',
    },
    {
      id: 8,
      playerName: 'RYAN DE NIRO',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit1',
    },
    {
      id: 9,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit2',
    },
    {
      id: 10,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit2',
    },
    {
      id: 11,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit2',
    },
    {
      id: 12,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: true,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit2',
    },
    {
      id: 13,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit2',
    },
    {
      id: 14,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit2',
    },
    {
      id: 15,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit2',
    },
    {
      id: 16,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit2',
    },
    {
      id: 17,
      playerName: 'New Player',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit3',
    },
    {
      id: 18,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit3',
    },
    {
      id: 19,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit3',
    },
    {
      id: 20,
      playerName: 'New Captain',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: true,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit3',
    },
    {
      id: 21,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit3',
    },
    {
      id: 22,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit3',
    },
    {
      id: 23,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit3',
    },
    {
      id: 24,
      playerName: 'RYAN DE',
      age: 9,
      ku: 10,
      role: 'Back',
      jerseyNumber: 2,
      isCaptain: false,
      img: 'https://source.unsplash.com/M5YKACTmdpo',
      clubName: 'Fotogrit3',
    },
  ];

  // Filter Club by Club id
  const filteredClub = clubs.filter((e) => {
    if (e.id == currentSection) {
      return e;
    }
  });

  // Filter Club Player by club name
  const filteredClubPlayer = clubPlayer.filter((filteredClubPlayer) => {
    if (filteredClubPlayer.clubName == filteredClub[0].clubName) {
      return filteredClubPlayer;
    }
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:items-center">
        <div className="w-full sm:w-[40%] lg:w-[30%]">
          <FilterSelect placeholder="Select Age Group" />
        </div>

        <div className="w-full sm:w-[40%] lg:w-[30%]">
          <FilterSearch placeholder="Search" />
        </div>

        <Tooltip text="Refresh" position="bottom">
          <Button
            background="black"
            // onClick={handleResetFilter}
            className="block w-full "
          >
            <BiReset className="mx-auto" />
          </Button>
        </Tooltip>
      </div>

      <div className="flex justify-center">
        <Swipe
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          data={clubs}
        >
          <img src={filteredClub[0].img} alt="Team Logo" />
        </Swipe>
      </div>

      <PlayerList data={filteredClubPlayer} />
    </div>
  );
};

export default ClubPlayers;
