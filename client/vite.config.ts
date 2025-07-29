import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __DEFINES__: '{}',
    __HMR_CONFIG_NAME__: '""',
    __SERVER_HOST__: '""',
    __BASE__: '""',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  envPrefix: 'VITE_',
});
