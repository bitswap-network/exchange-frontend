import React, { ReactElement } from 'react'
import { Box, Code, Grid, Link, Text, VStack } from '@chakra-ui/react'
import { ColorModeSwitcher } from '../../components/ColorModeSwitcher/ColorModeSwitcher'
import { Logo } from '../../Logo'

const ChakraHome: React.FC<Record<string, never>> = (): ReactElement => (
    <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <VStack spacing={8}>
                <Logo h="40vmin" pointerEvents="none" />
                <Text>
                    Edit <Code fontSize="xl">src/App.tsx</Code> and save to
                    reload.
                </Text>
                <Link
                    color="teal.500"
                    href="https://chakra-ui.com"
                    fontSize="2xl"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn Chakra
                </Link>
            </VStack>
        </Grid>
    </Box>
)

export default ChakraHome
