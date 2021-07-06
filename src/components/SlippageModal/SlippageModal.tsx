import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import * as globalVars from "../../globalVars";
import { BlueButton } from "../BlueButton";
interface SlippageModalProps {
    disclosure: {
        isOpen: boolean;
        onOpen: () => void;
        onClose: () => void;
    };
    setSlippage: (slippage: number) => void;
}

export const SlippageModal: React.FC<SlippageModalProps> = ({ disclosure, setSlippage }: SlippageModalProps) => {
    const [customSlippage, setCustomSlippage] = useState<string>("0.10");
    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Custom Slippage</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Enter a custom maximum slippage amount (%)</Text>
                    <Text color="gray.500" fontSize="sm" mb="4">
                        For example, a value of 2.5 means your max slippage tolerance will be 2.5%
                    </Text>
                    <NumberInput
                        min={0.1}
                        value={customSlippage}
                        onChange={(valueString: string) => {
                            setCustomSlippage(globalVars.parseNum(valueString));
                        }}
                        step={0.1}
                        precision={2}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={disclosure.onClose}>
                        Close
                    </Button>
                    <BlueButton
                        text={`   Confirm   `}
                        onClick={() => {
                            setSlippage(parseFloat(customSlippage));
                            disclosure.onClose();
                        }}
                        mr="3"
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
