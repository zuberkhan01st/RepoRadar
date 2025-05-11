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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGithub, FaSearch, FaUser, FaRobot } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import AnimatedBackground from './components/AnimatedBackground';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import SubscriptionPlans from './components/SubscriptionPlans';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CustomCursor from './components/CustomCursor';
import dynamic from 'next/dynamic';

const Chatbot = dynamic(() => import('./components/Chatbot'), {
  ssr: false,
  loading: () => <Box p={4}>Loading chat...</Box>,
});

const MotionBox = motion(Box);

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [analyzedRepo, setAnalyzedRepo] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    if (!repoUrl) {
      toast({
        title: 'Error',
        description: 'Please enter a repository URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze repository');
      }

      if (data.success) {
        // Store the repo URL in localStorage for the chat page
        localStorage.setItem('analyzedRepo', repoUrl);
        // Navigate to the chat page
        router.push('/chat');
      } else {
        throw new Error(data.error || 'Failed to analyze repository');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to analyze repository',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
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
            <IconButton
              aria-label="Login"
              icon={<FaUser />}
              variant="ghost"
              color="white"
              onClick={onOpen}
              _hover={{ bg: 'whiteAlpha.200' }}
            />
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
                isLoading={isLoading}
                leftIcon={<FaSearch />}
              >
                Analyze
              </Button>
            </HStack>
          </MotionBox>

          <MotionBox variants={itemVariants}>
            <HStack spacing={4} justify="center">
              <Button
                leftIcon={<FaGithub />}
                variant="outline"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                View on GitHub
              </Button>
            </HStack>
          </MotionBox>
        </VStack>

        <Features />
        <HowItWorks />
        <SubscriptionPlans />
      </Container>

      <Footer />
      <AuthModal isOpen={isOpen} onClose={onClose} />
      
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
