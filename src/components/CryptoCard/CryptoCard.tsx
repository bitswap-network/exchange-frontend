/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import { Box, Text, Image, Button } from "@chakra-ui/react"
import * as globalVars from "../../globalVars"

interface CryptoCardProps {
    active: boolean
    imageUrl: string
    currency: string
    amount: number
    border: boolean
    size?: string
}

export const CryptoCard: React.FC<CryptoCardProps> = ({
    imageUrl,
    currency,
    amount,
    active,
    border,
    size,
}: CryptoCardProps) => {
    return (
        <Button
            border={border && active ? "3px solid #94b5ff" : "0px solid #94b5ff"}
            boxSizing="border-box"
            d="flex"
            alignItems="center"
            justifyContent="flex-start"
            p={size == "sm" ? "2" : "5"}
            pr={size == "sm" ? "4" : "9"}
            background="white"
            borderRadius="8"
            w="full"
            boxShadow="xs"
            h="-moz-initial"
            opacity={active ? 1 : 0.6}
        >
            <Image htmlWidth="70px" objectFit="cover" src={imageUrl} />

            <Box ml="5">
                <Box d="flex" alignItems="center">
                    <Box
                        color="gray.600"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                    >
                        {currency} Balance
                    </Box>
                </Box>
                <Box mt="1" fontWeight="semibold" lineHeight="tight" isTruncated>
                    <Text fontSize="3xl" color="gray.600">
                        {globalVars.formatBalanceSmall(amount)} {currency}
                    </Text>
                </Box>
            </Box>
        </Button>
    )
}
