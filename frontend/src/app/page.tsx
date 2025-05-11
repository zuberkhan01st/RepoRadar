'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FaGithub, FaArrowRight, FaRobot, FaCode, FaChartLine, FaShieldAlt, FaUsers, FaBook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';

const MotionBox = motion(Box);

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
      if (!githubUrlPattern.test(repoUrl)) {
        throw new Error('Please enter a valid GitHub repository URL');
      }

      router.push(`/chat?repo=${encodeURIComponent(repoUrl)}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!isPageLoaded) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="black"
      >
        <VStack spacing={4}>
          <Icon as={FaGithub} w={12} h={12} color="brand.500" />
          <Text color="white" fontSize="xl">Loading RepoRadar...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      <AnimatedBackground />
      
      {/* Content */}
      <Box position="relative" zIndex={1}>
        {/* Hero Section */}
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={4}
        >
          <Container maxW="container.xl">
            <VStack spacing={12} align="center" textAlign="center">
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Icon as={FaGithub} w={16} h={16} color="brand.500" mb={6} />
                <Heading
                  as="h1"
                  size="4xl"
                  bgGradient="linear(to-r, brand.400, accent.400)"
                  bgClip="text"
                  fontWeight="extrabold"
                  letterSpacing="tight"
                >
                  RepoRadar
                </Heading>
                <Text fontSize="2xl" color="white" maxW="3xl" mt={6}>
                  Your AI-powered GitHub repository analysis tool. Get instant insights, understand codebases, and make better decisions.
                </Text>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                w="full"
                maxW="3xl"
              >
                <Card bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(10px)" borderWidth="1px" borderColor="whiteAlpha.200">
                  <CardBody>
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={6}>
                        <InputGroup size="lg">
                          <Input
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="Enter GitHub repository URL (e.g., https://github.com/username/repo)"
                            bg="whiteAlpha.100"
                            borderColor="whiteAlpha.200"
                            _hover={{ borderColor: 'brand.500' }}
                            _focus={{ borderColor: 'brand.500' }}
                            color="white"
                            size="lg"
                          />
                          <InputRightElement width="6rem">
                            <Button
                              h="2.5rem"
                              size="md"
                              type="submit"
                              isLoading={isLoading}
                              colorScheme="brand"
                              rightIcon={<FaArrowRight />}
                            >
                              Analyze
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </VStack>
                    </form>
                  </CardBody>
                </Card>
              </MotionBox>

              {/* Stats Section */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full" maxW="4xl">
                <Stat
                  px={4}
                  py={5}
                  bg="rgba(0, 0, 0, 0.5)"
                  backdropFilter="blur(10px)"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                >
                  <StatLabel color="whiteAlpha.800">Repositories Analyzed</StatLabel>
                  <StatNumber color="brand.400">1,234</StatNumber>
                  <StatHelpText color="whiteAlpha.600">
                    <StatArrow type="increase" />
                    23% increase
                  </StatHelpText>
                </Stat>
                <Stat
                  px={4}
                  py={5}
                  bg="rgba(0, 0, 0, 0.5)"
                  backdropFilter="blur(10px)"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                >
                  <StatLabel color="whiteAlpha.800">Active Users</StatLabel>
                  <StatNumber color="accent.400">567</StatNumber>
                  <StatHelpText color="whiteAlpha.600">
                    <StatArrow type="increase" />
                    12% increase
                  </StatHelpText>
                </Stat>
                <Stat
                  px={4}
                  py={5}
                  bg="rgba(0, 0, 0, 0.5)"
                  backdropFilter="blur(10px)"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                >
                  <StatLabel color="whiteAlpha.800">Success Rate</StatLabel>
                  <StatNumber color="accent.500">98.5%</StatNumber>
                  <StatHelpText color="whiteAlpha.600">
                    <StatArrow type="increase" />
                    0.5% increase
                  </StatHelpText>
                </Stat>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* Features Section */}
        <Box py={20} bg="black" opacity={0.8}>
          <Container maxW="container.xl">
            <VStack spacing={16}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  size="2xl"
                  bgGradient="linear(to-r, brand.400, accent.400)"
                  bgClip="text"
                >
                  Powerful Features
                </Heading>
                <Text fontSize="xl" color="whiteAlpha.800" maxW="2xl">
                  Everything you need to understand and improve your GitHub repositories
                </Text>
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
                    <Card
                      bg="rgba(0, 0, 0, 0.5)"
                      backdropFilter="blur(10px)"
                      borderWidth="1px"
                      borderColor="whiteAlpha.200"
                      _hover={{
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      }}
                      transition="all 0.3s"
                    >
                      <CardBody>
                        <VStack align="start" spacing={4}>
                          <Icon as={feature.icon} w={8} h={8} color={feature.color} />
                          <Heading size="md" color="white">{feature.title}</Heading>
                          <Text color="whiteAlpha.800">{feature.description}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}
