export const CalculateTotalFeeBasedOnDuration = (
  startTime,
  finishTime,
  services
) => {
  // Extracting start and finish hours and minutes
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [finishHour, finishMinute] = finishTime.split(':').map(Number);

  // Calculate the total minutes for both start and finish times
  const startTotalMinutes = startHour * 60 + startMinute;
  const finishTotalMinutes = finishHour * 60 + finishMinute;

  // Calculate the time difference in minutes
  const timeDifferenceMinutes = finishTotalMinutes - startTotalMinutes;

  // Calculate hours and minutes from time difference
  const hours = Math.ceil(timeDifferenceMinutes / 60);
  const minutes = timeDifferenceMinutes % 60;

  let totalFee = 0;
  const fixedFee = services?.variable_fees;

  if (hours <= 0) {
    totalFee = 0;
  } else if (Array.isArray(fixedFee) && fixedFee.length > 0) {
    let found = false;

    for (const fee of fixedFee) {
      if (hours >= fee.min && hours <= fee.max) {
        totalFee = fee.amount;
        found = true;
        break; // Exit the loop because a matching fee is found
      }
    }

    if (!found) {
      // Jika tidak ada rentang yang sesuai ditemukan, ambil dari elemen terakhir
      const lastFee = fixedFee[fixedFee.length - 1];
      totalFee = lastFee.amount;
    }
  }

  return { hours, minutes, totalFee };
};
