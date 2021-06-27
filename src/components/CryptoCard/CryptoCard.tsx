/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Box, Text, Image, Button, Spinner } from "@chakra-ui/react";
import * as globalVars from "../../globalVars";

interface CryptoCardProps {
    active: boolean;
    imageUrl: string;
    currency: string;
    amount: number;
    border: boolean;
    size?: string;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ imageUrl, currency, amount, active, border, size }: CryptoCardProps) => {
    return (
        <Button
            // border={border && active ? "3px solid #D9E1F4" : "1px solid #D9E1F4"}
            borderColor="#D9E1F4"
            borderStyle="solid"
            borderWidth={border ? "2px" : "0px"}
            boxSizing="border-box"
            d="flex"
            alignItems="center"
            justifyContent="flex-start"
            py={{ base: "2", md: "4" }}
            px="2"
            background={active ? "white" : "#FAFAFA"}
            borderRadius="8"
            w="full"
            boxShadow="xs"
            h="initial"
            opacity={active ? 1 : 0.5}
            zIndex={active ? 1 : 0}
            overflowX="hidden"
        >
            <Image boxSize={{ base: "65px" }} objectFit="cover" src={imageUrl} />

            <Box ml="1">
                <Box d="flex" alignItems="center">
                    <Box color="gray.600" fontWeight="normal" letterSpacing="wide" fontSize="xs" textTransform="uppercase">
                        {currency} Balance
                    </Box>
                </Box>
                <Box mt="1" fontWeight="semibold" lineHeight="tight">
                    <Text fontSize="2xl" color="gray.600" textAlign="left">
                        {!isNaN(amount) ? globalVars.formatBalanceSmall(amount) : <Spinner />} {currency}
                    </Text>
                </Box>
            </Box>
        </Button>
    );
};
