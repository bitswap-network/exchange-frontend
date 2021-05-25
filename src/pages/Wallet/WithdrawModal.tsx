import React, { useEffect, useState } from 'react'
import {
    Box,
    Flex,
    Heading,
    VStack,
    SimpleGrid,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { BalanceCard } from '../../components/BalanceCard'
import { CryptoCard } from '../../components/CryptoCard'
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import { userState } from '../../store'
import { getEthUSD, getBitcloutUSD } from '../../services/utility'
import { launch, sign } from '../../services/identity'
import { BlueButton } from '../../components/BlueButton'

interface ModalProps {
    disclosure: any
}

export const WithdrawModal: React.FC<ModalProps> = ({
    disclosure,
}: ModalProps) => {
    return (
        <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Withdraw</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    An email was sent to for verification. Check your spam
                    folder if you cannot find the email.
                </ModalBody>

                <ModalFooter>
                    <BlueButton
                        text={`   Close   `}
                        onClick={disclosure.onClose}
                        mr="3"
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
