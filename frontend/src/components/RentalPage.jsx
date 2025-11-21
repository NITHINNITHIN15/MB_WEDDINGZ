import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rental from '../components/Rental';

export default function RentalPage() {
  return (
    <>
      <Navbar />
      <div className="rental-page-wrapper">
        <Rental />
      </div>
      <Footer />
    </>
  );
}
