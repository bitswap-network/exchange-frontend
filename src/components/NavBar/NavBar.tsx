/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react"
import {
    Box,
    Flex,
    HStack,
    useToast,
    IconButton,
    Button,
    useDisclosure,
    Spacer,
    Text,
    Skeleton,
    Drawer,
    DrawerBody,
    VStack,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react"
import { RiCloseFill } from "react-icons/ri"
import { HiMenu } from "react-icons/hi"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { Logo } from "./components/Logo"

import { Link } from "react-router-dom"
import { loggedInState, orderModalState, userState } from "../../store"
import { AiOutlineUser } from "react-icons/ai"

const LINKS = ["home", "orders", "wallet"]
// 📌 TO DO: This is just the skeleton (no links or connections)
export const DefaultNavBar = (loading: boolean) => (
    <Box px={4} bg={"background.primary"}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <Skeleton isLoaded={!loading} m="4">
                <HStack as={"nav"} spacing={5} display={{ base: "none", md: "flex" }}>
                    <Link to="/">
                        <Logo />
                    </Link>
                </HStack>
            </Skeleton>
            <Flex alignItems={"center"} mr="5">
                <Skeleton isLoaded={!loading} m="4">
                    <Button
                        bg="#4978F0"
                        p="0px 40px"
                        color="white"
                        fontWeight="600"
                        fontSize="16"
                        borderRadius="6"
                        boxShadow="0px 3px 6px 0px #00000040"
                        as={Link}
                        to="/login"
                    >
                        Login
                    </Button>
                </Skeleton>
                <Spacer />
            </Flex>
        </Flex>
    </Box>
)

function NavBarFunc() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const isLoggedIn = useRecoilValue(loggedInState)
    const user = useRecoilValue(userState)
    const setOrderModalState = useSetRecoilState(orderModalState)
    const emailToast = useToast()
    const deviceToast = useToast()
    const chartWarningToast = useToast()
    const [emailToastOpened, setEmailToastOpened] = useState(false)
    const [deviceToastOpened, setDeviceToastOpened] = useState(false)
    const [chartWarningToastOpened, setChartWarningToastOpened] = useState(false)
    useEffect(() => {
        if (user && !user.verification.email && !emailToastOpened) {
            setEmailToastOpened(true)
            emailToast({
                title: "Email not verified.",
                description: "Verify your email to gain complete access to the platform.",
                status: "error",
                duration: 60000,
                isClosable: true,
                position: "bottom-right",
            })
        }
    }, [user])
    useEffect(() => {
        if (window.innerWidth < 768 && !deviceToastOpened) {
            setDeviceToastOpened(true)
            deviceToast({
                title: "Mobile device detected.",
                description: "Access the website on a desktop or laptop for a better experience.",
                status: "warning",
                duration: 60000,
                isClosable: true,
                position: "top",
            })
        }
        if (!chartWarningToastOpened) {
            setChartWarningToastOpened(true)
            chartWarningToast({
                id: "chartWarning",
                title: "Warning",
                description:
                    "Chart prices may currently be inaccurate. Please refer to market bid and ask prices instead.",
                status: "warning",
                duration: 600000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }, [])
    // 📌 TODO: Connect all functionality
    const loggedInMarkup = (
        <>
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Flex alignItems="flex-start" ml="-40px">
                            <Logo as={Link} to="/" />
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4} alignItems="flex-start">
                            {LINKS.map((link) => (
                                <Text
                                    textTransform="capitalize"
                                    as={Link}
                                    to={`/${link}`}
                                    key={link}
                                    onClick={() => onClose()}
                                >
                                    {link}
                                </Text>
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <Box px={4}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <IconButton
                        size={"lg"}
                        icon={isOpen ? <RiCloseFill /> : <HiMenu />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? () => onClose() : () => onOpen()}
                    />
                    <HStack as={"nav"} spacing={5} display={{ base: "none", md: "flex" }}>
                        <Logo as={Link} to="/" />
                        {LINKS.map((link) => (
                            <Text textTransform="capitalize" as={Link} to={`/${link}`} key={link} pt="3px">
                                {link}
                            </Text>
                        ))}
                    </HStack>
                    <Flex mr={{ sm: "5px", md: "20px" }}>
                        <HStack as={"nav"} spacing={1} display={{ base: "none", md: "flex" }}>
                            <Button
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
                            </Button>
                            <Link to="/profile">
                                <HStack spacing="5px" color="black" fontWeight="400" mr="4">
                                    <AiOutlineUser size="20" />
                                    <Text textTransform="capitalize" pt="2px">
                                        Profile
                                    </Text>
                                </HStack>
                            </Link>
                        </HStack>
                    </Flex>
                </Flex>

                {/* {isOpen && (
                    <Box pb={4} display={{ base: "flex", md: "none" }}>
                        <Stack as={"nav"} spacing={4}>
                            {LINKS.map((link) => (
                                <Text textTransform="capitalize" as={Link} to={`/${link}`} key={link}>
                                    {link}
                                </Text>
                            ))}
                        </Stack>
                    </Box>
                )} */}
            </Box>
        </>
    )

    return <>{isLoggedIn ? loggedInMarkup : DefaultNavBar(false)}</>
}
export const NavBar = React.memo(NavBarFunc)
