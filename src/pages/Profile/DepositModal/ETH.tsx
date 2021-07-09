import React, { useState, useEffect } from "react";
import {
    Modal,
    Text,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Flex,
    Button,
    InputRightElement,
    InputGroup,
    Input,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { HiCheckCircle } from "react-icons/hi";
import { useRecoilValue } from "recoil";
import { userState } from "../../../store";
import { depositEth, cancelDeposit } from "../../../services/gateway";
import { getTransactionById } from "../../../services/user";
import { BlueButton } from "../../../components/BlueButton";
import { TransactionSchema } from "../../../interfaces/Transaction";

import * as globalVars from "../../../globalVars";

interface DepositModalProps {
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
}

export const EthDepositModal: React.FC<DepositModalProps> = ({ disclosure }: DepositModalProps) => {
    let ETHTransferAddress: HTMLInputElement | null = null;
    const user = useRecoilValue(userState);
    const [textCopied, setTextCopied] = useState("copy");
    const [addressLoading, setAddressLoading] = useState(false);
    const [confirmButtonState, setConfirmButtonState] = useState(0);
    const [depositAddress, setDepositAddress] = useState<string | null>(null);
    const [depositSuccessful, setDepositSuccessful] = useState(false);
    const [depositTransaction, setDepositTransaction] = useState<TransactionSchema | null>(null);
    const [page, setPage] = useState<number>(0);
    const [currentOpenState, setCurrentOpenState] = useState<boolean>(disclosure.isOpen);

    useEffect(() => {
        if (currentOpenState === true && disclosure.isOpen === false && page === 1) {
            location.reload();
        }
        setCurrentOpenState(disclosure.isOpen);
    }, [disclosure.isOpen]);

    const cancelDepositHandler = () => {
        if (depositTransaction) {
            cancelDeposit(depositTransaction._id)
                .then(() => {
                    disclosure.onClose();
                    setPage(0);
                    location.reload();
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const startDeposit = () => {
        if (confirmButtonState === 0) {
            setConfirmButtonState(1);
            setAddressLoading(true);
            depositEth()
                .then((response) => {
                    setDepositAddress(response.data.data.address);
                    setDepositTransaction(response.data.data.transaction);
                    setAddressLoading(false);
                    setConfirmButtonState(2);
                })
                .catch((error) => {
                    console.error(error);
                    setAddressLoading(false);
                    setConfirmButtonState(2);
                });
        } else {
            setPage(page + 1);
        }
    };

    const checkDeposit = () => {
        if (depositTransaction) {
            getTransactionById(depositTransaction._id)
                .then((response) => {
                    if (response.data.data.state === "done") {
                        setDepositSuccessful(true);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    globalVars.useInterval(checkDeposit, 5000);

    const renderHandler = () => {
        switch (page) {
            case 0:
                return depositStartView;
            case 1:
                return depositCompleteView;
            case 2:
                return depositCancelView;
            default:
                return depositStartView;
        }
    };

    const copyToClipboard = (e: any) => {
        ETHTransferAddress && ETHTransferAddress.select();
        document.execCommand("copy");
        setTextCopied("Copied!");
        setTimeout(function () {
            setTextCopied("Copy");
        }, 3000);
        e.target.focus();
    };

    const depositCancelView = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Flex w="80%" ml="10%" flexDir="column">
                    <Text fontSize="xl" fontWeight="700" mt="6" mb="2" color="gray.700">
                        Confirm cancellation
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Are you sure you want to cancel this deposit? If you have already transferred funds to this account, do not cancel this deposit as you
                        may lose them.
                    </Text>
                    <Flex flexDir="row" justifyContent="space-between" w="full" mt="6%" mb="8%">
                        <Button
                            w="47%"
                            variant="ghost"
                            onClick={() => {
                                setPage(0);
                            }}
                        >
                            Go back
                        </Button>
                        <BlueButton w="47%" text={`   Cancel Deposit   `} onClick={cancelDepositHandler} />
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    );

    const depositCompleteView = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Flex w="80%" ml="10%" flexDir="column">
                    <Text fontSize="xl" fontWeight="700" mt="6" mb="2" color="gray.700">
                        Transaction Completed
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Your transaction has been completed successfully.
                    </Text>
                    <BlueButton
                        w="90%"
                        mt="6"
                        mb="8"
                        ml="5%"
                        text={`   Close   `}
                        onClick={() => {
                            disclosure.onClose();
                        }}
                    />
                </Flex>
            </ModalBody>
        </ModalContent>
    );

    const depositStartView = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Text textAlign="center" fontSize="xx-large" fontWeight="700" w="full" mt="6">
                    {globalVars.formatBalanceSmall(user.balance.ether)} {globalVars.ETHER}
                </Text>
                <Text textAlign="center" color="gray.500" fontSize="sm" w="full" mb="6">
                    Currently Available
                </Text>
                <Flex w="80%" ml="10%" flexDir="column">
                    <Text fontSize="xl" fontWeight="700" mb="2" color="gray.700">
                        Deposit Funds
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Add ETH to your BitSwap wallet! Click continue below to generate a transfer address.
                    </Text>
                    {depositAddress ? (
                        <>
                            <InputGroup size="md" mt="4">
                                <Input
                                    pr="4.5rem"
                                    ref={(input) => {
                                        ETHTransferAddress = input;
                                    }}
                                    type="text"
                                    isReadOnly={true}
                                    value={depositAddress}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={copyToClipboard}>
                                        {textCopied}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <VStack spacing={4} mt="6">
                                {!depositSuccessful ? (
                                    <>
                                        <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="gray.600" size="lg" />
                                        <Text color="gray.700" fontSize="md">
                                            Awaiting transfer
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <HiCheckCircle size="36" color="#1dce9e" />
                                        <Text color="gray.800" fontSize="md">
                                            Deposit successful
                                        </Text>
                                    </>
                                )}
                            </VStack>
                            <Text color="gray.500" fontSize="xs" mt="6">
                                Only transfer funds to this address <span style={{ fontWeight: 800 }}>ONCE</span>. Any further transfers will not go through and
                                your funds may be lost.
                            </Text>
                            <Text color="gray.500" fontSize="xs" mt="2">
                                Do not copy the address by hand. Incorrect addresses may result in deposits in the wrong account and cannot be undone.
                            </Text>
                        </>
                    ) : null}

                    <Flex flexDir="row" justifyContent="space-between" w="full" mt="6%" mb="8%">
                        {!depositSuccessful && depositAddress ? (
                            <Button w="90%" ml="5%" variant="solid" onClick={() => setPage(2)}>
                                Cancel
                            </Button>
                        ) : (
                            <>
                                <Button
                                    w="47%"
                                    variant="ghost"
                                    onClick={() => {
                                        disclosure.onClose();
                                        setPage(0);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <BlueButton w="47%" text={`   Continue   `} onClick={startDeposit} isDisabled={confirmButtonState == 1} icon />
                            </>
                        )}
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    );

    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            {renderHandler()}
        </Modal>
    );
};
