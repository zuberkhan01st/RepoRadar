import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    dark: {
      50: '#F7FAFC',
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#171923',
      950: '#0B0E11',
    },
    accent: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'dark.950',
        color: 'dark.50',
        backgroundImage: 'radial-gradient(circle at 50% 50%, var(--chakra-colors-dark-900) 0%, var(--chakra-colors-dark-950) 100%)',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'brand.600',
          color: 'white',
          _hover: {
            bg: 'brand.500',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          },
          _active: {
            bg: 'brand.700',
            transform: 'translateY(0)',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.500',
            color: 'white',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          },
        },
        ghost: {
          color: 'brand.500',
          _hover: {
            bg: 'brand.500',
            color: 'white',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'dark.800',
          borderColor: 'dark.700',
          _hover: {
            borderColor: 'brand.500',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'dark.800',
          borderRadius: 'xl',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
});

export default theme; 