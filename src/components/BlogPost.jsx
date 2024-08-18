import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Adjust the import path according to your project structure
import { doc, getDoc } from 'firebase/firestore';
import { ThreeDots } from 'react-loader-spinner';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to fetch blog post');
      }
      setLoading(false);
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-[#275C9E] hover:text-[#275C9E]/90 mb-4">
          &larr; Back to Blog
        </button>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-4">
            By {post.author} on {post.date}
          </p>
          <p className="text-gray-700">{post.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
