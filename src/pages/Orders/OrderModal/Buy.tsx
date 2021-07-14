import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import {
    FormControl,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Text,
    Stack,
    HStack,
    Tooltip,
    Spacer,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
} from "@chakra-ui/react";
import * as globalVars from "../../../globalVars";
import { AiFillInfoCircle } from "react-icons/ai";
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi";
const format = (val: string) => `$` + val;

interface BuyTabProps {
    user?: any;
    toolTipText: string;
    orderType: string;
    setOrderType: Dispatch<SetStateAction<string>>;
    orderQuantity: string;
    setOrderQuantity: Dispatch<SetStateAction<string>>;
    limitPrice: string;
    setLimitPrice: Dispatch<SetStateAction<string>>;
    totalUsd: number;
    ethUsd: number | null;
    cloutUsd: number;
    setAdvanced: Dispatch<SetStateAction<boolean>>;
    advanced: boolean;
    slippage: number;
    setSlippage: Dispatch<SetStateAction<number>>;
    slippageOnOpen: any;
}

const limitBuyTooltipText = "This is the price you are willing to buy Bitclout at. Must be between $100 and $500.";

export function BuyTab({
    user,
    toolTipText,
    orderType,
    setOrderType,
    orderQuantity,
    setOrderQuantity,
    limitPrice,
    setLimitPrice,
    totalUsd,
    ethUsd,
    cloutUsd,
    setAdvanced,
    advanced,
    slippage,
    setSlippage,
    slippageOnOpen,
}: BuyTabProps): React.ReactElement {
    const [height, setHeight] = useState<string>("0");
    const handleModeToggle = (advancedMode: boolean) => {
        setAdvanced(advancedMode);
        if (advancedMode) {
            setHeight("170px");
        } else {
            setOrderType("market");
            setHeight("0");
        }
    };
    useEffect(() => {
        if (advanced) {
            handleModeToggle(true);
        } else {
            handleModeToggle(false);
        }
    }, [advanced]);
    return (
        <Stack spacing={4}>
            <FormControl id="bcltAmount">
                <Tooltip label={`You can buy up to 500 ${globalVars.BITCLOUT} per order.`} aria-label="">
                    <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2" mb="2">
                        Quantity of {globalVars.BITCLOUT}
                        <AiFillInfoCircle color="#aaa" style={{ marginLeft: "4px", marginBottom: "2px", display: "inline" }} />
                    </Text>
                </Tooltip>
                <NumberInput
                    min={globalVars.MIN_LIMIT}
                    // max={user.verification.personaVerified ? 500 : globalVars.UNVERIFIED_MAX_USD_LIMIT / cloutUsd}
                    value={orderQuantity}
                    onChange={(valueString) => {
                        setOrderQuantity(globalVars.parseNum(valueString));
                    }}
                    step={0.1}
                    onBlur={() => {
                        setOrderQuantity((+parseFloat(orderQuantity).toFixed(globalVars.ROUNDING_PRECISION)).toString());
                    }}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
            {orderType === "market" && (
                <HStack w="full" justify="space-between" color="#81868C">
                    <HStack>
                        <Text fontSize="14px">
                            Maximum
                            <br />
                            Slippage:
                        </Text>
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
            )}
            {!advanced ? (
                <HStack onClick={() => handleModeToggle(true)} cursor="pointer">
                    <Text fontSize="sm" color="brand.100">
                        Advanced
                    </Text>
                    <FiChevronsDown size={16} color="#2e6ded" />
                </HStack>
            ) : (
                <HStack onClick={() => handleModeToggle(false)} cursor="pointer">
                    <Text fontSize="sm" color="brand.100">
                        View less
                    </Text>
                    <FiChevronsUp size={16} color="#2e6ded" />
                </HStack>
            )}
            <Stack maxH={height} overflowY="hidden" transition="max-height 0.6s cubic-bezier(.17,.67,.59,.99)" mt="0 !important">
                <FormControl id="orderType">
                    <Tooltip label={toolTipText} aria-label="">
                        <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2" mb="2">
                            Order Type&nbsp;
                            <AiFillInfoCircle
                                style={{
                                    display: "inline",
                                }}
                                color="#aaa"
                            />
                        </Text>
                    </Tooltip>

                    <Select value={orderType} textTransform="capitalize" onChange={(e) => setOrderType(e.target.value)}>
                        <option value="market">Market Buy</option>
                        <option value="limit">Limit Buy</option>
                    </Select>
                </FormControl>
                {orderType === "limit" ? (
                    <FormControl id="limitPrice">
                        <Tooltip label={limitBuyTooltipText} aria-label={limitBuyTooltipText}>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2" mb="2">
                                Limit Buy Price ($USD)&nbsp;
                                <AiFillInfoCircle
                                    style={{
                                        display: "inline",
                                    }}
                                    color="#aaa"
                                />
                            </Text>
                        </Tooltip>

                        <NumberInput
                            min={1}
                            max={500}
                            value={format(limitPrice)}
                            onChange={(valueString) => setLimitPrice(globalVars.parseNum(valueString))}
                            step={1}
                            precision={2}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                ) : null}
            </Stack>
            <Stack spacing={1}>
                <HStack pt="1">
                    <Text color="gray.600" fontSize="xs">
                        Current {globalVars.ETHER} Balance
                    </Text>
                    <Spacer />
                    <Text color="gray.900" fontSize="xs" fontWeight="600">
                        {globalVars.formatBalanceLarge(user?.balance.ether)}
                    </Text>
                </HStack>
                <HStack>
                    <Tooltip label={"Fees are deducted from the amount of CLOUT you will receive for this order."} aria-label="fee label buy">
                        <Text color="gray.600" fontSize="xs">
                            {" "}
                            {orderType === "market" ? "Est. " : ""}
                            Fees (1%)&nbsp;
                            <AiFillInfoCircle
                                style={{
                                    display: "inline",
                                    marginBottom: "4px",
                                }}
                                color="#aaa"
                            />
                        </Text>
                    </Tooltip>
                    <Spacer />
                    <Text color="gray.900" fontSize="xs" fontWeight="600">
                        {+(parseFloat(orderQuantity) * 0.01).toFixed(globalVars.ROUNDING_PRECISION)} {globalVars.BITCLOUT}
                    </Text>
                </HStack>
                <HStack>
                    <Text
                        color={user && ethUsd && globalVars.formatBalanceSmall(totalUsd / ethUsd) <= user.balance.ether ? "gray.600" : "red.600"}
                        fontSize="xs"
                    >
                        {orderType === "market" ? "Estimated " : ""}
                        Total Cost
                    </Text>
                    <Spacer />
                    <Text
                        color={user && ethUsd && globalVars.formatBalanceSmall(totalUsd / ethUsd) <= user.balance.ether ? "gray.900" : "red.600"}
                        fontSize="xs"
                        fontWeight="600"
                    >
                        {ethUsd ? `${globalVars.formatBalanceLarge(totalUsd / ethUsd)} ETH` : "Loading..."}
                    </Text>
                </HStack>
                <HStack>
                    <Text color={"gray.600"} fontSize="xs">
                        {" "}
                        {orderType === "market" ? "Estimated " : ""}
                        Total USD{" "}
                    </Text>
                    <Spacer />
                    <Text color="gray.900" fontSize="xs" fontWeight="600">
                        ${totalUsd.toFixed(2)}
                    </Text>
                </HStack>
            </Stack>
        </Stack>
    );
}
