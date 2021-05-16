/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Box, Button, Flex, Image, Heading, Stack } from '@chakra-ui/react'
import { NavBar } from '../../components/NavBar'

Playground.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    image: PropTypes.string,
    ctaText: PropTypes.string,
    ctaLink: PropTypes.string,
}

Playground.defaultProps = {
    title: 'Home',
    image: 'https://source.unsplash.com/collection/404339/800x600',
    ctaText: 'BitClout MarketValue',
    ctaLink: '/signup',
}

export function Playground({
    title,
    subtitle,
    image,
    ctaLink,
    ctaText,
    ...rest
}) {
    return (
        <>
            <NavBar loggedOut />
            <Flex
                align="center"
                justify={{
                    base: 'center',
                    md: 'space-around',
                    xl: 'space-between',
                }}
                direction={{ base: 'column-reverse', md: 'row' }}
                minH="70vh"
                px={8}
                mb={16}
                {...rest}
            >
                <Stack
                    spacing={4}
                    w={{ base: '80%', md: '40%' }}
                    align={['center', 'center', 'flex-start', 'flex-start']}
                >
                    <Heading
                        as="h1"
                        size="xl"
                        fontWeight="bold"
                        color="primary.800"
                        textAlign={['center', 'center', 'left', 'left']}
                    >
                        {title}
                    </Heading>
                    <Heading
                        as="h2"
                        size="md"
                        color="primary.800"
                        opacity="0.8"
                        fontWeight="normal"
                        lineHeight={1.5}
                        textAlign={['center', 'center', 'left', 'left']}
                    >
                        BitClout MarketValue
                    </Heading>
                    <Link to={ctaLink}>
                        <Button
                            colorScheme="primary"
                            borderRadius="8px"
                            py="4"
                            px="4"
                            lineHeight="1"
                            size="md"
                        >
                            BitClout MarketValue
                        </Button>
                    </Link>
                </Stack>
                <Box
                    w={{ base: '80%', sm: '60%', md: '50%' }}
                    mb={{ base: 12, md: 0 }}
                >
                    <Heading
                        as="h3"
                        size="lg"
                        fontWeight="bold"
                        color="primary.800"
                        textAlign={['center', 'center', 'left', 'left']}
                    >
                        Order Book
                    </Heading>
                    <Heading
                        as="h4"
                        size="md"
                        color="primary.800"
                        opacity="0.8"
                        fontWeight="normal"
                        lineHeight={1.5}
                        textAlign={['center', 'center', 'left', 'left']}
                    >
                        Sell Order
                    </Heading>
                    <Image
                        src={image}
                        size="100%"
                        rounded="1rem"
                        shadow="2xl"
                    />
                </Box>
            </Flex>
        </>
    )
}
