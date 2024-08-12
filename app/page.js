'use client';

import { useState } from 'react';
import { Box, Button, Modal, ThemeProvider, createTheme, Typography } from '@mui/material';
import ChatInterface from './components/ChatInterface';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
    },
  },
});

const BarbellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="20" height="4" rx="2" fill="#FF69B4" />
    <circle cx="4" cy="12" r="3" fill="#FF69B4" />
    <circle cx="20" cy="12" r="3" fill="#FF69B4" />
  </svg>
);

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => setIsChatOpen(true);
  const handleCloseChat = () => setIsChatOpen(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="background.default"
        color="white"
        position="relative"
        sx={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><g opacity="0.1">' + BarbellIcon().props.children + '</g></svg>')}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '60px 60px',
        }}
      >
        <Typography variant="h2" mb={4} textAlign="center">Welcome to Barbella!</Typography>
        <Typography variant="h5" mb={4} textAlign="center" maxWidth="800px">
          The platform designed to help you achieve the best version of yourself and guide you towards an improved lifestyle.
        </Typography>

        <Button
          variant="contained"
          onClick={handleOpenChat}
          sx={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            borderRadius: '24px',
            padding: '8px 16px',
            color: 'white',
            background: 'linear-gradient(90deg, #FF0000, #00FF00, #0000FF, #800080)',
            backgroundSize: '300% 300%',
            transition: 'all 0.5s ease',
            '&:hover': {
              backgroundPosition: '100% 50%',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          Chat
        </Button>

        <Modal
          open={isChatOpen}
          onClose={handleCloseChat}
          aria-labelledby="chat-modal"
          aria-describedby="chat-with-ai"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ outline: 'none' }}>
            <ChatInterface onClose={handleCloseChat} />
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}