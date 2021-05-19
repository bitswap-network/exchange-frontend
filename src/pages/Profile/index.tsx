/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { HiExclamationCircle } from 'react-icons/hi'
import { NavBar } from '../../components/NavBar'
import { BlueButton } from '../../components/BlueButton/BlueButton'
import { Box, Text } from '@chakra-ui/react'

export function Profile() {
    return (
        <div>
            <NavBar />
            <Flex
                minH="100%"
                align="center"
                justify="center"
                flexDirection="column"
                mt="20px"
            >
                <Box bg="blue" w="80px" height="80px" borderRadius="80"></Box>
                <Text color="#000" fontWeight="700" fontSize="20" mt="15">
                    @elonmusk
                </Text>
                <Flex flexDirection="row" width="100%">
                    <Box
                        display="flex"
                        flex="0.5"
                        justifyContent="flex-end"
                        pr="10px"
                        flexDir="row"
                    >
                        <Text
                            color="#5B5B5B"
                            fontSize="16"
                            mt="15"
                            fontWeight="700"
                            mr="1"
                        >
                            15839
                        </Text>
                        <Text
                            color="#5B5B5B"
                            fontSize="16"
                            mt="15"
                            fontWeight="500"
                        >
                            Followers
                        </Text>
                    </Box>
                    <Box
                        display="flex"
                        flex="0.5"
                        justifyContent="flex-start"
                        pl="10px"
                    >
                        <Text
                            color="#5B5B5B"
                            fontSize="16"
                            mt="15"
                            fontWeight="700"
                            mr="1"
                        >
                            ~$69,420
                        </Text>
                        <Text
                            color="#5B5B5B"
                            fontSize="16"
                            mt="15"
                            fontWeight="500"
                        >
                            Coin Price
                        </Text>
                    </Box>
                </Flex>
                <Flex
                    mt="50px"
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
                            elonmusk@gmail.com
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
                            onClick={() => console.log('hello')}
                        >
                            Verify
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    )
}
