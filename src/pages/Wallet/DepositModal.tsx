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

interface ModalProps {
    disclosure: any
}

export const DepositModal: React.FC<ModalProps> = ({
    disclosure,
}: ModalProps) => {
    const user = useRecoilValue(userState)
    const identityUserData = useRecoilValue(identityUsers)
    const [depositValue, setDepositValue] = useState<string>('0')
    const [preflight, setPreflight] =
        useState<TransactionAPIInterface | null>(null)

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
                value: parseFloat(depositValue),
            }
            handleBitcloutDeposit(depositObj)
        }
    }

    const valueHandler = (valueString: string) => {
        setDepositValue(valueString.replace(/^\$/, ''))
    }

    // const getMaxBitclout = () => {
    //     if (user.balance.bitclout > 0) {
    //         bitcloutPreflightTxn(user.balance.bitclout)
    //             .then((response) => {
    //                 setDepositValue(
    //                     user.balance.bitclout -
    //                         parseInt(response.data.FeeNanos) / 1e9
    //                 )
    //             })
    //             .catch((error) => {
    //                 console.log(error)
    //             })
    //     }
    // }

    // user.balance.bitclout
    const deposit = (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
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
                        {user.balance.bitclout} BCLT
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
                            Amount of BCLT to Deposit
                        </Text>
                        <NumberInput
                            mt="4"
                            type="text"
                            placeholder="0.0"
                            value={depositValue}
                            onChange={valueHandler}
                            precision={2}
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
                            You will be able to review this transaction before
                            it’s complete.
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
                                onClick={disclosure.onClose}
                            />
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )

    return deposit
}
