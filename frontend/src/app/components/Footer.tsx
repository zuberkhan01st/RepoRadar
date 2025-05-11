'use client';

import {
  Box,
  Container,
  SimpleGrid,
  Stack,
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

const MotionBox = motion(Box);

const Footer = () => {
  return (
    <Box
      bg="black"
      color="whiteAlpha.800"
      borderTopWidth="1px"
      borderColor="whiteAlpha.200"
    >
      <Container as={Stack} maxW="container.xl" py={10}>
        <SimpleGrid
          templateColumns={{
            base: '1fr',
            sm: '1fr 1fr',
            md: '2fr 1fr 1fr 1fr',
          }}
          spacing={8}
        >
          <Stack spacing={6}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <HStack spacing={2}>
                <Icon as={FaGithub} w={6} h={6} color="brand.500" />
                <Heading
                  size="lg"
                  bgGradient="linear(to-r, brand.400, accent.400)"
                  bgClip="text"
                >
                  RepoRadar
                </Heading>
              </HStack>
            </MotionBox>
            <Text fontSize="sm">
              Your AI-powered GitHub repository analysis tool. Get instant insights,
              understand codebases, and make better decisions.
            </Text>
            <Stack direction="row" spacing={6}>
              <IconButton
                aria-label="GitHub"
                icon={<FaGithub />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                as={Link}
                href="https://github.com/zuberkhan01st"
                isExternal
              />
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                as={Link}
                href="https://twitter.com/zuberkhan01st"
                isExternal
              />
              <IconButton
                aria-label="Discord"
                icon={<FaDiscord />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
              />
              <IconButton
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                as={Link}
                href="https://linkedin.com/in/zuberkhan01st"
                isExternal
              />
            </Stack>
          </Stack>
          <Stack align="flex-start">
            <Heading size="sm" color="white">Product</Heading>
            <Link href="#features" _hover={{ color: 'brand.400' }}>Features</Link>
            <Link href="#pricing" _hover={{ color: 'brand.400' }}>Pricing</Link>
            <Link href="#how-it-works" _hover={{ color: 'brand.400' }}>How It Works</Link>
            <Link href="#api" _hover={{ color: 'brand.400' }}>API</Link>
          </Stack>
          <Stack align="flex-start">
            <Heading size="sm" color="white">Company</Heading>
            <Link href="#about" _hover={{ color: 'brand.400' }}>About</Link>
            <Link href="#blog" _hover={{ color: 'brand.400' }}>Blog</Link>
            <Link href="#careers" _hover={{ color: 'brand.400' }}>Careers</Link>
            <Link href="#contact" _hover={{ color: 'brand.400' }}>Contact</Link>
          </Stack>
          <Stack align="flex-start">
            <Heading size="sm" color="white">Legal</Heading>
            <Link href="#privacy" _hover={{ color: 'brand.400' }}>Privacy Policy</Link>
            <Link href="#terms" _hover={{ color: 'brand.400' }}>Terms of Service</Link>
            <Link href="#cookies" _hover={{ color: 'brand.400' }}>Cookie Policy</Link>
            <Link href="#gdpr" _hover={{ color: 'brand.400' }}>GDPR</Link>
          </Stack>
        </SimpleGrid>

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
            <Link href="#privacy" fontSize="sm" _hover={{ color: 'brand.400' }}>Privacy</Link>
            <Link href="#terms" fontSize="sm" _hover={{ color: 'brand.400' }}>Terms</Link>
          </HStack>
        </Stack>

        <Box textAlign="center" mt={8}>
          <Text fontSize="sm" color="whiteAlpha.600">
            Made with <Icon as={FaHeart} color="red.500" mx={1} /> by{' '}
            <Link href="https://github.com/zuberkhan01st" isExternal color="brand.400">
              Zuber Khan
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 