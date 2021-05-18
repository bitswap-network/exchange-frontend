import React from 'react'
import { Box, BoxProps, Text } from '@chakra-ui/react'
import { LinkProps } from 'react-router-dom'

type LogoProps = Partial<LinkProps & BoxProps>
export function Logo(props: LogoProps): React.ReactElement {
    return (
        <Box {...props}>
            <Text fontSize="lg" fontWeight="bold">
                BITSWAP
            </Text>
        </Box>
    )
}
