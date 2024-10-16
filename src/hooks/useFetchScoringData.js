import { useState, useEffect } from 'react';
import { FetchScoringData } from '@/helpers/FetchScoringData';

const useFetchScoringData = (dataServices) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const promises = dataServices?.map(async (item) => {
        if (item.service_type === 'scoring') {
          const url = `/api/event_status/?event_id=${item._event_id}`;
          const response = await FetchScoringData(url);

          return {
            ...item,
            status_work_scoring: response?.status,
          };
        } else {
          return item;
        }
      });

      const results = await Promise.all(promises || []);
      setData(results);
    };

    fetchAllData();
  }, [dataServices]);

  return data;
};

export default useFetchScoringData;
