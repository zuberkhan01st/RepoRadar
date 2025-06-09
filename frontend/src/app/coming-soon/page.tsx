'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Input,
  HStack,
  useToast,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaRocket, FaCrown, FaBell, FaHome } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

const ComingSoon = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const router = useRouter();

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Here you would typically save the email to a waitlist
    toast({
      title: 'Success!',
      description: 'You\'ll be notified when premium plans are available!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setEmail('');
  };  return (
    <Box minH="100vh" bg="black">
      <Container maxW="container.md" py={10}>
        <HStack justify="space-between" mb={6}>
          <IconButton
            aria-label="Back to Home"
            icon={<FaHome />}
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            onClick={() => router.push('/')}
          />
        </HStack>
        <Box display="flex" alignItems="center" justifyContent="center" minH="80vh">
          <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          textAlign="center"
        >
          <VStack spacing={8}>
            <Box>
              <Icon as={FaRocket} w={20} h={20} color="brand.400" mb={6} />
              <Heading
                size="3xl"
                bgGradient="linear(to-r, brand.400, accent.400)"
                bgClip="text"
                mb={4}
              >
                Premium Plans Coming Soon!
              </Heading>
              <Text fontSize="xl" color="whiteAlpha.800" maxW="2xl" mx="auto">
                We're working hard to bring you advanced features and premium subscriptions. 
                Get ready for enhanced repository analysis, priority support, and much more!
              </Text>
            </Box>

            <Box bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)" borderRadius="xl" p={8} w="full">
              <VStack spacing={6}>
                <Heading size="lg" color="white">
                  What's Coming?
                </Heading>
                
                <HStack spacing={8} justify="center" wrap="wrap">
                  <VStack spacing={3} align="center" minW="200px">
                    <Icon as={FaRocket} w={8} h={8} color="purple.400" />
                    <Text color="white" fontWeight="bold">Pro Plan</Text>
                    <Text color="whiteAlpha.700" textAlign="center" fontSize="sm">
                      Advanced analytics, unlimited repos, priority support
                    </Text>
                  </VStack>
                  
                  <VStack spacing={3} align="center" minW="200px">
                    <Icon as={FaCrown} w={8} h={8} color="yellow.400" />
                    <Text color="white" fontWeight="bold">Enterprise Plan</Text>
                    <Text color="whiteAlpha.700" textAlign="center" fontSize="sm">
                      Custom AI training, API access, dedicated support
                    </Text>
                  </VStack>
                </HStack>

                <Box w="full" maxW="md" mt={8}>
                  <form onSubmit={handleNotifyMe}>
                    <VStack spacing={4}>
                      <Heading size="md" color="white">
                        <Icon as={FaBell} w={5} h={5} mr={2} />
                        Get Notified
                      </Heading>
                      <Text color="whiteAlpha.700" textAlign="center">
                        Be the first to know when premium plans are available
                      </Text>
                      <HStack w="full">
                        <Input
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          bg="rgba(255, 255, 255, 0.1)"
                          border="1px solid"
                          borderColor="whiteAlpha.300"
                          color="white"
                          _placeholder={{ color: 'whiteAlpha.600' }}
                          _focus={{
                            borderColor: 'brand.400',
                            boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
                          }}
                        />
                        <Button
                          type="submit"
                          colorScheme="brand"
                          px={8}
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                          }}
                        >
                          Notify Me
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                </Box>
              </VStack>
            </Box>

            <VStack spacing={4}>
              <Text color="whiteAlpha.600">
                In the meantime, enjoy our free tier!
              </Text>
              <Button
                variant="outline"
                colorScheme="brand"
                onClick={() => router.push('/')}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                Back to Home
              </Button>            </VStack>
          </VStack>
        </MotionBox>
        </Box>
      </Container>
    </Box>
  );
};

export default ComingSoon;
