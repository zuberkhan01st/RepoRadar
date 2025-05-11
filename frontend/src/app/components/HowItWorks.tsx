'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaRobot, FaCode, FaDatabase, FaBrain, FaArrowRight } from 'react-icons/fa';

const MotionBox = motion(Box);

const steps = [
  {
    title: 'Repository Analysis',
    description: 'Our AI analyzes your GitHub repository using advanced tools to understand its structure, contributors, and code patterns.',
    icon: FaCode,
    color: 'brand.500',
    position: 'left',
  },
  {
    title: 'Smart Tool Selection',
    description: 'The system automatically selects the most appropriate GitHub tools based on your questions, from repository info to commit history.',
    icon: FaRobot,
    color: 'accent.500',
    position: 'right',
  },
  {
    title: 'Data Processing',
    description: 'GitHub data is processed and formatted to provide meaningful insights about your repository.',
    icon: FaDatabase,
    color: 'brand.400',
    position: 'left',
  },
  {
    title: 'AI Response Generation',
    description: 'Our advanced AI generates accurate and contextual responses based on the repository data and chat history.',
    icon: FaBrain,
    color: 'accent.400',
    position: 'right',
  },
];

const HowItWorks = () => {
  return (
    <Box py={20} bg="black" opacity={0.8} position="relative">
      <Container maxW="container.xl">
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Heading
                size="2xl"
                bgGradient="linear(to-r, brand.400, accent.400)"
                bgClip="text"
              >
                How RepoRadar Works
              </Heading>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Text fontSize="xl" color="whiteAlpha.800" maxW="2xl">
                Our AI-powered system combines GitHub data with advanced language models to provide intelligent insights about your repositories
              </Text>
            </MotionBox>
          </VStack>

          <Box position="relative" w="full">
            {/* Center line */}
            <Box
              position="absolute"
              left="50%"
              top={0}
              bottom={0}
              w="2px"
              bg="whiteAlpha.200"
              transform="translateX(-50%)"
            />

            {steps.map((step, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, x: step.position === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                mb={12}
              >
                <Flex
                  justify={step.position === 'left' ? 'flex-start' : 'flex-end'}
                  align="center"
                  position="relative"
                >
                  {step.position === 'left' ? (
                    <>
                      <Box
                        bg="rgba(0, 0, 0, 0.5)"
                        backdropFilter="blur(10px)"
                        borderWidth="1px"
                        borderColor="whiteAlpha.200"
                        borderRadius="xl"
                        p={6}
                        maxW="md"
                        _hover={{
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        }}
                        transition="all 0.3s"
                      >
                        <VStack align="start" spacing={4}>
                          <Icon as={step.icon} w={8} h={8} color={step.color} />
                          <Heading size="md" color="white">{step.title}</Heading>
                          <Text color="whiteAlpha.800">{step.description}</Text>
                        </VStack>
                      </Box>
                      <Box
                        position="absolute"
                        left="calc(50% - 20px)"
                        top="50%"
                        transform="translateY(-50%)"
                        bg="brand.500"
                        borderRadius="full"
                        p={2}
                        zIndex={1}
                      >
                        <Icon as={FaArrowRight} color="white" />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        position="absolute"
                        right="calc(50% - 20px)"
                        top="50%"
                        transform="translateY(-50%)"
                        bg="accent.500"
                        borderRadius="full"
                        p={2}
                        zIndex={1}
                      >
                        <Icon as={FaArrowRight} color="white" transform="rotate(180deg)" />
                      </Box>
                      <Box
                        bg="rgba(0, 0, 0, 0.5)"
                        backdropFilter="blur(10px)"
                        borderWidth="1px"
                        borderColor="whiteAlpha.200"
                        borderRadius="xl"
                        p={6}
                        maxW="md"
                        _hover={{
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        }}
                        transition="all 0.3s"
                      >
                        <VStack align="start" spacing={4}>
                          <Icon as={step.icon} w={8} h={8} color={step.color} />
                          <Heading size="md" color="white">{step.title}</Heading>
                          <Text color="whiteAlpha.800">{step.description}</Text>
                        </VStack>
                      </Box>
                    </>
                  )}
                </Flex>
              </MotionBox>
            ))}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HowItWorks; 