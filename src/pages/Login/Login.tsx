
import React from 'react'
import { BlueButton } from '../../components/BlueButton/BlueButton'
import { VStack, Box, Text, Image } from '@chakra-ui/react'

export function Login(): React.ReactElement {
    return (
        <>
            <VStack spacing={4}>
                {/* 📌TODO: Change to BitSwap 3D thing with white background */}
                <Image src="./bitswapLogo.png" />
                <Text fontSize="xx-large" fontWeight="bold">
                    Welcome to BitSwap
                </Text>
                <Box as="span" ml="2" color="gray.600" fontSize="md">
                    To continue, please login to BitClout
                </Box>
                <BlueButton text={`   Login with BitClout   `} width="350px" />
            </VStack>
        </>
    )
}
