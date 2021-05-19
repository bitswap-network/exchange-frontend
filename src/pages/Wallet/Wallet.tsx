/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { NavBar } from '../../components/NavBar'
import { Box, Flex, Heading, VStack, SimpleGrid } from '@chakra-ui/react'
import { BalanceCard } from '../../components/BalanceCard'
import { CryptoCard } from '../../components/CryptoCard'

// TODO: UNFINISHED
export function Wallet(): React.ReactElement {
    return (
        <>
            <Box>
                <Heading> Wallet Page </Heading>
            </Box>
            <NavBar loggedOut={false} />
            <Box bg="background.primary" p="10">
                <Heading size="xl">Wallet</Heading>
            </Box>
            <Flex
                direction={{ base: 'column-reverse', md: 'row' }}
                bg="background.primary"
            >
                <SimpleGrid columns={2} spacing={10}>
                    <VStack p="15">
                        <CryptoCard />
                        <CryptoCard />
                    </VStack>
                    <BalanceCard />
                </SimpleGrid>
            </Flex>
        </>
    )
}
