import React, { useEffect, useState } from 'react'
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

interface DepositModalProps {
    disclosure: {
        isOpen: boolean
        onOpen: () => void
        onClose: () => void
    }
    currency: {
        type: string
        maxWithdraw: number
    }
}

export const DepositModal: React.FC<DepositModalProps> = ({
    disclosure,
    currency,
}: DepositModalProps) => {
    const user = useRecoilValue(userState)
    const identityUserData = useRecoilValue(identityUsers)
    const [depositValue, setDepositValue] = useState<string>('0.0000')
    const [preflight, setPreflight] =
        useState<TransactionAPIInterface | null>(null)
    const [page, setPage] = useState('deposit')
    const getPreflight = () => {
        bitcloutPreflightTxn(parseFloat(depositValue))
            .then((response) => {
                setPreflight(response.data.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const submitDeposit = () => {
        console.log(currency)
        if (currency.type === 'BCLT') {
            if (preflight) {
                const depositObj = {
                    accessLevel:
                        identityUserData[user.bitclout.publicKey].accessLevel,
                    accessLevelHmac:
                        identityUserData[user.bitclout.publicKey]
                            .accessLevelHmac,
                    encryptedSeedHex:
                        identityUserData[user.bitclout.publicKey]
                            .encryptedSeedHex,
                    transactionHex: preflight.TransactionHex,
                    transactionIDBase58Check:
                        preflight.TransactionIDBase58Check,
                    value: parseFloat(depositValue),
                }
                handleBitcloutDeposit(depositObj)
                    .then((response) => {
                        setPage('completed')
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }
    }

    const valueHandler = (valueString: string) => {
        setDepositValue(valueString.replace(/^\$/, ''))
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
                        Your transaction has been completed successfully.
                    </Text>
                    <BlueButton
                        w="70%"
                        mt="6"
                        mb="8"
                        ml="15%"
                        text={`   Close   `}
                        onClick={() => {
                            disclosure.onClose()
                            setPage('deposit')
                            setDepositValue('0')
                            window.location.reload()
                        }}
                    />
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    const confirmDeposit = (
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
                        Confirm Deposit
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        The following amount will be deposited to your BitSwap
                        account
                    </Text>
                    <Text
                        color="gray.700"
                        fontSize="md"
                        fontWeight="600"
                        mt="4"
                        mb="2"
                    >
                        Amount of {currency.type} to Deposit: {depositValue}
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
                                setPage('deposit')
                            }}
                        >
                            Modify
                        </Button>
                        <BlueButton
                            w="47%"
                            text={`   Confirm   `}
                            onClick={submitDeposit}
                        />
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    const deposit = (
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
                    {currency.type == 'ETH'
                        ? user.balance.ether
                        : user.balance.bitclout}{' '}
                    {currency.type}
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
                        Deposit Funds
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Add funds to your BitSwap wallet!
                    </Text>
                    <Text
                        color="gray.600"
                        fontSize="sm"
                        fontWeight="600"
                        mt="6"
                    >
                        Amount of {currency.type} to Deposit
                    </Text>
                    <NumberInput
                        mt="4"
                        type="text"
                        placeholder="0.0"
                        value={depositValue}
                        onChange={valueHandler}
                        precision={4}
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
                            onClick={() => {
                                disclosure.onClose()
                                setDepositValue('0')
                                setPreflight(null)
                                setPage('deposit')
                            }}
                        >
                            Cancel
                        </Button>
                        <BlueButton
                            w="47%"
                            text={`   Confirm   `}
                            onClick={() => {
                                setPage('confirmDeposit')
                                currency.type === 'BCLT' && getPreflight()
                            }}
                        />
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            {page == 'deposit'
                ? deposit
                : page == 'confirmDeposit'
                ? confirmDeposit
                : completed}
        </Modal>
    )
}
