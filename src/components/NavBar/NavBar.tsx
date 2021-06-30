/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    HStack,
    useToast,
    IconButton,
    useDisclosure,
    Spacer,
    Text,
    Drawer,
    DrawerBody,
    VStack,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Logo } from "./components/Logo";
import { NavLink } from "./components/NavLink";
import { NotifPopover } from "./components/NotifPopover";
import { Link } from "react-router-dom";
import { loggedInState, orderModalState, userState } from "../../store";
import { logout } from "../../helpers/persistence";

export function DefaultNavBar() {
    return (
        <Flex alignItems={"center"} justifyContent={"space-between"} p={4} boxShadow="md" h="8vh" w="full">
            <Logo as={Link} to="/" ml={{ base: 2, sm: 4, md: 8 }} />
            <Flex mr={{ base: 2, sm: 4, md: 8 }}>
                <Box _hover={{ backgroundColor: "background.primary", cursor: "pointer" }} borderRadius="sm" p={1} as={Link} to="/login">
                    <HStack>
                        <Text>Login</Text>
                        <FiLogIn size="20" />
                    </HStack>
                </Box>
            </Flex>
        </Flex>
    );
}

function NavBarFunc() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isLoggedIn = useRecoilValue(loggedInState);
    const user = useRecoilValue(userState);
    const setOrderModalState = useSetRecoilState(orderModalState);
    const emailToast = useToast();
    const [emailToastOpened, setEmailToastOpened] = useState(false);

    console.log(window.location.pathname);
    useEffect(() => {
        if (user && !user.verification.email && !emailToastOpened) {
            setEmailToastOpened(true);
            emailToast({
                title: "Email not verified.",
                description: "Verify your email to gain complete access to the platform.",
                status: "error",
                duration: 60000,
                isClosable: true,
                position: "bottom-left",
            });
        }
        if (user && user.verification.email) {
            emailToast.closeAll();
        }
    }, [user?.verification]);

    const loggedInMarkup = (
        <>
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        <VStack alignItems="center">
                            <Logo boxSize="200px" my="-8" />
                            <Text>Mobile Exchange</Text>
                        </VStack>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={6} alignItems="center" mt="2">
                            <NavLink as={Link} to="/" label={"Home"} onClick={onClose} />
                            <NavLink as={Link} to="/orders" label={"Orders"} onClick={onClose} />
                            <NavLink as={Link} to="/wallet" label={"Wallet"} />
                            <NavLink as={Link} to="/profile" label={"Account"} onClick={onClose} />

                            <Box
                                onClick={() => {
                                    logout();
                                    window.location.assign("/");
                                }}
                            >
                                <HStack>
                                    <Text>Logout</Text>
                                    <FiLogOut size="16" />
                                </HStack>
                            </Box>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <Flex justifyContent={{ base: "flex-start", md: "space-between" }} px={{ base: 8, md: 4 }} boxShadow="md" h="8vh">
                <HStack spacing={2} display={{ base: "inline-flex", md: "none" }}>
                    <IconButton
                        size="lg"
                        icon={isOpen ? <></> : <HiMenu size="30" />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? () => onClose() : () => onOpen()}
                    />
                    <Spacer />
                    <Logo as={Link} to="/" />
                </HStack>
                <HStack spacing={8} display={{ base: "none", md: "flex" }} ml="16">
                    <Logo as={Link} to="/" ml={4} mr={4} />
                    <NavLink as={Link} to="/" label={"Home"} />
                    <NavLink as={Link} to="/orders" label={"Orders"} />
                    <NavLink as={Link} to="/profile" label={"Account"} />
                    <NotifPopover />
                </HStack>
                <HStack spacing={8} display={{ base: "none", md: "flex" }} mr="6">
                    {/* <Button
                                as={Link}
                                to={{
                                    pathname: "/orders",
                                }}
                                onClick={() => setOrderModalState(() => true)}
                                h="30px"
                                bgColor="#DBE6FF"
                                borderRadius="4"
                                mr="4"
                            >
                                <Text textTransform="capitalize" fontWeight="500" color="brand.100" fontSize="sm">
                                    New Order
                                </Text>
                            </Button> */}
                    <Box
                        _hover={{ backgroundColor: "background.primary", cursor: "pointer" }}
                        onClick={() => {
                            logout();
                            window.location.assign("/");
                        }}
                        borderRadius="sm"
                        p={1}
                    >
                        <HStack>
                            <Text>Logout</Text>
                            <FiLogOut size="20" />
                        </HStack>
                    </Box>
                </HStack>
            </Flex>
        </>
    );

    return <>{isLoggedIn ? loggedInMarkup : DefaultNavBar()}</>;
}
export const NavBar = React.memo(NavBarFunc);
