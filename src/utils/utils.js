export const filterAccommodationsByDate = (accommodations, start, end) => {
    return accommodations.filter((accommodation) => {
      if (accommodation.availableDates) {
        return accommodation.availableDates.some((dateRange) => {
          const intervalStart = new Date(dateRange.intervalStart);
          const intervalEnd = new Date(dateRange.intervalEnd);
          return start >= intervalStart && end <= intervalEnd;
        });
      }
      return true;
    });
  };
  
  export const calculateTotalPrice = (startDate, endDate, accommodations) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let totalPrice = 0;
      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const pricePerNight = accommodations[0].pricelistInEuros.find(
          (price) => {
            const intervalStart = new Date(price.intervalStart);
            const intervalEnd = new Date(price.intervalEnd);
            return date >= intervalStart && date < intervalEnd;
          }
        ).pricePerNight;
  
        totalPrice += pricePerNight;
      }
  
      totalPrice *= 1;
      return totalPrice;
    } else {
      return null;
    }
  };
  