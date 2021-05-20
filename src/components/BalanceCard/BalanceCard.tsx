/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import { BlueButton } from '../BlueButton'

export function BalanceCard() {
    // 📌 TODO: This is just a placeholder
    const balance = {
        imageUrl:
            'https://www.google.com/search?q=bitclout+png&rlz=1C5CHFA_enCA914CA914&tbm=isch&source=iu&ictx=1&fir=bObvfUw3tml4xM%252CLscjq3ngbNgZVM%252C_&vet=1&usg=AI4_-kR8kPv28H_ew_XNZjrX4u1arEi-Lg&sa=X&ved=2ahUKEwiNiemG_8zwAhU7ElkFHbyyDQUQ9QF6BAgSEAE&biw=890&bih=1009#imgrc=bObvfUw3tml4xM',
        imageAlt: 'BitClout Logo',
        currency: 'BCLT',
        amount: 0.00021,
        publicKey: '<bitclout public key>',
    }

    return (
        <Box boxShadow="2xl" maxW="sm" borderRadius="lg" overflow="hidden">
            <Box p="6">
                <Box d="flex" alignItems="baseline">
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
                </Box>
                <Box>
                    <Box as="span" color="gray.400" fontSize="xs">
                        {balance.publicKey}
                    </Box>
                </Box>
                <Box d="flex" mt="2" alignItems="center">
                    <BlueButton text={'Withdraw'} width="200px" />
                    <Box ml="5">
                        <BlueButton text={'Deposit'} width="200px" />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
