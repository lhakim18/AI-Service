'use client';

import { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    console.log('Opening chat');
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    console.log('Closing chat');
    setIsChatOpen(false);
  };

  console.log('isChatOpen:', isChatOpen);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      color="white"
      position="relative"
    >
      <Typography variant="h2" mb={4} textAlign="center">Welcome to Barbella!</Typography>
      <Typography variant="h5" mb={4} textAlign="center" maxWidth="800px">
        The platform designed to help you achieve the best version of yourself and guide you towards an improved lifestyle.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenChat}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          borderRadius: '24px',
          padding: '8px 16px',
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
          zIndex: 1300,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            outline: 'none',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <ChatInterface onClose={handleCloseChat} />
        </Box>
      </Modal>
    </Box>
  );
}