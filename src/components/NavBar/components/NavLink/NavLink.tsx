import React from "react";
import { VStack, Text, Link, Box, LinkProps, BoxProps } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

type LinkBoxProps = Partial<LinkProps & BoxProps>;

interface NavLinkProps extends LinkBoxProps {
    label: string;
    to: string;
}

export const NavLink: React.FC<NavLinkProps> = (props: NavLinkProps) => {
    const location = useLocation();
    const active = location.pathname === props.to;
    return (
        <Box {...props}>
            <div className="navlink">
                <VStack>
                    <Link {...props} focus>
                        <Text
                            textDecoration={active ? "underline" : "none"}
                            textDecorationColor="brand.100"
                            textUnderlineOffset="5px"
                            textDecorationStyle="solid"
                            textDecorationThickness="3px"
                        >
                            {props.label}
                        </Text>
                    </Link>
                </VStack>
            </div>
        </Box>
    );
};
