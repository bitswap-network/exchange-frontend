import React, { Dispatch, SetStateAction } from "react"
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
} from "@chakra-ui/react"
import * as globalVars from "../../../globalVars"
import { AiFillInfoCircle } from "react-icons/ai"

const limitSellTooltipText = "This is the price you are willing to sell Bitclout at."

interface SellTabProps {
    user?: any
    toolTipText: string
    orderType: string
    setOrderType: Dispatch<SetStateAction<string>>
    orderQuantity: string
    setOrderQuantity: Dispatch<SetStateAction<string>>
    limitPrice: string
    setLimitPrice: Dispatch<SetStateAction<string>>
    totalUsd: number
    ethUsd: number
}
export const SellTab: React.FC<SellTabProps> = ({
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
}: SellTabProps) => (
    <Stack spacing={4}>
        <HStack>
            <Text color="gray.600" fontSize="sm">
                {" "}
                Current {globalVars.BITCLOUT} Balance{" "}
            </Text>
            <Spacer />
            <Text color="gray.900" fontSize="sm" fontWeight="600">
                {globalVars.formatBalanceLarge(user?.balance.bitclout)}
            </Text>
        </HStack>
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
        <FormControl id="bcltAmount">
            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2" mb="2">
                Quantity of {globalVars.BITCLOUT}
            </Text>
            <NumberInput
                min={globalVars.MIN_LIMIT}
                value={orderQuantity}
                onChange={(valueString) => setOrderQuantity(globalVars.parseNum(valueString))}
                step={0.1}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
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
                    min={0}
                    value={limitPrice}
                    onChange={(valueString) => setLimitPrice(globalVars.parseNum(valueString))}
                    step={1}
                    precision={1}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        ) : null}
        <HStack pt="4">
            <Tooltip
                label={"Fees are deducted from the amount of ETH you will recieve for this order."}
                aria-label="fee label sell"
            >
                <Text color="gray.600" fontSize="sm">
                    {" "}
                    {orderType === "market" ? "Est. " : ""}
                    Fees (2%)&nbsp;
                    <AiFillInfoCircle
                        style={{
                            display: "inline",
                        }}
                        color="#aaa"
                    />
                </Text>
            </Tooltip>
            <Spacer />
            <Text color="gray.900" fontSize="sm" fontWeight="600">
                ~$
                {(totalUsd * 0.02).toFixed(2)}
            </Text>
        </HStack>
        <HStack>
            <Text color="gray.600" fontSize="sm">
                {" "}
                {orderType === "market" ? "Estimated " : ""}
                Total ETH{" "}
            </Text>
            <Spacer />
            <Text color="gray.900" fontSize="sm" fontWeight="600">
                {ethUsd ? globalVars.formatBalanceSmall(totalUsd / ethUsd) : "Loading..."}
            </Text>
        </HStack>
        <HStack>
            <Text color="gray.600" fontSize="sm">
                {" "}
                {orderType === "market" ? "Estimated " : ""}
                Total USD{" "}
            </Text>
            <Spacer />
            <Text color="gray.900" fontSize="sm" fontWeight="600">
                ${totalUsd.toFixed(2)}
            </Text>
        </HStack>
    </Stack>
)