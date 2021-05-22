import React, { useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { HiExclamationCircle } from 'react-icons/hi'
import { Box, Text, Link } from '@chakra-ui/react'
import { profile } from 'console'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'
import { fetchBitcloutProfile } from '../../services/auth'
import { BitcloutProfile } from '../../interfaces/bitclout/Profile'
import { logout } from '../../helpers/persistence'
export function Profile(): React.ReactElement {
    const user = useRecoilValue(userState)
    const [bitcloutProfile, setBitcloutProfile] =
        useState<BitcloutProfile | null>(null)

    useEffect(() => {
        if (user) {
            console.log('s')
            fetchBitcloutProfile(
                user.bitclout.publicKey,
                user.bitclout.username
            ).then((response) => {
                setBitcloutProfile(response.data)
                console.log(response.data)
            })
        }
    }, [])

    const handleLogout = () => {
        logout()
        window.location.assign('/login')
    }
    // user.verification.bitcloutString

    return (
        <div>
            <Flex
                minH="100%"
                align="center"
                justify="center"
                flexDirection="column"
                mt="20px"
            >
                <img
                    src={user.bitclout.profilePicture}
                    style={{ width: 80, height: 80, borderRadius: 80 }}
                />
                <Link
                    isExternal
                    href={`https://bitclout.com/u/${user.bitclout.username}`}
                    color="black"
                    fontWeight="700"
                    fontSize="20"
                    mt="15"
                >
                    @{user.bitclout.username}
                </Link>
                <Text color="gray.700" fontWeight="400" fontSize="16" mt="15">
                    {user.bitclout.bio}
                </Text>

                <Flex
                    mt="20px"
                    w={{ sm: '80%', md: '600px' }}
                    p="20px"
                    flexDir={{ sm: 'column', md: 'row' }}
                    borderRadius="10"
                    boxShadow="1px 4px 6px 0px #00000040"
                >
                    <Flex
                        flex="0.65"
                        align="flex-start"
                        justify="center"
                        flexDir="column"
                    >
                        <Text color="#44423D" fontWeight="700" fontSize="18">
                            Email
                        </Text>
                        <Text
                            color="#44423D"
                            fontWeight="300"
                            fontSize="15"
                            mt="12px"
                        >
                            Important updates will be sent to this address.
                        </Text>
                        <Text
                            color="#44423D"
                            fontWeight="500"
                            fontSize="18"
                            mt="12px"
                        >
                            {user.email}
                        </Text>
                    </Flex>
                    <Flex
                        flex="0.35"
                        align="flex-end"
                        justify="space-between"
                        flexDir={{ sm: 'row', md: 'column' }}
                        mt={{ sm: '15px', md: '0' }}
                    >
                        <Button
                            bg="#407BFF"
                            w={{ sm: '45%', md: '90%' }}
                            p="10px 0"
                            color="white"
                            fontWeight="600"
                            fontSize="16"
                            borderRadius="6"
                            boxShadow="0px 2px 6px 0px #00000030"
                            onClick={() => console.log('hello')}
                        >
                            Edit
                        </Button>
                        <Button
                            bg="#407BFF"
                            w={{ sm: '45%', md: '90%' }}
                            p="10px 0"
                            color="white"
                            fontWeight="600"
                            fontSize="16"
                            borderRadius="6"
                            boxShadow="0px 2px 6px 0px #00000030"
                            onClick={() => console.log('hello')}
                        >
                            Verify
                        </Button>
                    </Flex>
                </Flex>

                <Flex
                    mt="50px"
                    w={{ sm: '80%', md: '600px' }}
                    p="20px"
                    flexDir={{ sm: 'column', md: 'row' }}
                    borderRadius="10"
                    boxShadow="1px 4px 6px 0px #00000040"
                    mb={{ sm: '50px', md: '0' }}
                >
                    <Flex
                        flex="0.65"
                        align="flex-start"
                        justify="center"
                        flexDir="column"
                    >
                        <Text color="#44423D" fontWeight="700" fontSize="18">
                            BitClout Verification{' '}
                            <HiExclamationCircle
                                style={{ display: 'inline' }}
                                color="#EE0004"
                                size="20"
                            />
                        </Text>
                        <Text
                            color="#44423D"
                            fontWeight="300"
                            fontSize="15"
                            mt="12px"
                        >
                            You must make a BitClout post to verify your account
                            before making any exchanges.
                        </Text>
                    </Flex>
                    <Flex
                        flex="0.35"
                        align="flex-end"
                        justify={{ sm: 'center', md: 'space-between' }}
                        flexDir={{ sm: 'row', md: 'column' }}
                        mt={{ sm: '15px', md: '0' }}
                    >
                        <Button
                            bg="#407BFF"
                            w="90%"
                            p="10px 0"
                            color="white"
                            fontWeight="600"
                            fontSize="16"
                            borderRadius="6"
                            boxShadow="0px 2px 6px 0px #00000030"
                            onClick={() => console.log('hello')}
                        >
                            Edit
                        </Button>
                    </Flex>
                </Flex>
                <Flex
                    mt="50px"
                    w={{ sm: '80%', md: '600px' }}
                    flexDir="column"
                    alignItems="center"
                >
                    <Button
                        bg="red.500"
                        w="125px"
                        p="10px 0"
                        color="white"
                        fontWeight="600"
                        fontSize="16"
                        borderRadius="6"
                        boxShadow="0px 2px 6px 0px #00000030"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Flex>
            </Flex>
        </div>
    )
}
