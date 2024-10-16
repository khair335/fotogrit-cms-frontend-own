import React, { useState } from 'react';

import { BiReset } from 'react-icons/bi';
import { Tooltip, Button, Swipe } from '@/components';
import { FilterSelect, FilterSearch } from '@/components/form-input';
import { TableSchedule } from '@/components/event-result-other';

const Schedule = (props) => {
  const { currentPage, setCurrentPage, limitPerPage, metaPagination } = props;
  const scheduleResults = [
    {
      id: 1,
      dateTime: '29/05/23 15:00',
      location: 'GOR Lokasari',
      eventCategories: 'Final',
      teamA: {
        name: 'AirOne Club',
        score: 52,
        winLose: 'Win',
      },
      teamB: {
        name: 'Warriors Club',
        score: 51,
        winLose: 'Lose',
      },
      hallOfFame: 'Ben Gutama',
      eventDetail: 'https://fotogrit.id/Cakra_Sakti_Cup_2023',
    },
    {
      id: 2,
      dateTime: '29/05/23 15:00',
      location: 'GOR Lokasari',
      eventCategories: 'Final',
      teamA: {
        name: 'AirOne Club',
        score: 53,
        winLose: 'Win',
      },
      teamB: {
        name: 'Warriors Club',
        score: 51,
        winLose: 'Lose',
      },
      hallOfFame: 'Ben Gutama',
      eventDetail: 'https://fotogrit.id/Cakra_Sakti_Cup_2023',
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-end">
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

      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">Schedule & Results</h1>

        <TableSchedule
          data={scheduleResults}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          limitPerPage={limitPerPage}
        />
      </div>
    </div>
  );
};

export default Schedule;
