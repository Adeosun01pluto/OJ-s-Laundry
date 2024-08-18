import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Ensure correct path to your firebase config
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ThreeDots } from 'react-loader-spinner'; // Import the ThreeDots spinner

function PriceList() {
  const [prices, setPrices] = useState({
    washing: {
      shirt: 0,
      pants: 0,
      dress: 0,
      suit: 0,
      bedding: 0,
    },
    ironing: {
      shirt: 0,
      pants: 0,
      dress: 0,
      suit: 0,
      bedding: 0,
    },
    washingAndIroning: {
      shirt: 0,
      pants: 0,
      dress: 0,
      suit: 0,
      bedding: 0,
    },
  });

  const [loading, setLoading] = useState(true); // Loading state for fetching
  const [saving, setSaving] = useState(false); // Loading state for saving

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const docRef = doc(db, 'pricing', 'servicePrices');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPrices(docSnap.data());
        } else {
          console.log('No such document!');
          // Initialize prices if document does not exist
          await setDoc(docRef, prices);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPrices();
  }, []);

  const handlePriceChange = (serviceType, item, newPrice) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [serviceType]: {
        ...prevPrices[serviceType],
        [item]: newPrice,
      },
    }));
  };

  const savePrices = async () => {
    setSaving(true); // Set saving to true while performing action
    try {
      const docRef = doc(db, 'pricing', 'servicePrices');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, prices);
      } else {
        await setDoc(docRef, prices);
      }

      console.log('Prices updated:', prices);
    } catch (error) {
      console.error('Error saving prices:', error);
    } finally {
      setSaving(false); // Set saving to false after saving
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Service Prices</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#275C9E"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : (
        <>
          {/* Washing Prices */}
          <h2 className="text-xl font-semibold mb-2">Washing</h2>
          {Object.keys(prices.washing).map((item) => (
            <div key={item} className="flex justify-between mb-2">
              <span className="capitalize">{item}</span>
              <input
                type="number"
                value={prices.washing[item]}
                onChange={(e) => handlePriceChange('washing', item, parseInt(e.target.value))}
                className="border p-2 rounded w-24 text-right"
              />
            </div>
          ))}

          {/* Ironing Prices */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Ironing</h2>
          {Object.keys(prices.ironing).map((item) => (
            <div key={item} className="flex justify-between mb-2">
              <span className="capitalize">{item}</span>
              <input
                type="number"
                value={prices.ironing[item]}
                onChange={(e) => handlePriceChange('ironing', item, parseInt(e.target.value))}
                className="border p-2 rounded w-24 text-right"
              />
            </div>
          ))}

          {/* Washing and Ironing Prices */}
          <h2 className="text-xl font-semibold mt-6 mb-2">Washing and Ironing</h2>
          {Object.keys(prices.washingAndIroning).map((item) => (
            <div key={item} className="flex justify-between mb-2">
              <span className="capitalize">{item}</span>
              <input
                type="number"
                value={prices.washingAndIroning[item]}
                onChange={(e) => handlePriceChange('washingAndIroning', item, parseInt(e.target.value))}
                className="border p-2 rounded w-24 text-right"
              />
            </div>
          ))}

          <button
            onClick={savePrices}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={saving} // Disable button while saving
          >
            {saving ? 'Saving...' : 'Save Prices'}
          </button>
        </>
      )}
    </div>
  );
}

export default PriceList;
