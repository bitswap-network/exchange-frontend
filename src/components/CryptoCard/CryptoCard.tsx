/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import { Box, Text, Image, Button } from "@chakra-ui/react"
import * as globalVars from "../../globalVars"

export const CryptoCard = (props: any) => {
    // 📌 TODO: This is just a placeholder
    const balance = {
        imageUrl: props.imageUrl,
        currency: props.currency,
        amount: props.amount,
        publicKey: props.publicKey,
    }

    return (
        <Button
            border={props.active ? "3px solid #94b5ff" : "0px solid #94b5ff"}
            boxSizing="border-box"
            d="flex"
            alignItems="center"
            justifyContent="flex-start"
            p="5"
            pr="9"
            background="white"
            borderRadius="8"
            w="full"
            boxShadow="xs"
            h="-moz-initial"
            opacity={props.active ? 1 : 0.6}
        >
            <Image htmlWidth="70px" objectFit="cover" src={balance.imageUrl} />

            <Box ml="5">
                <Box d="flex" alignItems="center">
                    <Box
                        color="gray.600"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                    >
                        {balance.currency} Balance
                    </Box>
                </Box>
                <Box
                    mt="1"
                    fontWeight="semibold"
                    lineHeight="tight"
                    isTruncated
                >
                    <Text fontSize="3xl" color="gray.600">
                        {globalVars.formatBalanceSmall(balance.amount)}{" "}
                        {balance.currency}
                    </Text>
                </Box>
            </Box>
        </Button>
    )
}
