import React from "react";
import { Button, ButtonProps, Text } from "@chakra-ui/react";

import { HiArrowRight } from "react-icons/hi";

interface BlueButtonProps extends ButtonProps {
    text: string;
    icon?: boolean;
    width?: string | number;
    loading?: boolean;
    disabled?: boolean;
    ghost?: boolean;
}

export const BlueButton: React.FC<BlueButtonProps> = ({ text, icon, width, loading, disabled, ghost, ...rest }: BlueButtonProps) => {
    return !ghost ? (
        <Button
            isLoading={loading}
            boxShadow={"md"}
            bg={ghost ? "brandSubtle.100" : "brand.100"}
            isDisabled={disabled}
            _hover={{
                bg: `${ghost ? "brandSubtle.150" : "brand.150"}`,
            }}
            _active={{
                bg: `${ghost ? "brandSubtle.200" : "brand.200"}`,
            }}
            width={width ? width : ""}
            color={ghost ? "black" : "white"}
            rightIcon={icon && !loading ? <HiArrowRight /> : undefined}
            {...rest}
        >
            <Text>{text}</Text>
        </Button>
    ) : (
        <Button
            variant={"solid"}
            isLoading={loading}
            isDisabled={disabled}
            width={width ? width : ""}
            rightIcon={icon && !loading ? <HiArrowRight /> : undefined}
            {...rest}
        >
            <Text>{text}</Text>
        </Button>
    );
};
