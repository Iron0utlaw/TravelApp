import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Button,
  Flex,
  Box,
  Heading,
  Link,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { auth, googleProvider } from "../firebase";
import { useAuth } from "../services/authContext";
import { signInWithPopup } from "firebase/auth";
import { HamburgerIcon } from "@chakra-ui/icons";

const NavBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/"); // Redirect to home or any other page after login
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <Box paddingY={4} paddingX={8} color="teal">
      <Flex mx="auto" align="center" justify="space-between">
        <Heading as="h1" size="lg">
          <Link as={RouterLink} to="/">
            TravelApp
          </Link>
        </Heading>
        {isMobile ? (
          <>
            <IconButton
              aria-label="Open Menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="outline"
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay>
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>Menu</DrawerHeader>
                  <DrawerBody>
                    <Flex direction="column" align="flex-start">
                      <Link as={RouterLink} to="/" mb={4} onClick={onClose}>
                        Home
                      </Link>
                      {user ? (
                        <>
                          <Link
                            as={RouterLink}
                            to="/create-trip"
                            mb={4}
                            onClick={onClose}
                          >
                            Create Trip
                          </Link>
                          <Link
                            as={RouterLink}
                            to="/trips"
                            mb={4}
                            onClick={onClose}
                          >
                            My Trips
                          </Link>
                          <Flex align="center" mb={4}>
                            <Avatar size="sm" src={user.photoURL} mr={2} />
                            <Text>Hi, {user.displayName}</Text>
                          </Flex>
                          <Button
                            variant="outline"
                            colorScheme="red"
                            onClick={() => {
                              handleLogout();
                              onClose();
                            }}
                          >
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Button
                          colorScheme="teal"
                          onClick={() => {
                            handleGoogleSignIn();
                            onClose();
                          }}
                        >
                          Login with Google
                        </Button>
                      )}
                    </Flex>
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          </>
        ) : (
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
                <Flex align="center">
                  <Avatar size="sm" src={user.photoURL} mr={2} />
                  <Text mr={2}>Hi, {user.displayName}</Text>
                </Flex>
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button colorScheme="teal" onClick={handleGoogleSignIn}>
                Login with Google
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default NavBar;
