import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { VscArrowRight } from 'react-icons/vsc'

export function StoryBook() {
    return (
        <div>
            <Flex minH="100vh" align="center" justify="center">
                <Button rightIcon={<VscArrowRight />}>
                    {`Let's get started!`}
                </Button>
            </Flex>
        </div>
    )
}
