import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ThreeDots } from 'react-loader-spinner'; // Import the ThreeDots spinner

const EditProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
  });
  const [orderStats, setOrderStats] = useState({ pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [updating, setUpdating] = useState(false); // Loading state for form submission

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserData(user.uid);
        fetchOrderStats(user.uid);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const fetchOrderStats = async (uid) => {
    try {
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
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
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
    setUpdating(true); // Set updating to true before submitting
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), userData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setUpdating(false); // Set updating to false after submission
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
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
            <button
              type="submit"
              className={`bg-blue-500 text-white p-2 rounded ${updating ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditProfile;
