'use client';

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  VStack,
  Text,
  Link,
  IconButton,
  useColorModeValue,
  Heading,
  HStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaDiscord, FaLinkedin, FaHeart } from 'react-icons/fa';
import NextLink from 'next/link';

const MotionBox = motion(Box);

const Footer = () => {
  return (
    <Box
      bg="linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 32, 44, 0.95) 100%)"
      color="whiteAlpha.800"
      borderTopWidth="3px"
      borderColor="brand.500"
      position="relative"
      zIndex={10}
      mt={20}
      boxShadow="0 -10px 40px rgba(0, 0, 0, 0.3)"
    >
      <Container as={Stack} maxW="container.xl" py={16}><SimpleGrid
          templateColumns={{
            base: '1fr',
            sm: '1fr 1fr',
            md: '2fr 1fr 1fr 1fr',
          }}
          spacing={10}
          mb={8}
        >          <Stack spacing={6}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <HStack spacing={2}>
                <Icon as={FaGithub} w={8} h={8} color="brand.500" />
                <Heading
                  size="xl"
                  bgGradient="linear(to-r, brand.400, accent.400)"
                  bgClip="text"
                >
                  RepoRadar
                </Heading>
              </HStack>
            </MotionBox>
            <Text fontSize="md" lineHeight="1.8" maxW="md">
              Your AI-powered GitHub repository analysis tool. Get instant insights,
              understand codebases, and make better decisions with advanced analytics.
            </Text>            <Stack direction="row" spacing={6}>
              <MotionBox whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  aria-label="GitHub"
                  icon={<FaGithub />}
                  variant="ghost"
                  color="white"
                  size="lg"
                  _hover={{ bg: 'brand.500', color: 'white' }}
                  as={Link}
                  href="https://github.com/zuberkhan01st"
                  isExternal
                />
              </MotionBox>
              <MotionBox whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  aria-label="Twitter"
                  icon={<FaTwitter />}
                  variant="ghost"
                  color="white"
                  size="lg"
                  _hover={{ bg: 'blue.500', color: 'white' }}
                  as={Link}
                  href="https://twitter.com/zuberkhan01st"
                  isExternal
                />
              </MotionBox>
              <MotionBox whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  aria-label="Discord"
                  icon={<FaDiscord />}
                  variant="ghost"
                  color="white"
                  size="lg"
                  _hover={{ bg: 'purple.500', color: 'white' }}
                />
              </MotionBox>
              <MotionBox whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  aria-label="LinkedIn"
                  icon={<FaLinkedin />}
                  variant="ghost"
                  color="white"
                  size="lg"
                  _hover={{ bg: 'blue.600', color: 'white' }}
                  as={Link}
                  href="https://linkedin.com/in/zuberkhan01st"
                  isExternal
                />
              </MotionBox>
            </Stack>
          </Stack>          <Stack align="flex-start" spacing={4}>
            <Heading size="md" color="white" mb={2}>Product</Heading>
            <VStack align="flex-start" spacing={3}>
              <Link href="#features" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Features</Link>
              <Link href="#pricing" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Pricing</Link>
              <Link href="#how-it-works" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">How It Works</Link>
              <Link href="#api" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">API</Link>
            </VStack>
          </Stack>
          <Stack align="flex-start" spacing={4}>
            <Heading size="md" color="white" mb={2}>Company</Heading>
            <VStack align="flex-start" spacing={3}>
              <Link href="#about" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">About</Link>
              <Link href="#blog" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Blog</Link>
              <Link href="#careers" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Careers</Link>
              <Link as={NextLink} href="/contact" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Contact</Link>
            </VStack>
          </Stack>
          <Stack align="flex-start" spacing={4}>
            <Heading size="md" color="white" mb={2}>Legal</Heading>            <VStack align="flex-start" spacing={3}>              <Link as={NextLink} href="/privacy" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Privacy Policy</Link>
              <Link as={NextLink} href="/terms" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Terms of Service</Link>
              <Link as={NextLink} href="/refund" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Refund Policy</Link>
              <Link href="#cookies" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">Cookie Policy</Link>
              <Link href="#gdpr" _hover={{ color: 'brand.400', textDecoration: 'none' }} fontSize="sm">GDPR</Link>
            </VStack>
          </Stack>
        </SimpleGrid>

        <Divider my={8} borderColor="brand.500" />        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          align={{ base: 'center', md: 'center' }}
          justify="space-between"
          py={4}
        >
          <Text fontSize="md" fontWeight="medium" color="white">
            © {new Date().getFullYear()} RepoRadar. All rights reserved.
          </Text>          <HStack spacing={6}>
            <Link 
              as={NextLink} 
              href="/privacy" 
              fontSize="sm" 
              _hover={{ color: 'brand.400', textDecoration: 'none' }}
              fontWeight="medium"
            >
              Privacy
            </Link>
            <Link 
              as={NextLink} 
              href="/terms" 
              fontSize="sm" 
              _hover={{ color: 'brand.400', textDecoration: 'none' }}
              fontWeight="medium"
            >
              Terms
            </Link>
            <Link 
              as={NextLink} 
              href="/refund" 
              fontSize="sm" 
              _hover={{ color: 'brand.400', textDecoration: 'none' }}
              fontWeight="medium"
            >
              Refunds
            </Link>
          </HStack>
        </Stack>

        <Box textAlign="center" mt={6} pt={6} borderTop="1px solid" borderColor="whiteAlpha.300">
          <Text fontSize="md" color="whiteAlpha.700" fontWeight="medium">
            Made with <Icon as={FaHeart} color="red.500" mx={1} /> by{' '}
            <Link 
              href="https://www.linkedin.com/in/zuber-khan-01st/" 
              isExternal 
              color="brand.400"
              _hover={{ color: 'brand.300', textDecoration: 'none' }}
              fontWeight="bold"
            >
              Zuber Khan
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 