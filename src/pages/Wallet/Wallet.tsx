/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    VStack,
    SimpleGrid,
    Button,
} from '@chakra-ui/react'
import { BalanceCard } from '../../components/BalanceCard'
import { CryptoCard } from '../../components/CryptoCard'

// TODO: UNFINISHED
export function Wallet(): React.ReactElement {
    const BCLT = {
        imageUri: './bitcloutLogo.png',
        imageAlt: 'BitClout Logo',
        currency: 'BCLT',
        amount: 0.00021,
        usdValue: 23.344,
        publicKey: 'bitclout public key>',
    }

    const ETH = {
        imageUri:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png',
        imageAlt: 'Ether Logo',
        currency: 'ETH',
        amount: 0.231,
        usdValue: 1323.344,
        publicKey: '<ethereum public key>',
    }

    const [selectedCurrency, setSelectedCurrency] = useState('BCLT')

    return (
        <>
            <Box bg="background.primary" mb="4">
                <Heading> Wallet Page </Heading>
            </Box>

            <Flex direction="column" bg="background.primary">
                <SimpleGrid
                    columns={{ sm: 1, md: 2 }}
                    rows={{ sm: 2, md: 1 }}
                    spacing={10}
                >
                    <VStack
                        align={{ sm: 'center', md: 'flex-end' }}
                        justifyContent={{ sm: 'space-evenly', md: 'center' }}
                    >
                        <Box pb="4" onClick={() => setSelectedCurrency('BCLT')}>
                            <CryptoCard
                                imageUrl={BCLT.imageUri}
                                imageAlt={BCLT.imageAlt}
                                currency={BCLT.currency}
                                amount={BCLT.amount}
                                publicKey={BCLT.publicKey}
                            />
                        </Box>
                        <Box onClick={() => setSelectedCurrency('ETH')}>
                            <CryptoCard
                                imageUrl={ETH.imageUri}
                                imageAlt={ETH.imageAlt}
                                currency={ETH.currency}
                                amount={ETH.amount}
                                publicKey={ETH.publicKey}
                            />
                        </Box>
                    </VStack>
                    <Flex
                        justifyContent={{ sm: 'center', md: 'flex-start' }}
                        w="full"
                    >
                        {selectedCurrency == 'BCLT' ? (
                            <BalanceCard
                                imageUrl={BCLT.imageUri}
                                imageAlt={BCLT.imageAlt}
                                currency={BCLT.currency}
                                amount={BCLT.amount}
                                usdValue={BCLT.usdValue}
                                publicKey={BCLT.publicKey}
                            />
                        ) : (
                            <BalanceCard
                                imageUrl={ETH.imageUri}
                                imageAlt={ETH.imageAlt}
                                currency={ETH.currency}
                                amount={ETH.amount}
                                usdValue={ETH.usdValue}
                                publicKey={ETH.publicKey}
                            />
                        )}
                    </Flex>
                </SimpleGrid>
            </Flex>
        </>
    )
}
