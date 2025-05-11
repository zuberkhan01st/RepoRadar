'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Button,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCheck, FaRocket, FaCrown, FaStar } from 'react-icons/fa';

const MotionBox = motion(Box);

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for individual developers',
    icon: FaStar,
    features: [
      'Basic repository analysis',
      'Up to 5 repositories',
      'Standard response time',
      'Community support',
    ],
    badge: 'Popular',
    color: 'blue',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'For professional developers and small teams',
    icon: FaRocket,
    features: [
      'Advanced repository analysis',
      'Unlimited repositories',
      'Priority response time',
      'Email support',
      'Custom integrations',
      'Team collaboration',
    ],
    badge: 'Best Value',
    color: 'purple',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    icon: FaCrown,
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom AI training',
      'API access',
      'Advanced analytics',
      'SLA guarantee',
    ],
    badge: 'Enterprise',
    color: 'yellow',
  },
];

const SubscriptionPlans = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box py={20} bg="black" opacity={0.8}>
      <Container maxW="container.xl">
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Heading
              size="2xl"
              bgGradient="linear(to-r, brand.400, accent.400)"
              bgClip="text"
            >
              Choose Your Plan
            </Heading>
            <Text fontSize="xl" color="whiteAlpha.800" maxW="2xl">
              Select the perfect plan for your needs and start analyzing repositories with AI
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
            {plans.map((plan, index) => (
              <MotionBox
                key={plan.name}
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
                  position="relative"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  }}
                  transition="all 0.3s"
                >
                  {plan.badge && (
                    <Badge
                      position="absolute"
                      top={-2}
                      right={-2}
                      colorScheme={plan.color}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                    >
                      {plan.badge}
                    </Badge>
                  )}

                  <VStack spacing={6} align="start">
                    <Box>
                      <Heading size="lg" color="white" mb={2}>
                        {plan.name}
                      </Heading>
                      <Text color="whiteAlpha.800">{plan.description}</Text>
                    </Box>

                    <Box>
                      <Heading size="3xl" color="white">
                        {plan.price}
                      </Heading>
                      {plan.period && (
                        <Text color="whiteAlpha.600">{plan.period}</Text>
                      )}
                    </Box>

                    <List spacing={3} w="full">
                      {plan.features.map((feature, i) => (
                        <ListItem key={i} color="whiteAlpha.800">
                          <ListIcon as={FaCheck} color="brand.500" />
                          {feature}
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      w="full"
                      colorScheme="brand"
                      size="lg"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                    >
                      Get Started
                    </Button>
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

export default SubscriptionPlans; 