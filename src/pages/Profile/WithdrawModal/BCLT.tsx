import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { userState } from "../../../store";
import { withdrawBitclout } from "../../../services/gateway";
import { BlueButton } from "../../../components/BlueButton";

import * as globalVars from "../../../globalVars";

interface WithdrawModalProps {
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    maxWithdraw: number;
    withdrawRemaining: number | null;
}

export const BitcloutWithdrawModal: React.FC<WithdrawModalProps> = ({ disclosure, maxWithdraw, withdrawRemaining }: WithdrawModalProps) => {
    const user = useRecoilValue(userState);
    const [withdrawValue, setWithdrawValue] = useState<string>("0");
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(0);

    const submitWithdrawBitclout = () => {
        setLoading(true);
        if (withdrawValue) {
            withdrawBitclout(parseFloat(withdrawValue))
                .then(() => {
                    setLoading(false);
                    setPage(2);
                })
                .catch((error) => {
                    setLoading(false);
                    console.error(error);
                });
        }
    };

    const valueHandler = async (valueString: string) => {
        setWithdrawValue(valueString.replace(/^\$/, ""));
    };

    const renderHandler = () => {
        switch (page) {
            case 0:
                return withdrawStartView;
            case 1:
                return withdrawConfirmView;
            case 2:
                return withdrawCompleteView;
            default:
                return withdrawStartView;
        }
    };

    const withdrawCompleteView = (
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
                        w="100%"
                        mt="6"
                        mb="8"
                        text={`   Close   `}
                        onClick={() => {
                            disclosure.onClose();
                            setPage(0);
                            setWithdrawValue("0");
                        }}
                    />
                </Flex>
            </ModalBody>
        </ModalContent>
    );

    const withdrawConfirmView = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Flex w="80%" ml="10%" flexDir="column">
                    <Text fontSize="xl" fontWeight="700" mt="6" mb="2" color="gray.700">
                        Confirm Withdrawal
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        The following amount will be withdrawn from your BitSwap account
                    </Text>
                    <Text color="gray.700" fontSize="md" fontWeight="400" mt="4" mb="2">
                        <b>Total Amount: </b>
                        {withdrawValue} {globalVars.BITCLOUT}
                    </Text>
                    <Flex flexDir="row" justifyContent="space-between" w="full" mt="6%" mb="8%">
                        <BlueButton
                            text={`   Modify   `}
                            w="47%"
                            ghost
                            onClick={() => {
                                setPage(0);
                            }}
                        />

                        <BlueButton
                            w="47%"
                            text={`   Confirm   `}
                            isDisabled={parseFloat(withdrawValue) <= 0}
                            onClick={submitWithdrawBitclout}
                            loading={loading}
                            icon
                        />
                    </Flex>
                </Flex>
            </ModalBody>
        </ModalContent>
    );

    const withdrawStartView = (
        <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Text textAlign="center" fontSize="xx-large" fontWeight="700" w="full" mt="6">
                    {user ? globalVars.formatBalanceSmall(user.balance.bitclout) : 0} {globalVars.BITCLOUT}
                </Text>
                <Text textAlign="center" color="gray.500" fontSize="sm" w="full" mb="6">
                    Currently Available
                </Text>
                <Flex w="80%" ml="10%" flexDir="column">
                    <Text fontSize="xl" fontWeight="700" mb="2" color="gray.700">
                        Withdraw Funds
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Withdraw funds from your BitSwap wallet!
                    </Text>
                    <Text color="gray.600" fontSize="sm" fontWeight="600" mt="6">
                        Amount of {globalVars.BITCLOUT} to withdraw{" "}
                        <Button variant="solid" fontSize="sm" p="3" h="30px" ml="2" onClick={() => setWithdrawValue(maxWithdraw.toString())}>
                            Max
                        </Button>
                    </Text>
                    {withdrawRemaining && (
                        <Text color="gray.600" fontSize="sm" mt="2">
                            ${withdrawRemaining?.toFixed(2)} USD remaining for withdrawal
                        </Text>
                    )}
                    <NumberInput mt="4" type="text" placeholder="0.0" value={withdrawValue} onChange={valueHandler} step={0.1} min={0} max={maxWithdraw}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Text color="gray.500" fontSize="sm" mt="6">
                        You will be able to review this transaction before it’s complete.
                    </Text>
                    <Flex flexDir="row" justifyContent="space-between" w="full" mt="6%" mb="8%">
                        <Button w="47%" variant="ghost" onClick={disclosure.onClose}>
                            Cancel
                        </Button>
                        <BlueButton
                            isDisabled={parseFloat(withdrawValue) > maxWithdraw || parseFloat(withdrawValue) <= 0}
                            w="47%"
                            text={`   Continue   `}
                            onClick={() => setPage(1)}
                        />
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
