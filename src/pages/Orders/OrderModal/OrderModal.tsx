import React from 'react'
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
} from '@chakra-ui/react'
import { BlueButton } from '../../../components/BlueButton'

type OrderModalProps = Omit<ModalProps, 'children'>

export function OrderModal({
    isOpen,
    onClose,
}: OrderModalProps): React.ReactElement {
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
                            <NumberInput max={50} min={10}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl id="usd">
                            <FormLabel>$USD per BCLT</FormLabel>
                            <NumberInput max={50} min={10}>
                                <NumberInputField />
                            </NumberInput>
                        </FormControl>
                        <FormControl id="type">
                            <FormLabel>Order Type </FormLabel>
                            <Select>
                                <option>Market Order</option>
                                <option>Limit Order</option>
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
