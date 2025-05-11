'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Input,
  Text,
  Flex,
  useToast,
  IconButton,
  Heading,
  HStack,
  Avatar,
  Divider,
  Button,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaArrowLeft,
  FaCode,
  FaGithub,
  FaCog,
  FaLightbulb,
  FaHistory,
  FaTrash,
  FaFileCode,
  FaChartBar,
  FaQuestionCircle,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SiGithub } from 'react-icons/si';

const MotionBox = motion(Box);

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'code' | 'text' | 'analysis';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const repoUrl = localStorage.getItem('analyzedRepo') || '';

  useEffect(() => {
    // Add initial greeting message with repo info
    const [owner, repo] = repoUrl.split('/').slice(-2);
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm your AI assistant. I can help you analyze and understand the repository ${owner}/${repo}. What would you like to know?`,
        timestamp: new Date(),
        type: 'text',
      },
    ]);
  }, [repoUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date(), type: 'text' },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message, timestamp: new Date(), type: 'text' },
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

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat history cleared. How can I help you?",
        timestamp: new Date(),
        type: 'text',
      },
    ]);
  };

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <Container maxW="container.xl" h="100vh" py={4}>
        <VStack h="full" spacing={4}>
          {/* Header */}
          <Flex w="full" justify="space-between" align="center" py={2}>
            <HStack spacing={4}>
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Tooltip label="View Repository">
                <IconButton
                  aria-label="View Repository"
                  icon={<SiGithub />}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={() => window.open(repoUrl, '_blank')}
                />
              </Tooltip>
            </HStack>
            <Heading size="md" bgGradient="linear(to-r, brand.400, accent.400)" bgClip="text">
              RepoRadar AI Assistant
            </Heading>
            <HStack spacing={2}>
              <Tooltip label="Settings">
                <IconButton
                  aria-label="Settings"
                  icon={<FaCog />}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={onOpen}
                />
              </Tooltip>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaHistory />}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                />
                <MenuList bg="gray.800" borderColor="gray.700">
                  <MenuItem
                    icon={<FaTrash />}
                    _hover={{ bg: 'whiteAlpha.200' }}
                    onClick={clearChat}
                  >
                    Clear Chat
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          <Divider borderColor="whiteAlpha.200" />

          {/* Repository Info */}
          <Box
            w="full"
            p={4}
            bg="gray.800"
            borderRadius="lg"
            borderWidth={1}
            borderColor="whiteAlpha.200"
          >
            <HStack spacing={4} align="center">
              <Avatar
                size="md"
                icon={<SiGithub />}
                bg="gray.700"
                color="white"
              />
              <VStack align="start" spacing={1}>
                <HStack>
                  <Text fontSize="lg" fontWeight="bold">
                    {repoUrl.split('/').slice(-2).join('/')}
                  </Text>
                  <Tooltip label="View on GitHub">
                    <IconButton
                      aria-label="View on GitHub"
                      icon={<FaGithub />}
                      size="sm"
                      variant="ghost"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      onClick={() => window.open(repoUrl, '_blank')}
                    />
                  </Tooltip>
                </HStack>
                <HStack spacing={4}>
                  <HStack spacing={1}>
                    <FaFileCode />
                    <Text fontSize="sm" color="whiteAlpha.700">Code Analysis</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <FaChartBar />
                    <Text fontSize="sm" color="whiteAlpha.700">Repository Stats</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <FaLightbulb />
                    <Text fontSize="sm" color="whiteAlpha.700">AI Insights</Text>
                  </HStack>
                </HStack>
              </VStack>
            </HStack>
          </Box>

          {/* Chat Messages */}
          <VStack
            flex={1}
            w="full"
            overflowY="auto"
            spacing={4}
            px={4}
            py={2}
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
              },
            }}
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  w="full"
                >
                  <Flex
                    justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                    align="start"
                    gap={3}
                  >
                    {message.role === 'assistant' && (
                      <Avatar
                        size="sm"
                        icon={<FaRobot />}
                        bg="brand.500"
                        color="white"
                      />
                    )}
                    <Box
                      maxW="70%"
                      bg={message.role === 'user' ? 'brand.500' : 'gray.800'}
                      color={message.role === 'user' ? 'white' : 'whiteAlpha.900'}
                      p={4}
                      borderRadius="lg"
                      boxShadow="lg"
                      borderWidth={1}
                      borderColor={message.role === 'user' ? 'brand.400' : 'whiteAlpha.200'}
                    >
                      <HStack spacing={2} mb={2}>
                        {message.type === 'code' && <FaCode />}
                        {message.type === 'analysis' && <FaChartBar />}
                        <Text fontWeight="medium">{message.content}</Text>
                      </HStack>
                      <Text
                        fontSize="xs"
                        color={message.role === 'user' ? 'whiteAlpha.800' : 'whiteAlpha.500'}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </Box>
                    {message.role === 'user' && (
                      <Avatar
                        size="sm"
                        icon={<FaUser />}
                        bg="gray.500"
                        color="white"
                      />
                    )}
                  </Flex>
                </MotionBox>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </VStack>

          {/* Input Area */}
          <Box
            w="full"
            p={4}
            borderTopWidth={1}
            borderColor="whiteAlpha.200"
            bg="gray.800"
          >
            <form onSubmit={handleSubmit}>
              <Flex gap={2}>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about GitHub repositories..."
                  size="lg"
                  bg="gray.700"
                  color="white"
                  borderColor="whiteAlpha.200"
                  _hover={{ borderColor: 'brand.500' }}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                  }}
                />
                <IconButton
                  type="submit"
                  aria-label="Send message"
                  icon={<FaPaperPlane />}
                  colorScheme="brand"
                  size="lg"
                  isLoading={isLoading}
                />
              </Flex>
            </form>
          </Box>
        </VStack>
      </Container>

      {/* Settings Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Add settings options here */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 