import React from 'react'
import { Flex } from '@chakra-ui/react'
import { BlueButton } from '../../components/BlueButton'

export function StoryBook() {
    return (
        <div>
            <Flex minH="100vh" align="center" justify="center">
                <BlueButton text={`Let's get started!`} icon />
            </Flex>
        </div>
    )
}
