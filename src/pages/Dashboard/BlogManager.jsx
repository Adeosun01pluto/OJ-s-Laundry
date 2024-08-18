import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Ensure correct path to your firebase config
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', summary: '' });
  const [editBlog, setEditBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
      const userDoc = await getDoc(userDocRef); // Retrieve the user's document
      setIsAdmin(userDoc.data()?.isAdmin || false);
      setCurrentUser(user.displayName || 'Anonymous');
      
      try {
        const blogsCollection = collection(db, 'blogs');
        const blogsSnapshot = await getDocs(blogsCollection);
        const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(blogsList);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
      setLoading(false);
    };
  
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prevBlog => ({ ...prevBlog, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBlog(prevBlog => ({ ...prevBlog, [name]: value }));
  };

  const handleAddBlog = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'blogs'), {
        ...newBlog,
        author: currentUser,
        date: new Date().toISOString()
      });
      setNewBlog({ title: '', summary: '' });
      await refreshBlogs();
    } catch (error) {
      console.error('Error adding blog:', error);
    }
    setLoading(false);
  };

  const handleUpdateBlog = async () => {
    setLoading(true);
    try {
      const blogRef = doc(db, 'blogs', editBlog.id);
      await updateDoc(blogRef, editBlog);
      setEditBlog(null);
      await refreshBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
    }
    setLoading(false);
  };

  const handleDeleteBlog = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'blogs', id));
      await refreshBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
    setLoading(false);
  };

  const refreshBlogs = async () => {
    const blogsCollection = collection(db, 'blogs');
    const blogsSnapshot = await getDocs(blogsCollection);
    const blogsList = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBlogs(blogsList);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Manager</h1>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#275C9E"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      )}

      {/* Add New Blog */}
      {isAdmin && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add New Blog</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newBlog.title}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            name="summary"
            placeholder="Summary"
            value={newBlog.summary}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={handleAddBlog}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <FaPlus className="inline mr-2" />
            Add Blog
          </button>
        </div>
      )}

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map(blog => (
          <div key={blog.id} className="border p-4 rounded shadow hover:bg-gray-100">
            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
            <p><b>Author:</b> {blog.author}</p>
            <p><b>Date:</b> {new Date(blog.date).toLocaleDateString()}</p>
            <p><b>Summary:</b> {blog.summary}</p>
            {isAdmin && (
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setEditBlog(blog)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  <FaTrash className="inline mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Blog Modal */}
      {editBlog && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setEditBlog(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-2">Edit Blog</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editBlog.title}
              onChange={handleEditChange}
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              name="summary"
              placeholder="Summary"
              value={editBlog.summary}
              onChange={handleEditChange}
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleUpdateBlog}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaSave className="inline mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
