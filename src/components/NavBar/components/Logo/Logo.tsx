import React from 'react'

import { Box, BoxProps, HStack, Image, Text } from '@chakra-ui/react'
import { LinkProps } from 'react-router-dom'

type LogoProps = Partial<LinkProps & BoxProps>
export function Logo(props: LogoProps): React.ReactElement {
    return (
        <Box {...props}>
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
        </Box>
    )
}
