'use client';

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  HStack,
  Divider,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
  Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AnimatedBackground from '../components/AnimatedBackground';

const MotionBox = motion(Box);

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (!acceptTerms) {
      throw new Error('Please accept the terms and conditions');
    }

    const response = await fetch('https://reporadar-03fy.onrender.com/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create account');
    }    // Show success toast
    toast({
      title: 'Success',
      description: 'Your account has been created successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Optionally redirect after a short delay
    setTimeout(() => {
      const lastAction = localStorage.getItem('lastAction');
      if (lastAction) {
        window.location.href = '/login'; // Redirect to login page with the last action preserved
      } else {
        window.location.href = '/login'; // Redirect to login page
      }
    }, 1500);

  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box minH="100vh" position="relative">
      <AnimatedBackground />
      
      <Container maxW="container.sm" py={20} position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8} align="stretch">
            <VStack spacing={4} textAlign="center">
              <Heading
                size="2xl"
                bgGradient="linear(to-r, brand.400, accent.400)"
                bgClip="text"
              >
                Create Account
              </Heading>
              <Text color="dark.300">
                Join RepoRadar and start analyzing repositories
              </Text>
            </VStack>

            <Box
              as="form"
              onSubmit={handleSubmit}
              bg="dark.800"
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              borderWidth="1px"
              borderColor="dark.700"
            >
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    bg="dark.700"
                    borderColor="dark.600"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    bg="dark.700"
                    borderColor="dark.600"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      bg="dark.700"
                      borderColor="dark.600"
                      _hover={{ borderColor: 'brand.500' }}
                      _focus={{ borderColor: 'brand.500' }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    bg="dark.700"
                    borderColor="dark.600"
                    _hover={{ borderColor: 'brand.500' }}
                    _focus={{ borderColor: 'brand.500' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <Checkbox
                    isChecked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    colorScheme="brand"
                  >
                    <Text color="dark.300" fontSize="sm">
                      I accept the{' '}
                      <Link href="/terms">
                        <Text as="span" color="brand.400">
                          Terms of Service
                        </Text>
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy">
                        <Text as="span" color="brand.400">
                          Privacy Policy
                        </Text>
                      </Link>
                    </Text>
                  </Checkbox>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                >
                  Create Account
                </Button>

                <HStack spacing={4} w="full">
                  <Divider borderColor="dark.600" />
                  <Text color="dark.400" fontSize="sm">OR</Text>
                  <Divider borderColor="dark.600" />
                </HStack>

                <HStack spacing={4} w="full">
                  <Button
                    variant="outline"
                    leftIcon={<Icon as={FaGithub} />}
                    flex={1}
                  >
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<Icon as={FaGoogle} />}
                    flex={1}
                  >
                    Google
                  </Button>
                </HStack>
              </VStack>
            </Box>

            <HStack justify="center" spacing={2}>
              <Text color="dark.400">Already have an account?</Text>
              <Link href="/login">
                <Button variant="link" color="brand.400">
                  Sign In
                </Button>
              </Link>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
} 