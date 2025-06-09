'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  useColorModeValue,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';

const MotionBox = motion(Box);

const PrivacyPolicy = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
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
              Privacy Policy
            </Heading>

            <Box bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)" borderRadius="xl" p={8}>
              <VStack spacing={6} align="stretch">
                
                <Box>
                  <Text color="whiteAlpha.800" lineHeight="1.8" fontStyle="italic">
                    Last updated: {new Date().toLocaleDateString()}
                  </Text>
                </Box>

                <Box>
                  <Heading size="lg" color="white" mb={4}>
                    OVERVIEW
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    RepoRadar ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by RepoRadar when you use our website and services.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    By accessing or using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    INFORMATION WE COLLECT
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mb={3}>
                    We collect information you provide directly to us, such as when you:
                  </Text>
                  <Text color="whiteAlpha.700" lineHeight="1.8" ml={4}>
                    • Create an account or update your profile<br/>
                    • Submit GitHub repository URLs for analysis<br/>
                    • Contact us for support<br/>
                    • Subscribe to our services<br/>
                    • Participate in surveys or promotions
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    We also automatically collect certain information about your device when you use our Service, including your IP address, browser type, operating system, and usage patterns.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    HOW WE USE YOUR INFORMATION
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mb={3}>
                    We use the information we collect to:
                  </Text>
                  <Text color="whiteAlpha.700" lineHeight="1.8" ml={4}>
                    • Provide, maintain, and improve our services<br/>
                    • Process transactions and send related information<br/>
                    • Send technical notices and support messages<br/>
                    • Respond to your comments and questions<br/>
                    • Analyze usage patterns and trends<br/>
                    • Prevent fraud and enhance security
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    INFORMATION SHARING
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy. We may share your information in the following circumstances:
                  </Text>
                  <Text color="whiteAlpha.700" lineHeight="1.8" mt={3} ml={4}>
                    • With service providers who assist us in operating our website<br/>
                    • To comply with legal obligations<br/>
                    • To protect our rights and prevent fraud<br/>
                    • In connection with a business transfer or acquisition
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    DATA SECURITY
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    DATA RETENTION
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    YOUR RIGHTS
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. To exercise these rights, please contact us at the information provided below.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    COOKIES AND TRACKING
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We use cookies and similar tracking technologies to collect and track information about your use of our Service. You can control cookies through your browser settings.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    CHANGES TO THIS POLICY
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    CONTACT US
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </Text>                  <Text color="whiteAlpha.700" lineHeight="1.8" mt={2} ml={4}>
                    Email: zuberkhan01st@gmail.com<br/>
                    Address: Pune, Maharashtra, India
                  </Text>
                </Box>              </VStack>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
