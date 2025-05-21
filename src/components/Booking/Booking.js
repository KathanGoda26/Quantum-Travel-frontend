import React, { useState, useContext } from "react";
import "./booking.css";
import { Form, FormGroup, ListGroupItem, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Booking = ({ tour }) => {
  const { price, reviews, avgRating, title } = tour;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState({
    userId: user && user._id,
    userEmail: user && user.email,
    tourName: title,
    fullName: "",
    phone: "",
    guestSize: 1,
    bookAt: "",
  });

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const serviceFee = 10;
  const totalAmount =
    Number(price) * Number(booking.guestSize) + Number(serviceFee);

  const handleClick = async (e) => {
  e.preventDefault();

  if (!user) {
    alert("Please sign in first.");
    return;
  }

  try {
    const res = await fetch(`https://quantum-travel-frontend.vercel.app/api/v1/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      credentials: "include", 
      body: JSON.stringify(booking),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result?.message || "Something went wrong during booking.");
      return;
    }
    navigate("/thank-you");

  } catch (error) {
    console.error("Booking error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
};
  
  return (
    <>
      <div className="booking">
        <div className="booking_top d-flex align-items-center justify-content-between">
          <h3>
            ${price}
            <span>/per person</span>
          </h3>
          <span className="tour_rating d-flex align-items-center">
            <i className="ri-star-s-fill"></i>
            {avgRating === 0 ? null : avgRating} ({reviews?.length})
          </span>
        </div>
        <div className="booking_form">
          <h5>Information</h5>
          <Form className="booking_form-info" onSubmit={handleClick}>
            <FormGroup>
              <input
                type="text"
                placeholder="Full Name"
                id="fullName"
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <input
                type="number"
                placeholder="Phone"
                id="phone"
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="d-flex align-items-center gap-3">
              <input
                type="date"
                placeholder="Date"
                id="bookAt"
                required
                onChange={handleChange}
              />
              <input
                type="number"
                placeholder="Members"
                id="guestSize"
                required
                onChange={handleChange}
              />
            </FormGroup>
          </Form>
        </div>
        <div className="booking_bottom">
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              ${price} <i className="ri-close-line"></i> per person
            </h5>
            <span>${price}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Services Charge</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>${totalAmount}</span>
          </ListGroupItem>
          <Button className="btn primary_btn w-100 mt-4" onClick={handleClick}>
            Book Now
          </Button>
        </div>
      </div>
    </>
  );
};

export default Booking;
