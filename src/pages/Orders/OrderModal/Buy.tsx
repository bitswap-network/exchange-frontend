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
const format = (val: string) => `$` + val

interface BuyTabProps {
    user?: any
    toolTipText: string
    orderType: string
    setOrderType: Dispatch<SetStateAction<string>>
    orderQuantity: string
    setOrderQuantity: Dispatch<SetStateAction<string>>
    limitPrice: string
    setLimitPrice: Dispatch<SetStateAction<string>>
    totalUsd: number
    ethUsd: number | null
}

const limitBuyTooltipText = "This is the price you are willing to buy Bitclout at. Must be between $100 and $500."

export const BuyTab: React.FC<BuyTabProps> = ({
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
}: BuyTabProps) => (
    <Stack spacing={4}>
        <HStack>
            <Text color="gray.600" fontSize="sm">
                {" "}
                Current {globalVars.ETHER} Balance{" "}
            </Text>
            <Spacer />
            <Text color="gray.900" fontSize="sm" fontWeight="600">
                {globalVars.formatBalanceLarge(user?.balance.ether)}
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
                <option value="market">Market Buy</option>
                <option value="limit">Limit Buy</option>
            </Select>
        </FormControl>
        <FormControl id="bcltAmount">
            <Tooltip label={`You can buy up to 500 ${globalVars.BITCLOUT} per order.`} aria-label="">
                <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2" mb="2">
                    Quantity of {globalVars.BITCLOUT}
                    <AiFillInfoCircle
                        color="#aaa"
                        style={{ marginLeft: "4px", marginBottom: "2px", display: "inline" }}
                    />
                </Text>
            </Tooltip>
            <NumberInput
                min={globalVars.MIN_LIMIT}
                max={500}
                value={orderQuantity}
                onChange={(valueString) => setOrderQuantity(globalVars.parseNum(valueString))}
                step={0.1}
                precision={2}
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
        <HStack pt="4">
            <Tooltip
                label={"Fees are deducted from the amount of CLOUT you will receive for this order."}
                aria-label="fee label buy"
            >
                <Text color="gray.600" fontSize="sm">
                    {" "}
                    {orderType === "market" ? "Est. " : ""}
                    Fees (2%)&nbsp;
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
            <Text color="gray.900" fontSize="sm" fontWeight="600">
                {+(parseFloat(orderQuantity) * 0.02).toFixed(6)} {globalVars.BITCLOUT}
            </Text>
        </HStack>
        <HStack>
            <Text
                color={
                    user && ethUsd && globalVars.formatBalanceSmall(totalUsd / ethUsd) <= user.balance.ether
                        ? "gray.600"
                        : "red.600"
                }
                fontSize="sm"
            >
                {orderType === "market" ? "Estimated " : ""}
                Total Cost
            </Text>
            <Spacer />
            <Text
                color={
                    user && ethUsd && globalVars.formatBalanceSmall(totalUsd / ethUsd) <= user.balance.ether
                        ? "gray.900"
                        : "red.600"
                }
                fontSize="sm"
                fontWeight="600"
            >
                {ethUsd ? `${globalVars.formatBalanceSmall(totalUsd / ethUsd)} ETH` : "Loading..."}
            </Text>
        </HStack>
        <HStack>
            <Text color={"gray.600"} fontSize="sm">
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
