import React, { useState } from 'react';
import { useAppData } from './hooks/useAppData';
import Layout from './components/Layout';

// Modules
import Dashboard from './modules/Dashboard';
import Agenda from './modules/Agenda';
import Habits from './modules/Habits';
import Gym from './modules/Gym';
import Finance from './modules/Finance';
import Security from './modules/Security';
import Overthinking from './modules/Overthinking';
import Dialogue from './modules/Dialogue';
import Gratitude from './modules/Gratitude';
import Project from './modules/Project';
import Knowledge from './modules/Knowledge';
import Playlists from './modules/Playlists';
import Posture from './modules/Posture';
import Style from './modules/Style';
import Friends from './modules/Friends';
import Purpose from './modules/Purpose';
import Hobbies from './modules/Hobbies';
import Wins from './modules/Wins';
import Explore from './modules/Explore';
import Profile from './modules/Profile';

function App() {
  const { data, loading, updateData } = useAppData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard data={data} darkMode={darkMode} />;
      case 'explore': return <Explore onNavigate={setActiveTab} />;
      case 'profile': return <Profile user={data.user} darkMode={darkMode} toggleTheme={toggleTheme} />;
      case 'habits': return <Habits data={data} updateData={updateData} />;
      case 'gym': return <Gym data={data} updateData={updateData} />;
      case 'finance': return <Finance data={data} updateData={updateData} />;
      case 'security': return <Security data={data} updateData={updateData} />;
      case 'overthinking': return <Overthinking data={data} updateData={updateData} />;
      case 'dialogue': return <Dialogue data={data} updateData={updateData} />;
      case 'gratitude': return <Gratitude data={data} updateData={updateData} />;
      case 'project': return <Project data={data} updateData={updateData} />;
      case 'knowledge': return <Knowledge data={data} />;
      case 'playlists': return <Playlists data={data} />;
      case 'posture': return <Posture data={data} updateData={updateData} />;
      case 'style': return <Style data={data} updateData={updateData} />;
      case 'friends': return <Friends data={data} updateData={updateData} />;
      case 'purpose': return <Purpose data={data} updateData={updateData} />;
      case 'hobbies': return <Hobbies data={data} updateData={updateData} />;
      case 'wins': return <Wins data={data} updateData={updateData} />;
      case 'agenda': return <Agenda data={data} updateData={updateData} />;
      default: return <Dashboard data={data} darkMode={darkMode} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} toggleTheme={toggleTheme}>
      {renderModule()}
    </Layout>
  );
}

export default App;
