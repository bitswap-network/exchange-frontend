import React, { useEffect, useState } from "react";
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
    Divider,
    useDisclosure,
} from "@chakra-ui/react";
import { BlueButton } from "../../../components/BlueButton";
import { useRecoilValue } from "recoil";
import { tokenState } from "../../../store";
import { createMarketOrder, createLimitOrder, getMarketPrice } from "../../../services/order";
import { SlippageModal } from "../../../components/SlippageModal";

import { getEthUSD, getBitcloutUSD } from "../../../services/utility";
import * as globalVars from "../../../globalVars";
import { useUser } from "../../../hooks";
import { BuyTab } from "./Buy";
import { SellTab } from "./Sell";

type OrderModalProps = Omit<ModalProps, "children">;

export function OrderModal({ isOpen, onClose }: OrderModalProps): React.ReactElement {
    const token = useRecoilValue(tokenState);
    const { user, userIsLoading, userIsError } = useUser(token);
    const [ethUsd, setEthUsd] = useState<number | null>(null);
    const [cloutUsd, setCloutUsd] = useState<number | null>(null);

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [continueLoading, setContinueLoading] = useState<boolean>(false);
    const [validateError, setValidateError] = useState<string | null>(null);
    const [marketError, setMarketError] = useState<string | null>(null);
    const [balanceError, setBalanceError] = useState<string | null>(null);
    const [totalUsd, setTotalUsd] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [advanced, setAdvanced] = useState<boolean>(false);

    const [slippage, setSlippage] = useState<number>(2);
    const { isOpen: slippageIsOpen, onOpen: slippageOnOpen, onClose: slippageOnClose } = useDisclosure();

    const marketBuyText = "Market Buy: Instantly buy $" + globalVars.BITCLOUT + " at the best market price.";
    const marketSellText = "Market Sell: Instantly sell $" + globalVars.BITCLOUT + " at the best market price.";
    const limitBuyText =
        "Limit Buy: Your order to buy $" + globalVars.BITCLOUT + " will execute when a seller at your specified price (or a better price) is found.";
    const limitSellText =
        "Limit Sell: Your order to sell $" + globalVars.BITCLOUT + " will execute when a buyer at your specified price (or a better price) is found.";
    const [tooltipText, setTooltipText] = useState<string>(marketBuyText);

    const [orderQuantity, setOrderQuantity] = useControllableState({
        defaultValue: "1",
    });
    const [limitPrice, setLimitPrice] = useControllableState({
        defaultValue: "101",
    });
    const [orderType, setOrderType] = useControllableState({
        defaultValue: "market",
    });
    const [orderSide, setOrderSide] = useControllableState({
        defaultValue: "buy",
    });

    const resetState = () => {
        setTabIndex(0);
        setEthUsd(null);
        setContinueLoading(false);
        setValidateError(null);
        setMarketError(null);
        setBalanceError(null);
        setTotalUsd(0);
        setPage(0);
        setTooltipText(marketBuyText);
        setOrderQuantity("1");
        setLimitPrice("101");
        setOrderSide("buy");
        setAdvanced(false);
    };

    const insufficientBalanceHandler = () => {
        if (orderSide === "sell" && orderQuantity > user.balance.bitclout) {
            setBalanceError(`Insufficient ${globalVars.BITCLOUT} balance to place this order.`);
        } else if (ethUsd && orderSide === "buy" && +(parseFloat(orderQuantity) * parseFloat(limitPrice)).toFixed(2) / ethUsd > user.balance.ether) {
            setBalanceError(`Insufficient ${globalVars.ETHER} balance to place this order.`);
        } else {
            setBalanceError(null);
            setValidateError(null);
        }
    };

    const insufficientVolumeHandler = () => {
        if (isNaN(parseFloat(orderQuantity))) {
            setMarketError("");
        } else {
            getMarketPrice(parseFloat(orderQuantity), orderSide)
                .then((response) => {
                    setMarketError(null);
                    setTotalUsd(+response.data.price.toFixed(globalVars.ROUNDING_PRECISION));
                })
                .catch((error) => {
                    console.error(error);
                    setMarketError(`Insufficient order volume to process a market ${orderSide} order for ${orderQuantity} ${globalVars.BITCLOUT}.`);
                });
        }
    };

    useEffect(() => {
        if (isOpen && user) {
            if (orderType === "market") {
                orderSide == "sell" ? setTooltipText(marketSellText) : setTooltipText(marketBuyText);
                insufficientVolumeHandler();
            } else {
                setMarketError(null);
                orderSide == "sell" ? setTooltipText(limitSellText) : setTooltipText(limitBuyText);
                setTotalUsd(+(parseFloat(orderQuantity) * parseFloat(limitPrice)).toFixed(2));
            }
            insufficientBalanceHandler();
        }
    }, [orderQuantity, orderSide, orderType, limitPrice, user, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            resetState();
        } else {
            getEthUSD().then((response) => {
                setEthUsd(response.data.data);
            });
            getBitcloutUSD().then((response) => {
                setCloutUsd(response.data.data);
                console.log(response.data.data);
            });
        }
    }, [isOpen]);

    const handleTabsChange = (index: number) => {
        setTabIndex(index);
        setOrderSide(index === 0 ? "buy" : "sell");
    };
    const orderBalanceValidate = async () => {
        if (ethUsd) {
            if (orderType === "market" && orderSide === "buy") {
                try {
                    const totalPriceResp = await getMarketPrice(parseFloat(orderQuantity), orderSide);
                    const totalEth = totalPriceResp.data.price / ethUsd;
                    return totalEth <= user.balance.ether;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            } else if (orderType === "limit" && orderSide === "buy") {
                const totalPrice = parseFloat(orderQuantity) * parseFloat(limitPrice);
                const totalEth = totalPrice / ethUsd;
                return totalEth <= user.balance.ether;
            } else {
                return parseFloat(orderQuantity) <= user.balance.bitclout;
            }
        } else {
            return false;
        }
    };

    const handleContinue = async () => {
        setContinueLoading(true);
        setValidateError(null);
        if (await orderBalanceValidate()) {
            setContinueLoading(false);
            setPage(1);
        } else {
            setContinueLoading(false);
            setValidateError("Unable to place order.");
        }
    };

    const handlePlaceOrder = () => {
        setContinueLoading(true);
        setValidateError(null);
        if (orderType === "market") {
            createMarketOrder(+parseFloat(orderQuantity).toFixed(globalVars.ROUNDING_PRECISION), orderSide, totalUsd, +(slippage / 100).toFixed(2))
                .then(() => {
                    setContinueLoading(false);
                    setPage(2);
                })
                .catch((error) => {
                    setContinueLoading(false);
                    setValidateError(error.response.data.message ? `${error.response.status}: ${error.response.data.message}` : "Error Placing Order");
                });
        } else {
            createLimitOrder(+parseFloat(orderQuantity).toFixed(globalVars.ROUNDING_PRECISION), +parseFloat(limitPrice).toFixed(2), orderSide)
                .then(() => {
                    setContinueLoading(false);
                    setPage(2);
                })
                .catch((error) => {
                    setContinueLoading(false);
                    if (error.response) {
                        setValidateError(error.response.data.message ? `${error.response.status}: ${error.response.data.message}` : "Error Placing Order");
                    } else {
                        setValidateError("Unknown Error");
                    }
                });
        }
    };

    const renderHandler = () => {
        switch (page) {
            case 0:
                return createOrder;
            case 1:
                return confirmOrder;
            case 2:
                return orderSuccess;
            default:
                return createOrder;
        }
    };

    const createOrder = (
        <>
            <SlippageModal disclosure={{ isOpen: slippageIsOpen, onClose: slippageOnClose, onOpen: slippageOnOpen }} setSlippage={setSlippage} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex w="full" pl="4" pr="4" mt="8" flexDir="column">
                            <Text fontSize="2xl" fontWeight="700" mb="2" color="gray.700">
                                Create Order
                            </Text>
                            <Tabs
                                variant="enclosed"
                                colorScheme="messenger"
                                mt="0.5em"
                                size="md"
                                onChange={handleTabsChange}
                                index={tabIndex}
                                isFitted
                                isLazy
                                lazyBehavior="keepMounted"
                            >
                                <TabList background="transparent">
                                    <Tab fontWeight="bold" fontSize="xl">
                                        Buy
                                    </Tab>
                                    <Tab fontWeight="bold" fontSize="xl">
                                        Sell
                                    </Tab>
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
                                            cloutUsd={cloutUsd ? cloutUsd : 0}
                                            advanced={advanced}
                                            setAdvanced={setAdvanced}
                                            slippage={slippage}
                                            setSlippage={setSlippage}
                                            slippageOnOpen={slippageOnOpen}
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
                                            cloutUsd={cloutUsd ? cloutUsd : 0}
                                            advanced={advanced}
                                            setAdvanced={setAdvanced}
                                            slippage={slippage}
                                            setSlippage={setSlippage}
                                            slippageOnOpen={slippageOnOpen}
                                        />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                            {marketError && (
                                <Text color="red.400" fontSize="sm" fontWeight="400" w="full" textAlign="center" mt="6">
                                    {marketError}
                                </Text>
                            )}
                            <Flex flexDir="row" justifyContent="space-between" w="full" mt="6" mb="6">
                                <BlueButton w="47%" onClick={onClose} ghost text={`   Cancel   `} />
                                <BlueButton
                                    w="47%"
                                    text={`   Continue   `}
                                    loading={continueLoading}
                                    onClick={handleContinue}
                                    disabled={!user || !ethUsd || marketError !== null || validateError !== null || balanceError !== null}
                                />
                            </Flex>
                            {balanceError && (
                                <Text color="red.400" fontSize="sm" fontWeight="400" w="full" textAlign="center" mb="4">
                                    {balanceError}
                                </Text>
                            )}
                            {validateError && (
                                <Text color="red.400" fontSize="sm" fontWeight="400" w="full" textAlign="center" mb="4">
                                    {validateError}
                                </Text>
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );

    const confirmOrder = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex w="full" pl="4" pr="4" mt="8" flexDir="column">
                        <Text fontSize="2xl" fontWeight="700" mb="2" color="gray.700">
                            Confirm Order
                        </Text>
                        <Text color="gray.500" fontSize="sm" mb="2">
                            {tooltipText}
                        </Text>
                        <Flex flexDir="column" p="4" boxShadow="md" borderRadius="md">
                            <HStack mt="1" mb="2">
                                <Text color="gray.600" fontSize="md">
                                    Order Type
                                </Text>
                                <Spacer />
                                <Text color="gray.900" fontWeight="600" fontSize="md">
                                    {orderType.substr(0, 1).toUpperCase() + orderType.substr(1)}
                                </Text>
                            </HStack>
                            <Divider />
                            <HStack mt="2" mb="2">
                                <Text color="gray.600" fontSize="md">
                                    Order Side
                                </Text>
                                <Spacer />
                                <Text color="gray.900" fontWeight="600" fontSize="md">
                                    {orderSide.substr(0, 1).toUpperCase() + orderSide.substr(1)}
                                </Text>
                            </HStack>
                            <Divider />
                            <HStack mt="2" mb="2">
                                <Text color="gray.600" fontSize="md">
                                    Order Quantity
                                </Text>
                                <Spacer />
                                <Text color="gray.900" fontWeight="600" fontSize="md">
                                    {+parseFloat(orderQuantity).toFixed(globalVars.ROUNDING_PRECISION)} {globalVars.BITCLOUT}
                                </Text>
                            </HStack>
                            <Divider />
                            {orderType != "market" ? (
                                <>
                                    <HStack mt="2" mb="2">
                                        <Text color="gray.600" fontSize="md">
                                            Limit Price
                                        </Text>
                                        <Spacer />
                                        <Text color="gray.900" fontWeight="600" fontSize="md">
                                            ${+parseFloat(limitPrice).toFixed(2)}
                                        </Text>
                                    </HStack>
                                    <Divider />
                                </>
                            ) : null}
                            <HStack mt="2">
                                <Text color="gray.600" fontSize="md">
                                    Estimated Total USD
                                </Text>
                                <Spacer />
                                <Text color="gray.900" fontWeight="600" fontSize="md">
                                    ${+totalUsd.toFixed(2)}
                                </Text>
                            </HStack>
                        </Flex>

                        <Flex flexDir="row" justifyContent="space-between" w="full" mt="6" mb="8">
                            <Button w="47%" variant="solid" onClick={() => setPage(0)}>
                                Modify
                            </Button>
                            <BlueButton w="47%" text={`   Confirm   `} onClick={handlePlaceOrder} loading={continueLoading} />
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
    );

    const orderSuccess = (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Flex w="full" pl="4" pr="4" mt="8" flexDir="column">
                        <Text fontSize="2xl" fontWeight="700" mt="1" mb="2" color="gray.700">
                            Order Placed
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                            Your order has been successfully placed. Market orders will reflect in your balance immediately. Limit orders will be fulfilled as
                            matching orders are found.
                        </Text>
                        <BlueButton w="100%" mt="6" mb="8" text={`   Close   `} onClick={onClose} />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );

    return renderHandler();
}
