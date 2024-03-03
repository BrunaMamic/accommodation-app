import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "../common/Button";

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;

  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  input,
  select {
    width: 100%;
    padding: 5px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;

  label {
    margin-right: 10px;
  }
`;

const Filters = ({ onApplyFilters, showModal }) => {
  // console.log(showModal, "FILTER SHOW MODAL", onApplyFilters);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numGuests, setNumGuests] = useState("");
  const [amenities, setAmenities] = useState({
    airConditioning: false,
    parkingSpace: false,
    pets: false,
    pool: false,
    wifi: false,
    tv: false,
  });

  useEffect(() => {
    if (!showModal) {
      setStartDate("");
      setEndDate("");
      setNumGuests("");
      setAmenities({
        airConditioning: false,
        parkingSpace: false,
        pets: false,
        pool: false,
        wifi: false,
        tv: false,
      });
    }
  }, [showModal]);

  const handleApplyFilters = () => {
    onApplyFilters({ startDate, endDate, numGuests, amenities });
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prevAmenities) => ({
      ...prevAmenities,
      [name]: checked,
    }));
  };

  return (
    <MainWrapper>
      <RowWrapper>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          min="2024-01-01"
          max="2024-12-31"
          onChange={(e) => setStartDate(e.target.value)}
        />
      </RowWrapper>

      <RowWrapper>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          min="2024-01-01"
          max="2024-12-31"
          onChange={(e) => setEndDate(e.target.value)}
        />
      </RowWrapper>

      <RowWrapper>
        <label htmlFor="numGuests">Number of Guests:</label>
        <input
          type="number"
          id="numGuests"
          value={numGuests}
          onChange={(e) => setNumGuests(e.target.value)}
        />
      </RowWrapper>

      <RowWrapper>
        <CheckboxWrapper>
          <input
            type="checkbox"
            id="parkingSpace"
            name="parkingSpace"
            checked={amenities.parkingSpace}
            onChange={handleAmenityChange}
          />
          <label htmlFor="parkingSpace">Parking Space</label>
          <input
            type="checkbox"
            id="pets"
            name="pets"
            checked={amenities.pets}
            onChange={handleAmenityChange}
          />
          <label htmlFor="pets">Pets</label>
          <input
            type="checkbox"
            id="airConditioning"
            name="airConditioning"
            checked={amenities.airConditioning}
            onChange={handleAmenityChange}
          />
          <label htmlFor="airConditioning">Air Conditioning</label>
          <input
            type="checkbox"
            id="pool"
            name="pool"
            checked={amenities.pool}
            onChange={handleAmenityChange}
          />
          <label htmlFor="pool">Pool</label>
          <input
            type="checkbox"
            id="wifi"
            name="wifi"
            checked={amenities.wifi}
            onChange={handleAmenityChange}
          />
          <label htmlFor="wifi">Wifi</label>

          <input
            type="checkbox"
            id="tv"
            name="tv"
            checked={amenities.tv}
            onChange={handleAmenityChange}
          />
          <label htmlFor="tv">TV</label>
        </CheckboxWrapper>

        {/* Add more checkboxes for amenities here */}
      </RowWrapper>

      <Button onClick={handleApplyFilters}>Apply Filters</Button>
    </MainWrapper>
  );
};

export default Filters;
