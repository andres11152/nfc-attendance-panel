// src/components/MainLayout.tsx
// (puedes copiar el código del layout con Drawer que tenías antes)
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
// importa aquí el Drawer/Menu tal como lo tenías en MainLayout

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* tu Drawer aquí */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
