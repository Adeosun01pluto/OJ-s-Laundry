import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

const DashboardHome = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchDashboardData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        // Check if the user is an admin
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setIsAdmin(userData.isAdmin);
        }

        if (isAdmin) {
          // Fetch all users and orders for admin
          const ordersCollection = collection(db, 'orders');
          const usersCollection = collection(db, 'users');

          const ordersSnapshot = await getDocs(ordersCollection);
          const usersSnapshot = await getDocs(usersCollection);

          setTotalOrders(ordersSnapshot.size);
          setTotalCustomers(usersSnapshot.size);

          // Fetch recent activities
          const activities = [
            { text: 'New order: Wash & Iron - John Doe' },
            { text: 'Price updated: Ironing Service' },
            { text: 'New blog post: "5 Tips for Stain Removal"' }
          ];
          setRecentActivities(activities);
        } else {
          // Fetch only the user's orders
          const ordersCollection = collection(db, 'orders');
          const q = query(ordersCollection, where('userId', '==', user.uid));
          const ordersSnapshot = await getDocs(q);

          setTotalOrders(ordersSnapshot.size);

          // Example recent activities for non-admin users
          const activities = [
            { text: 'Order completed: Wash & Iron' },
            { text: 'Price updated for your order' }
          ];
          setRecentActivities(activities);
        }
        
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#275C9E"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{isAdmin ? 'Total Orders' : 'Your Orders'}</h2>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        {isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Total Customers</h2>
            <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activities</h2>
          <ul className="space-y-2">
            {recentActivities.map((activity, index) => (
              <li key={index} className="text-sm text-gray-600">{activity.text}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isAdmin ? (
            <>
              <Link to="/dashboard/orders" className="bg-[#275C9E] text-white py-2 px-4 rounded-md hover:bg-[#275C9E]/90 transition-colors">
                Add New Order
              </Link>
              <Link to="/dashboard/price-list" className="bg-[#275C9E] text-white py-2 px-4 rounded-md hover:bg-[#275C9E]/90 transition-colors">
                Update Price List
              </Link>
              <Link to="/dashboard/blogs" className="bg-[#275C9E] text-white py-2 px-4 rounded-md hover:bg-[#275C9E]/90 transition-colors">
                Create Blog Post
              </Link>
              <Link to="/dashboard/orders" className="bg-[#275C9E] text-white py-2 px-4 rounded-md hover:bg-[#275C9E]/90 transition-colors">
                Send Notification
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/orders" className="bg-[#275C9E] text-white py-2 px-4 rounded-md hover:bg-[#275C9E]/90 transition-colors">
                Add New Order
              </Link>
              <Link to="/dashboard/edit-profile" className="bg-[#275C9E] text-white py-2 px-4 rounded-md hover:bg-[#275C9E]/90 transition-colors">
                Edit Profile
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
