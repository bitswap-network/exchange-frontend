/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react'
import { Box, Flex, Heading, VStack, SimpleGrid } from '@chakra-ui/react'
import { BalanceCard } from '../../components/BalanceCard'
import { CryptoCard } from '../../components/CryptoCard'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react'
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
    const data = [
        {
            id: '<11235813>',
            time: '2021-07-04 @ 6:23pm',
            from: '0.0001 ETH',
            to: '0.05 BCLT',
            rate: '0.02 BCLT / ETH',
        },
        {
            id: '<58323214>',
            time: '2021-05-16 @ 4:30pm',
            from: '0.0012 ETH',
            to: '0.45 BCLT',
            rate: '0.03 BCLT / ETH',
        },
        {
            id: '<23123815>',
            time: '2021-05-19 @ 7:25am',
            from: '0.07 BCLT',
            to: '0.0012 ETH',
            rate: '2.34 ETH / BCLT',
        },
    ]

    return (
        <Flex flexDir="column" alignItems="center">
            <Box maxW="95%">
                <Box bg="background.primary" mb="4">
                    <Heading> Wallet </Heading>
                </Box>

                <Flex direction="column" bg="background.primary">
                    <SimpleGrid
                        columns={{ sm: 1, md: 2 }}
                        rows={{ sm: 2, md: 1 }}
                        spacing={10}
                    >
                        <VStack
                            align={{ sm: 'center', md: 'flex-end' }}
                            justifyContent={{
                                sm: 'space-evenly',
                                md: 'center',
                            }}
                        >
                            <Box
                                pb="4"
                                onClick={() => setSelectedCurrency('BCLT')}
                            >
                                <CryptoCard
                                    active={selectedCurrency == 'BCLT'}
                                    imageUrl={BCLT.imageUri}
                                    imageAlt={BCLT.imageAlt}
                                    currency={BCLT.currency}
                                    amount={BCLT.amount}
                                    publicKey={BCLT.publicKey}
                                />
                            </Box>
                            <Box onClick={() => setSelectedCurrency('ETH')}>
                                <CryptoCard
                                    active={selectedCurrency == 'ETH'}
                                    imageUrl={ETH.imageUri}
                                    imageAlt={ETH.imageAlt}
                                    currency={ETH.currency}
                                    amount={ETH.amount}
                                    publicKey={ETH.publicKey}
                                />
                            </Box>
                        </VStack>
                        <Flex
                            justifyContent={{ sm: 'center', md: 'flex-end' }}
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
                <VStack alignItems="flex-start" mt="8" spacing={5}>
                    <Heading as="h2" size="md" color="gray.700">
                        Transaction History
                    </Heading>
                    <Box bg="white" w="100%" borderRadius="lg" boxShadow="xs">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th color="gray.700" pt="5">
                                        Transaction ID
                                    </Th>
                                    <Th color="gray.700" pt="5">
                                        Timestamp
                                    </Th>
                                    <Th color="gray.700" pt="5">
                                        From
                                    </Th>
                                    <Th color="gray.700" pt="5">
                                        To
                                    </Th>
                                    <Th color="gray.700" pt="5">
                                        Rate
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data.map((transaction) => (
                                    <Tr key={transaction.id}>
                                        <Td color="gray.500" fontSize="14">
                                            {transaction.id}
                                        </Td>
                                        <Td color="gray.500" fontSize="14">
                                            {transaction.time}
                                        </Td>
                                        <Td color="gray.500" fontSize="14">
                                            {transaction.from}
                                        </Td>
                                        <Td color="gray.500" fontSize="14">
                                            {transaction.to}
                                        </Td>
                                        <Td color="gray.500" fontSize="14">
                                            {transaction.rate}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </VStack>
            </Box>
        </Flex>
    )
}
