/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Box, Heading } from '@chakra-ui/react'

export function Home(): React.ReactElement {
    return (
        <>
            <Box p="20">
                <Heading size="lg">Wallet</Heading>
            </Box>
        </>
    )
}
