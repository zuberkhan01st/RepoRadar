'use client';

import {
  Box,
  Container,
  HStack,
  Icon,
  Heading,
  Spacer,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGithub, FaHome, FaBars } from 'react-icons/fa';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

interface NavigationProps {
  transparent?: boolean;
}

const Navigation = ({ transparent = false }: NavigationProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={transparent ? 'rgba(0, 0, 0, 0.8)' : 'black'}
      backdropFilter="blur(10px)"
      borderBottomWidth="1px"
      borderColor="whiteAlpha.200"
    >
      <Container maxW="container.xl" py={4}>
        <HStack spacing={8}>
          {/* Logo */}
          <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
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
          </Link>

          <Spacer />

          {/* Desktop Navigation */}
          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            <Link as={NextLink} href="/" color="whiteAlpha.800" _hover={{ color: 'brand.400' }}>
              Home
            </Link>
            <Link href="#features" color="whiteAlpha.800" _hover={{ color: 'brand.400' }}>
              Features
            </Link>
            <Link href="#pricing" color="whiteAlpha.800" _hover={{ color: 'brand.400' }}>
              Pricing
            </Link>
            <Link as={NextLink} href="/contact" color="whiteAlpha.800" _hover={{ color: 'brand.400' }}>
              Contact
            </Link>
            <Button
              as={NextLink}
              href="/login"
              variant="outline"
              colorScheme="brand"
              size="sm"
            >
              Login
            </Button>
            <Button
              as={NextLink}
              href="/signup"
              colorScheme="brand"
              size="sm"
            >
              Sign Up
            </Button>
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Open menu"
            icon={<FaBars />}
            variant="ghost"
            color="white"
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
          />
        </HStack>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900">
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
            <HStack spacing={2}>
              <Icon as={FaGithub} w={5} h={5} color="brand.500" />
              <Heading size="md" color="white">
                RepoRadar
              </Heading>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="stretch" mt={6}>
              <Link as={NextLink} href="/" color="white" _hover={{ color: 'brand.400' }} onClick={onClose}>
                Home
              </Link>
              <Link href="#features" color="white" _hover={{ color: 'brand.400' }} onClick={onClose}>
                Features
              </Link>
              <Link href="#pricing" color="white" _hover={{ color: 'brand.400' }} onClick={onClose}>
                Pricing
              </Link>
              <Link as={NextLink} href="/contact" color="white" _hover={{ color: 'brand.400' }} onClick={onClose}>
                Contact
              </Link>
              <Button
                as={NextLink}
                href="/login"
                variant="outline"
                colorScheme="brand"
                onClick={onClose}
              >
                Login
              </Button>
              <Button
                as={NextLink}
                href="/signup"
                colorScheme="brand"
                onClick={onClose}
              >
                Sign Up
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navigation;
