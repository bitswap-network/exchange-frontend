import React, { useEffect, useState } from "react";
import {
    Popover,
    PopoverBody,
    StackDivider,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Box,
    PopoverProps,
    PopoverCloseButton,
    PopoverArrow,
    Portal,
    Button,
    Text,
    VStack,
} from "@chakra-ui/react";
import { MdNotificationsActive } from "react-icons/md";
import { Notification } from "./Notification";
import { getNotifs } from "../../../../services/user";
import { Order } from "../../../../interfaces/Order";
export const NotifPopover: React.FC<any> = (props: any) => {
    const [notifications, setNotifications] = useState<Array<Order>>([]);
    useEffect(() => {
        getNotifs()
            .then((response) => {
                setNotifications(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    return (
        <Popover size="lg" boundary="scrollParent" preventOverflow={false}>
            <PopoverTrigger>
                <Box as={Button}>
                    <MdNotificationsActive size="20" />
                </Box>
            </PopoverTrigger>
            <PopoverContent bg="brand.100" w="max" zIndex="100">
                <PopoverHeader py={3} borderRadius={"4px 4px 0px 0px"}>
                    <Text color="white">Notifications</Text>
                </PopoverHeader>
                <PopoverArrow bg="brand.100" />
                <PopoverBody bg="white" w="full" p="0">
                    <VStack divider={<StackDivider borderColor="gray.200" />} w="max" spacing={0}>
                        {notifications.map((order, i) => (
                            <Notification
                                key={order._id}
                                type={order.error ? 2 : order.orderType == "buy" ? 0 : 1}
                                notifRead={false}
                                orderId={order.orderID}
                                timestamp={order.completeTime ? new Date(order.completeTime) : new Date(order.created)}
                                complete={order.complete}
                                orderDetails={{ cloutValue: +order.orderQuantityProcessed.toFixed(2), ethValue: +order.etherQuantity.toFixed(2) }}
                                error={order.error !== "" ? order.error : undefined}
                            />
                        ))}
                    </VStack>
                </PopoverBody>
                <PopoverFooter bg="white" border="hidden" d="flex" alignItems="center" justifyContent="space-between" pb={4} />
            </PopoverContent>
        </Popover>
    );
};
