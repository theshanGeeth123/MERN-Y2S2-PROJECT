import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { X  } from "lucide-react";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51S2w2vGe7HqxWKZyj6lw9cLpoZInhlmUFbwsBWlWHvQ9PV6zcgEw4vssigko1AR0B8gHf6eIcqSy0MPXcYctPXzQ00mNnCmHU8");

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

  const { totalDeposit, items = [] } = location.state || { totalDeposit: 0, items: [] };

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: totalDeposit, // total from cart
    description: "",
    startDate: "",
    endDate: "",
    items: items, // rental items
    account: "",
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
      // Send formData to backend (store in DB)
      await axios.post("http://localhost:5000/api/rentals", formData);

      navigate("/rental-payment-confirmation", {
        state: { items: formData.items, totalPaid: formData.amount },
      });
    }

    setLoading(false);
  };


const handleClose = async () =>{
  navigate("/payment"); 
}

//this is for date validation, the start date never be yesterday and end date never be today
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0"); 
const dd = String(today.getDate()).padStart(2, "0");
const todayStr = `${yyyy}-${mm}-${dd}`;

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const yyyyT = tomorrow.getFullYear();
const mmT = String(tomorrow.getMonth() + 1).padStart(2, "0");
const ddT = String(tomorrow.getDate()).padStart(2, "0");
const tomorrowStr = `${yyyyT}-${mmT}-${ddT}`;

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

  setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};


const handleSuccess = async () =>{
      const { name, email, startDate, endDate, account, description } = formData;
    if (!name || !email || !startDate || !endDate || !account || !description) {
      toast.error(`All input fields required...`, {
                position: "top-center",
                autoClose: 3000,
              });
      return;
    }
  navigate("/payment/success");
}


  return (
    <div className="max-w-6xl mx-auto bg-slate-900 shadow-lg rounded-2xl">
      <div className="w-full flex justify-end mt-6"><X className="w-6 h-6 text-gray-700 cursor-pointer flex justify-end mr-6" onClick={handleClose} /></div>
    <form
  onSubmit={handleSubmit}
  className="max-w-6xl mx-auto bg-slate-900 shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10 p-15 flex items-center justify-center"
>
  
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
    {/* Rental Items */}
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

    {/* Payment Details */}
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
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
        onClick={handleSuccess}
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
