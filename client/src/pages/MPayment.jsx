import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("your_stripe_publishable_key_here");

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const { totalDeposit, items } = location.state || { totalDeposit: 0, items: [] };

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: totalDeposit, // total from cart
  });

  useEffect(() => {
    if (!formData.amount) return;

    axios
      .post("http://localhost:5000/api/payment/create-payment-intent", {
        amount: formData.amount * 100, // Stripe expects cents
      })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error(err));
  }, [formData.amount]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === "succeeded") {
      // Navigate to confirmation page
      navigate("/rental-payment-confirmation", {
        state: { items, totalPaid: formData.amount },
      });
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-700 text-center">
        Complete Your Payment
      </h2>

      {/* Customer Info */}
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Full Name"
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          readOnly
          className="w-full p-2 border rounded-lg bg-gray-100"
        />
      </div>

      {/* Card Info */}
      <div className="space-y-4">
        <CardNumberElement options={ELEMENT_OPTIONS} className="w-full p-3 border rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <CardExpiryElement options={ELEMENT_OPTIONS} className="w-full p-3 border rounded-lg" />
          <CardCvcElement options={ELEMENT_OPTIONS} className="w-full p-3 border rounded-lg" />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
      >
        {loading ? "Processing..." : `Pay Rs. ${formData.amount}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
