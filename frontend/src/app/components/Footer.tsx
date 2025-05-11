'use client';

import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  Icon,
  HStack,
  VStack,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      bg="black"
      color="whiteAlpha.800"
      borderTop="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Container maxW="container.xl" py={10}>
        <Stack spacing={8} direction={{ base: 'column', md: 'row' }} justify="space-between">
          <VStack align="start" spacing={4}>
            <HStack spacing={2}>
              <Icon as={FaGithub} w={6} h={6} color="brand.500" />
              <Text fontSize="lg" fontWeight="bold">RepoRadar</Text>
            </HStack>
            <Text maxW="300px" fontSize="sm">
              Your AI-powered GitHub repository analysis tool. Get instant insights, understand codebases, and make better decisions.
            </Text>
          </VStack>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={8}>
            <VStack align="start" spacing={4}>
              <Text fontWeight="bold">Product</Text>
              <Link href="/features" _hover={{ color: 'brand.500' }}>Features</Link>
              <Link href="/pricing" _hover={{ color: 'brand.500' }}>Pricing</Link>
              <Link href="/docs" _hover={{ color: 'brand.500' }}>Documentation</Link>
            </VStack>

            <VStack align="start" spacing={4}>
              <Text fontWeight="bold">Company</Text>
              <Link href="/about" _hover={{ color: 'brand.500' }}>About</Link>
              <Link href="/blog" _hover={{ color: 'brand.500' }}>Blog</Link>
              <Link href="/careers" _hover={{ color: 'brand.500' }}>Careers</Link>
            </VStack>

            <VStack align="start" spacing={4}>
              <Text fontWeight="bold">Connect</Text>
              <Link href="https://github.com/zuberkhan01st" isExternal _hover={{ color: 'brand.500' }}>
                <HStack spacing={2}>
                  <Icon as={FaGithub} />
                  <Text>GitHub</Text>
                </HStack>
              </Link>
              <Link href="https://twitter.com/zuberkhan01st" isExternal _hover={{ color: 'brand.500' }}>
                <HStack spacing={2}>
                  <Icon as={FaTwitter} />
                  <Text>Twitter</Text>
                </HStack>
              </Link>
              <Link href="https://linkedin.com/in/zuberkhan01st" isExternal _hover={{ color: 'brand.500' }}>
                <HStack spacing={2}>
                  <Icon as={FaLinkedin} />
                  <Text>LinkedIn</Text>
                </HStack>
              </Link>
            </VStack>
          </Stack>
        </Stack>

        <Divider my={8} borderColor="whiteAlpha.200" />

        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          align={{ base: 'center', md: 'center' }}
          justify="space-between"
        >
          <Text fontSize="sm">
            © {new Date().getFullYear()} RepoRadar. All rights reserved.
          </Text>
          <HStack spacing={4}>
            <Link href="/privacy" fontSize="sm" _hover={{ color: 'brand.500' }}>Privacy Policy</Link>
            <Link href="/terms" fontSize="sm" _hover={{ color: 'brand.500' }}>Terms of Service</Link>
          </HStack>
        </Stack>

        <Box textAlign="center" mt={8}>
          <Text fontSize="sm" color="whiteAlpha.600">
            Made with <Icon as={FaHeart} color="red.500" mx={1} /> by{' '}
            <Link href="https://github.com/zuberkhan01st" isExternal color="brand.500">
              Zuber Khan
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 