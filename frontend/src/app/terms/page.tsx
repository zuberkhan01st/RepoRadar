'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  useColorModeValue,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

const TermsOfService = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
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
              Terms of Service
            </Heading>

            <Box bg="rgba(255, 255, 255, 0.05)" backdropFilter="blur(10px)" borderRadius="xl" p={8}>
              <VStack spacing={6} align="stretch">
                
                <Box>
                  <Heading size="lg" color="white" mb={4}>
                    OVERVIEW
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    This website is operated by RepoRadar. Throughout the site, the terms "we", "us" and "our" refer to RepoRadar. RepoRadar offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    SECTION 1 - ONLINE STORE TERMS
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    A breach or violation of any of the Terms will result in an immediate termination of your Services.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    SECTION 2 - GENERAL CONDITIONS
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We reserve the right to refuse service to anyone for any reason at any time.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    Prices for our products are subject to change without notice.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    SECTION 5 - PRODUCTS OR SERVICES
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    SECTION 6 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered to you through the service are provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind.
                  </Text>
                  <Text color="whiteAlpha.800" lineHeight="1.8" mt={4}>
                    In no case shall RepoRadar, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />                <Box>
                  <Heading size="md" color="white" mb={3}>
                    SECTION 7 - GOVERNING LAW
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India and jurisdiction of Pune, Maharashtra.
                  </Text>
                </Box>

                <Divider borderColor="whiteAlpha.300" />

                <Box>
                  <Heading size="md" color="white" mb={3}>
                    SECTION 8 - CONTACT INFORMATION
                  </Heading>
                  <Text color="whiteAlpha.800" lineHeight="1.8">
                    Questions about the Terms of Service should be sent to us at support@reporadar.com.
                  </Text>
                </Box>              </VStack>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default TermsOfService;
