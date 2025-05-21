'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
  IconButton,
  useDisclosure,
  Flex,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGithub, FaSearch, FaUser, FaRobot, FaFlask, FaComments } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import AnimatedBackground from './components/AnimatedBackground';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import SubscriptionPlans from './components/SubscriptionPlans';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('./components/Chatbot'), {
  ssr: false,
  loading: () => <Box p={4}>Loading chat...</Box>,
});

const MotionBox = motion(Box);

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [analyzedRepo, setAnalyzedRepo] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { 
    isOpen: isChatOpen, 
    onOpen: onChatOpen, 
    onClose: onChatClose 
  } = useDisclosure();

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a repository URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setShowOptions(false);
      return;
    }

    try {
      const gitHubRegex = /^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9\-]+)\/([a-zA-Z0-9\-._~!$&'()*+,;=:@/]+)/i;
      if (!gitHubRegex.test(repoUrl)) {
        throw new Error('Please enter a valid GitHub repository URL');
      }

      setShowOptions(true);
      setAnalyzedRepo(repoUrl);
      
      setTimeout(() => {
        const optionsElement = document.getElementById('repository-actions-container');
        if (optionsElement) {
          optionsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid GitHub repository URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setShowOptions(false);
    }
  };

  const handleAnalyzeRepository = () => {
    if (!analyzedRepo) return;
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('lastAction', 'analysis');
      localStorage.setItem('analyzedRepo', analyzedRepo);
      router.push('/login');
      return;
    }
    
    // Store the repo and redirect to analysis page
    localStorage.setItem('analyzedRepo', analyzedRepo);
    router.push('/analysis');
  };

  const handleChatWithRepo = () => {
    if (!analyzedRepo) return;
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('lastAction', 'chat');
      localStorage.setItem('analyzedRepo', analyzedRepo);
      router.push('/login');
      return;
    }
    
    router.push(`/chat?repo=${encodeURIComponent(analyzedRepo)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box minH="100vh" position="relative" overflow="hidden" cursor="none">
      <CustomCursor />
      <AnimatedBackground />
      
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <Flex justify="flex-end" py={4}>
          <HStack spacing={4}>
            <IconButton
              aria-label="Login"
              icon={<FaUser />}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => router.push('/login')}
            />

            {analyzedRepo && (
              <IconButton
                aria-label="Open Chat"
                icon={<FaRobot />}
                variant="ghost"
                color="white"
                onClick={onChatOpen}
                _hover={{ bg: 'whiteAlpha.200' }}
              />
            )}
          </HStack>
        </Flex>

        <VStack
          spacing={8}
          py={20}
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate={isPageLoaded ? 'visible' : 'hidden'}
        >
          <MotionBox variants={itemVariants}>
            <Heading
              size="4xl"
              textAlign="center"
              bgGradient="linear(to-r, brand.400, accent.400)"
              bgClip="text"
              fontWeight="extrabold"
            >
              RepoRadar
            </Heading>
          </MotionBox>

          <MotionBox variants={itemVariants}>
            <Text
              fontSize="2xl"
              textAlign="center"
              color="whiteAlpha.900"
              maxW="2xl"
            >
              Analyze any GitHub repository with AI and get instant insights
            </Text>
          </MotionBox>

          <MotionBox
            variants={itemVariants}
            w="full"
            maxW="2xl"
            as="form"
            onSubmit={handleSubmit}
          >
            <HStack spacing={4}>
              <Input
                placeholder="Enter GitHub repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                size="lg"
                bg="whiteAlpha.100"
                borderColor="whiteAlpha.200"
                color="white"
                _hover={{ borderColor: 'brand.500' }}
                _focus={{ borderColor: 'brand.500' }}
              />
              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                leftIcon={<FaSearch />}
              >
                Analyze
              </Button>
            </HStack>
          </MotionBox>

          {showOptions && analyzedRepo && (
            <MotionBox
              variants={itemVariants}
              w="full"
              maxW="2xl"
              mt={8}
              id="repository-actions-container"
              borderWidth={1}
              borderColor="whiteAlpha.200"
              borderRadius="lg"
              p={6}
              bg="whiteAlpha.50"
            >
              <VStack spacing={4}>
                <Text fontSize="lg" textAlign="center" color="whiteAlpha.900">
                  Choose an action for: 
                  <Text as="span" fontWeight="bold" color="brand.300" ml={2} display="block" whiteSpace="normal" wordBreak="break-all">
                    {analyzedRepo}
                  </Text>
                </Text>
                <HStack spacing={4} justify="center" w="full">
                  <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={handleAnalyzeRepository}
                    leftIcon={<FaFlask />}
                    flex={1}
                  >
                    Analyze Repository
                  </Button>
                  <Button
                    colorScheme="purple"
                    size="lg"
                    onClick={handleChatWithRepo}
                    leftIcon={<FaComments />}
                    flex={1}
                  >
                    Chat with Repo
                  </Button>
                </HStack>
              </VStack>
            </MotionBox>
          )}

          <MotionBox variants={itemVariants}>
            <HStack spacing={4} justify="center">
              <ChakraLink href="https://github.com/zuberkhan01st/RepoRadar" isExternal>
                <Button
                  leftIcon={<FaGithub />}
                  variant="outline"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  View on GitHub
                </Button>
              </ChakraLink>
            </HStack>
          </MotionBox>
        </VStack>

        <Features />
        <HowItWorks />
        <SubscriptionPlans />
      </Container>

      <Footer />
      
      <Drawer
        isOpen={isChatOpen}
        placement="right"
        onClose={onChatClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent bg="gray.900">
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
            <HStack>
              <Icon as={FaRobot} color="brand.500" />
              <Text color="white">RepoRadar AI Assistant</Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody p={0}>
            <Chatbot repoUrl={analyzedRepo} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}