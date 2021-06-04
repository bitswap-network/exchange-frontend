/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import { Box, Text, Image, Tooltip } from "@chakra-ui/react"
import { BlueButton } from "../BlueButton"

import * as globalVars from "../../globalVars"

export const BalanceCard = (props: any) => {
    // 📌 TODO: This is just a placeholder
    const balance = {
        imageUrl: props.imageUrl,
        imageAlt: props.imageAlt,
        currency: props.currency,
        amount: props.amount,
        publicKey: props.publicKey,
    }

    return (
        <Box
            boxShadow="xs"
            maxW="sm"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            d="flex"
            w="full"
            pos="relative"
        >
            <Image
                htmlWidth="70px"
                objectFit="cover"
                pos="absolute"
                top="4"
                right="4"
                src={balance.imageUrl}
            />
            <Box p="6" w="100%">
                <Box d="flex">
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
                <Box
                    mt="1"
                    fontWeight="semibold"
                    lineHeight="tight"
                    isTruncated
                >
                    <Tooltip
                        label={
                            balance.amount?.toString() + " " + balance.currency
                        }
                        aria-label=""
                    >
                        <Text fontSize="3xl" color="gray.600">
                            ~
                            {globalVars.formatBalanceLarge(balance.amount ?? 0)}{" "}
                            {balance.currency}
                        </Text>
                    </Tooltip>
                    {props.usdValue !== null ? (
                        <Tooltip
                            label={props.usdValue.toString() + " USD"}
                            aria-label="USD Value"
                        >
                            <Text fontSize="1xl" color="gray.500">
                                ~{props.usdValue.toFixed(2)} USD
                            </Text>
                        </Tooltip>
                    ) : (
                        <Text
                            fontSize="1xl"
                            color="white"
                            style={{ userSelect: "none" }}
                        >
                            Fetching...
                        </Text>
                    )}
                </Box>
                <Box paddingTop="5" d="flex" mt="8" justifyContent="center">
                    <BlueButton
                        onClick={props.openWithdrawModal}
                        text={"Withdraw"}
                        width="45%"
                    />
                    <BlueButton
                        onClick={props.openDepositModal}
                        ml="5"
                        text={"Deposit"}
                        width="45%"
                    />
                </Box>
            </Box>
        </Box>
    )
}
