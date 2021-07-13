import React from "react";
import { Flex, Modal, Text, ModalOverlay, ModalContent, ModalBody, Link, ModalCloseButton, Button } from "@chakra-ui/react";
import { BlueButton } from "../../../components/BlueButton";
import { TransactionSchema } from "../../../interfaces/Transaction";
import * as globalVars from "../../../globalVars";

interface TransactionModalProps {
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    transaction: TransactionSchema | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ disclosure, transaction }: TransactionModalProps) => {
    if (!transaction) {
        return null;
    }
    const created = new Date(transaction.created);
    let completed;
    if (transaction.completionDate) {
        completed = new Date(transaction.completionDate);
    }
    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex w="90%" ml="5%" flexDir="column">
                        <Text fontSize="2xl" fontWeight="700" mt="6" mb="2" color="gray.700">
                            {transaction?.assetType} {transaction?.transactionType.toUpperCase()} TRANSFER
                        </Text>
                        <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                            TRANSFER ID
                        </Text>
                        <Text color="gray.500" fontSize="sm" mt="1">
                            {transaction?._id}
                        </Text>
                        <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                            STATUS
                        </Text>
                        <Text color="gray.500" fontSize="sm" mt="1">
                            {transaction?.state}
                        </Text>
                        {transaction?.txnHash ? (
                            <>
                                <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                    TXN HASH{" "}
                                    {transaction?.assetType == "ETH" ? (
                                        <Link
                                            isExternal
                                            href={`https://${globalVars.etherscanPrefix}etherscan.io/tx/${transaction.txnHash}`}
                                            color="brand.100"
                                            fontWeight="600"
                                            textDecor="underline"
                                            fontSize="xs"
                                        >
                                            (View on etherscan)
                                        </Link>
                                    ) : (
                                        <Link
                                            isExternal
                                            href={`https://explorer.bitclout.com/?transaction-id=${transaction.txnHash}`}
                                            color="brand.100"
                                            fontWeight="600"
                                            textDecor="underline"
                                            fontSize="xs"
                                        >
                                            (View on bitclout explorer)
                                        </Link>
                                    )}
                                </Text>
                                <Text color="gray.500" fontSize="xs" mt="1">
                                    {transaction?.txnHash}
                                </Text>
                            </>
                        ) : null}
                        <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                            FUNDS TRANSFERED
                        </Text>
                        <Text color="gray.500" fontSize="sm" mt="1">
                            {transaction?.value}
                        </Text>
                        {transaction?.gasDeducted ? (
                            <>
                                <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                    GAS DEDUCTED
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    {transaction?.gasDeducted}
                                </Text>
                            </>
                        ) : null}
                        <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                            DATE CREATED
                        </Text>
                        <Text color="gray.500" fontSize="sm" mt="1">
                            {created.toDateString()} {created.toLocaleTimeString()}
                        </Text>
                        {completed ? (
                            <>
                                <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                    DATE COMPLETED
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    {completed.toDateString()} {completed.toLocaleTimeString()}
                                </Text>
                            </>
                        ) : null}
                        {transaction?.error ? (
                            <>
                                <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                    ERROR
                                </Text>
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    {transaction?.error}
                                </Text>
                            </>
                        ) : null}
                        <Flex flexDir="row" justifyContent="space-between" w="full" mt="6%" mb="8%">
                            <BlueButton w="47%" text={`   Close   `} onClick={disclosure.onClose} />
                            <Button w="47%" variant="solid" as={Link} isExternal href={"https://discord.com/invite/bitswap"} onClick={disclosure.onClose}>
                                Support
                            </Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
