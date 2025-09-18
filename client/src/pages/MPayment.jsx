import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRequestStore } from "../mstore/mRequestStore";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51S2w2vGe7HqxWKZyj6lw9cLpoZInhlmUFbwsBWlWHvQ9PV6zcgEw4vssigko1AR0B8gHf6eIcqSy0MPXcYctPXzQ00mNnCmHU8"
);

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
  const { addRequest } = useRequestStore();
  const { totalDeposit, items = [] } = location.state || { totalDeposit: 0, items: [] };

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: totalDeposit,
    description: "",
    startDate: "",
    endDate: "",
    items: items,
    account: "",
  });

  // Fetch Stripe client secret
  useEffect(() => {
    if (!formData.amount) return;
    axios
      .post("http://localhost:4000/api/payment/create-payment-intent", {
        amount: formData.amount * 100,
      })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error(err));
  }, [formData.amount]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Date validation helpers
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(
    tomorrow.getMonth() + 1
  ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const selectedDate = new Date(value);
    if (name === "endDate") {
      const startDate = new Date(formData.startDate);
      if (selectedDate <= startDate) {
        alert("End date must be after the start date!");
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form before payment
  const validateForm = () => {
    const { name, email, startDate, endDate, account, description } = formData;
    if (!name || !email || !startDate || !endDate || !account || !description) {
      toast.error("All input fields are required!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };

  // Handle payment and save
  const handlePaymentAndSave = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);

    try {
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
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded" || paymentIntent.status === "failed") {
        try {
          const updatedFormData = {
            ...formData,
            paymentStatus: paymentIntent.status,
            stripePaymentId: paymentIntent.id,
          };

          await addRequest(updatedFormData); // using Zustand store

          toast.success("Payment & Request saved successfully!", {
            position: "top-center",
            autoClose: 3000,
          });

          navigate("/payment/success", {
            state: { items: formData.items, totalPaid: formData.amount },
          });
        } catch (dbError) {
          toast.error("Payment done but failed to save request!");
          console.error(dbError);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await handlePaymentAndSave();
  };

  const handleClose = () => navigate("/payment");

  return (
    <div className="max-w-6xl mx-auto bg-slate-900 shadow-lg rounded-2xl">
      <div className="w-full flex justify-end mt-6">
        <X
          className="w-6 h-6 text-gray-200 cursor-pointer flex justify-end mr-6"
          onClick={handleClose}
        />
      </div>

      <form className="max-w-6xl mx-auto bg-slate-900 shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10 ">
        {/* Rental Info */}
        <div className="space-y-6 ">
          <h2 className="text-2xl font-bold text-white text-center">Rental Information</h2>
          <div className="space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded-xl bg-white" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded-xl bg-white" />
            <input type="number" name="amount" value={formData.amount} readOnly className="w-full p-2 border rounded-xl bg-gray-100" />
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded-xl bg-white" />
            <input type="text" name="account" value={formData.account} onChange={(e) => setFormData({ ...formData, account: e.target.value.replace(/\D/g, "") })} placeholder="Add Your Account Number for Refund" className="w-full p-2 border rounded-xl bg-white" />
            <input type="date" name="startDate" value={formData.startDate} min={todayStr} onChange={handleDateChange} className="w-full p-2 border rounded-xl bg-white" />
            <input type="date" name="endDate" value={formData.endDate} min={tomorrowStr} onChange={handleDateChange} className="w-full p-2 border rounded-xl bg-white" />
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-6 pl-6 border-l border-gray-500">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Your Rented Items</h3>
            <ul className="space-y-2">
              {formData.items.map((item, index) => (
                <li key={item._id || index} className="bg-gray-100 p-3 rounded-lg flex justify-between">
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-md font-bold text-white text-center mb-4">Add Your Payment Details</h2>
            <div className="space-y-4">
              <CardNumberElement options={ELEMENT_OPTIONS} className="w-full p-3 border rounded-xl bg-white" />
              <div className="grid grid-cols-2 gap-4">
                <CardExpiryElement options={ELEMENT_OPTIONS} className="w-full p-3 border rounded-xl bg-white" />
                <CardCvcElement options={ELEMENT_OPTIONS} className="w-full p-3 border rounded-xl bg-white" />
              </div>
            </div>

            <button type="button" disabled={!stripe || loading} onClick={handlePayNow} className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md">
              {loading ? "Processing..." : `Pay Rs. ${formData.amount}`}
            </button>
          </div>
        </div>
      </form>
    </div>
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





/*
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRequestStore } from "../mstore/mRequestStore"; 
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51S2w2vGe7HqxWKZyj6lw9cLpoZInhlmUFbwsBWlWHvQ9PV6zcgEw4vssigko1AR0B8gHf6eIcqSy0MPXcYctPXzQ00mNnCmHU8"
);

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

  const { addRequest } = useRequestStore();

  const { totalDeposit, items = [] } = location.state || {
    totalDeposit: 0,
    items: [],
  };

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: totalDeposit,
    description: "",
    startDate: "",
    endDate: "",
    items: items,
    account: "",
  });

  // ✅ Fetch Stripe client secret
  useEffect(() => {
    if (!formData.amount) return;

    axios
      .post("http://localhost:4000/api/payment/create-payment-intent", {
        amount: formData.amount * 100, 
      })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error(err));
  }, [formData.amount]);

  // handle inputs
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Date validation
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(
    tomorrow.getMonth() + 1
  ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const selectedDate = new Date(value);

    if (name === "endDate") {
      const startDate = new Date(formData.startDate);
      if (selectedDate <= startDate) {
        alert("End date must be after the start date!");
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validate form before payment
  const validateForm = () => {
    const { name, email, startDate, endDate, account, description } = formData;
    if (!name || !email || !startDate || !endDate || !account || !description) {
      toast.error("All input fields are required!", {
        position: "top-center",
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };

  // ✅ Handle payment + save
  const handlePaymentAndSave = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: formData.name,
              email: formData.email,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded"||paymentIntent.status === "failed") {
        try {
          await axios.post("http://localhost:4000/api/requests", formData, {
            withCredentials: true,
          });

          toast.success("Payment & Request saved successfully!", {
            position: "top-center",
            autoClose: 3000,
          });

          navigate("/payment/success", {
            state: { items: formData.items, totalPaid: formData.amount },
          });
        } catch (dbError) {
          toast.error("Payment done but failed to save request!");
          console.error(dbError);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pay Now button handler
  const handlePayNow = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    await handlePaymentAndSave();
  };

  const handleClose = () => {
    navigate("/payment");
  };

  return (
    <div className="max-w-6xl mx-auto bg-slate-900 shadow-lg rounded-2xl">
      <div className="w-full flex justify-end mt-6">
        <X
          className="w-6 h-6 text-gray-200 cursor-pointer flex justify-end mr-6"
          onClick={handleClose}
        />
      </div>

      <form className="max-w-6xl mx-auto bg-slate-900 shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Rental Information
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full p-2 border rounded-xl bg-white"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full p-2 border rounded-xl bg-white"
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              readOnly
              className="w-full p-2 border rounded-xl bg-gray-100"
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Description"
              className="w-full p-2 border rounded-xl bg-white"
            />
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, account: value });
              }}
              required
              placeholder="Add Your Account Number for Refund"
              className="w-full p-2 border rounded-xl bg-white"
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              min={todayStr}
              onChange={handleDateChange}
              required
              className="w-full p-2 border rounded-xl bg-white"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              min={tomorrowStr}
              onChange={handleDateChange}
              required
              className="w-full p-2 border rounded-xl bg-white"
            />
          </div>
        </div>

        
        <div className="space-y-6 pl-6 border-l border-gray-500">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">
              Your Rented Items
            </h3>
            <ul className="space-y-2">
              {formData.items.map((item, index) => (
                <li
                  key={item._id || index}
                  className="bg-gray-100 p-3 rounded-lg flex justify-between"
                >
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-md font-bold text-white text-center mb-4">
              Add Your Payment Details
            </h2>
            <div className="space-y-4">
              <CardNumberElement
                options={ELEMENT_OPTIONS}
                required
                className="w-full p-3 border rounded-xl bg-white"
              />
              <div className="grid grid-cols-2 gap-4">
                <CardExpiryElement
                  options={ELEMENT_OPTIONS}
                  required
                  className="w-full p-3 border rounded-xl bg-white"
                />
                <CardCvcElement
                  options={ELEMENT_OPTIONS}
                  required
                  className="w-full p-3 border rounded-xl bg-white"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={!stripe || loading}
              onClick={handlePayNow} 
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
            >
              {loading ? "Processing..." : `Pay Rs. ${formData.amount}`}
            </button>
          </div>
        </div>
      </form>
    </div>
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
*/

/*
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRequestStore } from "../mstore/mRequestStore";
import { toast } from "react-toastify";
import { X } from "lucide-react";

function MPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addRequest } = useRequestStore();

  // ✅ Get totalDeposit and items from location.state
  const { totalDeposit = 0, items = [] } = location.state || {
    totalDeposit: 0,
    items: [],
  };

  const [newRequest, setnewRequest] = useState({
    name: "",
    email: "",
    amount: totalDeposit, // ✅ auto-filled
    description: "",
    startDate: "",
    endDate: "",
    items: items,
    account: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setnewRequest((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const selectedDate = new Date(value);

    if (name === "endDate" && newRequest.startDate) {
      const startDate = new Date(newRequest.startDate);
      if (selectedDate <= startDate) {
        toast.error("End date must be after the start date!");
        return;
      }
    }
    setnewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, amount, startDate, endDate, account, description } = newRequest;
    if (!name || !email || !amount || !startDate || !endDate || !account || !description) {
      toast.error("All fields are required!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addRequest(newRequest);
      toast.success("Rental request submitted!");
      navigate("/requests");
    } catch (err) {
      toast.error("Failed to save request");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-slate-900 shadow-lg rounded-2xl">
      <div className="w-full flex justify-end mt-6">
        <X
          className="w-6 h-6 text-gray-200 cursor-pointer flex justify-end mr-6"
          onClick={() => navigate("/requests")}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-slate-900 shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Rental Information</h2>

          <div className="space-y-4">
            <input type="text" name="name" value={newRequest.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded-xl bg-white" required />
            <input type="email" name="email" value={newRequest.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded-xl bg-white" required />

            
            <input
              type="number"
              name="amount"
              value={newRequest.amount}
              readOnly
              className="w-full p-2 border rounded-xl bg-gray-100"
            />

            <input type="text" name="description" value={newRequest.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded-xl bg-white" required />
            <input type="text" name="account" value={newRequest.account} onChange={(e) => setnewRequest({ ...newRequest, account: e.target.value.replace(/\D/g, "") })} placeholder="Your Account Number" className="w-full p-2 border rounded-xl bg-white" required />
            <input type="date" name="startDate" value={newRequest.startDate} min={today} onChange={handleDateChange} className="w-full p-2 border rounded-xl bg-white" required />
            <input type="date" name="endDate" value={newRequest.endDate} min={today} onChange={handleDateChange} className="w-full p-2 border rounded-xl bg-white" required />
          </div>
        </div>

        
        <div className="space-y-6 pl-6 border-l border-gray-500">
          <h3 className="text-lg font-semibold mb-3 text-white">Your Rented Items</h3>
          <ul className="space-y-2">
            {newRequest.items.map((item, index) => (
              <li key={item._id || index} className="bg-gray-100 p-3 rounded-lg flex justify-between">
                <span>{item.name}</span>
              </li>
            ))}
          </ul>

          <button type="submit" className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md">
            Submit Rental Request
          </button>
        </div>
      </form>
    </div>
  );
}

export default MPayment;
*/