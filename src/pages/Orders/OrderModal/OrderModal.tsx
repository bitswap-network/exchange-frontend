import React, { useEffect, useState } from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalProps,
    FormControl,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Text,
    Stack,
    useControllableState,
    Tab,
    TabList,
    Tabs,
    TabPanel,
    TabPanels,
    Flex,
    Button,
    HStack,
    Spacer,
} from "@chakra-ui/react"
import { BlueButton } from "../../../components/BlueButton"
import { useRecoilValue } from "recoil"
import { tokenState, userState } from "../../../store"
import {
    createMarketOrder,
    createLimitOrder,
    getMarketPrice,
} from "../../../services/order"
import { getEthUSD } from "../../../services/utility"
import * as globalVars from "../../../globalVars"
import { useUser } from "../../../hooks"

type OrderModalProps = Omit<ModalProps, "children">

export function OrderModal({
    isOpen,
    onClose,
}: OrderModalProps): React.ReactElement {
    const token = useRecoilValue(tokenState)
    const { user, userIsLoading, userIsError } = useUser(token)
    const [ethUsd, setEthUsd] = useState<number | null>(null)
    const parseNum = (val: string) => val.replace(/^\$/, "")
    const [tabIndex, setTabIndex] = useState<number>(0)
    const [continueLoading, setContinueLoading] = useState<boolean>(false)
    const [validateError, setValidateError] = useState<string | null>(null)
    const [priceError, setPriceError] = useState<string | null>(null)
    const [totalUsd, setTotalUsd] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [orderQuantity, setOrderQuantity] = useControllableState({
        defaultValue: "1",
    })
    const [limitPrice, setLimitPrice] = useControllableState({
        defaultValue: "0",
    })
    const [orderType, setOrderType] = useControllableState({
        defaultValue: "limit",
    })
    const [orderSide, setOrderSide] = useControllableState({
        defaultValue: "buy",
    })

    useEffect(() => {
        if (orderType === "market" && isOpen) {
            getMarketPrice(parseFloat(orderQuantity), orderSide)
                .then((response) => {
                    setPriceError(null)
                    setTotalUsd(response.data.price)
                })
                .catch((error) => {
                    console.error(error)
                    setPriceError(
                        `Insufficient volume to process a market ${orderSide} order for ${orderQuantity} ${globalVars.BITCLOUT}.`
                    )
                })
        } else if (isOpen) {
            setTotalUsd(parseFloat(orderQuantity) * parseFloat(limitPrice))
            setPriceError(null)
        }
    }, [orderQuantity, orderSide, orderType, limitPrice])

    useEffect(() => {
        if (!isOpen) {
            setValidateError(null)
            setTabIndex(0)
            setPage(0)
            setOrderQuantity("1")
            setLimitPrice("0")
        } else {
            getEthUSD().then((response) => {
                setEthUsd(response.data.data)
            })
            getMarketPrice(parseFloat(orderQuantity), orderSide)
                .then((response) => {
                    setPriceError(null)
                    setTotalUsd(response.data.price)
                })
                .catch((error) => {
                    console.error(error)
                    orderType === "market"
                        ? setPriceError(
                              `Insufficient volume to process a market ${orderSide} order for ${orderQuantity} ${globalVars.BITCLOUT}.`
                          )
                        : setPriceError(null)
                })
        }
    }, [isOpen])

    const handleTabsChange = (index: number) => {
        setTabIndex(index)
        setOrderSide(index === 0 ? "buy" : "sell")
    }
    const orderBalanceValidate = async () => {
        console.log(
            ethUsd,
            orderType,
            orderSide,
            orderQuantity,
            limitPrice,
            user.balance.bitclout
        )
        if (ethUsd) {
            if (orderType === "market" && orderSide === "buy") {
                try {
                    const totalPriceResp = await getMarketPrice(
                        parseFloat(orderQuantity),
                        orderSide
                    )
                    const totalEth = totalPriceResp.data.price / ethUsd
                    return totalEth <= user.balance.ether && !priceError
                } catch (e) {
                    console.error(e)
                    return false
                }
            } else if (orderType === "limit" && orderSide === "buy") {
                const totalPrice =
                    parseFloat(orderQuantity) * parseFloat(limitPrice)
                const totalEth = totalPrice / ethUsd
                return totalEth <= user.balance.ether
            } else {
                return parseFloat(orderQuantity) <= user.balance.bitclout
            }
        } else {
            return false
        }
    }

    const handleContinue = async () => {
        setContinueLoading(true)
        setValidateError(null)
        const validate = await orderBalanceValidate()
        if (validate) {
            setContinueLoading(false)
            setPage(1)
        } else {
            setContinueLoading(false)
            setValidateError("Unable to place order.")
        }
    }

    const handlePlaceOrder = () => {
        setContinueLoading(true)
        setValidateError(null)
        if (orderType === "market") {
            createMarketOrder(parseFloat(orderQuantity), orderSide)
                .then(() => {
                    setContinueLoading(false)
                    setPage(2)
                })
                .catch((error) => {
                    setContinueLoading(false)
                    setValidateError(
                        error.response.data.message
                            ? `${error.response.status}: ${error.response.data.message}`
                            : "Error Placing Order"
                    )
                })
        } else {
            createLimitOrder(
                parseFloat(orderQuantity),
                parseFloat(limitPrice),
                orderSide
            )
                .then(() => {
                    setContinueLoading(false)
                    setPage(2)
                })
                .catch((error) => {
                    setContinueLoading(false)
                    if (error.response) {
                        setValidateError(
                            error.response.data.message
                                ? `${error.response.status}: ${error.response.data.message}`
                                : "Error Placing Order"
                        )
                    } else {
                        setValidateError("Unknown Error")
                    }
                })
        }
    }

    const renderHandler = () => {
        switch (page) {
            case 0:
                return createOrder
            case 1:
                return confirmOrder
            case 2:
                return orderSuccess
            default:
                return createOrder
        }
    }

    const createOrder = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex w="80%" ml="10%" mt="8" flexDir="column">
                        <Text
                            fontSize="2xl"
                            fontWeight="700"
                            mb="2"
                            color="gray.700"
                        >
                            Create Order
                        </Text>
                        <Text color="gray.500" fontSize="sm" mb="4">
                            Place a new buy or sell order for BitClout!
                        </Text>
                        <Tabs
                            variant="soft-rounded"
                            colorScheme="messenger"
                            mt="0.5em"
                            size="md"
                            onChange={handleTabsChange}
                            index={tabIndex}
                            isFitted
                        >
                            <TabList>
                                <Tab fontWeight="semibold">Buy</Tab>
                                <Tab fontWeight="semibold">Sell</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Stack spacing={4}>
                                        <HStack>
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                            >
                                                {" "}
                                                Current {globalVars.ETHER}{" "}
                                                Balance{" "}
                                            </Text>
                                            <Spacer />
                                            <Text
                                                color="gray.900"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                {user?.balance.ether.toFixed(6)}
                                            </Text>
                                        </HStack>
                                        <FormControl id="orderType">
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                                fontWeight="600"
                                                mt="2"
                                                mb="2"
                                            >
                                                Order Type
                                            </Text>
                                            <Select
                                                value={orderType}
                                                textTransform="capitalize"
                                                onChange={(e) =>
                                                    setOrderType(e.target.value)
                                                }
                                            >
                                                <option value="market">
                                                    Market Buy
                                                </option>
                                                <option value="limit">
                                                    Limit Buy
                                                </option>
                                            </Select>
                                        </FormControl>
                                        <FormControl id="bcltAmount">
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                                fontWeight="600"
                                                mt="2"
                                                mb="2"
                                            >
                                                Quantity of{" "}
                                                {globalVars.BITCLOUT}
                                            </Text>
                                            <NumberInput
                                                min={globalVars.MIN_LIMIT}
                                                max={globalVars.MAX_LIMIT}
                                                value={orderQuantity}
                                                onChange={(valueString) =>
                                                    setOrderQuantity(
                                                        parseNum(valueString)
                                                    )
                                                }
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
                                                <Text
                                                    color="gray.600"
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    mt="2"
                                                    mb="2"
                                                >
                                                    Limit Price (USD)
                                                </Text>
                                                {/* Add a tooltip here that says something like "this is the price that you will pay per bitclout if your order is executed" */}
                                                <NumberInput
                                                    min={globalVars.MIN_LIMIT}
                                                    max={globalVars.MAX_LIMIT}
                                                    value={limitPrice}
                                                    onChange={(valueString) =>
                                                        setLimitPrice(
                                                            parseNum(
                                                                valueString
                                                            )
                                                        )
                                                    }
                                                    step={0.1}
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
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                            >
                                                {" "}
                                                {orderType === "market"
                                                    ? "Estimated "
                                                    : ""}
                                                Total ETH{" "}
                                            </Text>
                                            <Spacer />
                                            <Text
                                                color="gray.900"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                {ethUsd
                                                    ? globalVars.formatBalanceSmall(
                                                          totalUsd / ethUsd
                                                      )
                                                    : "Loading..."}
                                            </Text>
                                        </HStack>
                                        <HStack>
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                            >
                                                {" "}
                                                {orderType === "market"
                                                    ? "Estimated "
                                                    : ""}
                                                Total USD{" "}
                                            </Text>
                                            <Spacer />
                                            <Text
                                                color="gray.900"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                ${totalUsd}
                                            </Text>
                                        </HStack>
                                    </Stack>
                                </TabPanel>
                                <TabPanel>
                                    <Stack spacing={4}>
                                        <HStack>
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                            >
                                                {" "}
                                                Current {
                                                    globalVars.BITCLOUT
                                                }{" "}
                                                Balance{" "}
                                            </Text>
                                            <Spacer />
                                            <Text
                                                color="gray.900"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                {user?.balance.bitclout.toFixed(
                                                    6
                                                )}
                                            </Text>
                                        </HStack>
                                        <FormControl id="orderType">
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                                fontWeight="600"
                                                mt="2"
                                                mb="2"
                                            >
                                                Order Type
                                            </Text>
                                            <Select
                                                value={orderType}
                                                textTransform="capitalize"
                                                onChange={(e) =>
                                                    setOrderType(e.target.value)
                                                }
                                            >
                                                <option value="market">
                                                    Market Sell
                                                </option>
                                                <option value="limit">
                                                    Limit Sell
                                                </option>
                                            </Select>
                                        </FormControl>
                                        <FormControl id="bcltAmount">
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                                fontWeight="600"
                                                mt="2"
                                                mb="2"
                                            >
                                                Quantity of{" "}
                                                {globalVars.BITCLOUT}
                                            </Text>
                                            <NumberInput
                                                min={globalVars.MIN_LIMIT}
                                                max={globalVars.MAX_LIMIT}
                                                value={orderQuantity}
                                                onChange={(valueString) =>
                                                    setOrderQuantity(
                                                        parseNum(valueString)
                                                    )
                                                }
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
                                                <Text
                                                    color="gray.600"
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    mt="2"
                                                    mb="2"
                                                >
                                                    Limit Price (USD)
                                                </Text>
                                                {/* Add a tooltip here that says something like "this is the price that you will pay per bitclout if your order is executed" */}
                                                <NumberInput
                                                    min={0}
                                                    value={limitPrice}
                                                    onChange={(valueString) =>
                                                        setLimitPrice(
                                                            parseNum(
                                                                valueString
                                                            )
                                                        )
                                                    }
                                                    step={1}
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
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                            >
                                                {" "}
                                                {orderType === "market"
                                                    ? "Estimated "
                                                    : ""}
                                                Total ETH{" "}
                                            </Text>
                                            <Spacer />
                                            <Text
                                                color="gray.900"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                {ethUsd
                                                    ? globalVars.formatBalanceSmall(
                                                          totalUsd / ethUsd
                                                      )
                                                    : "Loading..."}
                                            </Text>
                                        </HStack>
                                        <HStack>
                                            <Text
                                                color="gray.600"
                                                fontSize="sm"
                                            >
                                                {" "}
                                                {orderType === "market"
                                                    ? "Estimated "
                                                    : ""}
                                                Total USD{" "}
                                            </Text>
                                            <Spacer />
                                            <Text
                                                color="gray.900"
                                                fontSize="sm"
                                                fontWeight="600"
                                            >
                                                ${totalUsd}
                                            </Text>
                                        </HStack>
                                    </Stack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                        {priceError && (
                            <Text
                                color="red.400"
                                fontSize="sm"
                                fontWeight="400"
                                w="full"
                                textAlign="center"
                                mb="4"
                            >
                                {priceError}
                            </Text>
                        )}
                        <Flex
                            flexDir="row"
                            justifyContent="space-between"
                            w="full"
                            mt="6"
                            mb="6"
                        >
                            <BlueButton
                                w="47%"
                                onClick={onClose}
                                ghost
                                text={`   Cancel   `}
                            />
                            <BlueButton
                                w="47%"
                                text={`   Continue   `}
                                loading={continueLoading}
                                onClick={handleContinue}
                                isDisabled={priceError ? true : false}
                            />
                        </Flex>
                        {validateError && (
                            <Text
                                color="red.400"
                                fontSize="md"
                                fontWeight="400"
                                w="full"
                                textAlign="center"
                                mb="4"
                            >
                                {validateError}
                            </Text>
                        )}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )

    const confirmOrder = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex w="80%" ml="10%" mt="8" flexDir="column">
                        <Text
                            fontSize="2xl"
                            fontWeight="700"
                            mb="2"
                            color="gray.700"
                        >
                            Confirm Order
                        </Text>
                        <HStack>
                            <Text
                                color="gray.600"
                                fontSize="sm"
                                fontWeight="600"
                                mt="2"
                            >
                                Order Type
                            </Text>
                            <Spacer />
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {orderType.substr(0, 1).toUpperCase() +
                                    orderType.substr(1)}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text
                                color="gray.600"
                                fontSize="sm"
                                fontWeight="600"
                                mt="2"
                            >
                                Order Side
                            </Text>
                            <Spacer />
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {orderSide.substr(0, 1).toUpperCase() +
                                    orderSide.substr(1)}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text
                                color="gray.600"
                                fontSize="sm"
                                fontWeight="600"
                                mt="2"
                            >
                                Order Quantity
                            </Text>
                            <Spacer />
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {orderQuantity} {globalVars.BITCLOUT}
                            </Text>
                        </HStack>

                        {orderType != "market" ? (
                            <HStack>
                                <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    fontWeight="600"
                                    mt="2"
                                >
                                    Limit Price
                                </Text>
                                <Spacer />
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    ${limitPrice}
                                </Text>
                            </HStack>
                        ) : null}
                        <HStack>
                            <Text
                                color="gray.600"
                                fontSize="sm"
                                fontWeight="600"
                                mt="2"
                            >
                                Total USD
                            </Text>
                            <Spacer />
                            <Text color="gray.500" fontSize="sm" mt="1">
                                ${totalUsd}
                            </Text>
                        </HStack>

                        <Flex
                            flexDir="row"
                            justifyContent="space-between"
                            w="full"
                            mt="6"
                            mb="8"
                        >
                            <Button
                                w="47%"
                                variant="solid"
                                onClick={() => setPage(0)}
                            >
                                Modify
                            </Button>
                            <BlueButton
                                w="47%"
                                text={`   Confirm   `}
                                onClick={handlePlaceOrder}
                                loading={continueLoading}
                            />
                        </Flex>
                        {validateError && (
                            <Text
                                color="red.400"
                                fontSize="md"
                                fontWeight="400"
                                w="full"
                                textAlign="center"
                                mb="4"
                            >
                                {validateError}
                            </Text>
                        )}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )

    const orderSuccess = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex w="80%" ml="10%" flexDir="column">
                        <Text
                            fontSize="2xl"
                            fontWeight="700"
                            mt="6"
                            mb="2"
                            color="gray.700"
                        >
                            Order Placed
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            Your order has been successfully placed. Market
                            orders will reflect in your balance immediately.
                            Limit orders will be fulfilled as matching orders
                            are found.
                        </Text>
                        <BlueButton
                            w="100%"
                            mt="6"
                            mb="8"
                            text={`   Close   `}
                            onClick={() => {
                                onClose
                                window.location.reload()
                            }}
                        />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )

    return renderHandler()
}
