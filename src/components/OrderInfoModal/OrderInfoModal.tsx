import React, { useState } from "react";
import { Flex, Modal, Text, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Divider, Box, Spacer } from "@chakra-ui/react";
import { BlueButton } from "../../components/BlueButton";
import { OrderTableDataInterface } from "../../interfaces/Order";
import { cancelOrder } from "../../services/order";
import * as globalVars from "../../globalVars";
import { useEffect } from "react";
interface OrderInfoModalProps {
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    order: OrderTableDataInterface | undefined | null;
}

export const OrderInfoModal: React.FC<OrderInfoModalProps> = ({ disclosure, order }: OrderInfoModalProps) => {
    if (!order) {
        return null;
    }
    const [cancelLoading, setCancelLoading] = useState<boolean>(false);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const created = new Date(order.created);
    const completed: Date | null = order.completeTime ? new Date(order.completeTime) : null;
    useEffect(() => {
        if (disclosure.isOpen) {
            setCancelError(null);
            setPage(0);
        }
        console.log(order);
    }, [disclosure.isOpen]);
    const cancelOrderHandler = () => {
        setCancelError(null);
        if (!order.complete) {
            setCancelLoading(true);
            setCancelError(null);
            cancelOrder(order.orderID)
                .then(() => {
                    setCancelLoading(false);
                    setPage(0);
                    disclosure.onClose();
                })
                .catch((error: any) => {
                    setCancelLoading(false);
                    if (error.response) setCancelError(error.response.data.message);
                });
        }
    };

    const renderHandler = () => {
        switch (page) {
            case 0:
                return infoModal;
            case 1:
                return confirmCancelModal;
            default:
                return infoModal;
        }
    };

    const infoModal = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Flex w="90%" ml="5%" flexDir="column">
                    <Flex flexDir="row">
                        <Text fontSize="2xl" fontWeight="700" mt="6" color="gray.700">
                            Order Details
                        </Text>
                        <Spacer />
                        <Text
                            color={order.status === "Active" ? "green.700" : order.status === "Partial" ? "yellow.500" : "red.500"}
                            fontWeight="600"
                            fontSize="xl"
                            mt="7"
                            mr="2"
                        >
                            {order.status.toUpperCase()}
                        </Text>
                    </Flex>

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
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                ORDER TYPE
                            </Text>
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {order.orderType.toUpperCase()}
                            </Text>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                LIMIT PRICE
                            </Text>
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {order.orderPrice ? `${order.orderPrice.toFixed(2)} $USD` : " - "}
                            </Text>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                EXECUTION PRICE
                            </Text>
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {order.execPrice ? `${order.execPrice.toFixed(2)} $USD` : " - "}
                            </Text>
                        </Box>
                        <Spacer />
                        <Box align="right">
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                ORDER SIDE
                            </Text>
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {order.orderSide.toUpperCase()}
                            </Text>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                ORDER QUANTITY
                            </Text>
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {+order.orderQuantity.toFixed(globalVars.ROUNDING_PRECISION)} {globalVars.BITCLOUT} /{" "}
                                {+order.etherQuantity.toFixed(globalVars.ROUNDING_PRECISION)} {globalVars.ETHER}
                            </Text>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                QUANTITY PROCESSED
                            </Text>
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {+order.orderQuantityProcessed.toFixed(globalVars.ROUNDING_PRECISION)} {globalVars.BITCLOUT}
                            </Text>
                        </Box>
                    </Flex>
                    {order.error && order.error !== "" && (
                        <>
                            <Text color="red.400" fontSize="sm" fontWeight="600" mt="4" w="full" textAlign="center">
                                {order.error}
                            </Text>
                        </>
                    )}

                    <Flex flexDir="row" justifyContent="space-between" w="full" mt="6" mb="4">
                        <BlueButton w="full" text={`   Close   `} mr={order.complete ? "0" : "4"} onClick={disclosure.onClose} ghost />
                        {!order.complete && (
                            <>
                                <BlueButton w="full" text={`   Cancel Order   `} ml={"4"} onClick={() => setPage(1)} isLoading={cancelLoading} />
                            </>
                        )}
                    </Flex>
                </Flex>
                {cancelError && (
                    <Text color="red.400" fontSize="md" fontWeight="400" mb="1" w="full" textAlign="center">
                        {cancelError}
                    </Text>
                )}
            </ModalBody>
        </ModalContent>
    );

    const confirmCancelModal = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Flex w="90%" ml="5%" flexDir="column">
                    <Text fontSize="2xl" fontWeight="700" mt="6" color="gray.700">
                        Confirm Cancel
                    </Text>
                    <Text fontSize="md" fontWeight="500" mt="2" color="gray.600">
                        Are you sure you want to cancel this order?
                    </Text>
                </Flex>
                <Flex flexDir="row" justifyContent="space-between" w="90%" ml="5%" mt="6" mb="4">
                    <BlueButton w="full" text={`   Go Back   `} mr={order.complete ? "0" : "4"} onClick={() => setPage(0)} ghost />
                    {!order.complete && (
                        <>
                            <BlueButton w="full" text={`   Cancel Order   `} ml={"4"} onClick={cancelOrderHandler} isLoading={cancelLoading} />
                        </>
                    )}
                </Flex>
                {cancelError && (
                    <Text color="red.400" fontSize="md" fontWeight="400" mb="1" w="full" textAlign="center">
                        {cancelError}
                    </Text>
                )}
            </ModalBody>
        </ModalContent>
    );

    return (
        <Modal
            isOpen={disclosure.isOpen}
            onClose={() => {
                disclosure.onClose();
                setCancelError(null);
                setCancelLoading(false);
            }}
        >
            <ModalOverlay />
            {renderHandler()}
        </Modal>
    );
};
