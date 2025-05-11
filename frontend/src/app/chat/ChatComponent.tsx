'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  Input,
  Text,
  Flex,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { FaGithub, FaPaperPlane } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get('repo');

  useEffect(() => {
    if (repoUrl) {
      setMessages([
        {
          role: 'assistant',
          content: `I'm ready to help you analyze ${repoUrl}. What would you like to know about this repository?`,
        },
      ]);
    }
  }, [repoUrl]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !repoUrl) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Please enter a question and make sure a repository is selected.',
        },
      ]);
      return;
    }
  
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
  
    try {
      console.log('Sending request with:', { question: userMessage, repoUrl });
      const response = await fetch(`${API_URL}/user/chat`, {
        method: 'POST', // Changed to POST
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage,
          repoUrl: repoUrl,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
  
      if (!data.message) {
        throw new Error('Invalid response format from server');
      }
  
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            error instanceof Error
              ? `Error: ${error.message}`
              : 'Sorry, there was an error processing your request. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!repoUrl) {
    return (
      <Container maxW="container.xl" minH="100vh" py={20}>
        <VStack gap={4}>
          <Heading>No Repository Selected</Heading>
          <Text>Please go back and select a repository to analyze.</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" minH="100vh" py={8}>
      <VStack h="full" gap={4}>
        <Flex w="full" align="center" gap={2} mb={4}>
          <Icon as={FaGithub} w={6} h={6} color="brand.500" />
          <Text fontSize="lg" fontWeight="bold">
            {repoUrl}
          </Text>
        </Flex>

        <Box
          w="full"
          flex={1}
          overflowY="auto"
          bg="gray.800"
          borderRadius="lg"
          p={4}
        >
          <VStack gap={4} align="stretch">
            {messages.map((message, index) => (
              <Flex
                key={index}
                justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="70%"
                  bg={message.role === 'user' ? 'brand.500' : 'gray.700'}
                  color="white"
                  p={3}
                  borderRadius="lg"
                >
                  <Text>{message.content}</Text>
                </Box>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        <Box w="full" as="form" onSubmit={handleSubmit}>
          <Flex gap={2}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the repository..."
              bg="gray.700"
              borderColor="gray.600"
              _hover={{ borderColor: 'brand.500' }}
              _focus={{ borderColor: 'brand.500' }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: '#0ea5e9',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <FaPaperPlane />
            </button>
          </Flex>
        </Box>
      </VStack>
    </Container>
  );
} 