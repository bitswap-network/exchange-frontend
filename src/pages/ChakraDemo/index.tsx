import React from 'react'
import {
    Button,
    Center,
    Grid,
    Heading,
    Input,
    Text,
    useColorModeValue,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    VStack,
} from '@chakra-ui/react'

const ChakraDemo: React.FC<Record<string, never>> = () => {
    const color = useColorModeValue('gray.200', 'red.700')
    return (
        <Grid minH="100vh" templateColumns="1fr 2fr 1fr">
            <Center>
                <VStack spacing={4} px={8}>
                    <Heading>Hello world!</Heading>
                    <Text>Bitswap Bitswap Bitswap</Text>
                    <Text fontSize="sm" color="gray.700" noOfLines={[1, 2, 3]}>
                        The world{`'`}s first Bitclout exchange with automatic
                        transaction verification. We{`'`}ve already facilitated
                        $1.5m+ in private transactions — now, anybody can
                        publicly buy, sell, and trade Bitclout in a matter of
                        seconds.
                    </Text>
                    <Text _hover={{ fontWeight: 'semibold' }}>Bitswap</Text>
                </VStack>
            </Center>
            <VStack px={4} py={24} spacing={8}>
                <Button size="lg">Button 1</Button>
                <Button
                    onClick={() => alert('Clicked')}
                    variant="outline"
                    bgColor="blue.200"
                >
                    Button 2
                </Button>
                <Input placeholder="Input 1" />
            </VStack>
            <Center bg={color}>
                <Table variant="simple">
                    <TableCaption>
                        Imperial to metric conversion factors
                    </TableCaption>
                    <Thead>
                        <Tr>
                            <Th>To convert</Th>
                            <Th>into</Th>
                            <Th isNumeric>multiply by</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>inches</Td>
                            <Td>millimetres (mm)</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                        <Tr>
                            <Td>feet</Td>
                            <Td>centimetres (cm)</Td>
                            <Td isNumeric>30.48</Td>
                        </Tr>
                        <Tr>
                            <Td>yards</Td>
                            <Td>metres (m)</Td>
                            <Td isNumeric>0.91444</Td>
                        </Tr>
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>To convert</Th>
                            <Th>into</Th>
                            <Th isNumeric>multiply by</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </Center>
        </Grid>
    )
}

export default ChakraDemo
