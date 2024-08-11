import { useState, useRef, useEffect } from 'react';
import { Box, Button, Stack, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';

export default function ChatInterface({ onClose }) {
  console.log('ChatInterface component rendered');
  console.log('ChatInterface props:', { onClose });

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Simulate AI sending the initial message
    const initialMessage = {
      role: 'assistant',
      content: "Hi, I'm Barbella, your personal fitness and wellness assistant. How can I help you today?"
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    const newMessages = [
      ...messages,
      { role: 'user', content: message },
    ];

    setMessages(newMessages);
    setMessage(''); // This line clears the input field after sending the message

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessages),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: `Error: ${error.message}. Please try again.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      width="400px"
      height="600px"
      bgcolor="background.paper"
      borderRadius={2}
      boxShadow={3}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Box display="flex" justifyContent="flex-end" p={1} bgcolor="grey.200">
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>
      <Stack
        direction="column"
        spacing={2}
        flexGrow={1}
        overflow="auto"
        p={2}
        sx={{
          '&::-webkit-scrollbar': {
            width: '0.4em'
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
          }
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            alignSelf={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            bgcolor={message.role === 'assistant' ? '#2196f3' : '#e91e63'}
            color="white"
            borderRadius={2}
            p={1}
            maxWidth="80%"
          >
            {message.role === 'assistant' ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              message.content
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Stack>
      <Box p={2} bgcolor="grey.100">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
                sx={{ bgcolor: '#e91e63', '&:hover': { bgcolor: '#ad1457' } }}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            ),
            style: { color: 'black' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
            '& .MuiInputBase-input': {
              color: 'black',
              '&::placeholder': {
                color: 'black',
                opacity: 0.7,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}