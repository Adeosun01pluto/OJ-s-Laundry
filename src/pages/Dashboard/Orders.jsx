import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { doc, collection, getDocs, query, where, updateDoc, getDoc } from 'firebase/firestore';
import { FaSearch, FaSort, FaTimes } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner'; // Import the ThreeDots spinner

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, orderId: null, status: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
      checkIfAdmin(user.uid);
    }
  }, []);

  const checkIfAdmin = async (userId) => {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setIsAdmin(userData.isAdmin || false);
        fetchOrders(userId, userData.isAdmin || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchOrders = async (userId, isAdmin) => {
    try {
      setLoading(true); // Set loading to true before fetching
      const ordersCollection = collection(db, 'orders');
      const q = isAdmin ? query(ordersCollection) : query(ordersCollection, where('userId', '==', userId));
      const ordersSnapshot = await getDocs(q);
      const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleOrderClick = async (orderId) => {
    try {
      const orderDoc = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderDoc);
      if (orderSnapshot.exists()) {
        setSelectedOrder({ id: orderSnapshot.id, ...orderSnapshot.data() });
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const updateOrderStatus = async () => {
    try {
      const { orderId, status } = confirmDialog;
      const orderDoc = doc(db, 'orders', orderId);
      await updateDoc(orderDoc, { status });
      setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
      setConfirmDialog({ isOpen: false, orderId: null, status: null });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders
    .filter(order => order.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (sortBy === 'date' ? new Date(b.date) - new Date(a.date) : a.name.localeCompare(b.name)));

  return (
    <div className="md:p-4">
      <h1 className="text-2xl font-bold mb-4">{isAdmin ? 'All Orders' : 'My Orders'}</h1>

      {/* Search and Sort UI */}
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="relative mb-4 md:mb-0 w-full md:w-auto">
          <input
            type="text"
            className="border p-2 rounded w-full md:w-64"
            placeholder="Search Orders"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute right-2 top-3 text-gray-500" />
        </div>
        <div className="w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
          <FaSort className="inline ml-2 text-gray-500" />
        </div>
      </div>

      {/* Loading Spinner */}
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
          {/* Orders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOrderClick(order.id)}
              >
                <h2 className="text-sm sm:text-md md:text-xl font-semibold">Order #{order.id}</h2>
                <p>Status: {order.status}</p>
                <p>Total Price: #{order.totalPrice}</p>
              </div>
            ))}
          </div>

          {/* Order Details Dialog */}
          {isDialogOpen && (
            <div
              className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setIsDialogOpen(false)}
            >
              <div
                className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()} // Prevent dialog close on content click
              >
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
                <h2 className="text-xl font-bold mb-2">Order Details</h2>
                {selectedOrder && (
                  <>
                    <p><span className="font-semibold">Name:</span> {selectedOrder.name}</p>
                    <p><span className="font-semibold">Email:</span> {selectedOrder.email}</p>
                    <p><span className="font-semibold">Phone:</span> {selectedOrder.phoneNumber}</p>
                    <p><span className="font-semibold">Address:</span> {selectedOrder.address}</p>
                    <p><span className="font-semibold">Date:</span> {selectedOrder.date}</p>
                    <p><span className="font-semibold">Time:</span> {selectedOrder.time}</p>
                    <p><span className="font-semibold">Pickup Option:</span> {selectedOrder.pickupOption}</p>
                    <p><span className="font-semibold">Total Price:</span> #{selectedOrder.totalPrice}</p>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">Items:</h3>
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="mt-2">
                          <p><span className="font-semibold">Type:</span> {item.type}</p>
                          <p><span className="font-semibold">Quantity:</span> {item.quantity}</p>
                          <p><span className="font-semibold">Service:</span> {item.serviceType}</p>
                        </div>
                      ))}
                    </div>
                    {!isAdmin && (
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => setConfirmDialog({ isOpen: true, orderId: selectedOrder.id, status: 'completed' })}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Mark as Completed
                        </button>
                        <button
                          onClick={() => setConfirmDialog({ isOpen: true, orderId: selectedOrder.id, status: 'cancelled' })}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Confirmation Dialog */}
          {confirmDialog.isOpen && (
            <div
              className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setConfirmDialog({ isOpen: false, orderId: null, status: null })}
            >
              <div
                className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()} // Prevent dialog close on content click
              >
                <button
                  onClick={() => setConfirmDialog({ isOpen: false, orderId: null, status: null })}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
                <h2 className="text-xl font-bold mb-2">Confirm Action</h2>
                <p>Are you sure you want to mark this order as {confirmDialog.status}?</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setConfirmDialog({ isOpen: false, orderId: null, status: null })}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateOrderStatus}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;
