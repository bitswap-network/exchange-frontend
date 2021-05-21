/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Box, Text, Image } from '@chakra-ui/react'
import { BlueButton } from '../BlueButton'

export const BalanceCard = (props: any) => {
    // 📌 TODO: This is just a placeholder
    const balance = {
        imageUrl: props.imageUrl,
        imageAlt: props.imageAlt,
        currency: props.currency,
        amount: props.amount,
        usdValue: props.usdValue,
        publicKey: props.publicKey,
    }

    return (
        <Box
            boxShadow="1px 4px 8px 0px #00000040"
            maxW="sm"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            d="flex"
            w="full"
            pos="relative"
        >
            <Image
                alt="BitClout Logo"
                htmlWidth="50px"
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
                    <Text fontSize="3xl">
                        {balance.amount} {balance.currency}
                    </Text>
                    <Text fontSize="1xl" color="gray.500">
                        ~{balance.usdValue} USD
                    </Text>
                </Box>
                <Box>
                    <Box as="span" color="gray.400" fontSize="xs">
                        {balance.publicKey}
                    </Box>
                </Box>
                <Box d="flex" mt="8" justifyContent="center">
                    <BlueButton text={'Withdraw'} width="45%" />
                    <BlueButton ml="5" text={'Deposit'} width="45%" />
                </Box>
            </Box>
        </Box>
    )
}
