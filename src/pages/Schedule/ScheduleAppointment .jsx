import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ScheduleAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    pickupOption: 'dropOff',
    address: '',
    globalServiceType: '',
    items: [{ type: '', quantity: '', serviceType: '' }],
    specialInstructions: '',
  });

  const [showPriceConfirmation, setShowPriceConfirmation] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [pricingData, setPricingData] = useState({});

  const db = getFirestore();
  const auth = getAuth();

  // Fetch pricing data from Firebase
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const docRef = doc(db, 'pricing', 'servicePrices');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPricingData(docSnap.data());
        } else {
          console.log('No pricing data found');
        }
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      }
    };

    fetchPricing();
  }, [db]);

  const handleGlobalServiceTypeChange = (e) => {
    const newServiceType = e.target.value;

    if (newServiceType !== 'both') {
      const updatedItems = formData.items.map(item => ({
        ...item,
        serviceType: newServiceType,
      }));

      setFormData({
        ...formData,
        globalServiceType: newServiceType,
        items: updatedItems,
      });
    } else {
      setFormData({
        ...formData,
        globalServiceType: newServiceType,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, e) => {
    const newItems = formData.items.map((item, i) => 
      i === index ? { ...item, [e.target.name]: e.target.value } : item
    );
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { type: '', quantity: '', serviceType: '' }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculatePrice = () => {
    if (!pricingData.washing || !pricingData.ironing || !pricingData.washingAndIroning) {
      return 0;
    }

    const basePricesForWashing = pricingData.washing;
    const basePricesForIroning = pricingData.ironing;
    const basePricesForWashingandIron = pricingData.washingAndIroning;

    const pickupFee = formData.pickupOption === 'pickup' ? 500 : 0;

    const itemsTotal = formData.items.reduce((total, item) => {
      let itemPrice = 0;
      const serviceType = formData.globalServiceType === 'both' ? item.serviceType : formData.globalServiceType;

      switch (serviceType) {
        case 'washing':
          itemPrice = basePricesForWashing[item.type] || 0;
          break;
        case 'ironing':
          itemPrice = basePricesForIroning[item.type] || 0;
          break;
        case 'both':
          itemPrice = basePricesForWashingandIron[item.type] || 0;
          break;
        default:
          itemPrice = 0;
      }
      return total + itemPrice * item.quantity;
    }, 0);

    return itemsTotal + pickupFee;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = calculatePrice();
    setTotalPrice(price);
    setShowPriceConfirmation(true);
  };

  const handleConfirm = async () => {
    const user = auth.currentUser;
    const orderData = {
      ...formData,
      totalPrice,
      userId: user.uid,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      console.log('Order saved successfully');
    } catch (error) {
      console.error('Error saving order:', error);
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      pickupOption: 'dropOff',
      address: '',
      items: [{ type: '', quantity: '', serviceType: '' }],
      specialInstructions: '',
    });
    setShowPriceConfirmation(false);
  };

  const handleCancel = () => {
    setShowPriceConfirmation(false);
  };


  return (
    <div className="min-h-screen bg-gray-100 py-1 md:py-4 flex flex-col justify-center sm:py-12">
      <div className="relative md:py-3 sm:max-w-xl sm:mx-auto w-full md:px-4 sm:px-0">
        <div className="relative px-4 py-10 bg-white mx-0 md:mx-0 sm:shadow sm:rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            {!showPriceConfirmation ? (
              <>
                <div className="flex items-center space-x-2 md:space-x-5">
                  <div className="h-14 w-14 bg-[#275C9E] rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-mono">L</div>
                  <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                    <h2 className="text-sm font-bold sm:text-md md:leading-relaxed">Schedule Your Laundry Service</h2>
                    <p className="text-sm text-gray-500 font-normal leading-relaxed">Book your laundry pickup or drop-off</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7 bg-red flex flex-col gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                        placeholder="Name"
                        required
                      />
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                        placeholder="Email"
                        required
                      />
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Email
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                        placeholder="Phone"
                        required
                      />
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Phone
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                        placeholder="Date"
                        required
                      />
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Date
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                        placeholder="Time"
                        required
                      />
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Time
                      </label>
                    </div>

                    <div className="relative">
                      <select
                        name="globalServiceType"
                        value={formData.globalServiceType}
                        onChange={handleGlobalServiceTypeChange}
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                        required
                      >
                        <option value="">Select Service Type</option>
                        <option value="washing">Washing</option>
                        <option value="ironing">Ironing</option>
                        <option value="both">Washing & Ironing</option>
                      </select>
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Service Type
                      </label>
                    </div>
                    <div className="relative">
                      <label className="block text-gray-700">Pickup Option:</label>
                      <div className="mt-1">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="pickupOption"
                            value="dropOff"
                            checked={formData.pickupOption === 'dropOff'}
                            onChange={handleChange}
                            className="form-radio text-[#275C9E]"
                          />
                          <span className="ml-2">Drop Off</span>
                        </label>
                        <label className="inline-flex items-center ml-6">
                          <input
                            type="radio"
                            name="pickupOption"
                            value="pickup"
                            checked={formData.pickupOption === 'pickup'}
                            onChange={handleChange}
                            className="form-radio text-[#275C9E]"
                          />
                          <span className="ml-2">Pickup</span>
                        </label>
                      </div>
                    </div>

                    {formData.pickupOption === 'pickup' && (
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                          placeholder="Address"
                          required
                        />
                        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                          Address
                        </label>
                      </div>
                    )}

                    <div className="relative">
                      <label className="block text-gray-700">Items:</label>
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex space-x-4 mb-2">
                          <select
                            name="type"
                            value={item.type}
                            onChange={(e) => handleItemChange(index, e)}
                            className="peer placeholder-transparent h-10 w-1/3 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                            required
                          >
                            <option value="">Item Type</option>
                            <option value="shirt">Shirt</option>
                            <option value="pants">Pants</option>
                            <option value="dress">Dress</option>
                            <option value="suit">Suit</option>
                            <option value="bedding">Bedding</option>
                          </select>

                          {formData.globalServiceType === 'both' && (
                            <select
                              name="serviceType"
                              value={item.serviceType}
                              onChange={(e) => handleItemChange(index, e)}
                              className="peer placeholder-transparent h-10 w-1/3 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                              required
                            >
                              <option value="">Service Type</option>
                              <option value="washing">Washing</option>
                              <option value="ironing">Ironing</option>
                              <option value="both">Washing & Ironing</option>
                            </select>
                          )}

                          <input
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            className="peer placeholder-transparent h-10 w-1/3 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                            placeholder="Quantity"
                            required
                            min="1"
                          />

                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-500 focus:outline-none"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 text-blue-500 focus:outline-none"
                      >
                        Add Item
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleChange}
                        className="peer placeholder-transparent h-20 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-[#275C9E]"
                        placeholder="Special Instructions"
                      ></textarea>
                      <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                        Special Instructions
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center space-x-4">
                    <button
                      type="submit"
                      className="bg-[#275C9E] flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
                    >
                      Calculate Price
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Price Confirmation</h2>
                <p className="text-xl mb-6">Total Price: #{totalPrice.toFixed(2)}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleConfirm}
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;