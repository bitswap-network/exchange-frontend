import { Button, Modal, HStack, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Divider, Text } from "@chakra-ui/react";
import React from "react";
import * as globalVars from "../../../globalVars";
import { BlueButton } from "../../../components/BlueButton";
import { Link as RouterLink } from "react-router-dom";

interface InsufficientFundModalProps {
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    orderSide: string;
    orderAmount: {
        bitclout: number;
        ether: number;
    };
    userBalance:
        | {
              bitclout: number;
              ether: number;
          }
        | undefined;
}

export const InsufficientFundModal: React.FC<InsufficientFundModalProps> = ({
    disclosure,
    orderSide,
    orderAmount,
    userBalance,
}: InsufficientFundModalProps) => {
    return userBalance ? (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            <ModalContent p="4" px="8">
                <ModalHeader>
                    Deposit{" "}
                    {orderSide === "buy" ? +(orderAmount.ether - userBalance.ether).toFixed(4) : +(orderAmount.bitclout - userBalance.bitclout).toFixed(4)}{" "}
                    {orderSide === "buy" ? globalVars.ETHER : globalVars.BITCLOUT} to continue
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text color="gray.500" fontSize="sm" mb="4">
                        You don’t have enough funds in your balance to complete this transaction.
                    </Text>
                    <HStack justify="space-between">
                        <Text fontWeight="bold">Your Order</Text>
                        <Text color="gray.500" fontSize="sm" mb="4" font>
                            {orderSide === "buy"
                                ? `${+orderAmount.ether.toFixed(2)} ${globalVars.ETHER}`
                                : `${+orderAmount.bitclout.toFixed(2)} ${globalVars.BITCLOUT}`}
                        </Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                        <Text fontWeight="bold">Current Balance</Text>
                        <Text color="gray.500" fontSize="sm" mb="4">
                            {orderSide === "buy"
                                ? `${+userBalance.ether.toFixed(2)} ${globalVars.ETHER}`
                                : `${+userBalance.bitclout.toFixed(2)} ${globalVars.BITCLOUT}`}
                        </Text>
                    </HStack>
                    {/* <HStack justify="space-between">
                        <Text fontWeight="bold">Amount Missing</Text>
                        <Text color="gray.500" fontSize="sm" mb="4">
                            {orderSide === "buy" ? +(orderAmount.ether - userBalance.ether).toFixed(4) : +(orderAmount.bitclout - userBalance.bitclout).toFixed(4)} {orderSide === "buy" ? globalVars.ETHER : globalVars.BITCLOUT}
                        </Text>
                    </HStack> */}
                </ModalBody>
                <ModalFooter>
                    <HStack w="full" justify="space-between">
                        <Button variant="ghost" onClick={disclosure.onClose} w="full">
                            Cancel
                        </Button>
                        <RouterLink to={{ pathname: "/profile" }} style={{ width: "100%" }}>
                            <BlueButton
                                w="full"
                                onClick={() => {
                                    disclosure.onClose();
                                }}
                                text={`Deposit`}
                                mr="3"
                            />
                        </RouterLink>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    ) : null;
};
