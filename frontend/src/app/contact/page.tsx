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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

const Contact = () => {
  const router = useRouter();

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
                        support@reporadar.com
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
                    </VStack>
                  </HStack>

                </VStack>

                <Box textAlign="center" mt={8} pt={6} borderTop="1px solid" borderColor="whiteAlpha.200">
                  <Text color="whiteAlpha.700" fontSize="sm">
                    We typically respond within 24 hours during business days.
                  </Text>
                </Box>              </VStack>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Contact;
