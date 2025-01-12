import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultProfileImage from '../images/default profile picture.png';

function UserProfile() {
    const navigate = useNavigate();
    const myId = localStorage.getItem('_id');
    const [user, setUser] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        // Fetch user data and set the state
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://talkio-cy0z.onrender.com:/api/auth/user/${myId}`);
                const data = await response.json();
                setUser(data.user);
                setLoadingProfile(false);
            } catch (error) {
                toast.error("Failed to fetch user data");
                setLoadingProfile(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        toast.success("Logout successful");
        navigate('/login');
    };

    const handleBack = () => {
        navigate('/');
    };

    if (loadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-gray-600 font-semibold text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full sm:w-96">
                <div className="flex justify-center mb-6">
                    <img
                        src={user?.profilePicture || defaultProfileImage}
                        alt="Profile"
                        className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
                    />
                </div>
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-semibold text-gray-800">{user?.name || "User Name"}</h2>
                    <p className="text-md text-gray-600">{user?.username || "user@example.com"}</p>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                    >
                        Back
                    </button>

                    <button
                        onClick={handleLogout}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
