'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Input,
  Button,
  Text,
  Divider,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaGoogle } from 'react-icons/fa';

const MotionBox = motion(Box);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      
      toast({
        title: type === 'login' ? 'Logged in successfully' : 'Account created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(10px)"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        borderRadius="xl"
      >
        <ModalHeader color="white">Welcome to RepoRadar</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6}>
          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList mb={4}>
              <Tab color="white">Login</Tab>
              <Tab color="white">Sign Up</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4} as="form" onSubmit={(e) => handleSubmit(e, 'login')}>
                  <Input
                    placeholder="Email"
                    type="email"
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.200"
                    color="white"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500' }}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.200"
                    color="white"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500' }}
                  />
                  <Button
                    type="submit"
                    colorScheme="brand"
                    w="full"
                    isLoading={isLoading}
                  >
                    Login
                  </Button>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4} as="form" onSubmit={(e) => handleSubmit(e, 'signup')}>
                  <Input
                    placeholder="Full Name"
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.200"
                    color="white"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500' }}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.200"
                    color="white"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500' }}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.200"
                    color="white"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500' }}
                  />
                  <Button
                    type="submit"
                    colorScheme="brand"
                    w="full"
                    isLoading={isLoading}
                  >
                    Sign Up
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Divider my={6} borderColor="whiteAlpha.200" />

          <VStack spacing={4}>
            <Text color="whiteAlpha.800" fontSize="sm">
              Or continue with
            </Text>
            <Button
              w="full"
              leftIcon={<FaGithub />}
              bg="whiteAlpha.100"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Continue with GitHub
            </Button>
            <Button
              w="full"
              leftIcon={<FaGoogle />}
              bg="whiteAlpha.100"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Continue with Google
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal; 