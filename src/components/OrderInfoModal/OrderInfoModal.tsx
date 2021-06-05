import React, { useState } from "react"
import {
    Flex,
    Modal,
    Text,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Button,
    Divider,
    Box,
    Spacer,
} from "@chakra-ui/react"
import { BlueButton } from "../../components/BlueButton"
import { OrderTableDataInterface } from "../../interfaces/Order"
import { cancelOrder } from "../../services/order"
import * as globalVars from "../../globalVars"
interface OrderInfoModalProps {
    disclosure: {
        isOpen: boolean
        onOpen: () => void
        onClose: () => void
    }
    order: OrderTableDataInterface | undefined | null
}

export const OrderInfoModal: React.FC<OrderInfoModalProps> = ({
    disclosure,
    order,
}: OrderInfoModalProps) => {
    if (!order) {
        return null
    }
    const [cancelLoading, setCancelLoading] = useState<boolean>(false)
    const [cancelError, setCancelError] = useState<string | null>(null)
    const created = new Date(order.created)
    const completed: Date | null = order.completeTime
        ? new Date(order.completeTime)
        : null

    const cancelOrderHandler = () => {
        setCancelError(null)
        if (!order.complete) {
            setCancelLoading(true)
            cancelOrder(order.orderID)
                .then(() => {
                    setCancelLoading(false)
                    disclosure.onClose()
                    window.location.reload()
                })
                .catch((error: any) => {
                    if (error.response)
                        setCancelError(error.response.data.message)
                })
        }
    }
    return (
        <Modal
            isOpen={disclosure.isOpen}
            onClose={() => {
                disclosure.onClose()
                setCancelError(null)
                setCancelLoading(false)
            }}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex w="90%" ml="5%" flexDir="column">
                        <Text
                            fontSize="2xl"
                            fontWeight="700"
                            mt="6"
                            color="gray.700"
                        >
                            Order Details
                        </Text>

                        <Text color="gray.500" fontSize="sm" mb="2">
                            <b>Created: </b>
                            {globalVars.formateDateTime(created)}
                        </Text>
                        {completed && (
                            <Text color="gray.500" fontSize="sm" mb="2">
                                <b>Completed: </b>
                                {globalVars.formateDateTime(completed)}
                            </Text>
                        )}

                        <Divider mb="2" />
                        <Flex>
                            <Box>
                                <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    fontWeight="600"
                                    mt="2"
                                >
                                    STATUS
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    {order.status.toUpperCase()}
                                </Text>
                                <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    fontWeight="600"
                                    mt="2"
                                >
                                    ORDER TYPE
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    {order.orderType.toUpperCase()}
                                </Text>
                                <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    fontWeight="600"
                                    mt="2"
                                >
                                    PRICE PER {globalVars.BITCLOUT}
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    ${order.orderPrice} USD
                                </Text>
                            </Box>
                            <Spacer />
                            <Box align="right">
                                <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    fontWeight="600"
                                    mt="2"
                                >
                                    ORDER SIDE
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    {order.orderSide.toUpperCase()}
                                </Text>
                                <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    fontWeight="600"
                                    mt="2"
                                >
                                    ORDER QUANTITY
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    {order.orderQuantity} {globalVars.BITCLOUT}
                                </Text>
                                <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    fontWeight="600"
                                    mt="2"
                                >
                                    QUANTITY PROCESSED
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    {order.orderQuantityProcessed}{" "}
                                    {globalVars.BITCLOUT}
                                </Text>
                            </Box>
                        </Flex>
                        {order.error && order.error !== "" && (
                            <>
                                <Text
                                    color="red.400"
                                    fontSize="sm"
                                    fontWeight="600"
                                    mt="4"
                                    w="full"
                                    textAlign="center"
                                >
                                    {order.error}
                                </Text>
                            </>
                        )}

                        <Flex
                            flexDir="row"
                            justifyContent="space-between"
                            w="full"
                            mt="6"
                            mb="4"
                        >
                            <BlueButton
                                w="full"
                                text={`   Close   `}
                                mr={!order.complete ? "0" : "4"}
                                onClick={disclosure.onClose}
                                isLoading={cancelLoading}
                                ghost
                            />
                            {!order.complete && (
                                <>
                                    <BlueButton
                                        w="full"
                                        text={`   Cancel Order   `}
                                        ml={!order.complete ? "0" : "4"}
                                        onClick={cancelOrderHandler}
                                        isLoading={cancelLoading}
                                    />
                                </>
                            )}
                        </Flex>
                    </Flex>
                    {cancelError && (
                        <Text
                            color="red.400"
                            fontSize="md"
                            fontWeight="400"
                            mb="1"
                            w="full"
                            textAlign="center"
                        >
                            {cancelError}
                        </Text>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
