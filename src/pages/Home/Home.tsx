/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
<<<<<<< HEAD
import { Box, Heading } from '@chakra-ui/react'
=======
import { NavBar } from '../../components/NavBar'
import { Box, Flex, Heading, VStack } from '@chakra-ui/react'
>>>>>>> a31581c (Add BalanceCard)

export function Home() {
    return (
        <>
<<<<<<< HEAD
            <Box p="20">
                <Heading size="lg">Wallet</Heading>
            </Box>
=======
            <NavBar loggedOut={false} />
            <Flex bg="background.primary">
                <VStack>
                    <Box p="20">
                        <Heading size="lg">Wallet</Heading>
                    </Box>
                    <Box p="20">
                        <Heading size="lg">Wallet</Heading>
                    </Box>
                </VStack>
            </Flex>
>>>>>>> a31581c (Add BalanceCard)
        </>
    )
}
