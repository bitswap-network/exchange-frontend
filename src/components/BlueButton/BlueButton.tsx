import React from 'react'
import { Button } from '@chakra-ui/react'
import { VscArrowRight } from 'react-icons/vsc'

export interface BlueButtonProps {
    /** Text for button */
    text: string
    /** Determines if button should have icon */
    icon?: boolean
}

export function BlueButton({ text, icon }: BlueButtonProps) {
    return (
        <Button color="white" rightIcon={icon ? <VscArrowRight /> : undefined}>
            {text}
        </Button>
    )
}
