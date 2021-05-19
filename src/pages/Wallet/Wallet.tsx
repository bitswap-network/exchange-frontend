/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { NavBar } from '../../components/NavBar'
import { Box, Flex, Heading, VStack } from '@chakra-ui/react'
import { BalanceCard } from '../../components/BalanceCard'

// TODO: UNFINISHED
export function Wallet(): React.ReactElement {
    return (
        <>
            <Box>
                <Heading> Wallet Page </Heading>
            </Box>
            <NavBar loggedOut={false} />
            <Flex bg="background.primary">
                <VStack>
                    <Box p="15">
                        <Heading size="lg">Wallet</Heading>
                    </Box>
                    <Box d="flex" mt="20" ml="120" alignItems="center">
                        <BalanceCard />
                    </Box>
                </VStack>
            </Flex>
        </>
    )
}
