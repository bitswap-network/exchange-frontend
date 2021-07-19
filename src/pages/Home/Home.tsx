/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";

import {
    Flex,
    Heading,
    VStack,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    Text,
    HStack,
    Image,
    Link,
    Input,
    InputGroup,
    SimpleGrid,
    useDisclosure,
    Button,
} from "@chakra-ui/react";
import { FiArrowDown, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { BiCheckCircle } from "react-icons/bi";
import { Link as RouterLink } from "react-router-dom";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { AiFillInfoCircle } from "react-icons/ai";
import { useUser } from "../../hooks";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Chart } from "../../components/BitCloutChart/Chart";
import { getMarketPrice, getMarketQuantity } from "../../services/order";
import { tokenState, orderModalState, orderInfoModalState } from "../../store";
import { MdLoop } from "react-icons/md";
import * as globalVars from "../../globalVars";
import { BlueButton } from "../../components/BlueButton";
import { getEthUSD, getBitcloutUSD } from "../../services/utility";
import { SlippageModal } from "../../components/SlippageModal";
import { InsufficientFundModal } from "./InsufficientFundModal";
import { createMarketOrder } from "../../services/order";

export function Home(): React.ReactElement {
    const token = useRecoilValue(tokenState);
    const setOrderModalState = useSetRecoilState(orderModalState);
    const setOrderInfoModalState = useSetRecoilState(orderInfoModalState);
    const { user, userIsLoading, userIsError } = useUser(token);
    const [marketBuy, setMarketBuy] = useState<number | null>(null);
    const [marketSell, setMarketSell] = useState<number | null>(null);
    const [orderSide, setOrderSide] = useState<string>("buy");
    const [orderCloutQuantity, setCloutOrderQuantity] = useState<string>("");
    const [orderEthQuantity, setEthOrderQuantity] = useState<string>("");
    const [totalUsd, setTotalUsd] = useState<number | null>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [slippage, setSlippage] = useState<number>(2);
    const [ethErr, setEthErr] = useState<string>("");
    const [cloutErr, setCloutErr] = useState<string>("");
    const [ethUsd, setEthUsd] = useState<number | null>(null);
    const [tabPage, setTabPage] = useState<number>(0);
    const precision = globalVars.ROUNDING_PRECISION;
    const { isOpen: slippageIsOpen, onOpen: slippageOnOpen, onClose: slippageOnClose } = useDisclosure();
    const { isOpen: insufficientFundModalIsOpen, onOpen: insufficientFundModalOnOpen, onClose: insufficientFundModalOnClose } = useDisclosure();
    useEffect(() => {
        getEthUSD().then((response) => {
            setEthUsd(response.data.data);
        });
        getMarketPrice(0.01, "buy").then((response) => {
            setMarketBuy(response.data.price * 100);
        });
        getMarketPrice(0.01, "sell").then((response) => {
            setMarketSell(response.data.price * 100);
        });
    }, []);

    useEffect(() => {
        if (ethUsd) {
            getMarketPrice(parseFloat(orderCloutQuantity), orderSide)
                .then((response) => {
                    const temp = globalVars.parseNum((response.data.price / ethUsd).toFixed(precision));
                    handleEthChange(temp);
                })
                .catch((error) => {
                    setEthOrderQuantity("0");
                    setCloutErr("Insufficient Market Volume.");
                    setEthErr("Insufficient Market Volume.");
                });
        }
    }, [orderSide]);

    const toggleOrderSide = () => {
        if (orderSide === "buy") {
            setOrderSide("sell");
        } else {
            setOrderSide("buy");
        }
    };

    const handleEthChange = (value: any) => {
        setEthOrderQuantity(globalVars.parseNum(value));
        setCloutErr("");
        setEthErr("");
        ethUsd && setTotalUsd(+(parseFloat(value) * ethUsd).toFixed(2));
        ethUsd &&
            getMarketQuantity(parseFloat(value) * ethUsd, orderSide)
                .then((response) => {
                    setCloutOrderQuantity(globalVars.parseNum(response.data.quantity.toFixed(precision)));
                })
                .catch((error) => {
                    setCloutOrderQuantity("0");
                    setCloutErr("Insufficient Market Volume.");
                    setEthErr("Insufficient Market Volume.");
                });
    };

    const handleCloutChange = (value: any) => {
        setCloutOrderQuantity(globalVars.parseNum(value));
        setCloutErr("");
        setEthErr("");
        ethUsd &&
            getMarketPrice(parseFloat(value), orderSide)
                .then((response) => {
                    setEthOrderQuantity(globalVars.parseNum((response.data.price / ethUsd).toFixed(precision)));
                    setTotalUsd(+response.data.price.toFixed(2));
                })
                .catch((error) => {
                    setEthOrderQuantity("0");
                    setCloutErr("Insufficient Market Volume.");
                    setEthErr("Insufficient Market Volume.");
                });
    };

    const handleSwap = () => {
        let error = false;
        if (!user) {
            window.location.href = "/login";
            error = true;
        }
        if (ethErr || cloutErr) {
            error = true;
            return;
        }
        if (isNaN(parseFloat(orderEthQuantity)) || parseFloat(orderEthQuantity) <= 0) {
            setEthErr("Invalid ETH Quantity");
            error = true;
        }
        if (isNaN(parseFloat(orderCloutQuantity)) || parseFloat(orderCloutQuantity) <= 0.01) {
            setCloutErr("Invalid CLOUT Quantity");
            error = true;
        }
        if (error) {
            return;
        }
        switch (orderSide) {
            case "buy":
                if (parseFloat(orderEthQuantity) > user.balance.ether) {
                    setEthErr("Insufficient ETH Balance to place this order.");
                    insufficientFundModalOnOpen();
                    error = true;
                }
                break;
            case "sell":
                if (parseFloat(orderCloutQuantity) > user.balance.bitclout) {
                    setCloutErr("Insufficient CLOUT Balance to place this order.");
                    insufficientFundModalOnOpen();
                    error = true;
                }
                break;
        }
        if (error) {
            return;
        }
        // handle error checking logic here before proceeding to confirmation
        console.log("side:", orderSide);
        console.log("eth order quantity:", orderEthQuantity);
        console.log("clout order quantity:", orderCloutQuantity);
        console.log("slippage:", slippage);
        setTabPage(1);
        return;
    };

    const confirmSwap = () => {
        setConfirmLoading(true);
        setConfirmError(null);
        totalUsd &&
            createMarketOrder(+parseFloat(orderCloutQuantity).toFixed(2), orderSide, totalUsd, +(slippage / 100).toFixed(2))
                .then(() => {
                    setConfirmLoading(false);
                    setTabPage(2);
                })
                .catch((error) => {
                    setConfirmLoading(false);
                    setConfirmError(error.response.data.message ? `${error.response.status}: ${error.response.data.message}` : "Error Placing Order");
                });
    };

    const buySellTabs = (
        <>
            <HStack spacing={0} borderRadius="inherit" w="full" justify="space-evenly" textAlign="center" fontSize="20" fontWeight="bold">
                <Box borderRadius="inherit" w="full" bg={orderSide === "buy" ? "white" : "#F9FBFF"} py="4" onClick={() => setOrderSide("buy")} cursor="pointer">
                    <Text color={orderSide === "buy" ? "#2E6DED" : "#ACB5BD"} fontSize="17">
                        Buy
                    </Text>
                </Box>
                <Box
                    borderRadius="inherit"
                    w="full"
                    bg={orderSide === "sell" ? "white" : "#F9FBFF"}
                    py="4"
                    onClick={() => setOrderSide("sell")}
                    cursor="pointer"
                >
                    <Text fontSize="17" color={orderSide === "sell" ? "#2E6DED" : "#ACB5BD"}>
                        Sell
                    </Text>
                </Box>
            </HStack>
            <>
                <Box w="full" align="center" py="2">
                    <Text fontSize="13" fontWeight="black">
                        Instantly buy or sell{" "}
                        <span>
                            <Link href="http://bitclout.com/" isExternal>
                                CLOUT
                                <ExternalLinkIcon mx="2px" mb="4px" />
                            </Link>
                        </span>{" "}
                        at the best price.
                    </Text>
                </Box>

                <Flex flexDir={orderSide === "buy" ? "column" : "column-reverse"} align="center" p="2" overflow="auto" h="max" px="5">
                    <Box pos="relative" borderWidth="2px" borderColor="rgba(221, 226, 229, 0.5)" borderRadius="10" p="4">
                        <HStack pos="absolute" top="10px" right="10px" bg="#F9FBFF" h="40px" borderRadius="6" borderWidth="1px" borderColor="#F3F3F3" p="1">
                            <Image src={globalVars.ETHER_LOGO} boxSize="20px" />
                            <Text color="#495057" fontSize="20px" pr="2px">
                                ETH
                            </Text>
                        </HStack>
                        <Text color="#81868C" fontSize="18" fontWeight="regular">
                            {orderSide === "buy" ? "From" : "To"}
                        </Text>
                        <InputGroup mt="2">
                            <Input
                                type="number"
                                placeholder={
                                    marketBuy && marketSell && ethUsd
                                        ? orderSide === "buy"
                                            ? (+(marketBuy / ethUsd).toFixed(precision)).toString()
                                            : (+(marketSell / ethUsd).toFixed(precision)).toString()
                                        : "0"
                                }
                                fontSize="40px"
                                height="62px"
                                borderWidth="0px"
                                pl="2"
                                colorScheme="gray"
                                value={orderEthQuantity}
                                onChange={(e) => handleEthChange(e.target.value)}
                                isInvalid={parseFloat(orderEthQuantity) <= 0}
                                onBlur={() => {
                                    setEthOrderQuantity((+parseFloat(orderEthQuantity).toFixed(precision)).toString());
                                }}
                            />
                        </InputGroup>
                        <Text color="tomato" fontSize="14" fontWeight="regular" mt="2">
                            {ethErr}
                        </Text>
                    </Box>
                    <Box
                        mt="-3"
                        mb="-3"
                        bg="white"
                        borderRadius="5"
                        boxSize="38px"
                        borderWidth="2px"
                        borderColor="rgba(221, 226, 229, 0.5)"
                        zIndex="overlay"
                        d="flex"
                        onClick={toggleOrderSide}
                        cursor="pointer"
                    >
                        <MdLoop color="#7E91BA" size="28px" style={{ margin: "auto" }} />
                    </Box>
                    <Box p="4" pos="relative" borderWidth="2px" borderColor="rgba(221, 226, 229, 0.5)" borderRadius="10">
                        <HStack pos="absolute" top="10px" right="10px" bg="#F9FBFF" h="40px" borderRadius="6" borderWidth="1px" borderColor="#F3F3F3" p="1">
                            <Image src={globalVars.BITCLOUT_LOGO} boxSize="20px" />
                            <Text color="#495057" fontSize="20px" pr="2px">
                                CLOUT
                            </Text>
                        </HStack>
                        <Text color="#81868C" fontSize="18" fontWeight="regular">
                            {orderSide === "sell" ? "From" : "To"}
                        </Text>
                        <InputGroup mt="2">
                            <Input
                                type="number"
                                placeholder={(+(1).toFixed(precision)).toString()}
                                fontSize="40px"
                                height="62px"
                                borderWidth="0px"
                                pl="2"
                                colorScheme="gray"
                                value={orderCloutQuantity}
                                onChange={(e) => handleCloutChange(e.target.value)}
                                isInvalid={parseFloat(orderCloutQuantity) <= 0}
                                onBlur={() => {
                                    setCloutOrderQuantity((+parseFloat(orderCloutQuantity).toFixed(precision)).toString());
                                }}
                            />
                        </InputGroup>
                        <Text color="tomato" fontSize="14" fontWeight="regular" mt="2">
                            {cloutErr}
                        </Text>
                    </Box>
                </Flex>
                <HStack w="full" justify="space-between" px="6" color="#81868C">
                    <HStack>
                        <Text fontSize="14px">Maximum Slippage:</Text>
                        <Popover placement="top-start" trigger="hover">
                            <PopoverTrigger>
                                <Box>
                                    <AiFillInfoCircle color="#C4C4C4" />
                                </Box>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverHeader fontSize="sm" fontWeight="600">
                                    Maximum Slippage
                                </PopoverHeader>
                                <PopoverBody fontSize="xs" fontWeight="400" color="gray.600">
                                    “Slippage” is when prices change between the time you create your order and the time it’s confirmed. Your order will
                                    automatically cancel if slippage exceeds your max slippage setting.
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </HStack>
                    <HStack spacing={1}>
                        <Text
                            cursor="pointer"
                            onClick={() => setSlippage(1)}
                            borderRadius="100"
                            bgColor={slippage == 1 ? "#407BFF" : "white"}
                            p="2px"
                            pl="4"
                            pr="4"
                            color={slippage == 1 ? "white" : "#ACB5BD"}
                            fontSize="12px"
                            border="1px solid #DDE2E5"
                        >
                            1%
                        </Text>
                        <Text
                            cursor="pointer"
                            onClick={() => setSlippage(2)}
                            borderRadius="100"
                            bgColor={slippage == 2 ? "#407BFF" : "white"}
                            p="2px"
                            pl="4"
                            pr="4"
                            color={slippage == 2 ? "white" : "#ACB5BD"}
                            fontSize="12px"
                            border="1px solid #DDE2E5"
                        >
                            2%
                        </Text>
                        <Text
                            cursor="pointer"
                            onClick={slippageOnOpen}
                            borderRadius="100"
                            bgColor={slippage != 1 && slippage != 2 ? "#407BFF" : "white"}
                            p="2px"
                            pl="4"
                            pr="4"
                            color={slippage != 1 && slippage != 2 ? "white" : "#ACB5BD"}
                            fontSize="12px"
                            border="1px solid #DDE2E5"
                        >
                            {slippage != 1 && slippage != 2 ? `${slippage}%` : "custom"}
                        </Text>
                    </HStack>
                </HStack>
                <HStack w="full" justify="space-between" px="6" color="#81868C">
                    <Text fontSize="14px">Exchange Rate:</Text>
                    <Text fontSize="14px" fontWeight="bold">
                        {orderSide == "buy"
                            ? `1 ${globalVars.ETHER} ~ ${+(parseFloat(orderCloutQuantity) / parseFloat(orderEthQuantity)).toFixed(precision)} ${
                                  globalVars.BITCLOUT
                              }`
                            : `1 ${globalVars.BITCLOUT} ~ ${+(parseFloat(orderEthQuantity) / parseFloat(orderCloutQuantity)).toFixed(precision)} ${
                                  globalVars.ETHER
                              }`}
                    </Text>
                </HStack>
                {/* <HStack w="full" justify="space-between" px="6" color="#81868C">
                    <Text fontSize="14px">Est. Fees:</Text>
                    <Text fontSize="14px" fontWeight="bold">
                        {orderSide === "buy"
                            ? `${+(parseFloat(orderCloutQuantity) * 0.01).toFixed(4)} ${globalVars.BITCLOUT}`
                            : `${+(parseFloat(orderEthQuantity) * 0.01).toFixed(4)} ${globalVars.ETHER}`}
                    </Text>
                </HStack> */}
                <VStack p="2" px="5" w="full">
                    <BlueButton text={"Swap"} w="full" size="lg" onClick={handleSwap} />
                    <Button
                        as={RouterLink}
                        to={{
                            pathname: "/orders",
                        }}
                        pt="2"
                        pb="2"
                        onClick={() => setOrderModalState(() => true)}
                    >
                        <Text color="#81868C">Advanced Options</Text>
                    </Button>
                </VStack>
            </>
        </>
    );

    const confirmTabs = (
        <Flex boxSize="md" flexDir="column" align="center" p="2" pt="12" overflow="auto" h="max" px="5">
            <Text fontSize="2xl" fontWeight="700" color="gray.700">
                Confirm Swap
            </Text>
            <Flex my="10" spacing={2} flexDir={orderSide === "buy" ? "column" : "column-reverse"} alignItems="center">
                <Text fontSize="2xl" color="gray.500" fontWeight="400">
                    {orderEthQuantity} {globalVars.ETHER}
                </Text>
                <FiArrowDown size={40} color="#718096" />
                <Text fontSize="2xl" color="gray.500" fontWeight="400">
                    {orderCloutQuantity} {globalVars.BITCLOUT}
                </Text>
            </Flex>
            <HStack w="full" justify="space-between" px="6" color="#81868C">
                <Text fontSize="14px">Maximum Slippage:</Text>
                <Text fontSize="14px" fontWeight="bold">
                    {slippage}%
                </Text>
            </HStack>
            <HStack w="full" justify="space-between" px="6" color="#81868C">
                <Text fontSize="14px">Exchange Rate:</Text>
                <Text fontSize="14px" fontWeight="bold">
                    {orderSide == "buy"
                        ? `1 ${globalVars.ETHER} ~ ${+(parseFloat(orderCloutQuantity) / parseFloat(orderEthQuantity)).toFixed(precision)} ${
                              globalVars.BITCLOUT
                          }`
                        : `1 ${globalVars.BITCLOUT} ~ ${+(parseFloat(orderEthQuantity) / parseFloat(orderCloutQuantity)).toFixed(precision)} ${
                              globalVars.ETHER
                          }`}
                </Text>
            </HStack>
            <HStack w="full" justify="space-between" px="6" color="#81868C">
                <Text fontSize="14px">Est. Fees:</Text>
                <Text fontSize="14px" fontWeight="bold">
                    {orderSide === "buy"
                        ? `${+(parseFloat(orderCloutQuantity) * 0.01).toFixed(4)} ${globalVars.BITCLOUT}`
                        : `${+(parseFloat(orderEthQuantity) * 0.01).toFixed(4)} ${globalVars.ETHER}`}
                </Text>
            </HStack>
            <VStack p="2" px="5" pt="6" w="full">
                <BlueButton text={"Confirm"} w="full" size="lg" onClick={confirmSwap} loading={confirmLoading} />
                <Button pt="2" pb="2" onClick={() => setTabPage(0)}>
                    <Text color="#81868C">Modify</Text>
                </Button>
                {confirmError && (
                    <Text color="red.400" fontSize="sm" fontWeight="400" w="full" textAlign="center" mt="6">
                        {confirmError}
                    </Text>
                )}
            </VStack>
        </Flex>
    );

    const completeTabs = (
        <Flex boxSize="md" flexDir="column" align="center" p="2" pt="12" overflow="auto" h="max" px="5">
            <Text fontSize="2xl" fontWeight="700" color="gray.700">
                Swap Successful
            </Text>
            <FiCheckCircle size={100} color="#94b5ff" style={{ marginTop: 20 }} />
            <Flex mt="8" mb="10" spacing={2} flexDir={orderSide === "buy" ? "row" : "row-reverse"} alignItems="center" justifyContent="center">
                <Text fontSize="xl" color="gray.500" fontWeight="400">
                    {orderEthQuantity} {globalVars.ETHER}
                </Text>
                <FiArrowRight size={30} color="#718096" />
                <Text fontSize="xl" color="gray.500" fontWeight="400">
                    {orderCloutQuantity} {globalVars.BITCLOUT}
                </Text>
            </Flex>
            <HStack w="full" justify="space-between" px="6" color="#81868C">
                <Text fontSize="14px">Maximum Slippage:</Text>
                <Text fontSize="14px" fontWeight="bold">
                    {slippage}%
                </Text>
            </HStack>
            <HStack w="full" justify="space-between" px="6" color="#81868C">
                <Text fontSize="14px">Exchange Rate:</Text>
                <Text fontSize="14px" fontWeight="bold">
                    {orderSide == "buy"
                        ? `1 ${globalVars.ETHER} ~ ${+(parseFloat(orderCloutQuantity) / parseFloat(orderEthQuantity)).toFixed(precision)} ${
                              globalVars.BITCLOUT
                          }`
                        : `1 ${globalVars.BITCLOUT} ~ ${+(parseFloat(orderEthQuantity) / parseFloat(orderCloutQuantity)).toFixed(precision)} ${
                              globalVars.ETHER
                          }`}
                </Text>
            </HStack>
            <HStack w="full" justify="space-between" px="6" color="#81868C">
                <Text fontSize="14px">Est. Fees:</Text>
                <Text fontSize="14px" fontWeight="bold">
                    {orderSide === "buy"
                        ? `${+(parseFloat(orderCloutQuantity) * 0.01).toFixed(4)} ${globalVars.BITCLOUT}`
                        : `${+(parseFloat(orderEthQuantity) * 0.01).toFixed(4)} ${globalVars.ETHER}`}
                </Text>
            </HStack>
            <Button
                as={RouterLink}
                to={{
                    pathname: "/orders",
                }}
                my="6"
                pt="2"
                pb="2"
                onClick={() => setOrderInfoModalState(() => [true, null])}
            >
                <Text color="#407bff">View Orders</Text>
            </Button>
        </Flex>
    );

    return (
        <>
            <InsufficientFundModal
                userBalance={user && user.balance}
                disclosure={{ isOpen: insufficientFundModalIsOpen, onClose: insufficientFundModalOnClose, onOpen: insufficientFundModalOnOpen }}
                orderSide={orderSide}
                orderAmount={{ bitclout: parseFloat(orderCloutQuantity), ether: parseFloat(orderEthQuantity) }}
            />
            <SlippageModal disclosure={{ isOpen: slippageIsOpen, onClose: slippageOnClose, onOpen: slippageOnOpen }} setSlippage={setSlippage} />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <Flex flexDirection="column" w="full" padding={4}>
                    <Heading fontSize={{ base: "32px", md: "52px" }} mb={4}>
                        Buy and Sell BitClout for Ethereum
                    </Heading>
                    <Heading fontSize="18px" color="#696F79" fontWeight="medium" lineHeight="8">
                        BitSwap is the easiest and fastest way to buy and sell BitClout. Join the world&apos;s first BitClout exchange and start trading today!
                    </Heading>

                    {user ? (
                        <Box
                            boxShadow="0px 0px 30px 12px rgba(0,0,0,0.07)"
                            borderRadius="lg"
                            overflow="hidden"
                            bg="white"
                            p="2"
                            mt="4"
                            borderWidth="2px"
                            borderColor="#DDE2E5"
                        >
                            <HStack justify="space-evenly">
                                <Text>
                                    <Image src={globalVars.BITCLOUT_LOGO} htmlWidth="32" style={{ display: "inline" }} /> CLOUT Balance:{" "}
                                    {user ? +user.balance.bitclout.toFixed(2) : "-"}
                                </Text>
                                <Text>
                                    <Image src={globalVars.ETHER_LOGO} htmlWidth="30" style={{ display: "inline" }} /> ETHER Balance:{" "}
                                    {user ? +user.balance.ether.toFixed(2) : "-"}
                                </Text>
                            </HStack>
                        </Box>
                    ) : null}
                    <Box
                        boxShadow="0px 0px 30px 12px rgba(0,0,0,0.07)"
                        borderRadius="lg"
                        overflow="hidden"
                        bg="white"
                        p="2"
                        mt="4"
                        borderWidth="2px"
                        borderColor="#DDE2E5"
                    >
                        <HStack w="full" justify="space-evenly" mt="2" display={{ base: "none", md: "flex" }}>
                            <Flex
                                p="4"
                                color="brand.100"
                                fontWeight="500"
                                fontSize="sm"
                                h="20px"
                                align="center"
                                justify="center"
                                borderRadius="4"
                                borderWidth="2px"
                                borderColor="#DDE2E5"
                            >
                                Market Ask: {marketBuy ? `$${marketBuy.toFixed(2)}` : " ... "}
                            </Flex>
                            <Flex>
                                <Popover placement="top-start" trigger="hover">
                                    <PopoverTrigger>
                                        <div>
                                            <AiFillInfoCircle color="#2E6DED" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverHeader fontSize="sm" fontWeight="600">
                                            Price Derivation
                                        </PopoverHeader>
                                        <PopoverBody fontSize="xs" fontWeight="400" color="gray.600">
                                            The market bid is the highest current offer to buy CLOUT. The market ask is the lowest current offer to sell CLOUT.
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Flex>
                            <Flex
                                p="4"
                                color="brand.100"
                                fontWeight="500"
                                fontSize="sm"
                                h="20px"
                                align="center"
                                justify="center"
                                borderRadius="4"
                                borderWidth="2px"
                                borderColor="#DDE2E5"
                            >
                                Market Bid: {marketSell ? `$${marketSell.toFixed(2)}` : "..."}
                            </Flex>
                        </HStack>
                        <Chart ticks={4} dateTicks={10} />
                    </Box>
                </Flex>
                <Flex flexDirection="column" w="full" padding={4} justify="center" align="center">
                    <Box maxW={{ base: "450px" }}>
                        <VStack w="full" borderColor="#DDE2E5" borderWidth="2px" borderRadius="6" boxShadow="0px 0px 30px 12px rgba(0,0,0,0.07)">
                            {tabPage === 0 && buySellTabs}
                            {tabPage === 1 && confirmTabs}
                            {tabPage === 2 && completeTabs}
                        </VStack>
                    </Box>
                </Flex>
            </SimpleGrid>
        </>
    );
}
