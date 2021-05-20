/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import {
    Box,
    Flex,
    Avatar,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Stack,
    Spacer,
    Text,
} from '@chakra-ui/react'
import { RiCloseFill } from 'react-icons/ri'
import { HiMenu } from 'react-icons/hi'
import { useRecoilValue } from 'recoil'
import { Logo } from './components/Logo'
import { Link } from 'react-router-dom'
import { loggedInState } from '../../store'

const LINKS = ['home', 'orders', 'wallet']

// 📌 TO DO: This is just the skeleton (no links or connections)
export const DefaultNavBar = (
    <Box px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <HStack
                as={'nav'}
                spacing={5}
                display={{ base: 'none', md: 'flex' }}
            >
                <Link to="/">
                    <Logo />
                </Link>
            </HStack>
            <Flex alignItems={'center'} mr="5">
                <Link to="/login">
                    <Button fontWeight="bold" size="xs" color="gray.600">
                        LOGIN
                    </Button>
                </Link>
                <Spacer />
            </Flex>
        </Flex>
    </Box>
)
export function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const isLoggedIn = useRecoilValue(loggedInState)
    console.log('IS LOGGED IN: ', isLoggedIn)
    // 📌 TODO: Connect all functionality

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
                                <Avatar size="xs" src="" />
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
