/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import { Box, Text, Image, Tooltip, Flex, Spacer } from "@chakra-ui/react"
import { BlueButton } from "../BlueButton"

import * as globalVars from "../../globalVars"

interface BalanceCardProps {
    imageUrl: string
    currency: string
    amount?: number
    usdValue?: number
    openWithdrawModal: () => void
    openDepositModal: () => void
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    imageUrl,
    currency,
    amount,
    usdValue,
    openWithdrawModal,
    openDepositModal,
}: BalanceCardProps) => {
    return (
        <Box boxShadow="xs" maxW="sm" borderRadius="lg" overflow="hidden" bg="white" d="flex" w="full" pos="relative">
            <Flex flexDir="column" p="6" w="full">
                <Image htmlWidth="70px" objectFit="cover" pos="absolute" top="4" right="4" src={imageUrl} />
                <Box>
                    <Box w="100%">
                        <Box
                            color="gray.600"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                        >
                            Your Balance
                        </Box>
                    </Box>
                    <Box mt="1" fontWeight="semibold" lineHeight="tight" isTruncated>
                        <Tooltip label={amount?.toString() + " " + currency} aria-label="">
                            <Text fontSize="3xl" color="gray.600">
                                ~{globalVars.formatBalanceSmall(amount ?? 0)} {currency}
                            </Text>
                        </Tooltip>
                        {usdValue != null ? (
                            <Tooltip label={usdValue.toString() + " $USD"} aria-label="USD Value">
                                <Text fontSize="1xl" color="gray.500" h="30px">
                                    ~${usdValue.toFixed(2)} USD
                                </Text>
                            </Tooltip>
                        ) : null}
                    </Box>
                </Box>
                <Spacer />
                <Flex w="full" justify="space-between">
                    <BlueButton onClick={openWithdrawModal} text={"Withdraw"} width="45%" />
                    <BlueButton onClick={openDepositModal} text={"Deposit"} width="45%" />
                </Flex>
            </Flex>
        </Box>
    )
}
