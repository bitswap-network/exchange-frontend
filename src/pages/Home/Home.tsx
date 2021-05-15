/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { NavBar } from '../../components/NavBar'
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'

export function Home() {
    return (
        <>
            <NavBar loggedOut={false} />
            <Flex bg="background.primary">
                <Box p="20">
                    <Heading size="lg">Wallet</Heading>
                </Box>
            </Flex>
        </>
    )
}
