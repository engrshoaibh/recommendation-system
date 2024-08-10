import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import Products from './Products';
import RecommendProducts from '../components/RecommendProducts';
import Navbar from '../components/Navbar';

export default function Home() {
  const [userData, setUserData] = useState<{ id: number, email:string } | null>(null); // Expect userId to be a number

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
    
      const parsedUser = JSON.parse(user);
      if (typeof parsedUser.id === 'number') {
        setUserData(parsedUser);
      } else {
        console.error('userId is not a number');
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  }, []);

  return (
    <div className="min-h-full">
      <Navbar />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Home</h1>
          <h2>{"Hy! "+ userData?.email}</h2>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <HeroSection />
          <Products />
          {/* Pass userId if available */}
          {userData && <RecommendProducts userId={userData.id} />}
        </div>
      </main>
    </div>
  );
}
