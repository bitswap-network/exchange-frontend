import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { HiExclamationCircle } from 'react-icons/hi'
import { Box, Text } from '@chakra-ui/react'
import { profile } from 'console'

export function Profile(): React.ReactElement {
    const user = {
        username: '@elonmusk',
        email: 'elonmusk@gmail.com',
        followers: '15839',
        coin_price: '69,420',
        profile_picture:
            'https://res.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_256,w_256,f_auto,g_faces,z_0.7,q_auto:eco/hevy6dvk7gien0rmg37n',
    }

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
                    src={user.profile_picture}
                    style={{ width: 80, height: 80, borderRadius: 80 }}
                />
                <Text color="#000" fontWeight="700" fontSize="20" mt="15">
                    {user.username}
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
                            {user.followers}
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
                            ~${user.coin_price}
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
                            Verify
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    )
}
