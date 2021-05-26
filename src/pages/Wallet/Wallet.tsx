/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    VStack,
    SimpleGrid,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { BalanceCard } from '../../components/BalanceCard'
import { CryptoCard } from '../../components/CryptoCard'
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'
import { getEthUSD, getBitcloutUSD } from '../../services/utility'
import { TransactionSchema } from '../../interfaces/Transaction'
import { getTransactions } from '../../services/user'
import { WithdrawModal } from './WithdrawModal'
import { DepositModal } from './DepositModal'
// TODO: UNFINISHED
export function Wallet(): React.ReactElement {
    const user = useRecoilValue(userState)
    const [ethUsd, setEthUsd] = useState<number | null>(null)
    const [bitcloutUsd, setBitcloutUsd] = useState<number | null>(null)
    const [selectedCurrency, setSelectedCurrency] = useState('BCLT')
    const [transactions, setTransactions] = useState<TransactionSchema[]>([])
    const {
        isOpen: isOpenDepositModal,
        onOpen: onOpenDepositModal,
        onClose: onCloseDepositModal,
    } = useDisclosure()

    const {
        isOpen: isOpenWithdrawModal,
        onOpen: onOpenWithdrawModal,
        onClose: onCloseWithdrawModal,
    } = useDisclosure()

    useEffect(() => {
        getEthUSD().then((response) => {
            console.log(response.data.data)
            setEthUsd(response.data.data)
        })
        getBitcloutUSD().then((response) => {
            setBitcloutUsd(response.data.data)
        })
        getTransactions().then((response) => {
            setTransactions(response.data.data)
        })
    }, [])

    const BCLT = {
        imageUri: './bitcloutLogo.png',
        imageAlt: 'BitClout Logo',
        currency: 'BCLT',
        amount: user.balance.bitclout,
        usdValue: bitcloutUsd ? bitcloutUsd * user.balance.bitclout : null,
        publicKey: user.bitclout.publicKey,
    }

    const ETH = {
        imageUri:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png',
        imageAlt: 'Ether Logo',
        currency: 'ETH',
        amount: user.balance.ether,
        usdValue: ethUsd ? ethUsd * user.balance.ether : null,
        publicKey: '<ethereum public key>',
    }

    return (
        <>
            <DepositModal
                currency={selectedCurrency}
                disclosure={{
                    isOpen: isOpenDepositModal,
                    onOpen: onOpenDepositModal,
                    onClose: onCloseDepositModal,
                }}
            />
            <WithdrawModal
                currency={selectedCurrency}
                disclosure={{
                    isOpen: isOpenWithdrawModal,
                    onOpen: onOpenWithdrawModal,
                    onClose: onCloseWithdrawModal,
                }}
            />
            <Flex flexDir="column" alignItems="center">
                <Box maxW="90%" minW="65%">
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
                                    w="full"
                                    maxW="sm"
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
                                <Box
                                    onClick={() => setSelectedCurrency('ETH')}
                                    w="full"
                                    maxW="sm"
                                >
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
                                justifyContent={{
                                    sm: 'center',
                                    md: 'flex-end',
                                }}
                                w="full"
                            >
                                {selectedCurrency == 'BCLT' ? (
                                    <BalanceCard
                                        openWithdrawModal={onOpenWithdrawModal}
                                        openDepositModal={onOpenDepositModal}
                                        imageUrl={BCLT.imageUri}
                                        imageAlt={BCLT.imageAlt}
                                        currency={BCLT.currency}
                                        amount={BCLT.amount}
                                        usdValue={
                                            bitcloutUsd
                                                ? bitcloutUsd *
                                                  user.balance.bitclout
                                                : null
                                        }
                                    />
                                ) : (
                                    <BalanceCard
                                        openWithdrawModal={onOpenWithdrawModal}
                                        openDepositModal={onOpenDepositModal}
                                        imageUrl={ETH.imageUri}
                                        imageAlt={ETH.imageAlt}
                                        currency={ETH.currency}
                                        amount={ETH.amount}
                                        usdValue={
                                            ethUsd
                                                ? ethUsd * user.balance.ether
                                                : null
                                        }
                                    />
                                )}
                            </Flex>
                        </SimpleGrid>
                    </Flex>
                    <VStack alignItems="flex-start" mt="8" spacing={5}>
                        <Heading as="h2" size="md" color="gray.700">
                            Transaction History
                        </Heading>
                        <Box
                            bg="white"
                            w="100%"
                            borderRadius="lg"
                            boxShadow="xs"
                        >
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th color="gray.700" pt="5">
                                            Transaction Type
                                        </Th>
                                        <Th color="gray.700" pt="5">
                                            Timestamp
                                        </Th>
                                        <Th color="gray.700" pt="5">
                                            Asset
                                        </Th>
                                        <Th color="gray.700" pt="5">
                                            Value
                                        </Th>
                                        <Th color="gray.700" pt="5">
                                            Status
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {transactions.map((transaction) => (
                                        <Tr key={transaction._id}>
                                            <Td color="gray.500" fontSize="14">
                                                {transaction.transactionType}
                                            </Td>
                                            <Td color="gray.500" fontSize="14">
                                                {transaction.created}
                                            </Td>
                                            <Td color="gray.500" fontSize="14">
                                                {transaction.assetType}
                                            </Td>
                                            <Td color="gray.500" fontSize="14">
                                                {transaction.value
                                                    ? transaction.value
                                                    : 'N/A'}
                                            </Td>
                                            <Td color="gray.500" fontSize="14">
                                                {transaction.completed
                                                    ? 'Completed'
                                                    : 'Pending'}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </VStack>
                </Box>
            </Flex>
        </>
    )
}
