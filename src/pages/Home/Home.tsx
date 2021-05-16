/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { NavBar } from '../../components/NavBar'
import { Box, Flex, Heading, VStack } from '@chakra-ui/react'

export function Home() {
    return (
        <>
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
        </>
    )
}
