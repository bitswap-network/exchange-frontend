import React from "react";
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
import { MdNotificationsNone, MdNotificationsActive } from "react-icons/md";
import { Notification } from "./Notification";
// type NotifProps = Partial<LinkProps & PopoverProps>;

export const NotifPopover: React.FC<any> = (props: any) => {
    return (
        <Popover size="lg" boundary="scrollParent" preventOverflow={false}>
            <PopoverTrigger>
                <Box as={Button}>
                    <MdNotificationsActive size="20" />
                </Box>
            </PopoverTrigger>
            <PopoverContent bg="brand.100" w="max">
                <PopoverHeader py={3} borderRadius={"4px 4px 0px 0px"}>
                    <Text color="white">Notifications</Text>
                </PopoverHeader>
                <PopoverArrow bg="brand.100" />
                <PopoverBody bg="white" w="full" p="0">
                    <VStack divider={<StackDivider borderColor="gray.200" />} w="max" spacing={0}>
                        <Notification
                            type={0}
                            notifRead={false}
                            orderId="11111"
                            timestamp={new Date("06/24/2021")}
                            complete={true}
                            orderDetails={{ cloutValue: 6.9, ethValue: 4.2 }}
                        />
                        <Notification
                            type={1}
                            notifRead={false}
                            orderId="111121"
                            timestamp={new Date("06/23/2021")}
                            complete={true}
                            orderDetails={{ cloutValue: 6.9, ethValue: 4.2 }}
                        />
                        <Notification
                            type={2}
                            notifRead={true}
                            orderId="111121"
                            timestamp={new Date("06/23/2021")}
                            complete={true}
                            orderDetails={{ cloutValue: 6.9, ethValue: 4.2 }}
                        />
                    </VStack>
                </PopoverBody>
                <PopoverFooter bg="white" border="hidden" d="flex" alignItems="center" justifyContent="space-between" pb={4} />
            </PopoverContent>
        </Popover>
    );
};
