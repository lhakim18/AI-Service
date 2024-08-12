import { useState, useRef, useEffect } from 'react';
import { Box, Button, Stack, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import { handleUserMessage } from '../utils/chatUtils';

export default function ChatInterface({ onClose }) {
  console.log('ChatInterface component rendered');
  console.log('ChatInterface props:', { onClose });

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    // Simulate AI sending the initial message
    const initialMessage = {
      role: 'assistant',
      content: "Hi, I'm Barbella, your personal fitness and wellness assistant. I can help you with workout plans, nutrition advice, and even find local fitness events. Just ask me to 'find [event type] events near [location]'!"
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
      const response = await handleUserMessage(message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: response },
      ]);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: `Error: ${error.message}. Please try again.` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatWorkout = (content) => {
    if (content.includes('| Exercise | Sets | Reps |')) {
      const rows = content.split('\n');
      const headers = rows[0].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
      const data = rows.slice(2).map(row => row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim()));

      return (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
    return <ReactMarkdown>{content}</ReactMarkdown>;
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
            {message.role === 'assistant' ? formatWorkout(message.content) : message.content}
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