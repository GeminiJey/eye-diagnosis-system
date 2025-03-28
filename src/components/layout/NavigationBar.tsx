import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CollectionsIcon from '@mui/icons-material/Collections';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';

interface NavigationBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ currentView, onViewChange }) => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          眼科疾病智能诊断系统
        </Typography>
        
        <Box>
          <Button 
            color="inherit" 
            startIcon={<PhotoLibraryIcon />}
            onClick={() => onViewChange('single')}
            sx={{ 
              fontWeight: currentView === 'single' ? 'bold' : 'normal',
              textDecoration: currentView === 'single' ? 'underline' : 'none'
            }}
          >
            单图像检测
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<CollectionsIcon />}
            onClick={() => onViewChange('multi')}
            sx={{ 
              fontWeight: currentView === 'multi' ? 'bold' : 'normal',
              textDecoration: currentView === 'multi' ? 'underline' : 'none'
            }}
          >
            多图像检测
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<HistoryIcon />}
            onClick={() => onViewChange('history')}
            sx={{ 
              fontWeight: currentView === 'history' ? 'bold' : 'normal',
              textDecoration: currentView === 'history' ? 'underline' : 'none'
            }}
          >
            历史记录
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<InfoIcon />}
            onClick={() => onViewChange('system')}
            sx={{ 
              fontWeight: currentView === 'system' ? 'bold' : 'normal',
              textDecoration: currentView === 'system' ? 'underline' : 'none'
            }}
          >
            系统信息
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;