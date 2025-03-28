import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import NavigationBar from './components/layout/NavigationBar';
import SingleImageView from './components/views/SingleImageView';
import MultiImageView from './components/views/MultiImageView';
import HistoryView from './components/views/HistoryView';
import SystemInfoView from './components/views/SystemInfoView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('single');
  
  const renderCurrentView = () => {
    switch (currentView) {
      case 'single':
        return <SingleImageView />;
      case 'multi':
        return <MultiImageView />;
      case 'history':
        return <HistoryView />;
      case 'system':
        return <SystemInfoView />;
      default:
        return <SingleImageView />;
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column', 
        height: '100vh',
        background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
        backgroundAttachment: 'fixed'
      }}>
        <NavigationBar currentView={currentView} onViewChange={setCurrentView} />
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {renderCurrentView()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;