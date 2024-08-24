// components/Navbar.js
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Flex, Box, Heading, Link } from '@chakra-ui/react';
import { auth, googleProvider } from '../firebase'; // Ensure you have the GoogleAuthProvider set up
import { useAuth } from '../services/authContext';
import { signInWithPopup } from 'firebase/auth';

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/'); // Redirect to home or any other page after login
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <Box paddingY={4} paddingX={24} color="teal">
      <Flex mx="auto" align="center" justify="space-between">
        <Heading as="h1" size="lg">
          <Link as={RouterLink} to="/">
            TravelApp
          </Link>
        </Heading>
        <Flex align="center">
          <Link as={RouterLink} to="/" mr={4}>
            Home
          </Link>
          {user ? (
            <>
              <Link as={RouterLink} to="/create-trip" mr={4}>
                Create Trip
              </Link>
              <Link as={RouterLink} to="/trips" mr={4}>
                My Trips
              </Link>
              <Button variant={"outline"} colorScheme="red" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button colorScheme="teal" onClick={handleGoogleSignIn}>
              Login with Google
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
