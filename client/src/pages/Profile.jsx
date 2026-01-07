/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser } from '../services/api';
import { Grid3X3, Settings, Loader2 } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  );

  useEffect(() => {
    if (profile && currentUser) {
      setIsFollowing(profile.followers.includes(currentUser._id));
    }
  }, [profile, currentUser]);

  const handleFollowToggle = async () => {
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      if (isFollowing) {
        await unfollowUser(profile._id);
      } else {
        await followUser(profile._id);
      }
    } catch (err) {
      setIsFollowing(previousState);
      alert("Could not update follow status");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getUserProfile(username);
        setProfile(data);
      } catch (err) {
        console.error("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center mt-20">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b pb-12">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200">
          <img
            src={profile.avatar || "https://via.placeholder.com/150"}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <h2 className="text-2xl font-light">{profile.username}</h2>

            {currentUser && profile.username === currentUser.username ? (
              <button className="bg-gray-100 px-4 py-1.5 rounded-lg font-semibold text-sm">
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-1.5 rounded-lg font-semibold text-sm transition ${
                  isFollowing
                    ? 'bg-gray-200 text-black hover:bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}

            <Settings className="cursor-pointer" size={24} />
          </div>

          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <span><strong>{profile.postCount}</strong> posts</span>
            <span><strong>{profile.followers.length}</strong> followers</span>
            <span><strong>{profile.following.length}</strong> following</span>
          </div>

          <div className="font-semibold text-sm">Full Name Placeholder</div>
          <p className="text-sm">This is where the user bio will be displayed.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center border-t border-black -mt-12 mb-4">
        <div className="flex items-center gap-2 pt-4 uppercase tracking-widest text-xs font-bold border-t border-black">
          <Grid3X3 size={16} /> POSTS
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-8">
        {profile.posts.map((post) => (
          <div key={post._id} className="aspect-square relative group cursor-pointer">
            <img
              src={post.imageUrl}
              className="w-full h-full object-cover"
              alt="user post"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
