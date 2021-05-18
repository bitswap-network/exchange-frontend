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

const LINKS = ['Home', 'Orders', 'Wallet']

// 📌 TO DO: This is just the skeleton (no links, etc)

export function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Box px={4}>
                <Flex
                    h={16}
                    aignItems={'center'}
                    justifyContent={'space-between'}
                >
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
                        <Logo />
                        {/* LEAVING THESE AS TEXT FOR NOW until we have all the pages and proper routing */}
                        {LINKS.map((link) => (
                            <Text key={link}>{link}</Text>
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
        </>
    )
}
