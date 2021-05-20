/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Button, ButtonProps, Text } from '@chakra-ui/react'

import { HiArrowRight } from 'react-icons/hi'

interface BlueButtonProps extends ButtonProps {
    /** Text for button */
    text: string
    /** Determines if button should have icon */
    icon?: boolean
    /** width */
    width?: string
}

export const BlueButton: React.FC<BlueButtonProps> = ({
    text,
    icon,
    width,
    ...rest
}: BlueButtonProps) => {
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
            {...rest}
        >
            <Text fontSize="15px">{text}</Text>
        </Button>
    )
}
