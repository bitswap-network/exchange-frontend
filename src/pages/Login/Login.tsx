/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { NavBar } from '../../components/NavBar'
import { BlueButton } from '../../components/BlueButton/BlueButton'
import { VStack, Box, Text, Image } from '@chakra-ui/react'

export function Login() {
    return (
        <>
            <VStack spacing={4}>
                {/* 📌TODO: Change BitSwap 3D thing to have white background */}

                <Box boxSize="sm">
                    <Image src="./bitswapgifsmall.gif" />
                </Box>
                <Text fontSize="xx-large" fontWeight="bold">
                    Welcome to BitSwap
                </Text>
                <Text fontSize="small" fontWeight="light">
                    To continue, please login to BitClout
                </Text>
                {/* 📌TODO: Make button wider */}
                <BlueButton text={`   Login with BitClout   `} />
            </VStack>
        </>
    )
}
