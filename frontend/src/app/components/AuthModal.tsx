'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toast = useToast();

  const validateForm = (type: 'login' | 'signup') => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (type === 'signup' && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (type === 'signup' && !name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    
    if (!validateForm(type)) {
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          type === 'login' 
            ? { email, password }
            : { email, password, name }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${type}`);
      }

      // Handle successful auth
      onClose();
      toast({
        title: 'Success',
        description: type === 'login' ? 'Logged in successfully!' : 'Account created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || `An error occurred during ${type}`,
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
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Welcome to RepoRadar</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs variant="soft-rounded" colorScheme="brand">
            <TabList mb={4}>
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4} as="form" onSubmit={(e) => handleSubmit(e, 'login')}>
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    width="full"
                    isLoading={isLoading}
                  >
                    Login
                  </Button>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4} as="form" onSubmit={(e) => handleSubmit(e, 'signup')}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    width="full"
                    isLoading={isLoading}
                  >
                    Sign Up
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 