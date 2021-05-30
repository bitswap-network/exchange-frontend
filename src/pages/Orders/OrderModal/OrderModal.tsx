import React from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalProps,
    FormControl,
    FormLabel,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Text,
    Stack,
    useControllableState,
} from "@chakra-ui/react"
import { BlueButton } from "../../../components/BlueButton"
import { createMarketOrder, createLimitOrder } from "../../../services/order"

type OrderModalProps = Omit<ModalProps, "children">

export function OrderModal({
    isOpen,
    onClose,
}: OrderModalProps): React.ReactElement {
    const parseNum = (val: string) => val.replace(/^\$/, "")
    const [amountBitclout, setAmountBitclout] = useControllableState({
        defaultValue: "0",
    })
    const [usdPer, setUsdPer] = useControllableState({
        defaultValue: "0",
    })
    const [orderType, setOrderType] = useControllableState({
        defaultValue: "market",
    })
    const [orderSide, setOrderSide] = useControllableState({
        defaultValue: "buy",
    })
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create New Order</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4}>
                        <FormControl id="bcltAmount">
                            <FormLabel>Amount of BCLT</FormLabel>
                            <NumberInput
                                min={0}
                                value={amountBitclout}
                                onChange={(valueString) =>
                                    setAmountBitclout(parseNum(valueString))
                                }
                                step={1}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl id="usd">
                            <FormLabel>$USD per BCLT</FormLabel>
                            <NumberInput
                                min={0}
                                value={usdPer}
                                onChange={(valueString) =>
                                    setUsdPer(parseNum(valueString))
                                }
                                step={5}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl id="type">
                            <FormLabel>Order Type </FormLabel>
                            <Select>
                                <option>Market Order</option>
                                <option>Limit Order</option>
                            </Select>
                        </FormControl>
                        <FormControl id="side">
                            <FormLabel>Order Side </FormLabel>
                            <Select>
                                <option>Buy</option>
                                <option>Sell</option>
                            </Select>
                        </FormControl>
                        <Text color="gray.600"> Total $ETH </Text>
                        <Text color="gray.600"> Total $USD </Text>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <BlueButton w="100%" text="Continue" />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
