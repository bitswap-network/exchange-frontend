/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import {
    Box,
    Flex,
    Avatar,
    HStack,
    Text,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Stack,
} from '@chakra-ui/react'
import { RiCloseFill } from 'react-icons/ri'
import { HiMenu } from 'react-icons/hi'
import { Logo } from './components/Logo'
import { Link } from 'react-router-dom'

const LINKS = ['home', 'orders', 'wallet']

// 📌 TO DO: This is just the skeleton (no links or connections)

interface NavBarProps {
    /** Determines if it should be the naked NavBar with just the Logo*/
    loggedOut: boolean
}

export function NavBar({ loggedOut }: NavBarProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    // ADD LOGIN OPTION WHERE PROFILE NORMALLY LIVES <3
    const welcomeMarkup = (
        <Box px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <HStack
                    as={'nav'}
                    spacing={5}
                    display={{ base: 'none', md: 'flex' }}
                >
                    <Logo />
                </HStack>
            </Flex>
        </Box>
    )

    const loggedInMarkup = (
        <Box px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'lg'}
                    icon={isOpen ? <RiCloseFill /> : <HiMenu />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />
                <HStack
                    as={'nav'}
                    spacing={5}
                    display={{ base: 'none', md: 'flex' }}
                >
                    <Logo as={Link} to="/" />
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
                </HStack>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            as={Button}
                            rounded={'full'}
                            variant={'link'}
                            cursor={'pointer'}
                        >
                            {/* PROFILE ...  */}
                            <HStack spacing="24px">
                                <Avatar
                                    size="xs"
                                    src="https://bit.ly/broken-link"
                                />
                            </HStack>
                        </MenuButton>
                        {/* Not sure if we need this? Can remove if not */}
                        <MenuList>
                            <MenuItem>Edit Profile</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        {LINKS.map((link) => (
                            <Text key={link}> {link}</Text>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    )

    return <>{loggedOut ? welcomeMarkup : loggedInMarkup}</>
}
