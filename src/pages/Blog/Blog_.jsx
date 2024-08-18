import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase'; // Adjust the path according to your project structure
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ThreeDots } from 'react-loader-spinner';
import { FaTimes, FaSave } from 'react-icons/fa';

const Blog_ = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [saving, setSaving] = useState(false); // Loading state for saving changes

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        setIsAdmin(userDoc.data()?.isAdmin || false);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        setBlogs(blogs.filter(blog => blog.id !== id)); // Remove deleted blog from state
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleEditChange = (e) => {
    setEditBlog({
      ...editBlog,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateBlog = async () => {
    if (editBlog) {
      setSaving(true); // Start the saving process
      try {
        const blogRef = doc(db, 'blogs', editBlog.id);
        await updateDoc(blogRef, {
          title: editBlog.title,
          summary: editBlog.summary,
        });
        setBlogs(blogs.map(blog => (blog.id === editBlog.id ? editBlog : blog)));
        setEditBlog(null);
      } catch (error) {
        console.error('Error updating blog:', error);
      }
      setSaving(false); // End the saving process
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
              <p className="text-gray-600 mb-2">
                By {post.author} on {post.date}
              </p>
              <p className="text-gray-700">{post.summary}</p>
              <button
                onClick={() => navigate(`/blog/${post.id}`)}
                className="mt-4 text-[#275C9E] hover:text-[#275C9E]/90 transition-colors"
              >
                Read More
              </button>
              {isAdmin && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => setEditBlog(post)}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
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
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center ${saving && 'opacity-50 cursor-not-allowed'}`}
              disabled={saving} // Disable the button while saving
            >
              {saving ? (
                <ThreeDots
                  visible={true}
                  height="20"
                  width="20"
                  color="#ffffff"
                  radius="9"
                  ariaLabel="three-dots-saving"
                />
              ) : (
                <>
                  <FaSave className="inline mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog_;
