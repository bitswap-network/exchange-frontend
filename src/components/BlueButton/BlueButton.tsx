/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react"
import { Button, ButtonProps, Text, Spinner } from "@chakra-ui/react"

import { HiArrowRight } from "react-icons/hi"

interface BlueButtonProps extends ButtonProps {
    /** Text for button */
    text: string
    /** Determines if button should have icon */
    icon?: boolean
    /** width */
    width?: any
    loading?: boolean
    disabled?: boolean
}

export const BlueButton: React.FC<BlueButtonProps> = ({
    text,
    icon,
    width,
    loading,
    disabled,
    ...rest
}: BlueButtonProps) => {
    return (
        <Button
            isLoading={loading}
            boxShadow="md"
            bg="brand.100"
            opacity={disabled ? 0.6 : 1}
            _hover={{
                bg: "brand.150",
            }}
            _active={{
                bg: "brand.200",
            }}
            width={width ? width : ""}
            color="white"
            rightIcon={icon && !loading ? <HiArrowRight /> : undefined}
            {...rest}
        >
            <Text fontSize="15px">{text}</Text>
        </Button>
    )
}
