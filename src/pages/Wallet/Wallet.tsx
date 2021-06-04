/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react"
import {
    Box,
    Flex,
    Heading,
    VStack,
    SimpleGrid,
    useDisclosure,
} from "@chakra-ui/react"
import { BalanceCard } from "../../components/BalanceCard"
import { CryptoCard } from "../../components/CryptoCard"
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { tokenState, userState } from "../../store"
import { getEthUSD } from "../../services/utility"
import { TransactionSchema } from "../../interfaces/Transaction"
import { getTransactions } from "../../services/user"
import { bitcloutPreflightTxn } from "../../services/gateway"
import { TransactionModal } from "./TransactionModal"
import { BitcloutWithdrawModal, EthWithdrawModal } from "./WithdrawModal"
import { BitcloutDepositModal, EthDepositModal } from "./DepositModal"
import * as globalVars from "../../globalVars"
import { useUser } from "../../hooks"

// TODO: UNFINISHED
export function Wallet(): React.ReactElement {
    // const user = useRecoilValue(userState)
    const token = useRecoilValue(tokenState)
    const { user, userIsLoading, userIsError } = useUser(token)
    const [ethUsd, setEthUsd] = useState<number | null>(null)
    // const [bitcloutUsd, setBitcloutUsd] = useState<number | null>(null)
    const [selectedCurrency, setSelectedCurrency] = useState<{
        type: string
        maxWithdraw: number
    }>({
        type: "BCLT",
        maxWithdraw: 0,
    })
    const [transactions, setTransactions] = useState<TransactionSchema[]>([])
    const [currentTransaction, setCurrentTransaction] =
        useState<TransactionSchema | null>(null)

    const {
        isOpen: isOpenTransactionModal,
        onOpen: onOpenTransactionModal,
        onClose: onCloseTransactionModal,
    } = useDisclosure()

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
        // getBitcloutUSD().then((response) => {
        //     setBitcloutUsd(response.data.data)
        // })
        getTransactions().then((response) => {
            setTransactions(response.data.data)
        })
    }, [])
    useEffect(() => {
        if (selectedCurrency.type === "BCLT") {
            getMaxBitclout().then((max) => {
                setSelectedCurrency({
                    type: "BCLT",
                    maxWithdraw: max,
                })
            })
        } else {
            getMaxEth().then((max) => {
                setSelectedCurrency({
                    type: "ETH",
                    maxWithdraw: max,
                })
            })
        }
    }, [user])

    const BCLT = {
        imageUri: "./bitcloutLogo.png",
        imageAlt: "BitClout Logo",
        currency: "BCLT",
        amount: user?.balance.bitclout,
        publicKey: user?.bitclout.publicKey,
    }

    const ETH = {
        imageUri:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png",
        imageAlt: "Ether Logo",
        currency: "ETH",
        amount: user?.balance.ether,
        usdValue: ethUsd ? ethUsd * user?.balance.ether : null,
        publicKey: "",
    }
    //make it into an est. gas fees field
    const getMaxBitclout = async (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            if (user?.balance.bitclout > 0) {
                bitcloutPreflightTxn(user.balance.bitclout)
                    .then((response) => {
                        resolve(
                            user.balance.bitclout -
                                response.data.data.FeeNanos / 1e9
                        )
                    })
                    .catch((error) => {
                        console.log(error)
                        reject(error)
                    })
            } else {
                resolve(0)
            }
        })
    }

    const getMaxEth = (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            if (user?.balance.ether > 0) {
                resolve(user.balance.ether)
            } else {
                resolve(0)
            }
        })
    }

    const handleCurrencyChange = (type: string) => {
        if (type === "BCLT") {
            getMaxBitclout().then((max) => {
                setSelectedCurrency({
                    type: "BCLT",
                    maxWithdraw: max,
                })
            })
        } else {
            getMaxEth().then((max) => {
                setSelectedCurrency({
                    type: "ETH",
                    maxWithdraw: max,
                })
            })
        }
    }

    const openTransactionModal = (transaction: TransactionSchema) => {
        setCurrentTransaction(transaction)
        onOpenTransactionModal()
    }

    return (
        <>
            <TransactionModal
                disclosure={{
                    isOpen: isOpenTransactionModal,
                    onOpen: onOpenTransactionModal,
                    onClose: onCloseTransactionModal,
                }}
                transaction={currentTransaction}
            />
            {selectedCurrency.type == "BCLT" ? (
                <>
                    <BitcloutDepositModal
                        disclosure={{
                            isOpen: isOpenDepositModal,
                            onOpen: onOpenDepositModal,
                            onClose: onCloseDepositModal,
                        }}
                    />
                    <BitcloutWithdrawModal
                        maxWithdraw={selectedCurrency.maxWithdraw}
                        disclosure={{
                            isOpen: isOpenWithdrawModal,
                            onOpen: onOpenWithdrawModal,
                            onClose: onCloseWithdrawModal,
                        }}
                    />
                </>
            ) : (
                <>
                    <EthDepositModal
                        disclosure={{
                            isOpen: isOpenDepositModal,
                            onOpen: onOpenDepositModal,
                            onClose: onCloseDepositModal,
                        }}
                    />
                    <EthWithdrawModal
                        maxWithdraw={selectedCurrency.maxWithdraw}
                        disclosure={{
                            isOpen: isOpenWithdrawModal,
                            onOpen: onOpenWithdrawModal,
                            onClose: onCloseWithdrawModal,
                        }}
                    />
                </>
            )}
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
                                align={{ sm: "center", md: "flex-end" }}
                                justifyContent={{
                                    sm: "space-evenly",
                                    md: "center",
                                }}
                            >
                                <Box
                                    pb="4"
                                    onClick={() => handleCurrencyChange("BCLT")}
                                    w="full"
                                    maxW="sm"
                                >
                                    <CryptoCard
                                        active={selectedCurrency.type == "BCLT"}
                                        imageUrl={BCLT.imageUri}
                                        imageAlt={BCLT.imageAlt}
                                        currency={BCLT.currency}
                                        amount={BCLT.amount}
                                        publicKey={BCLT.publicKey}
                                    />
                                </Box>
                                <Box
                                    onClick={() => handleCurrencyChange("ETH")}
                                    w="full"
                                    maxW="sm"
                                >
                                    <CryptoCard
                                        active={selectedCurrency.type == "ETH"}
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
                                    sm: "center",
                                    md: "flex-end",
                                }}
                                w="full"
                            >
                                {selectedCurrency.type == "BCLT" ? (
                                    <BalanceCard
                                        openWithdrawModal={onOpenWithdrawModal}
                                        openDepositModal={onOpenDepositModal}
                                        imageUrl={BCLT.imageUri}
                                        imageAlt={BCLT.imageAlt}
                                        currency={BCLT.currency}
                                        amount={BCLT.amount}
                                        usdValue={null}
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
                                                ? ethUsd * user?.balance.ether
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
                                    {transactions
                                        .sort((a, b) => {
                                            return (
                                                new Date(
                                                    b.completionDate ??
                                                        b.created
                                                ).getTime() -
                                                new Date(
                                                    a.completionDate ??
                                                        a.created
                                                ).getTime()
                                            )
                                        })
                                        .map((transaction) => (
                                            <Tr
                                                onClick={() =>
                                                    openTransactionModal(
                                                        transaction
                                                    )
                                                }
                                                cursor="pointer"
                                                key={transaction._id}
                                            >
                                                <Td
                                                    color="gray.500"
                                                    fontSize="14"
                                                >
                                                    {transaction.transactionType.toUpperCase()}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="14"
                                                >
                                                    {globalVars.timeSince(
                                                        new Date(
                                                            transaction.completionDate
                                                                ? transaction.completionDate
                                                                : transaction.created
                                                        )
                                                    )}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="14"
                                                >
                                                    {transaction.assetType}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="14"
                                                >
                                                    {transaction.value
                                                        ? `${globalVars.formatBalanceLarge(
                                                              transaction.value
                                                          )} ${
                                                              transaction.assetType
                                                          }`
                                                        : "N/A"}
                                                </Td>
                                                <Td
                                                    color="gray.500"
                                                    fontSize="14"
                                                >
                                                    {transaction.state.toUpperCase()}
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
