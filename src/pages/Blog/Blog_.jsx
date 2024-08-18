import React from 'react';
import { useNavigate } from 'react-router-dom';


const blogPosts = [
  {
    id: 1,
    title: 'The Benefits of Professional Laundry Services',
    author: 'John Doe',
    date: 'August 10, 2024',
    summary: 'Discover the advantages of using professional laundry services and how they can save you time and effort.',
  },
  {
    id: 2,
    title: 'Top 5 Tips for Effective Stain Removal',
    author: 'Jane Smith',
    date: 'July 25, 2024',
    summary: 'Learn the best techniques for removing stubborn stains from your clothes and fabrics.',
  },
  {
    id: 3,
    title: 'How to Choose the Right Laundry Detergent',
    author: 'Alice Johnson',
    date: 'August 5, 2024',
    summary: 'Find out how to select the best laundry detergent for your needs and ensure your clothes come out fresh and clean.',
  },
  {
    id: 4,
    title: 'The Rise of Eco-Friendly Laundry Solutions',
    author: 'Michael Brown',
    date: 'July 30, 2024',
    summary: 'Explore the growing trend of eco-friendly laundry products and how they benefit both the environment and your wardrobe.',
  },
  {
    id: 5,
    title: 'Essential Tips for Maintaining Your Washing Machine',
    author: 'Emily Davis',
    date: 'August 2, 2024',
    summary: 'Get practical advice on keeping your washing machine in top condition to extend its lifespan and improve performance.',
  },
  {
    id: 6,
    title: 'Understanding Different Types of Laundry Services',
    author: 'Robert Wilson',
    date: 'July 20, 2024',
    summary: 'Learn about the various types of laundry services available and how to choose the one that best suits your needs.',
  },
  {
    id: 7,
    title: 'How to Care for Delicate Fabrics',
    author: 'Laura Taylor',
    date: 'August 1, 2024',
    summary: 'Discover the best practices for washing and caring for delicate fabrics to keep them looking their best.',
  },
  {
    id: 8,
    title: 'The Importance of Regular Laundry Maintenance',
    author: 'Daniel Martinez',
    date: 'July 18, 2024',
    summary: 'Understand why regular maintenance of your laundry routines is crucial for keeping clothes in good condition.',
  },
  {
    id: 9,
    title: 'The Role of Technology in Modern Laundry Services',
    author: 'Sophia Lee',
    date: 'August 7, 2024',
    summary: 'Learn about the technological advancements in laundry services and how they enhance convenience and efficiency.',
  },
  {
    id: 10,
    title: 'Innovations in Stain-Resistant Fabrics',
    author: 'James White',
    date: 'July 12, 2024',
    summary: 'Explore the latest innovations in stain-resistant fabrics and how they can make laundry day easier.',
  },
  {
    id: 11,
    title: 'How to Optimize Your Laundry Routine',
    author: 'Olivia Harris',
    date: 'August 8, 2024',
    summary: 'Find out how to streamline your laundry routine to save time and reduce stress.',
  },
  {
    id: 12,
    title: 'The Impact of Laundry Practices on Clothing Longevity',
    author: 'Ethan Clark',
    date: 'July 28, 2024',
    summary: 'Explore how different laundry practices can affect the longevity of your clothing and how to make them last longer.',
  },
];


const Blog_ = () => {
    const navigate = useNavigate(); // Initialize the navigate hook

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
              <p className="text-gray-600 mb-2">
                By {post.author} on {post.date}
              </p>
              <p className="text-gray-700">{post.summary}</p>
              <button
                onClick={() => navigate(`/blog/${post.id}`)} // Use navigate to go to the blog post
                className="mt-4 text-[#275C9E] hover:text-[#275C9E]/90 transition-colors"
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog_;