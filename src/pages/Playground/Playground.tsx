/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// TODO: delete this file later <3 this is just Gina playing around
import React from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import {
    Box,
    Flex,
    Image,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Stack,
} from "@chakra-ui/react"
import { NavBar } from "../../components/NavBar"

Playground.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    image: PropTypes.string,
    ctaText: PropTypes.string,
    ctaLink: PropTypes.string,
}

Playground.defaultProps = {
    title: "Home",
    image: "https://source.unsplash.com/collection/404339/800x600",
    ctaText: "BitClout MarketValue",
    ctaLink: "/",
}

export function Playground({ title, image, ctaLink, ctaText, ...rest }) {
    const tableMarkup = (
        <Table size="sm" variant="none">
            <Thead>
                <Tr borderBottom="1px" borderColor="gray.300">
                    <Th>Order ID</Th>
                    <Th isNumberic>Quantity</Th>
                    <Th isNumeric>Price</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>#1234</Td>
                    <Td isNumeric>5</Td>
                    <Td isNumeric>200</Td>
                </Tr>
                <Tr>
                    <Td>#1234</Td>
                    <Td isNumeric>10</Td>
                    <Td isNumeric>1</Td>
                </Tr>
            </Tbody>
        </Table>
    )
    return (
        <>
            <NavBar loggedOut />
            <Flex
                align="top"
                justify={{
                    base: "normal",
                    md: "space-around",
                    xl: "space-between",
                }}
                direction={{ base: "column", md: "row" }}
                minH="70vh"
                px={8}
                mb={16}
                {...rest}
                bg="background.primary"
            >
                <Stack
                    spacing={4}
                    w={{ base: "80%", md: "40%" }}
                    align={["center", "center", "flex-start", "flex-start"]}
                >
                    <Heading
                        as="h1"
                        size="xl"
                        fontWeight="bold"
                        color="primary.800"
                        textAlign={["center", "center", "left", "left"]}
                    >
                        {title}
                    </Heading>
                    <Heading
                        as="h2"
                        size="md"
                        color="primary.800"
                        opacity="0.8"
                        mt="-1"
                        fontWeight="normal"
                        lineHeight={1.5}
                        textAlign={["center", "center", "left", "left"]}
                    >
                        BitClout MarketValue
                    </Heading>

                    {/*📌 TODO: replace this with chart  */}
                    <Image
                        src={image}
                        size="100%"
                        rounded="1rem"
                        shadow="2xl"
                    />
                </Stack>
                <Box
                    w={{ base: "80%", sm: "60%", md: "50%" }}
                    mb={{ base: 12, md: 0 }}
                >
                    <Heading
                        as="h3"
                        size="xl"
                        fontWeight="bold"
                        color="primary.800"
                        textAlign={["center", "center", "left", "left"]}
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
                        textAlign={["center", "center", "left", "left"]}
                    >
                        Sell Order
                    </Heading>
                    <Box
                        border="1px"
                        borderStyle="solid"
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="sm"
                        borderColor="gray.300"
                        maxW="sm"
                    >
                        {tableMarkup}
                    </Box>
                    <Heading
                        as="h4"
                        size="md"
                        color="primary.800"
                        opacity="0.8"
                        fontWeight="normal"
                        lineHeight={1.5}
                        textAlign={["center", "center", "left", "left"]}
                        mt="5"
                    >
                        Buy Order
                    </Heading>
                    <Box
                        border="1px"
                        borderStyle="solid"
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="sm"
                        borderColor="gray.300"
                        maxW="sm"
                    >
                        {tableMarkup}
                    </Box>
                </Box>
            </Flex>
        </>
    )
}
