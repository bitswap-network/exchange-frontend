import React from 'react'
import { Box, Flex, Spacer, Text, Link, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

interface OrderCardProps {
    title: string
    linkText: string
    linkSrc: string
    status: string
    icon?: React.ReactElement
}

export const OrderCard: React.FC<OrderCardProps> = ({
    title,
    linkText,
    linkSrc,
    status,
    icon,
}: OrderCardProps) => (
    <Box bg="white" w="sm" borderRadius="lg" boxShadow="xs" p={6}>
        <Flex>
            <Text fontSize="lg">{title}</Text>
            <Spacer />
            <Link as={RouterLink} to={linkSrc} variant="">
                {linkText}
            </Link>
        </Flex>
        <HStack>
            {icon}
            <Text>{status}</Text>
        </HStack>
    </Box>
)
