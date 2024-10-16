import React, { useState } from 'react';
import { TableResultStanding } from '@/components/event-result-other';
import {
  ResultStandingTop,
  ResultStandingTopCategory,
} from '@/components/event-result-other/result-standing/ResultStandingTop';

import { FilterSelect } from '@/components/form-input';

const ResultStanding = (props) => {
  const { currentPage, setCurrentPage, limitPerPage, metaPagination } = props;

  const standings = [
    {
      id: 1,
      team: '/images/logo-fotogrit.png',
      totalPlays: 10,
      totalWins: 10,
      totalLose: 0,
      pointsFor: 100,
      pointsPointsAgainst: 50,
      pointsDifferences: 50,
      finalStandings: '1st Place',
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full sm:w-[40%] lg:w-[30%]">
          <FilterSelect placeholder="Select Age Group" />
        </div>

        <ResultStandingTop>
          <ResultStandingTopCategory
            category="TOP BLOCK"
            name="Louis B"
            img="https://source.unsplash.com/M5YKACTmdpo"
          />
          <ResultStandingTopCategory
            category="TOP REBOUND"
            name="Jason L"
            img="https://source.unsplash.com/M5YKACTmdpo"
          />
          <ResultStandingTopCategory
            category="TOP SCORE"
            name="Juan Ali"
            img="https://source.unsplash.com/M5YKACTmdpo"
          />
          <ResultStandingTopCategory
            category="TOP COACH"
            name="Kemal"
            img="https://source.unsplash.com/M5YKACTmdpo"
          />
        </ResultStandingTop>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">Standings</h1>

        <TableResultStanding
          data={standings}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          metaPagination={metaPagination}
          limitPerPage={limitPerPage}
        />
      </div>
    </div>
  );
};

export default ResultStanding;
