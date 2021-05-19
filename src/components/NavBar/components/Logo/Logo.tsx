import React from 'react'
<<<<<<< HEAD
import { Box, BoxProps, Text } from '@chakra-ui/react'
import { LinkProps } from 'react-router-dom'
=======
import { HStack, Text, Image } from '@chakra-ui/react'
>>>>>>> c86e104 (Add Login to NavBar)

type LogoProps = Partial<LinkProps & BoxProps>
export function Logo(props: LogoProps): React.ReactElement {
    return (
<<<<<<< HEAD
        <Box {...props}>
=======
        <HStack>
            <Image
                src="./bitswapLogo.png"
                alt="Bitswap Logo"
                htmlWidth="30px"
                objectFit="cover"
            />
>>>>>>> c86e104 (Add Login to NavBar)
            <Text fontSize="lg" fontWeight="bold">
                BITSWAP
            </Text>
        </HStack>
    )
}
