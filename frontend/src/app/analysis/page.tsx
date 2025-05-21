'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Badge,
  Button,
  Fade,
  Link,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tooltip,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FiLogOut, FiRefreshCw, FiGithub, FiMessageCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Markdown from 'markdown-to-jsx';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import AnimatedBackground from '../components/AnimatedBackground';
// Removed: import { ChakraLink } from '@chakra-ui/react';

// Register languages for highlight.js
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
const AnalysisPage = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repoName, setRepoName] = useState<string>('');
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // Component for the header with improved navigation
  const AnalysisHeader = () => {
    return (
      <Box
        py={3}
        px={4}
        bg={useColorModeValue('white', 'gray.800')}
        borderBottom="1px"
        borderColor={borderColor}
        boxShadow="sm"
        mb={4}
        borderRadius="md"
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <HStack spacing={3}>
            <Tooltip label="Back to Home" placement="bottom">
              <IconButton
                aria-label="Back to home"
                icon={<ArrowBackIcon />}
                onClick={() => router.push('/')}
                variant="ghost"
                size="md"
                color="brand.400"
                _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
              />
            </Tooltip>
            <Heading as="h1" size={{ base: "md", md: "lg" }} color="brand.400">
              Repository Analysis
            </Heading>
            {repoName && (
              <Badge
                colorScheme="purple"
                fontSize={{ base: 'sm', md: 'md' }}
                px={2}
                py={1}
                borderRadius="full"
              >
                {repoName}
              </Badge>
            )}
          </HStack>

          <HStack spacing={2}>
            <Tooltip label="New Analysis" placement="bottom">
              <IconButton
                aria-label="New Analysis"
                icon={<FiRefreshCw />}
                onClick={handleNewAnalysis}
                variant="ghost"
                colorScheme="brand"
                size="md"
              />
            </Tooltip>
            
            <Tooltip label="Chat with Repository" placement="bottom">
              <IconButton
                aria-label="Chat with Repository"
                icon={<FiMessageCircle />}
                onClick={() => router.push('/chat')}
                variant="ghost"
                colorScheme="brand"
                size="md"
              />
            </Tooltip>
            
            <Tooltip label="Logout" placement="bottom">
              <IconButton
                aria-label="Logout"
                icon={<FiLogOut />}
                onClick={onOpen}
                variant="ghost"
                colorScheme="red"
                size="md"
              />
            </Tooltip>
          </HStack>
        </Flex>
      </Box>
    );
  };

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return false;
      }
      return true;
    };

    const fetchAnalysisReport = async () => {
      const analyzedRepo = localStorage.getItem('analyzedRepo');
      const token = localStorage.getItem('token');
      if (!analyzedRepo) {
        setError('No repository selected for analysis. Please select a repository.');
        return false;
      }
      try {
        // Extract repo name for display
        const urlParts = analyzedRepo.split('/');
        const name = urlParts.slice(-2).join('/');
        setRepoName(name);

        // Make API call
        setLoading(true);
        const response = await fetch(`https://reporadar-03fy.onrender.com/analysis/repository`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ repoUrl: analyzedRepo }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: 'Failed to analyze repository.',
          }));
          throw new Error(errorData.message || `Failed to fetch analysis report. Status: ${response.status}`);
        }

        const analysisResult = await response.json();
        console.log('API Response:', analysisResult); // Debug log
        // Extract Markdown report
        const reportContent = analysisResult.data?.report || analysisResult.report || JSON.stringify(analysisResult, null, 2);
        setReport(reportContent);
      } catch (e: any) {
        console.error('Report fetching error:', e);
        setError(e.message || 'Failed to fetch analysis report. Please try again.');
        return false;
      }
      return true;
    };

    if (!checkAuthAndRedirect()) return;
    fetchAnalysisReport().finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    toast({
      title: 'Logged out successfully',
      description: 'All cached data has been cleared.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    router.push('/');
  };

  const handleNewAnalysis = () => {
    // Clear report and repo data, keep token
    localStorage.removeItem('analyzedRepo');
    localStorage.removeItem('analysisReport');
    router.push('/');
  };

  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const codeBgColor = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bg={bgColor}
      >
        <VStack spacing={5} p={8} borderRadius="lg" bg={cardBgColor} boxShadow="lg">
          <Box position="relative">
            <Spinner
              size="xl"
              color="brand.500"
              thickness="4px"
              speed="0.8s"
              emptyColor={useColorModeValue("gray.200", "gray.700")}
            />
            <Spinner
              position="absolute"
              top="0"
              left="0"
              size="xl"
              color="brand.300"
              thickness="4px"
              speed="0.65s"
              opacity="0.6"
              emptyColor="transparent"
            />
          </Box>
          <Text fontSize="lg" fontWeight="medium" color={textColor}>
            Analyzing repository...
          </Text>
          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} textAlign="center">
            This might take a minute depending on repository size
          </Text>
        </VStack>
      </Box>
    );
  }
  return (
    <>
      <CustomCursor />
      <AnimatedBackground />
      <Box
        bg={bgColor}
        color={textColor}
        minHeight="100vh"
        position="relative"
        zIndex={1}
        overflowX="hidden"
      >
        <Container maxW="container.xl" py={{ base: 4, md: 6 }} px={{ base: 4, md: 8 }}>
          <Fade in transition={{ enter: { duration: 0.5 } }}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Use the new header component */}
              <AnalysisHeader />

              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Logout Confirmation
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to logout? All your session data will be cleared.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button colorScheme="red" onClick={handleLogout} ml={3}>
                        Logout
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>

              {error && (
                <Alert 
                  status="error" 
                  borderRadius="md" 
                  variant="subtle"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <AlertIcon />
                  <VStack align="start" spacing={2} width="100%">
                    <Text fontWeight="bold">Error Loading Report</Text>
                    <Text>{error}</Text>
                    <HStack pt={3} spacing={4} width="100%" justifyContent="flex-end">
                      <Button
                        colorScheme="brand"
                        size="sm"
                        onClick={handleNewAnalysis}
                        leftIcon={<FiRefreshCw />}
                      >
                        New Analysis
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/chat')}
                        leftIcon={<FiMessageCircle />}
                      >
                        Try Chat
                      </Button>
                    </HStack>
                  </VStack>
                </Alert>
              )}              {report && !error && (
                <Box
                  p={{ base: 4, md: 6 }}
                  bg={cardBgColor}
                  borderRadius="lg"
                  boxShadow="md"
                  borderWidth={1}
                  borderColor={borderColor}
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{ boxShadow: "lg" }}
                >
                  <Box mb={4} pb={4} borderBottomWidth={1} borderColor={borderColor}>
                    <HStack justify="space-between" wrap="wrap">
                      <Heading size="md" color="brand.400">Analysis Report</Heading>
                      <HStack spacing={2}>
                        <Tooltip label="Repository URL" placement="top">
                          <Button
                            size="sm"
                            leftIcon={<FiGithub />}
                            as={Link}
                            href={localStorage.getItem('analyzedRepo') || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline"
                            colorScheme="brand"
                            isDisabled={!localStorage.getItem('analyzedRepo')}
                          >
                            View Repository
                          </Button>
                        </Tooltip>
                      </HStack>
                    </HStack>
                  </Box>
                  
                  <Markdown
                    options={{
                      overrides: {
                        h1: {
                          component: Heading,
                          props: { as: 'h1', size: { base: 'lg', md: 'xl' }, my: 6, color: 'brand.300' },
                        },
                        h2: {
                          component: Heading,
                          props: { as: 'h2', size: { base: 'md', md: 'lg' }, my: 5, color: 'brand.400' },
                        },
                        h3: {
                          component: Heading,
                          props: { as: 'h3', size: 'md', my: 4 },
                        },
                        p: {
                          component: Text,
                          props: { fontSize: { base: 'sm', md: 'md' }, my: 3, lineHeight: 'tall' },
                        },
                        ul: {
                          component: Box,
                          props: { as: 'ul', pl: 5, my: 3, style: { listStyleType: 'disc' } },
                        },
                        ol: {
                          component: Box,
                          props: { as: 'ol', pl: 5, my: 3, style: { listStyleType: 'decimal' } },
                        },
                        li: {
                          component: Box,
                          props: { as: 'li', my: 2 },
                        },
                        code: {
                          component: ({ className, children, ...props }) => {
                            const isInline = !className?.includes('language-');
                            const language = className?.replace('language-', '') || 'text';
                            if (isInline) {
                              return (
                                <Text
                                  as="code"
                                  px={1.5}
                                  py={0.5}
                                  bg={codeBgColor}
                                  borderRadius="md"
                                  fontFamily="monospace"
                                  fontSize={{ base: '0.85em', md: '0.9em' }}
                                  {...props}
                                >
                                  {children}
                                </Text>
                              );
                            }
                            const highlightedCode = hljs.highlight(String(children).replace(/\n$/, ''), {
                              language,
                            }).value;
                            return (
                              <Box
                                as="pre"
                                my={4}
                                borderRadius="md"
                                overflowX="auto"
                                bg={codeBgColor}
                                p={4}
                                boxShadow="sm"
                                className={useColorModeValue('hljs github', 'hljs github-dark')}
                              >
                                <code dangerouslySetInnerHTML={{ __html: highlightedCode }} {...props} />
                              </Box>
                            );
                          },
                        },
                        blockquote: {
                          component: Box,
                          props: {
                            borderLeft: '4px',
                            borderColor: 'brand.500',
                            pl: 4,
                            my: 4,
                            fontStyle: 'italic',
                            color: useColorModeValue('gray.600', 'gray.400'),
                            bg: useColorModeValue('brand.50', 'brand.900'),
                            py: 2,
                          },
                        },
                        table: {
                          component: Box,
                          props: { as: 'table', width: 'full', overflowX: 'auto', my: 4 },
                        },
                        thead: {
                          component: Box,
                          props: { as: 'thead', bg: useColorModeValue('gray.100', 'gray.700') },
                        },
                        tr: {
                          component: Box,
                          props: { as: 'tr', borderBottomWidth: '1px', borderColor },
                        },
                        th: {
                          component: Box,
                          props: { as: 'th', px: 4, py: 2, textAlign: 'left', fontWeight: 'semibold', borderColor },
                        },
                        td: {
                          component: Box,
                          props: { as: 'td', px: 4, py: 2, borderColor },
                        },
                        a: {
                          component: Link,
                          props: {
                            color: 'brand.500',
                            fontWeight: 'medium',
                            isExternal: true,
                            _hover: { textDecoration: 'underline', color: useColorModeValue('brand.600', 'brand.300') },
                          },
                        },
                      },
                    }}
                  >
                    {report}
                  </Markdown>
                </Box>
              )}              {!report && !error && !loading && (
                <Box
                  p={6}
                  bg={cardBgColor}
                  borderRadius="lg"
                  boxShadow="md"
                  borderWidth={1}
                  borderColor={borderColor}
                  textAlign="center"
                >
                  <VStack spacing={4} align="center">
                    <Box 
                      p={3} 
                      borderRadius="full" 
                      bg={useColorModeValue("brand.50", "brand.900")}
                    >
                      <FiGithub size="2.5rem" color={useColorModeValue("#6B46C1", "#D6BCFA")} />
                    </Box>
                    <Heading size="md">No Repository Analysis</Heading>
                    <Text fontSize={{ base: 'sm', md: 'md' }} color={useColorModeValue("gray.600", "gray.400")}>
                      No analysis data is available. Would you like to analyze a new repository?
                    </Text>
                    <Button
                      mt={2}
                      colorScheme="brand"
                      onClick={handleNewAnalysis}
                      size="md"
                      leftIcon={<FiRefreshCw />}
                    >
                      Analyze New Repository
                    </Button>
                  </VStack>
                </Box>
              )}
            </VStack>
          </Fade>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default AnalysisPage;