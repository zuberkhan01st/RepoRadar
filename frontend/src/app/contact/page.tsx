'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Link,
  useColorModeValue,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaHome, FaClock } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

const Contact = () => {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <Box minH="100vh" bg="black">
      <Container maxW="container.lg" py={10}>
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
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={8} align="stretch">
            <Heading
              size="2xl"
              textAlign="center"
              bgGradient="linear(to-r, brand.400, accent.400)"
              bgClip="text"
              mb={4}
            >
              Contact Us
            </Heading>

            <Box bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)" borderRadius="xl" p={8}>
              <VStack spacing={8} align="stretch">
                
                <Box textAlign="center">
                  <Text color="whiteAlpha.800" fontSize="lg" lineHeight="1.8">
                    Have questions about RepoRadar? We'd love to hear from you! 
                    Send us a message and we'll respond as soon as possible.
                  </Text>
                </Box>

                <VStack spacing={6} align="stretch">
                  
                  <HStack spacing={6} justify="center" wrap="wrap">
                    <VStack spacing={2} align="center" minW="250px">
                      <Icon as={FaEnvelope} w={8} h={8} color="brand.400" />
                      <Heading size="md" color="white">Email</Heading>
                      <Link href="mailto:support@reporadar.com" color="whiteAlpha.800" _hover={{ color: 'brand.400' }}>
                        zuberkhan01st@gmail.com
                      </Link>
                      <Text color="whiteAlpha.600" fontSize="sm" textAlign="center">
                        For general inquiries and support
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack spacing={6} justify="center" wrap="wrap" mt={8}>
                    <VStack spacing={2} align="center" minW="250px">
                      <Icon as={FaEnvelope} w={8} h={8} color="purple.400" />
                      <Heading size="md" color="white">Privacy & Legal</Heading>
                      <Link href="mailto:privacy@reporadar.com" color="whiteAlpha.800" _hover={{ color: 'brand.400' }}>
                        zuberkhan01st@gmail.com
                      </Link>
                      <Text color="whiteAlpha.600" fontSize="sm" textAlign="center">
                        For privacy and legal matters
                      </Text>
                    </VStack>                    <VStack spacing={2} align="center" minW="250px">
                      <Icon as={FaMapMarkerAlt} w={8} h={8} color="green.400" />
                      <Heading size="md" color="white">Location</Heading>
                      <Text color="whiteAlpha.800" textAlign="center">
                        Pune, Maharashtra<br />
                        India
                      </Text>
                      <Text color="whiteAlpha.600" fontSize="sm" textAlign="center">
                        Our headquarters
                      </Text>
                    </VStack>                  </HStack>
                  
                  <HStack spacing={6} justify="center" wrap="wrap" mt={8}>
                    <VStack spacing={2} align="center" minW="250px">
                      <Icon as={FaPhone} w={8} h={8} color="blue.400" />
                      <Heading size="md" color="white">Phone</Heading>
                      <Link href="tel:+919876543210" color="whiteAlpha.800" _hover={{ color: 'brand.400' }}>
                        +91 8767174206
                      </Link>
                      <Text color="whiteAlpha.600" fontSize="sm" textAlign="center">
                        Mon-Fri, 9:00 AM - 6:00 PM IST
                      </Text>
                    </VStack>
                    
                    <VStack spacing={2} align="center" minW="250px">
                      <Icon as={FaClock} w={8} h={8} color="yellow.400" />
                      <Heading size="md" color="white">Business Hours</Heading>
                      <Text color="whiteAlpha.800" textAlign="center">
                        Monday - Friday<br />
                        9:00 AM - 6:00 PM IST
                      </Text>
                      <Text color="whiteAlpha.600" fontSize="sm" textAlign="center">
                        Closed on weekends & holidays
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>

                <Box 
                  bg="rgba(255, 255, 255, 0.03)" 
                  borderRadius="xl" 
                  p={8} 
                  mt={10} 
                  borderWidth="1px" 
                  borderColor="whiteAlpha.200"
                >
                  <VStack as="form" onSubmit={handleSubmit} spacing={6}>
                    <Heading size="md" color="white">Send us a message</Heading>
                    
                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.800">Name</FormLabel>
                      <Input 
                        placeholder="Your name"
                        bg="whiteAlpha.100"
                        border="none"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        _hover={{ bg: 'whiteAlpha.200' }}
                        _focus={{ bg: 'whiteAlpha.200', borderColor: 'brand.400' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.800">Email</FormLabel>
                      <Input 
                        type="email"
                        placeholder="your.email@example.com"
                        bg="whiteAlpha.100"
                        border="none"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        _hover={{ bg: 'whiteAlpha.200' }}
                        _focus={{ bg: 'whiteAlpha.200', borderColor: 'brand.400' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel color="whiteAlpha.800">Subject</FormLabel>
                      <Input 
                        placeholder="What is this regarding?"
                        bg="whiteAlpha.100"
                        border="none"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        _hover={{ bg: 'whiteAlpha.200' }}
                        _focus={{ bg: 'whiteAlpha.200', borderColor: 'brand.400' }}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel color="whiteAlpha.800">Message</FormLabel>
                      <Textarea 
                        placeholder="Your message"
                        bg="whiteAlpha.100"
                        border="none"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.400' }}
                        _hover={{ bg: 'whiteAlpha.200' }}
                        _focus={{ bg: 'whiteAlpha.200', borderColor: 'brand.400' }}
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </FormControl>
                    
                    <Button 
                      type="submit" 
                      colorScheme="brand" 
                      alignSelf="flex-start"
                      isLoading={isSubmitting}
                      loadingText="Sending"
                    >
                      Send Message
                    </Button>
                  </VStack>
                </Box>

                <Box textAlign="center" mt={8} pt={6} borderTop="1px solid" borderColor="whiteAlpha.200">
                  <Text color="whiteAlpha.700" fontSize="sm">
                    We typically respond within 24 hours during business days.
                  </Text>
                  <Text color="whiteAlpha.700" fontSize="sm" mt={2}>
                    For urgent inquiries, please call our customer support line.
                  </Text>
                </Box></VStack>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Contact;
