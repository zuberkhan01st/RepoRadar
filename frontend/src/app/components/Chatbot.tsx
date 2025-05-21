'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  Flex,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  repoUrl: string | null;
}

const Chatbot = ({ repoUrl }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (repoUrl) {
      // Add initial message when repo is analyzed
      setMessages([
        {
          role: 'assistant',
          content: `I've analyzed the repository at ${repoUrl}. What would you like to know about it?`,
        },
      ]);
    }
  }, [repoUrl]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !repoUrl) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {      const response = await fetch('https://reporadar-03fy.onrender.com/users/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question: userMessage,
          repoUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to get response from AI',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box h="full" display="flex" flexDirection="column">
      <VStack
        flex={1}
        overflowY="auto"
        spacing={4}
        p={4}
        alignItems="stretch"
      >
        {messages.map((message, index) => (
          <Flex
            key={index}
            justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
          >
            <Box
              maxW="80%"
              bg={message.role === 'user' ? 'brand.500' : 'whiteAlpha.200'}
              color={message.role === 'user' ? 'white' : 'whiteAlpha.900'}
              p={3}
              borderRadius="lg"
            >
              <Text>{message.content}</Text>
            </Box>
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      <Box p={4} borderTopWidth={1} borderColor="whiteAlpha.200">
        <form onSubmit={handleSubmit}>
          <Flex>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the repository..."
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.200"
              color="white"
              _hover={{ borderColor: 'brand.500' }}
              _focus={{ borderColor: 'brand.500' }}
              mr={2}
            />
            <IconButton
              type="submit"
              aria-label="Send message"
              icon={<FaPaperPlane />}
              colorScheme="brand"
              isLoading={isLoading}
            />
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default Chatbot; 