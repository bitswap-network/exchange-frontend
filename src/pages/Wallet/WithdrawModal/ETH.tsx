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
    Input,
    Spinner,
    HStack,
    Link,
    VStack,
} from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { HiCheckCircle } from "react-icons/hi"
import { userState, identityUsers } from "../../../store"
import { withdrawEth } from "../../../services/gateway"
import { BlueButton } from "../../../components/BlueButton"
import { TransactionAPIInterface } from "../../../interfaces/bitclout/Transaction"
import { isAddress } from "ethereum-address"
// const ethereum_address = require("ethereum-address")
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
    const [ethAddressInput, setEthAddressInput] = useState<string>("")
    const [ethAddressInputErr, setEthAddressInputErr] = useState<string>("")
    const [withdrawSuccessful, setWithdrawSuccessful] = useState<boolean>(false)
    const [etherscanID, setEtherscanID] = useState<string>("")

    const submitWithdrawETH = () => {
        // submit eth withdraw stuff here
        withdrawEth(parseFloat(withdrawValue), ethAddressInput)
            .then((response) => {
                setWithdrawSuccessful(true)
                setEtherscanID(response.data.data.txnHash)
            })
            .catch((error) => {
                console.error(error)
            })

        setPage(1)
    }

    const valueHandler = async (valueString: string) => {
        setWithdrawValue(valueString.replace(/^\$/, ""))
    }

    const ethAddressValueHandler = (e: any) => {
        if (!isAddress(e.target.value)) {
            setEthAddressInputErr("Invalid ETH address")
        } else {
            setEthAddressInputErr("")
        }
        setEthAddressInput(e.target.value)
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
                        w="100%"
                        mt="6"
                        mb="8"
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
                        Transaction In Process
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        {withdrawValue} {globalVars.ETHER} will be withdrawn
                        from your BitSwap account. Once the transaction has gone
                        through, a link will be displayed below for you to
                        review.
                    </Text>
                    <HStack spacing={4} mt="4">
                        {!withdrawSuccessful ? (
                            <>
                                <Spinner
                                    thickness="3px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="gray.600"
                                    size="lg"
                                />
                                <Text color="gray.700" fontSize="md">
                                    Awaiting transfer
                                </Text>
                            </>
                        ) : (
                            <>
                                <HiCheckCircle size="36" color="#1dce9e" />
                                <VStack spacing={1} alignItems="flex-start">
                                    <Text color="gray.800" fontSize="md">
                                        Withdrawal successful
                                    </Text>
                                    <Link
                                        isExternal
                                        href={`https://etherscan.io/tx/${etherscanID}`}
                                        color="brand.100"
                                        fontWeight="600"
                                        textDecor="underline"
                                        fontSize="xs"
                                    >
                                        View on etherscan
                                    </Link>
                                </VStack>
                            </>
                        )}
                    </HStack>
                    <Flex
                        flexDir="row"
                        justifyContent="space-between"
                        w="full"
                        mt="6"
                        mb="8"
                    >
                        <BlueButton
                            w="90%"
                            ml="5%"
                            text={`   Continue   `}
                            isDisabled={!withdrawSuccessful}
                            onClick={() => setPage(2)}
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
                    {globalVars.formatBalanceSmall(user.balance.ether)}{" "}
                    {globalVars.ETHER}
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
                    <Text
                        color="gray.600"
                        fontSize="sm"
                        fontWeight="400"
                        mt="6"
                    >
                        Enter the {globalVars.ETHER} address you would like to
                        transfer the funds to
                    </Text>
                    <Input
                        mt="4"
                        type="text"
                        value={ethAddressInput}
                        placeholder={"Address"}
                        isInvalid={ethAddressInputErr != ""}
                        onChange={ethAddressValueHandler}
                    />
                    <Text color="red.300" fontSize="sm" fontWeight="400" mt="4">
                        {ethAddressInputErr}
                    </Text>

                    <Text color="gray.500" fontSize="xs" mt="2">
                        Please verify carefully that your address has been
                        entered correctly. Once the confirm button is clicked,
                        the transaction can no longer be modified.
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
                            isDisabled={
                                parseFloat(withdrawValue) > maxWithdraw ||
                                parseFloat(withdrawValue) <= 0 ||
                                !isAddress(ethAddressInput)
                            }
                            w="47%"
                            text={`   Confirm   `}
                            onClick={submitWithdrawETH}
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
