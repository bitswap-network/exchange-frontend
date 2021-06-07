import React, { useEffect, useState } from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalProps,
    Text,
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
import { tokenState } from "../../../store"
import { createMarketOrder, createLimitOrder, getMarketPrice } from "../../../services/order"

import { getEthUSD } from "../../../services/utility"
import * as globalVars from "../../../globalVars"
import { useUser } from "../../../hooks"
import { BuyTab } from "./Buy"
import { SellTab } from "./Sell"

type OrderModalProps = Omit<ModalProps, "children">

export function OrderModal({ isOpen, onClose }: OrderModalProps): React.ReactElement {
    const token = useRecoilValue(tokenState)
    const { user, userIsLoading, userIsError } = useUser(token)
    const [ethUsd, setEthUsd] = useState<number | null>(null)

    const [tabIndex, setTabIndex] = useState<number>(0)
    const [continueLoading, setContinueLoading] = useState<boolean>(false)
    const [validateError, setValidateError] = useState<string | null>(null)
    const [priceError, setPriceError] = useState<string | null>(null)
    const [totalUsd, setTotalUsd] = useState<number>(0)
    const [page, setPage] = useState<number>(0)

    const marketBuyText = "Market Buy: Instantly buy " + globalVars.BITCLOUT + " at the best market price."
    const marketSellText = "Market Sell: Instantly sell " + globalVars.BITCLOUT + " at the best market price."
    const limitBuyText =
        "Limit Buy: Your order to buy " +
        globalVars.BITCLOUT +
        " will execute when a seller at your specified price (or a better price) is found."
    const limitSellText =
        "Limit Sell: Your order to sell" +
        globalVars.BITCLOUT +
        " will execute when a buyer at your specified price (or a better price) is found."
    const [tooltipText, setTooltipText] = useState<string>(marketBuyText)

    const [orderQuantity, setOrderQuantity] = useControllableState({
        defaultValue: "1",
    })
    const [limitPrice, setLimitPrice] = useControllableState({
        defaultValue: "0",
    })
    const [orderType, setOrderType] = useControllableState({
        defaultValue: "market",
    })
    const [orderSide, setOrderSide] = useControllableState({
        defaultValue: "buy",
    })

    useEffect(() => {
        if (orderType === "market" && isOpen) {
            orderSide == "sell" ? setTooltipText(marketSellText) : setTooltipText(marketBuyText)
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
            console.log(orderSide)
            orderSide == "sell" ? setTooltipText(limitSellText) : setTooltipText(limitBuyText)
            setTotalUsd(parseFloat(orderQuantity) * parseFloat(limitPrice))
            if (user && ethUsd) {
                if (orderSide === "sell" && orderQuantity > user.balance.bitclout) {
                    setPriceError("Insufficient CLOUT balance to place this order.")
                } else if (orderSide === "buy" && totalUsd / ethUsd > user.balance.ether) {
                    setPriceError("Insufficient ETHER balance to place this order.")
                } else {
                    setPriceError(null)
                }
            }
        }
    }, [orderQuantity, orderSide, orderType, limitPrice, ethUsd, user])

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
        console.log(ethUsd, orderType, orderSide, orderQuantity, limitPrice, user.balance.bitclout)
        if (ethUsd) {
            if (orderType === "market" && orderSide === "buy") {
                try {
                    const totalPriceResp = await getMarketPrice(parseFloat(orderQuantity), orderSide)
                    const totalEth = totalPriceResp.data.price / ethUsd
                    return totalEth <= user.balance.ether && !priceError
                } catch (e) {
                    console.error(e)
                    return false
                }
            } else if (orderType === "limit" && orderSide === "buy") {
                const totalPrice = parseFloat(orderQuantity) * parseFloat(limitPrice)
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
            createLimitOrder(parseFloat(orderQuantity), parseFloat(limitPrice), orderSide)
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
                        <Text fontSize="2xl" fontWeight="700" mb="2" color="gray.700">
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
                                    <BuyTab
                                        user={user}
                                        toolTipText={tooltipText}
                                        orderType={orderType}
                                        setOrderType={setOrderType}
                                        orderQuantity={orderQuantity}
                                        setOrderQuantity={setOrderQuantity}
                                        limitPrice={limitPrice}
                                        setLimitPrice={setLimitPrice}
                                        totalUsd={totalUsd ? totalUsd : 0}
                                        ethUsd={ethUsd ? ethUsd : 0}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <SellTab
                                        user={user}
                                        toolTipText={tooltipText}
                                        orderType={orderType}
                                        setOrderType={setOrderType}
                                        orderQuantity={orderQuantity}
                                        setOrderQuantity={setOrderQuantity}
                                        limitPrice={limitPrice}
                                        setLimitPrice={setLimitPrice}
                                        totalUsd={totalUsd ? totalUsd : 0}
                                        ethUsd={ethUsd ? ethUsd : 0}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                        {priceError && (
                            <Text color="red.400" fontSize="sm" fontWeight="400" w="full" textAlign="center" mb="4">
                                {priceError}
                            </Text>
                        )}
                        <Flex flexDir="row" justifyContent="space-between" w="full" mt="6" mb="6">
                            <BlueButton w="47%" onClick={onClose} ghost text={`   Cancel   `} />
                            <BlueButton
                                w="47%"
                                text={`   Continue   `}
                                loading={continueLoading}
                                onClick={handleContinue}
                                disabled={!user || !ethUsd || priceError !== null || validateError !== null}
                            />
                        </Flex>
                        {validateError && (
                            <Text color="red.400" fontSize="md" fontWeight="400" w="full" textAlign="center" mb="4">
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
                        <Text fontSize="2xl" fontWeight="700" mb="2" color="gray.700">
                            Confirm Order
                        </Text>
                        <HStack>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                Order Type
                            </Text>
                            <Spacer />
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {orderType.substr(0, 1).toUpperCase() + orderType.substr(1)}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                Order Side
                            </Text>
                            <Spacer />
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {orderSide.substr(0, 1).toUpperCase() + orderSide.substr(1)}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                Order Quantity
                            </Text>
                            <Spacer />
                            <Text color="gray.500" fontSize="sm" mt="1">
                                {orderQuantity} {globalVars.BITCLOUT}
                            </Text>
                        </HStack>

                        {orderType != "market" ? (
                            <HStack>
                                <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                    Limit Price
                                </Text>
                                <Spacer />
                                <Text color="gray.500" fontSize="sm" mt="1">
                                    ${limitPrice}
                                </Text>
                            </HStack>
                        ) : null}
                        <HStack>
                            <Text color="gray.600" fontSize="sm" fontWeight="600" mt="2">
                                Estimated Total USD
                            </Text>
                            <Spacer />
                            <Text color="gray.500" fontSize="sm" mt="1">
                                ${totalUsd}
                            </Text>
                        </HStack>

                        <Flex flexDir="row" justifyContent="space-between" w="full" mt="6" mb="8">
                            <Button w="47%" variant="solid" onClick={() => setPage(0)}>
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
                            <Text color="red.400" fontSize="md" fontWeight="400" w="full" textAlign="center" mb="4">
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
                        <Text fontSize="2xl" fontWeight="700" mt="6" mb="2" color="gray.700">
                            Order Placed
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            Your order has been successfully placed. Market orders will reflect in your balance
                            immediately. Limit orders will be fulfilled as matching orders are found.
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
