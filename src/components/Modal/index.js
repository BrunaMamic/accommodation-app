import React, { useState } from "react";
import styled from "styled-components";
import {Button} from '../common/Button'

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 600px;
`;

const Modal = ({ accommodation, onClose, startDate, endDate, totalPrice }) => {
  const { image, title } =
    accommodation;

  return (
    <ModalWrapper>
      <ModalContent>
        <div>Thank you for your reservation!</div>
        <img src={image} alt={title} style={{ width: "100%", marginBottom: 20 }} />
        <div>Reservation for {title} successfully completed!</div>
        <div>Chosen Dates: {startDate} - {endDate}</div>
        <div>Total Price: {totalPrice}€</div>
        <Button onClick={onClose}>Back</Button> 
        
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
