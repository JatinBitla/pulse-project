import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/api';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  },);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="pt-4 pb-20">
      {posts.length > 0? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-lg">No posts yet.</p>
          <p className="text-sm">Follow some users to see their content!</p>
        </div>
      )}
    </div>
  );
};

export default Home;