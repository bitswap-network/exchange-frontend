import React from "react";

import { Box, BoxProps, Image, ImageProps } from "@chakra-ui/react";
import { LinkProps } from "react-router-dom";

type LinkBoxProps = Partial<LinkProps & BoxProps & ImageProps>;
export function Logo(props: LinkBoxProps): React.ReactElement {
    return (
        <Box {...props}>
            <Image src="./bitswapTextLogo.png" fit="cover" htmlWidth={props.htmlWidth ? props.htmlWidth : "120"} />
        </Box>
    );
}
