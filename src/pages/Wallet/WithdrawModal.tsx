import React, { useState } from 'react'
import {
    Modal,
    Text,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Flex,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import { userState, identityUsers } from '../../store'
import { bitcloutPreflightTxn } from '../../services/gateway'
import { handleBitcloutDeposit } from '../../services/identity/helper'
import { BlueButton } from '../../components/BlueButton'
import { TransactionAPIInterface } from '../../interfaces/bitclout/Transaction'

interface ModalProps {
    disclosure: any
    currency: string
}

export const WithdrawModal: React.FC<ModalProps> = ({
    disclosure,
    currency,
}: ModalProps) => {
    const user = useRecoilValue(userState)
    const identityUserData = useRecoilValue(identityUsers)
    const [withdrawValue, setWithdrawValue] = useState<string>('0.000000')
    const [preflight, setPreflight] =
        useState<TransactionAPIInterface | null>(null)
    const [page, setPage] = useState('withdraw')
    const getPreflight = () => {
        bitcloutPreflightTxn(parseFloat(withdrawValue))
            .then((response) => {
                setPreflight(response.data.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const submitDeposit = () => {
        if (preflight) {
            const depositObj = {
                accessLevel:
                    identityUserData[user.bitclout.publicKey].accessLevel,
                accessLevelHmac:
                    identityUserData[user.bitclout.publicKey].accessLevelHmac,
                encryptedSeedHex:
                    identityUserData[user.bitclout.publicKey].encryptedSeedHex,
                transactionHex: preflight.TransactionHex,
                transactionIDBase58Check: preflight.TransactionIDBase58Check,
                value: parseFloat(withdrawValue),
            }
            handleBitcloutDeposit(depositObj)
        }
    }

    const valueHandler = async (valueString: string) => {
        const max =
            currency == 'ETH'
                ? ((await getMaxEth()) as number)
                : ((await getMaxBitclout()) as number)
        if (max) {
            if (parseFloat(valueString) > max) {
                setWithdrawValue(max.toFixed(4))
            } else {
                setWithdrawValue(valueString.replace(/^\$/, ''))
            }
        } else {
            setWithdrawValue('0.000000')
        }
    }

    const getMaxBitclout = () => {
        if (user.balance.bitclout > 0) {
            bitcloutPreflightTxn(user.balance.bitclout)
                .then((response) => {
                    setWithdrawValue(
                        (
                            user.balance.bitclout -
                            parseFloat(response.data.FeeNanos) / 1e9
                        ).toString()
                    )
                    return (
                        user.balance.bitclout -
                        parseFloat(response.data.FeeNanos) / 1e9
                    )
                })
                .catch((error) => {
                    console.log(error)
                    return 0
                })
        } else {
            setWithdrawValue('0.000000')
            return 0
        }
    }

    const getMaxEth = () => {
        if (user.balance.ether > 0) {
            bitcloutPreflightTxn(user.balance.ether)
                .then((response) => {
                    setWithdrawValue(
                        (
                            user.balance.ether -
                            parseFloat(response.data.FeeNanos) / 1e9
                        ).toString()
                    )
                    return (
                        user.balance.ether -
                        parseFloat(response.data.FeeNanos) / 1e9
                    )
                })
                .catch((error) => {
                    console.log(error)
                    return 0
                })
        } else {
            setWithdrawValue('0.000000')
            return 0
        }
    }

    const completed = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Flex w="80%" ml="10%" flexDir="column">
                    <Text
                        fontSize="xl"
                        fontWeight="700"
                        mt="6"
                        mb="2"
                        color="gray.700"
                    >
                        Transaction Completed
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Your transaction has been completed successfully. Click
                        confirm to return to your wallet.
                    </Text>
                    <BlueButton
                        w="70%"
                        mt="6"
                        mb="8"
                        ml="15%"
                        text={`   Confirm   `}
                        onClick={() => {
                            disclosure.onClose()
                            setPage('withdraw')
                            setWithdrawValue('0')
                        }}
                    />
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    const confirmWithdraw = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Flex w="80%" ml="10%" flexDir="column">
                    <Text
                        fontSize="xl"
                        fontWeight="700"
                        mt="6"
                        mb="2"
                        color="gray.700"
                    >
                        Confirm Withdrawal
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        The following amount will be withdrawn from your BitSwap
                        account
                    </Text>
                    <Text
                        color="gray.700"
                        fontSize="md"
                        fontWeight="600"
                        mt="4"
                        mb="2"
                    >
                        Amount of {currency} to Withdraw: {withdrawValue}
                    </Text>
                    <Flex
                        flexDir="row"
                        justifyContent="space-between"
                        w="full"
                        mt="6%"
                        mb="8%"
                    >
                        <Button
                            w="47%"
                            variant="solid"
                            onClick={() => {
                                setPage('withdraw')
                            }}
                        >
                            Modify
                        </Button>
                        <BlueButton
                            w="47%"
                            text={`   Confirm   `}
                            onClick={() => {
                                setPage('completed')
                            }}
                        />
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    const withdraw = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Text
                    textAlign="center"
                    fontSize="xx-large"
                    fontWeight="700"
                    w="full"
                    mt="6"
                >
                    {currency == 'ETH'
                        ? user.balance.ether
                        : user.balance.bitclout}{' '}
                    {currency}
                </Text>
                <Text
                    textAlign="center"
                    color="gray.500"
                    fontSize="sm"
                    w="full"
                    mb="6"
                >
                    Currently Available
                </Text>
                <Flex w="80%" ml="10%" flexDir="column">
                    <Text
                        fontSize="xl"
                        fontWeight="700"
                        mb="2"
                        color="gray.700"
                    >
                        Withdraw Funds
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Withdraw funds from your BitSwap wallet!
                    </Text>
                    <Text
                        color="gray.600"
                        fontSize="sm"
                        fontWeight="600"
                        mt="6"
                    >
                        Amount of {currency} to Withdraw{' '}
                        <Button
                            variant="solid"
                            fontSize="sm"
                            p="3"
                            h="30px"
                            ml="2"
                            onClick={
                                currency == 'ETH' ? getMaxEth : getMaxBitclout
                            }
                        >
                            Max
                        </Button>
                    </Text>
                    <NumberInput
                        mt="4"
                        type="text"
                        placeholder="0.0"
                        value={withdrawValue}
                        onChange={valueHandler}
                        precision={6}
                        step={0.1}
                        min={0}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Text color="gray.500" fontSize="sm" mt="6">
                        You will be able to review this transaction before it’s
                        complete.
                    </Text>
                    <Flex
                        flexDir="row"
                        justifyContent="space-between"
                        w="full"
                        mt="6%"
                        mb="8%"
                    >
                        <Button
                            w="47%"
                            variant="solid"
                            onClick={disclosure.onClose}
                        >
                            Cancel
                        </Button>
                        <BlueButton
                            w="47%"
                            text={`   Confirm   `}
                            onClick={() => setPage('confirmWithdraw')}
                        />
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            {page == 'withdraw'
                ? withdraw
                : page == 'confirmWithdraw'
                ? confirmWithdraw
                : completed}
        </Modal>
    )
}
