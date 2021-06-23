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
} from "@chakra-ui/react";
import * as globalVars from "../../../globalVars";
import { AiFillInfoCircle } from "react-icons/ai";
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi";
const format = (val: string) => `$` + val;
const limitSellTooltipText = "This is the price you are willing to sell Bitclout at. Must be between $100 and $500.";

interface SellTabProps {
    user?: any;
    toolTipText: string;
    orderType: string;
    setOrderType: Dispatch<SetStateAction<string>>;
    orderQuantity: string;
    setOrderQuantity: Dispatch<SetStateAction<string>>;
    limitPrice: string;
    setLimitPrice: Dispatch<SetStateAction<string>>;
    totalUsd: number;
    ethUsd: number;
    cloutUsd: number;
    setAdvanced: Dispatch<SetStateAction<boolean>>;
    advanced: boolean;
}
export function SellTab({
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
}: SellTabProps): React.ReactElement {
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
                <Tooltip label={`You can sell up to 500 ${globalVars.BITCLOUT} per order.`} aria-label="">
                    <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2" mb="2">
                        Quantity of {globalVars.BITCLOUT}
                        <AiFillInfoCircle color="#aaa" style={{ marginLeft: "4px", marginBottom: "2px", display: "inline" }} />
                    </Text>
                </Tooltip>
                <NumberInput
                    min={globalVars.MIN_LIMIT}
                    value={orderQuantity}
                    onChange={(valueString) => setOrderQuantity(globalVars.parseNum(valueString))}
                    step={0.1}
                    precision={2}
                    max={
                        user.verification.personaVerified
                            ? user.balance.bitclout < 500
                                ? user.balance.bitclout
                                : 500
                            : user.balance.bitclout < globalVars.UNVERIFIED_MAX_USD_LIMIT / cloutUsd
                            ? user.balance.bitclout
                            : globalVars.UNVERIFIED_MAX_USD_LIMIT / cloutUsd
                    }
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
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
                        <option value="market">Market Sell</option>
                        <option value="limit">Limit Sell</option>
                    </Select>
                </FormControl>
                {orderType === "limit" ? (
                    <FormControl id="limitPrice">
                        <Tooltip label={limitSellTooltipText} aria-label={limitSellTooltipText}>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2" mb="2">
                                Limit Sell Price ($USD)&nbsp;
                                <AiFillInfoCircle
                                    style={{
                                        display: "inline",
                                    }}
                                    color="#aaa"
                                />
                            </Text>
                        </Tooltip>
                        {/* Add a tooltip here that says something like "this is the price that you will pay per bitclout if your order is executed" */}
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
                        {" "}
                        Current {globalVars.BITCLOUT} Balance{" "}
                    </Text>
                    <Spacer />
                    <Text color="gray.900" fontSize="xs" fontWeight="600">
                        {globalVars.formatBalanceLarge(user?.balance.bitclout)}
                    </Text>
                </HStack>
                <HStack>
                    <Tooltip label={"Fees are deducted from the amount of ETH you will receive for this order."} aria-label="fee label sell">
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
                        {ethUsd && (+(totalUsd / ethUsd) * 0.01).toFixed(6)} {globalVars.ETHER}
                    </Text>
                </HStack>
                <HStack>
                    <Text color={"gray.600"} fontSize="xs">
                        {orderType === "market" ? "Estimated " : ""}
                        Total Received
                    </Text>
                    <Spacer />
                    <Text color={"gray.900"} fontSize="xs" fontWeight="600">
                        {ethUsd ? `${globalVars.formatBalanceSmall(totalUsd / ethUsd)} ETH` : "Loading..."}
                    </Text>
                </HStack>
                <HStack>
                    <Text color="gray.600" fontSize="xs">
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
