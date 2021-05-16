import React from 'react'
import { HStack, Text, Image } from '@chakra-ui/react'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Logo() {
    return (
        <HStack>
            <Image
                src="./bitswapLogo.png"
                alt="Bitswap Logo"
                htmlWidth="30px"
                objectFit="cover"
            />
            <Text fontSize="lg" fontWeight="bold">
                BITSWAP
            </Text>
        </HStack>
    )
}
