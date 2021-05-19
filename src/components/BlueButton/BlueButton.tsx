/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Button, Text } from '@chakra-ui/react'
import { HiArrowRight } from 'react-icons/hi'

interface BlueButtonProps {
    /** Text for button */
    text: string
    /** Determines if button should have icon */
    icon?: boolean
    /** */
    width?: string
}

export function BlueButton({ text, icon, width }: BlueButtonProps) {
    return (
        <Button
            boxShadow="lg"
            bg="brand.100"
            _hover={{
                bg: 'brand.100',
            }}
            _active={{
                bg: 'brand.200',
            }}
            width={width ? width : ''}
            color="white"
            rightIcon={icon ? <HiArrowRight /> : undefined}
        >
            <Text fontSize="15px">{text}</Text>
        </Button>
    )
}
