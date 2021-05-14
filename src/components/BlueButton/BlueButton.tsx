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
    const theme = extendTheme({
        shadows: {
            outline: '0 0 0 3px #2669EC',
        },
    })
    return (
        <ChakraProvider theme={theme}>
            <Button
                rightIcon={icon ? <VscArrowRight /> : undefined}
                color="#4978F0"
                variant="solid"
            >
                {text}
            </Button>
        </ChakraProvider>
    )
}
