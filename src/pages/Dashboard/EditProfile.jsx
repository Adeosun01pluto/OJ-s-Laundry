import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const EditProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
  });
  const [orderStats, setOrderStats] = useState({ pending: 0, completed: 0 });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user.uid);
        fetchOrderStats(user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data());
    }
  };

  const fetchOrderStats = async (uid) => {
    const ordersRef = collection(db, 'orders');
    
    // Query for pending orders
    const pendingQuery = query(ordersRef, where('userId', '==', uid), where('status', '==', 'pending'));
    const pendingSnapshot = await getDocs(pendingQuery);
    
    // Query for completed orders
    const completedQuery = query(ordersRef, where('userId', '==', uid), where('status', '==', 'completed'));
    const completedSnapshot = await getDocs(completedQuery);
    
    setOrderStats({
      pending: pendingSnapshot.size,
      completed: completedSnapshot.size,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), userData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Order Stats</h2>
        <p>Pending Orders: {orderStats.pending}</p>
        <p>Completed Orders: {orderStats.completed}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="border p-2 w-full rounded"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            className="border p-2 w-full rounded"
            value={userData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            className="border p-2 w-full rounded"
            value={userData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
