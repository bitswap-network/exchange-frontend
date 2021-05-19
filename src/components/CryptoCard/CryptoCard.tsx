/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Box, Text, Image } from '@chakra-ui/react'

export function CryptoCard() {
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
        <Box boxShadow="2xl" borderRadius="lg" overflow="hidden">
            <Box p="6">
                <Box d="flex" mt="2" alignItems="center">
                    <Image
                        alt="BitClout Logo"
                        htmlWidth="70px"
                        objectFit="cover"
                        src="./bitcloutLogo.png"
                    />

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
                            <Text fontSize="3xl">
                                {balance.amount} {balance.currency}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
