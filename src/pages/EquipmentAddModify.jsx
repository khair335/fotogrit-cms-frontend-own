import { useState } from 'react';

import { Breadcrumb } from '@/components';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Tabs, Tab, TabPanel } from '@/components/Tabs';

import { useGetEventGroupListQuery } from '@/services/api/eventGroupApiSlice';
import useDebounce from '@/hooks/useDebounce';
import { FilterSelect } from '@/components/form-input';
import { Equipment, EquipmentGroup } from '@/components/equipment-add-modify';

const breadcrumbItems = [
  { label: 'Equipment Management', url: '#' },
  { label: 'Add/Modify My Equipment' },
];

const EquipmentAddModify = () => {
  const [filterEventGroup, setFilterEventGroup] = useState('');
  const [currentActiveTab, setCurrentActiveTab] = useState(1);

  // For filter Event Group, infinite scroll
  const [pageEventGroup, setPageEventGroup] = useState(1);
  const [searchQueryEventGroup, setSearchQueryEventGroup] = useState('');
  const debouncedSearchEventGroup = useDebounce(searchQueryEventGroup, 200);
  const { data: eventGroupList } = useGetEventGroupListQuery({
    page: pageEventGroup,
    searchTerm: debouncedSearchEventGroup,
  });
  const eventGroupData = eventGroupList?.data?.event_groups;
  const totalPageOptionEventGroup = eventGroupList?.meta?.total_page;
  const selectDataEventGroup = eventGroupData?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));
  if (Array.isArray(selectDataEventGroup)) {
    selectDataEventGroup.unshift({ value: '', label: 'Select Event Group' });
  }

  return (
    <>
      <Card>
        <CardHeader className="relative ">
          <Breadcrumb title="Add/Modify My Equipment" items={breadcrumbItems} />

          <div className="flex  items-center gap-2 sm:w-[40%] mt-4 sm:mt-0">
            <div className="z-50 flex-grow ">
              <FilterSelect
                dataOptions={selectDataEventGroup}
                placeholder="Select Event Group"
                filterSelectedValue={filterEventGroup}
                setFilterSelectedValue={setFilterEventGroup}
                infiniteScroll
                setPage={setPageEventGroup}
                setSearchQuery={setSearchQueryEventGroup}
                totalPageOptions={totalPageOptionEventGroup}
              />
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Equipment Group">
              <TabPanel>
                <EquipmentGroup filterEventGroup={filterEventGroup} />
              </TabPanel>
            </Tab>
            <Tab label="Equipment">
              <TabPanel>
                <Equipment filterEventGroup={filterEventGroup} />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default EquipmentAddModify;
