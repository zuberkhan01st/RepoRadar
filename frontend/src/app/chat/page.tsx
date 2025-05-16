'use client';

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
  Code,
  useClipboard,
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
  FaSignOutAlt,
  FaFileCode,
  FaChartBar,
  FaQuestionCircle,
  FaCopy,
  FaCheck,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SiGithub } from 'react-icons/si';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { useState, useRef, useEffect } from 'react';

const MotionBox = motion(Box);

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'code' | 'text' | 'analysis';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { hasCopied, onCopy } = useClipboard('');

  // Load repo URL from localStorage
  useEffect(() => {
    const storedRepoUrl = localStorage.getItem('analyzedRepo');
    if (!storedRepoUrl) {
      router.push('/');
      return;
    }
    setRepoUrl(storedRepoUrl);
    const [owner, repo] = storedRepoUrl.split('/').slice(-2);
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm your AI assistant. I can help you analyze and understand the repository ${owner}/${repo}. What would you like to know?`,
        timestamp: new Date(),
        type: 'text',
      },
    ]);
  }, [router]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date(), type: 'text' },
    ]);

    // Add temporary thinking message
    const tempMsgId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempMsgId,
        role: 'assistant',
        content: 'Thinking...',
        timestamp: new Date(),
        type: 'text',
      },
    ]);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const response = await fetch('https://reporadar-03fy.onrender.com/user/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: userMessage, repoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response from AI');
      }

      const data = await response.json();

      // Clean up final response
      let finalResponse = data.message || 'No response from AI';
      try {
        const parsed = JSON.parse(finalResponse);
        if (parsed.response) finalResponse = parsed.response;
      } catch {}
      finalResponse = finalResponse.replace(/^\[Bot\]|\[Bot\]/g, '').trim();

      // Replace thinking message with real one
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== tempMsgId)
          .concat([
            {
              role: 'assistant',
              content: finalResponse,
              timestamp: new Date(),
              type: 'text',
            },
          ])
      );
    } catch (error: any) {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMsgId));
      toast({
        title: 'Error',
        description: error?.message || 'Failed to get response from AI',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const [owner, repo] = repoUrl.split('/').slice(-2);
    setMessages([
      {
        role: 'assistant',
        content: `Chat history cleared. How can I help you with ${owner}/${repo}?`,
        timestamp: new Date(),
        type: 'text',
      },
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('analyzedRepo');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    router.push('/');
  };

  const renderMessage = (message: Message) => {
    const isCodeBlock = message.content.includes('```');
    const isMarkdown = message.content.includes('*') || message.content.includes('#') || message.content.includes('`');

    if (isCodeBlock || isMarkdown) {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ className, children }) => {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <Box position="relative" w="full">
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                  <IconButton
                    aria-label="Copy code"
                    icon={hasCopied ? <FaCheck /> : <FaCopy />}
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => {
                      onCopy(String(children));
                      toast({
                        title: 'Copied!',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                      });
                    }}
                  />
                </Box>
              ) : (
                <Code>{children}</Code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      );
    }

    return <Text fontWeight="medium">{message.content}</Text>;
  };

  if (!repoUrl) return null;

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <Container maxW="container.xl" h="100vh" py={4} px={0}>
        <VStack h="full" spacing={4} px={4}>
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
              <Tooltip label="Logout">
                <IconButton
                  aria-label="Logout"
                  icon={<FaSignOutAlt />}
                  variant="ghost"
                  color="red.300"
                  _hover={{ bg: 'red.900' }}
                  onClick={handleLogout}
                />
              </Tooltip>

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
              </VStack>
            </HStack>
          </Box>

          {/* Chat Messages */}
          <Box
            flex={1}
            w="full"
            overflowY="auto"
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
            <VStack spacing={4} align="stretch" w="full">
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
                      align="flex-start"
                      gap={3}
                      w="full"
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
                        maxW={{ base: '90%', md: '80%', lg: '70%' }}
                        minW="120px"
                        bg={message.role === 'user' ? 'brand.500' : 'gray.800'}
                        color={message.role === 'user' ? 'white' : 'whiteAlpha.900'}
                        p={4}
                        borderRadius="lg"
                        boxShadow="lg"
                        borderWidth={1}
                        borderColor={message.role === 'user' ? 'brand.400' : 'whiteAlpha.200'}
                        overflow="hidden"
                      >
                        {renderMessage(message)}
                        <Text 
                          fontSize="xs" 
                          mt={2}
                          textAlign="right"
                          color={message.role === 'user' ? 'whiteAlpha.800' : 'whiteAlpha.500'}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Text>
                      </Box>
                      {message.role === 'user' && (
                        <Avatar size="sm" icon={<FaUser />} bg="gray.500" color="white" />
                      )}
                    </Flex>
                  </MotionBox>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          {/* Input Area */}
          <Box w="full" p={4} borderTopWidth={1} borderColor="whiteAlpha.200" bg="gray.800">
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
          <ModalBody pb={6}></ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}