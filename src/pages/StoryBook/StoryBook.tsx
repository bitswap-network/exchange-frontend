/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { HiArrowRight } from 'react-icons/hi'
import { NavBar } from '../../components/NavBar'
import { BlueButton } from '../../components/BlueButton/BlueButton'

export function StoryBook() {
    return (
        <div>
            <NavBar />
            <Flex minH="100vh" align="center" justify="center">
                <Button rightIcon={<HiArrowRight />}>
                    {`Let's get started!`}
                </Button>
                <BlueButton text={`Let's get started!`} icon></BlueButton>
            </Flex>
        </div>
    )
}
