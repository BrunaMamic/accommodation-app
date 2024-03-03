import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Filters from "../Filters";
import Modal from "../Modal";
import {Button} from '../common/Button'

const MainWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
  max-width: 1440px;
  width: 100%;
  margin: 50px auto;
  padding: 0 20px;

  .main {
    display: flex;
    gap: 30px;
    flex-direction: column;
  }

`;

const CardWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-direction: column;

  @media screen and (min-width: 760px) {
    flex-direction: row;
  }
`;

const ImageWrapper = styled.div`
  flex: 0 0 auto;
  width: 100%;
  /* max-width: 400px; */

  @media screen and (min-width: 768px) {
    flex: 0 0 400px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
`;

const AdditionalInfoWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;

  .amenities,
  .priceDate {
    flex: 1;
    max-width: calc(50% - 10px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  div {
    margin-bottom: 10px;
  }

  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AccommodationList = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

  const handleOpenModal = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setStartDate("");
    setEndDate("");
    setTotalPrice(null);
    setFilteredAccommodations(accommodations);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get(
          "https://api.adriatic.hr/test/accommodation"
        );
        setAccommodations(response.data);
        setFilteredAccommodations(response.data);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
      }
    };

    fetchAccommodations();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      setShowTotalPrice(true);
      calculateTotalPrice();
    } else {
      setShowTotalPrice(false);
      setTotalPrice(null);
    }
  }, [startDate, endDate]);

  const applyFilters = ({ startDate, endDate, numGuests, amenities }) => {
    let filtered = accommodations;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((accommodation) => {
        if (accommodation.availableDates) {
          return accommodation.availableDates.some((dateRange) => {
            const intervalStart = new Date(dateRange.intervalStart);
            const intervalEnd = new Date(dateRange.intervalEnd);
            return start >= intervalStart && end <= intervalEnd;
          });
        }
        return true;
      });
    }

    if (numGuests) {
      filtered = filtered.filter(
        (accommodation) => accommodation.capacity >= numGuests
      );
    }

    if (Object.values(amenities).some((value) => value === true)) {
      filtered = filtered.filter((accommodation) => {
        for (const [amenity, selected] of Object.entries(amenities)) {
          if (selected && !accommodation.amenities[amenity]) {
            return false;
          }
        }
        return true;
      });
    }

    setFilteredAccommodations(filtered);
    calculateTotalPrice();
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const calculateTotalPrice = () => {
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
        )?.pricePerNight;

        totalPrice += pricePerNight;
      }

      totalPrice *= 1;
      setTotalPrice(totalPrice);
    } else {
      setTotalPrice(null);
    }
  };

  const [expandedAccommodationIndex, setExpandedAccommodationIndex] =
    useState(-1);

  const toggleExpandedAccommodation = (index) => {
    if (expandedAccommodationIndex === index) {
      setExpandedAccommodationIndex(-1);
    } else {
      setExpandedAccommodationIndex(index);
    }
  };


  return (
    <MainWrapper>
      <div className="main">
        <Filters onApplyFilters={applyFilters} showModal={showModal} />
        {filteredAccommodations.length === 0 ? (
          <div>No accommodations found.</div>
        ) : ( 
          filteredAccommodations.map((accommodation, index) => {
            const minPrice = Math.min(
              ...accommodation.pricelistInEuros.map((price) => price.pricePerNight)
            );
            const maxPrice = Math.max(
              ...accommodation.pricelistInEuros.map((price) => price.pricePerNight)
            );
  
            return (
              <CardWrapper key={index}>
                <ImageWrapper>
                  <CardImage src={accommodation.image} alt={accommodation.title} />
                </ImageWrapper>
  
                <div className="card">
                  <h2>{accommodation.title}</h2>
                  <div>Capacity: {accommodation.capacity}</div>
                  {accommodation.beachDistanceInMeters && (
                    <div>Distance to Beach: {accommodation.beachDistanceInMeters}m</div>
                  )}
                  <Button onClick={() => toggleExpandedAccommodation(index)}>
                    {expandedAccommodationIndex === index ? "See Less" : "See More"}
                  </Button>
                </div>
  
                {expandedAccommodationIndex === index && (
                  <AdditionalInfoWrapper>
                    <div className="amenities">
                      Amenities:
                      {Object.entries(accommodation.amenities).map(([key, value]) => (
                        <div key={key}>{key}: {value ? "Yes" : "No"}</div>
                      ))}
                    </div>
  
                    {startDate && endDate ? (
                      <div className="priceDate">
                        <div>Total Price: {totalPrice ? `${totalPrice} €` : "Calculating..."}</div>
                        <Button onClick={() => handleOpenModal(accommodation)}>Rezerviraj</Button>
                      </div>
                    ) : (
                      <div className="priceDate">
                        <div>Price Range: {minPrice} € - {maxPrice} €</div>
                        <div>Please select start and end dates to see the total price and reserve the accommodation.</div>
                      </div>
                    )}
                  </AdditionalInfoWrapper>
                )}
              </CardWrapper>
            );
          })
        )}
  
        {showModal && selectedAccommodation && (
          <Modal
            accommodation={selectedAccommodation}
            onClose={handleCloseModal}
            totalPrice={totalPrice}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </div>
    </MainWrapper>
  );
  
};

export default AccommodationList;
