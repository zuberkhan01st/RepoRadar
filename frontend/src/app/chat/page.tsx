'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Box, Container, VStack, Text, Heading } from '@chakra-ui/react';

// Dynamically import the chat component with no SSR
const ChatComponent = dynamic(() => import('./ChatComponent'), {
  ssr: false,
  loading: () => (
    <Container maxW="container.xl" minH="100vh" py={20}>
      <VStack gap={4}>
        <Heading>Loading...</Heading>
        <Text>Please wait while we prepare the chat interface.</Text>
      </VStack>
    </Container>
  ),
});

export default function Chat() {
  return (
    <Suspense
      fallback={
        <Container maxW="container.xl" minH="100vh" py={20}>
          <VStack gap={4}>
            <Heading>Loading...</Heading>
            <Text>Please wait while we prepare the chat interface.</Text>
          </VStack>
        </Container>
      }
    >
      <ChatComponent />
    </Suspense>
  );
} 