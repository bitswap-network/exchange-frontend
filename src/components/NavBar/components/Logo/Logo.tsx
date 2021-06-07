import React from "react"

import { Box, BoxProps, HStack, Image, Text } from "@chakra-ui/react"
import { LinkProps } from "react-router-dom"

type LogoProps = Partial<LinkProps & BoxProps>
export function Logo(props: LogoProps): React.ReactElement {
    return (
        <Box {...props}>
            <HStack ml="10" mr="5">
                <Image src="./bitswapLogo.png" alt="Bitswap Logo" htmlWidth="25px" objectFit="cover" />
                <Text fontSize="lg" fontWeight="600">
                    BitSwap
                </Text>
            </HStack>
        </Box>
    )
}
