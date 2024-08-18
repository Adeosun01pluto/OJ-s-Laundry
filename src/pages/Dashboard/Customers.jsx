import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; 
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaSearch, FaSort, FaTimes } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner'; // Import the ThreeDots spinner

function Customers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ isOpen: false, userId: null, action: null });
  const [loading, setLoading] = useState(true); // Loading state for fetching users
  const [actionLoading, setActionLoading] = useState(false); // Loading state for actions (block/delete)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    const user = users.find(user => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDialogOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    setActionLoading(true); // Set actionLoading to true while performing action
    const { userId, action } = confirmAction;
    try {
      const userDoc = doc(db, 'users', userId);
      if (action === 'block') {
        await updateDoc(userDoc, { isBlocked: true });
        setUsers(users.map(user => user.id === userId ? { ...user, isBlocked: true } : user));
      } else if (action === 'delete') {
        await deleteDoc(userDoc);
        setUsers(users.filter(user => user.id !== userId));
      }
      setConfirmAction({ isOpen: false, userId: null, action: null });
      setIsDialogOpen(false);
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    } finally {
      setActionLoading(false); // Set actionLoading to false after performing action
    }
  };

  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {/* Search and Sort UI */}
      <div className="flex justify-between mb-4 flex-col md:flex-row">
        <div className="relative mb-4 md:mb-0">
          <input
            type="text"
            className="border p-2 rounded w-full md:w-64"
            placeholder="Search Customers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute right-2 top-3 text-gray-500" />
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="createdAt">Sort by Created At</option>
          </select>
          <FaSort className="inline ml-2 text-gray-500" />
        </div>
      </div>

      {/* Users Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => handleUserClick(user.id)}
            >
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p>Email: {user.email}</p>
              <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Status: {user.isBlocked ? 'Blocked' : 'Active'}</p>
            </div>
          ))}
        </div>
      )}

      {/* User Details Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-2">Customer Details</h2>
            {selectedUser && (
              <>
                <p><b>Name:</b> {selectedUser.name}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Phone:</b> {selectedUser.phoneNumber}</p>
                <p><b>Address:</b> {selectedUser.address}</p>
                <p><b>Created At:</b> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                <p><b>Status:</b> {selectedUser.isBlocked ? 'Blocked' : 'Active'}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setConfirmAction({ isOpen: true, userId: selectedUser.id, action: 'block' })}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    disabled={selectedUser.isBlocked || actionLoading}
                  >
                    {actionLoading && confirmAction.action === 'block' ? 'Blocking...' : 'Block User'}
                  </button>
                  <button
                    onClick={() => setConfirmAction({ isOpen: true, userId: selectedUser.id, action: 'delete' })}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    disabled={actionLoading}
                  >
                    {actionLoading && confirmAction.action === 'delete' ? 'Deleting...' : 'Delete User'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmAction.isOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setConfirmAction({ isOpen: false, userId: null, action: null })}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-2">Confirm Action</h2>
            <p>Are you sure you want to {confirmAction.action} this user?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setConfirmAction({ isOpen: false, userId: null, action: null })}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
              >
                No
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded text-white ${confirmAction.action === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
              >
                {actionLoading ? 'Processing...' : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
