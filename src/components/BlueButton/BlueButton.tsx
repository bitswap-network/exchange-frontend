/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Button } from '@chakra-ui/react'
import { HiArrowRight } from 'react-icons/hi'

interface BlueButtonProps {
    /** Text for button */
    text: string
    /** Determines if button should have icon */
    icon?: boolean
}

export function BlueButton({ text, icon }: BlueButtonProps) {
    return (
        <Button
            bg="brand.100"
            _hover={{
                bg: 'brand.100',
            }}
            _active={{
                bg: 'brand.200',
            }}
            color="white"
            rightIcon={icon ? <HiArrowRight /> : undefined}
        >
            {text}
        </Button>
    )
}
