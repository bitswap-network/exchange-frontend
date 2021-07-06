import React from "react";

import { Box, BoxProps, Image, ImageProps } from "@chakra-ui/react";
import { LinkProps } from "react-router-dom";

type LinkBoxProps = Partial<LinkProps & BoxProps & ImageProps>;
export function Logo(props: LinkBoxProps): React.ReactElement {
    return (
        <Box {...props} borderWidth="0">
            <Image src="./bitswapTextLogo.png" objectFit={props.objectFit ? props.objectFit : "contain"} h={props.boxSize ? props.boxSize : "40px"} />
        </Box>
    );
}
