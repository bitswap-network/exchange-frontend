import React, { useState } from "react";
import { Button, Text, VStack, HStack, Image } from "@chakra-ui/react";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import { FaCircle } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import { orderInfoModalState } from "../../../../store";
import * as globalVars from "../../../../globalVars";
import { Link as RouterLink } from "react-router-dom";

const nWidth = "400px";
const nHeight = "70px";

//type 0: Buy bclt
//type 1: Sell bclt
//type 2: Cancelled
interface NotifProps {
    type: number;
    notifRead: boolean;
    orderId: string;
    timestamp: Date;
    complete: boolean;
    error?: string;
    orderDetails?: {
        cloutValue: number;
        ethValue: number;
    };
}

export function Notification({ type, notifRead, orderId, timestamp, complete, error, orderDetails }: NotifProps): React.ReactElement {
    const setOrderModalState = useSetRecoilState(orderInfoModalState);
    const [active, setActive] = useState(false);
    const [activeButton, setActiveButton] = useState(false);
    const renderHandler = () => {
        switch (type) {
            case 0:
                return buyOrderNotif;
            case 1:
                return sellOrderNotif;
            case 2:
                return cancelledOrderNotif;
            default:
                return <></>;
        }
    };

    const buyOrderNotif = (
        <HStack
            bg={active ? "background.primary" : "white"}
            w={nWidth}
            h={nHeight}
            justify="space-between"
            spacing={2}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            px="4"
            as={RouterLink}
            to={{
                pathname: "/orders",
            }}
            onClick={() => setOrderModalState(() => [true, timestamp])}
        >
            <Image src="./notif_buy.png" htmlWidth="85" />
            <VStack align="left" justify="start" spacing={0} left={0} pr={4} minW="147px">
                <Text whiteSpace="nowrap" color="#696F79" fontSize="sm" fontWeight="bold">
                    {complete ? "Order Completed" : "Order Partial Filled"}
                </Text>
                <HStack w="full" spacing={2}>
                    <HStack justify="flex-start" spacing={1}>
                        <VscTriangleUp color="var(--chakra-colors-brand-100)" size="12px" />
                        <Text fontSize="xs" whiteSpace="nowrap" color="#8692A6">
                            {orderDetails?.cloutValue} {globalVars.BITCLOUT}
                        </Text>
                    </HStack>
                    <HStack justify="flex-start" spacing={1}>
                        <VscTriangleDown color="#8692A6" size="12px" />
                        <Text fontSize="xs" whiteSpace="nowrap" color="#8692A6">
                            {orderDetails?.ethValue} {globalVars.ETHER}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
            <FaCircle size="8" color={notifRead ? "white" : "white"} />
            <Button
                size="sm"
                bg="brand.100"
                color="white"
                w="25%"
                _hover={{ bg: "brand.150" }}
                onMouseEnter={() => setActiveButton(true)}
                onMouseLeave={() => setActiveButton(false)}
            >
                <Text fontSize="xs" fontWeight="light">
                    {activeButton ? "View" : globalVars.timeSince(timestamp)}
                </Text>
            </Button>
        </HStack>
    );

    const sellOrderNotif = (
        <HStack
            bg={active ? "background.primary" : "white"}
            w={nWidth}
            h={nHeight}
            justify="space-between"
            spacing={2}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            px="4"
            as={RouterLink}
            to={{
                pathname: "/orders",
            }}
            onClick={() => setOrderModalState(() => [true, timestamp])}
        >
            <Image src="./notif_sell.png" htmlWidth="85" />
            <VStack align="left" justify="start" spacing={0} left={0} pr={4} minW="147px">
                <Text whiteSpace="nowrap" color="#696F79" fontSize="sm" fontWeight="bold">
                    {complete ? "Order Completed" : "Order Partial Filled"}
                </Text>
                <HStack w="full" spacing={2}>
                    <HStack justify="flex-start" spacing={1}>
                        <VscTriangleUp color="var(--chakra-colors-brand-100)" size="12px" />
                        <Text fontSize="xs" whiteSpace="nowrap" color="#8692A6">
                            {orderDetails?.ethValue} {globalVars.ETHER}
                        </Text>
                    </HStack>
                    <HStack justify="flex-start" spacing={1}>
                        <VscTriangleDown color="#8692A6" size="12px" />
                        <Text fontSize="xs" whiteSpace="nowrap" color="#8692A6">
                            {orderDetails?.cloutValue} {globalVars.BITCLOUT}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
            <FaCircle size="8" color={notifRead ? "white" : "white"} />
            <Button
                size="sm"
                fontSize="sm"
                bg="brand.100"
                color="white"
                w="25%"
                _hover={{ bg: "brand.150" }}
                onMouseEnter={() => setActiveButton(true)}
                onMouseLeave={() => setActiveButton(false)}
            >
                <Text fontSize="xs" fontWeight="light">
                    {activeButton ? "View" : globalVars.timeSince(timestamp)}
                </Text>
            </Button>
        </HStack>
    );

    const cancelledOrderNotif = (
        <HStack
            bg={active ? "background.primary" : "white"}
            w={nWidth}
            h={nHeight}
            justify="space-between"
            spacing={2}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            px="4"
            as={RouterLink}
            to={{
                pathname: "/orders",
            }}
            onClick={() => setOrderModalState(() => [true, timestamp])}
        >
            <Image src="./notif_cancelled.png" htmlWidth="85" />
            <VStack align="left" justify="start" spacing={0} left={0} minW="147px">
                <Text whiteSpace="nowrap" color="#696F79" fontSize="sm" fontWeight="bold">
                    {"Order Deactivated"}
                </Text>
                <Text whiteSpace="nowrap" color="#8692A6" fontSize="xs" fontWeight="light" textOverflow="clip" maxW="147px" overflow="hidden">
                    {error ? error : "Placeholder error text."}
                </Text>
            </VStack>
            <FaCircle size="8" color={notifRead ? "white" : "white"} />
            <Button
                size="sm"
                fontSize="sm"
                bg="brand.100"
                color="white"
                w="25%"
                _hover={{ bg: "brand.150" }}
                onMouseEnter={() => setActiveButton(true)}
                onMouseLeave={() => setActiveButton(false)}
            >
                <Text fontSize="xs" fontWeight="light">
                    {activeButton ? "View" : globalVars.timeSince(timestamp)}
                </Text>
            </Button>
        </HStack>
    );

    return renderHandler();
}
