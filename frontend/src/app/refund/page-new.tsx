'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  IconButton,
  HStack,
  Icon,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaHome, FaRocket, FaCreditCard, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

export default function RefundPolicy() {
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
              Refund Policy
            </Heading>

            <Box bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)" borderRadius="xl" p={8}>
              <VStack spacing={6} align="stretch">
                
                <Box>
                  <HStack mb={4}>
                    <Icon as={FaRocket} color="brand.400" w={6} h={6} />
                    <Heading size="lg" color="white">
                      Subscription Refunds
                    </Heading>
                  </HStack>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    At RepoRadar, we offer a 14-day money-back guarantee on our Pro and Enterprise subscription plans. If you're not satisfied with our AI-powered GitHub repository analysis service within the first 14 days of your subscription, we'll provide a full refund upon request.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    Our Starter (Free) plan does not qualify for refunds as it is offered at no cost.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <HStack mb={4}>
                    <Icon as={FaCalendarAlt} color="brand.400" w={6} h={6} />
                    <Heading size="md" color="white">
                      Eligibility Period
                    </Heading>
                  </HStack>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    The 14-day period begins on the date of your initial subscription purchase. After this period expires, we cannot offer refunds for:
                  </Text>
                  <List spacing={3} mt={4} ml={5}>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      Partial subscription periods
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      Unused time on your subscription
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      Subscription renewals after the initial 14-day period
                    </ListItem>
                  </List>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <HStack mb={4}>
                    <Icon as={FaExclamationTriangle} color="brand.400" w={6} h={6} />
                    <Heading size="md" color="white">
                      Non-Refundable Items
                    </Heading>
                  </HStack>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    The following are not eligible for refunds:
                  </Text>
                  <List spacing={3} mt={4} ml={5}>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      Any add-on features or services purchased separately
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      Custom AI model training for specific repositories
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      API usage beyond included limits
                    </ListItem>
                  </List>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <HStack mb={4}>
                    <Icon as={FaCreditCard} color="brand.400" w={6} h={6} />
                    <Heading size="md" color="white">
                      Refund Process
                    </Heading>
                  </HStack>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    To request a refund:
                  </Text>
                  <List spacing={3} mt={4} ml={5} mb={4}>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      Email our support team at support@reporadar.com with your account email and reason for refund
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      Include the date of purchase and subscription plan type
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      Include any relevant information about your experience
                    </ListItem>
                  </List>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We process refund requests within 5-7 business days. Once approved, the credit will be automatically applied to your original payment method within 3-5 business days, depending on your payment provider.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <HStack mb={4}>
                    <Icon as={FaClock} color="brand.400" w={6} h={6} />
                    <Heading size="md" color="white">
                      Subscription Cancellation
                    </Heading>
                  </HStack>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    Canceling your subscription is separate from requesting a refund. To avoid future charges:
                  </Text>
                  <List spacing={3} mt={4} ml={5}>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      Login to your RepoRadar account
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      Go to Account Settings {'>'} Subscription
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaCheckCircle} color="green.400" />
                      Click "Cancel Subscription"
                    </ListItem>
                  </List>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    You will still have access to your current subscription features until the end of your billing period.
                  </Text>
                </Box>
                
                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <HStack mb={4}>
                    <Icon as={FaExclamationTriangle} color="brand.400" w={6} h={6} />
                    <Heading size="md" color="white">
                      Additional Information
                    </Heading>
                  </HStack>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We reserve the right to refuse a refund if we find evidence of:
                  </Text>
                  <List spacing={3} mt={4} ml={5}>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      Excessive usage of features and services during the refund eligibility period
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      Abuse of the refund policy through repeated subscriptions and cancellations
                    </ListItem>
                    <ListItem color="whiteAlpha.800" lineHeight="1.8">
                      <ListIcon as={FaExclamationTriangle} color="orange.400" />
                      Violation of our Terms of Service
                    </ListItem>
                  </List>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <HStack mb={4}>
                    <Icon as={FaCalendarAlt} color="brand.400" w={6} h={6} />
                    <Heading size="md" color="white">
                      Policy Updates
                    </Heading>
                  </HStack>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    This refund policy was last updated on June 10, 2025. We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    If you have any questions about our Refund Policy, please contact us at support@reporadar.com or our headquarters at Plot No. 25, IT Park, Hinjewadi Phase 1, Pune, Maharashtra, India 411057.
                  </Text>
                </Box>

              </VStack>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
