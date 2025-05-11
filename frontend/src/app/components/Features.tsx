'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaRobot, FaCode, FaChartLine, FaShieldAlt, FaUsers, FaBook } from 'react-icons/fa';

const MotionBox = motion(Box);

const features = [
  {
    title: 'AI-Powered Analysis',
    description: 'Get intelligent insights about any GitHub repository using advanced AI technology.',
    icon: FaRobot,
    color: 'brand.500',
  },
  {
    title: 'Code Understanding',
    description: 'Understand complex codebases with our AI assistant that explains code structure and patterns.',
    icon: FaCode,
    color: 'accent.500',
  },
  {
    title: 'Smart Recommendations',
    description: 'Receive personalized recommendations for improving your repository.',
    icon: FaChartLine,
    color: 'brand.400',
  },
  {
    title: 'Security Analysis',
    description: 'Identify potential security vulnerabilities and get suggestions for improvement.',
    icon: FaShieldAlt,
    color: 'accent.400',
  },
  {
    title: 'Community Insights',
    description: 'Understand community engagement and contribution patterns.',
    icon: FaUsers,
    color: 'brand.300',
  },
  {
    title: 'Documentation Analysis',
    description: 'Get insights about documentation quality and coverage.',
    icon: FaBook,
    color: 'accent.300',
  },
];

const Features = () => {
  return (
    <Box py={20} bg="black" opacity={0.8}>
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
                Powerful Features
              </Heading>
            </MotionBox>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Text fontSize="xl" color="whiteAlpha.800" maxW="2xl">
                Everything you need to understand and improve your GitHub repositories
              </Text>
            </MotionBox>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  bg="rgba(0, 0, 0, 0.5)"
                  backdropFilter="blur(10px)"
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                  borderRadius="xl"
                  p={8}
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  }}
                  transition="all 0.3s"
                >
                  <VStack align="start" spacing={4}>
                    <Icon as={feature.icon} w={8} h={8} color={feature.color} />
                    <Heading size="md" color="white">{feature.title}</Heading>
                    <Text color="whiteAlpha.800">{feature.description}</Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Features; 