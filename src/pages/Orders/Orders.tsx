import {
    Box,
    Heading,
    HStack,
    Button,
    Flex,
    Spacer,
    Text,
    Link,
    VStack,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Center,
} from '@chakra-ui/react'
import React from 'react'
import Table from '../../components/Table/Table'

const OrderCard = () => (
    <Box bg="white" w="sm" borderRadius="lg" boxShadow="xs" p={6}>
        <Flex>
            <Text fontSize="lg">Ongoing Orders</Text>
            <Spacer />
            <Link variant="">Learn More</Link>
        </Flex>
        <Text>Status</Text>
    </Box>
)

export function Orders(): React.ReactElement {
    return (
        <VStack spacing={8}>
            <Flex w="100%">
                <Heading> Orders </Heading>
                <Spacer />
                <Button> New Order </Button>
            </Flex>
            <Flex w="100%">
                <OrderCard />
                <Spacer />
                <OrderCard />
                <Spacer />
                <OrderCard />
            </Flex>
            <Tabs w="100%" variant="enclosed-colored">
                <Center>
                    <TabList>
                        <Tab>One</Tab>
                        <Tab>Two</Tab>
                    </TabList>
                </Center>
                <TabPanels>
                    <TabPanel>
                        <Table />
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    )
}
