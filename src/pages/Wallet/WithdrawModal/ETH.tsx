import React, { useEffect, useState } from "react"
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
} from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { userState, identityUsers } from "../../../store"
import {
    withdrawBitclout,
    bitcloutPreflightTxn,
} from "../../../services/gateway"
import { BlueButton } from "../../../components/BlueButton"
import { TransactionAPIInterface } from "../../../interfaces/bitclout/Transaction"
import * as globalVars from "../../../globalVars"

interface WithdrawModalProps {
    disclosure: {
        isOpen: boolean
        onOpen: () => void
        onClose: () => void
    }
    maxWithdraw: number
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
    disclosure,
    maxWithdraw,
}: WithdrawModalProps) => {
    const user = useRecoilValue(userState)
    const [withdrawValue, setWithdrawValue] = useState<string>("0")
    const [page, setPage] = useState(0)

    const submitWithdrawBitclout = () => {
        if (withdrawValue) {
            withdrawBitclout(parseFloat(withdrawValue))
                .then(() => {
                    setPage(2)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const valueHandler = async (valueString: string) => {
        setWithdrawValue(valueString.replace(/^\$/, ""))
    }

    const renderHandler = () => {
        switch (page) {
            case 0:
                return withdrawStartView
            case 1:
                return withdrawConfirmView
            case 2:
                return withdrawCompleteView
            default:
                return withdrawStartView
        }
    }

    const withdrawCompleteView = (
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
                            setPage(0)
                            setWithdrawValue("0")
                            window.location.reload()
                        }}
                    />
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    const withdrawConfirmView = (
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
                        Amount of {globalVars.ETHER} to Withdraw:{" "}
                        {withdrawValue}
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
                                setPage(0)
                            }}
                        >
                            Modify
                        </Button>
                        <BlueButton
                            w="47%"
                            text={`   Confirm   `}
                            isDisabled={parseFloat(withdrawValue) <= 0}
                            onClick={submitWithdrawBitclout}
                        />
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    const withdrawStartView = (
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
                    {user.balance.ether} {globalVars.ETHER}
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
                        Amount of {globalVars.ETHER} to withdraw{" "}
                        <Button
                            variant="solid"
                            fontSize="sm"
                            p="3"
                            h="30px"
                            ml="2"
                            onClick={() =>
                                setWithdrawValue(maxWithdraw.toString())
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
                        precision={4}
                        step={0.1}
                        min={0}
                        max={maxWithdraw}
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
                            isDisabled={parseFloat(withdrawValue) > maxWithdraw}
                            w="47%"
                            text={`   Confirm   `}
                            onClick={() => setPage(1)}
                        />
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    )

    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            {renderHandler()}
        </Modal>
    )
}

export default WithdrawModal