import React from 'react';
import { FormDownloadCertificate } from '@/components/event-result-other';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const EventInfoNews = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-5 pb-5 border-b-2 border-ftbrown">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Event Info</h1>

          <ul className="list-disc list-inside text-sm sm:text-base">
            <li>18 February 2023 - 18 March 2023</li>
            <li>Total Prize {CurrencyFormat(10000000)}</li>
            <li>Location : GOR Lokasari & GOR Bulungan</li>
          </ul>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Event News</h1>

          <ul className="list-disc list-inside text-sm sm:text-base">
            <li>Location moved from GOR Lokasari to GOR Padjajaran</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-8">
        <h1 className="text-xl font-bold">Download Certificate</h1>

        <FormDownloadCertificate />
      </div>
    </div>
  );
};

export default EventInfoNews;
