export const statusWorkCheck = (data, isClient, isAdmin, userID) => {
  let status;
  if (isClient) {
    if (data?.service_type === 'scoring') {
      status =
        data?.status_work_scoring === 'NoScoreInfo'
          ? data?.status_tracking
          : data?.status_work_scoring || '-';
    } else {
      status = data?.status_tracking || '-';
    }
  } else if (data?.service_type === 'scoring') {
    if (
      data?.photographer_fsp_id === data?.photographer_ssp_id &&
      data?.status_work_fsp === 'decline'
    ) {
      status = data?.status_work_fsp;
    } else if (
      data?.photographer_fsp_id !== data?.photographer_ssp_id &&
      data?.status_work_ssp === 'decline'
    ) {
      status = data?.status_work_ssp;
    } else {
      if (data?.status_work_fsp === 'assigned') {
        status = data?.status_work_fsp;
      } else if (data?.status_work_ssp === 'waiting for ssp approval') {
        status = data?.status_work_ssp;
      } else {
        status =
          data?.status_work_scoring === 'NoScoreInfo'
            ? 'Waiting for event' || '-'
            : data?.status_work_scoring || '-';
      }
    }
  } else if (isAdmin) {
    if (
      (data?.status_work_fsp === 'completed by fsp' ||
        data?.status_work_fsp === 'complete') &&
      (data?.status_work_ssp !== 'completed by ssp' ||
        data?.status_work_ssp !== 'complete')
    ) {
      status = data?.status_work_fsp;
    } else if (
      (data?.status_work_fsp !== 'completed by fsp' ||
        data?.status_work_fsp !== 'complete') &&
      (data?.status_work_ssp === 'completed by ssp' ||
        data?.status_work_ssp === 'complete')
    ) {
      status = data?.status_work_ssp;
    } else if (data?.photographer_fsp_id === data?.photographer_ssp_id) {
      status = data?.status_work_fsp;
    } else if (data?.photographer_fsp_id !== data?.photographer_ssp_id) {
      status = data?.status_work_ssp;
    } else {
      status = '-';
    }
  } else if (userID === data?.photographer_fsp_id) {
    status = data?.status_work_fsp;
  } else if (userID === data?.photographer_ssp_id) {
    status = data?.status_work_ssp;
  } else if (data?.photographer_fsp_id === data?.photographer_ssp_id) {
    status = data?.status_work_fsp;
  } else if (data?.photographer_fsp_id !== data?.photographer_ssp_id) {
    status = data?.status_work_ssp;
  } else {
    status = '-';
  }

  return status;
};

export const statusColorCheck = (status) => {
  const colorMap = {
    'waiting for ssp approval': 'text-[#A17F58]',
    assigned: 'text-[#A17F58]',
    visiting: 'text-orange-300',
    complete: 'text-green-400',
    'completed by fsp': 'text-green-400',
    'completed by ssp': 'text-green-400',
    'uploading media': 'text-blue-400',
    'media has been uploaded': 'text-blue-400',
    decline: 'text-red-400',
    'decline from ssp': 'text-red-400',
    'media has been recognized': 'text-purple-400',
    Closed: 'text-red-400',
  };

  return colorMap[status];
};
