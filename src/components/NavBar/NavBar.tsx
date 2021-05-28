/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    useDisclosure,
    Stack,
    Spacer,
    Text,
} from "@chakra-ui/react"
import { RiCloseFill } from "react-icons/ri"
import { HiMenu } from "react-icons/hi"
import { useRecoilValue } from "recoil"
import { Logo } from "./components/Logo"
import { Link } from "react-router-dom"
import { loggedInState } from "../../store"
import { AiOutlineUser } from "react-icons/ai"

const LINKS = ["home", "orders", "wallet"]

// 📌 TO DO: This is just the skeleton (no links or connections)
export const DefaultNavBar = (
    <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack
                as={"nav"}
                spacing={5}
                display={{ base: "none", md: "flex" }}
            >
                <Link to="/">
                    <Logo />
                </Link>
            </HStack>
            <Flex alignItems={"center"} mr="5">
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
                <Spacer />
            </Flex>
        </Flex>
    </Box>
)

export function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const isLoggedIn = useRecoilValue(loggedInState)
    console.log("IS LOGGED IN: ", isLoggedIn)
    // 📌 TODO: Connect all functionality
    const loggedInMarkup = (
        <Box px={4}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                <IconButton
                    size={"lg"}
                    icon={isOpen ? <RiCloseFill /> : <HiMenu />}
                    aria-label={"Open Menu"}
                    display={{ md: "none" }}
                    onClick={isOpen ? onClose : onOpen}
                />
                <HStack
                    as={"nav"}
                    spacing={5}
                    display={{ base: "none", md: "flex" }}
                >
                    <Logo as={Link} to="/" />
                    {LINKS.map((link) => (
                        <Text
                            textTransform="capitalize"
                            as={Link}
                            to={`/${link}`}
                            key={link}
                            pt="3px"
                        >
                            {link}
                        </Text>
                    ))}
                </HStack>
                <Flex mr={{ sm: "5px", md: "40px" }}>
                    <Link to="/profile">
                        <HStack spacing="5px" color="black" fontWeight="400">
                            <AiOutlineUser size="20" />
                            <Text textTransform="capitalize" pt="2px">
                                Profile
                            </Text>
                        </HStack>
                    </Link>
                </Flex>
            </Flex>
            {isOpen ? (
                <Box pb={4} display={{ md: "none" }}>
                    <Stack as={"nav"} spacing={4}>
                        {LINKS.map((link) => (
                            <Text
                                textTransform="capitalize"
                                as={Link}
                                to={`/${link}`}
                                key={link}
                            >
                                {link}
                            </Text>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    )

    return <>{isLoggedIn ? loggedInMarkup : DefaultNavBar}</>
}
