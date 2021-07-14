import React, { useEffect, useState, useRef } from "react";
import { HiExclamationCircle, HiBadgeCheck } from "react-icons/hi";
import { Client } from "persona";
import {
    Flex,
    Button,
    Input,
    Text,
    Link,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    HStack,
    Spacer,
    Box,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Table,
    List,
    ListItem,
    OrderedList,
    UnorderedList,
} from "@chakra-ui/react";
import { FiArrowDown } from "react-icons/fi";
import { BalanceCard } from "../../components/BalanceCard";
import { CryptoCard } from "../../components/CryptoCard";
import { tokenState } from "../../store";
import { getEthUSD, getBitcloutUSD } from "../../services/utility";
import { TransactionSchema } from "../../interfaces/Transaction";
import { getTransactions } from "../../services/user";
import { withdrawBitcloutPreflightTxn } from "../../services/gateway";
import { TransactionModal } from "./TransactionModal";
import { BitcloutWithdrawModal, EthWithdrawModal } from "./WithdrawModal";
import { BitcloutDepositModal, EthDepositModal } from "./DepositModal";
import { useUser } from "../../hooks";
import { useRecoilValue } from "recoil";
import { userState } from "../../store";
import { BlueButton } from "../../components/BlueButton/BlueButton";
import { updateEmail, updateName, resendVerificationEmail } from "../../services/user";
import { FaCircle } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";

import * as globalVars from "../../globalVars";

const regEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

const tiers = [
    {
        name: "Silver",
        color: "#cccccc",
        pageText: "You are a Silver Tier BitSwap user. Please verify your identity to get full platform access.",
    },
    {
        name: "Gold",
        color: "#FFC634",
        pageText: "You are a Gold Tier BitSwap user. Enjoy unlimited trading on BitSwap!",
    },
];

export function Profile(): React.ReactElement {
    const user = useRecoilValue(userState);

    const [emailEdit, setEmailEdit] = useState(false);
    const [nameEdit, setNameEdit] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [withdrawRemaining, setWithdrawRemaining] = useState(globalVars.UNVERIFIED_WITHDRAW_LIMIT);

    const [loading, setLoading] = useState(false);
    const { isOpen: isEmailVerificationOpen, onOpen: onEmailVerificationOpen, onClose: onEmailVerificationClose } = useDisclosure();
    const { isOpen: isTierOpen, onOpen: onTierOpen, onClose: onTierClose } = useDisclosure();
    const embeddedClientRef = useRef<Client | null>(null);
    const [startedVerification, setStartedVerification] = useState(false);
    const token = useRecoilValue(tokenState);
    const { user: user2, userIsLoading, userIsError } = useUser(token);
    const [ethUsd, setEthUsd] = useState<number | null>(null);
    const [cloutUsd, setCloutUsd] = useState<number | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<{
        type: string;
        maxWithdraw: number;
    }>({
        type: globalVars.BITCLOUT,
        maxWithdraw: 0,
    });
    const [transactions, setTransactions] = useState<TransactionSchema[]>([]);
    const [currentTransaction, setCurrentTransaction] = useState<TransactionSchema | null>(null);
    const [BCLT, setBCLT] = useState({
        amount: user?.balance.bitclout,
        usdValue: cloutUsd ? cloutUsd * user2?.balance.bitclout : null,
    });
    const [ETH, setETH] = useState({
        amount: user?.balance.ether,
        usdValue: ethUsd ? ethUsd * user2?.balance.ether : null,
    });
    const { isOpen: isOpenTransactionModal, onOpen: onOpenTransactionModal, onClose: onCloseTransactionModal } = useDisclosure();

    const { isOpen: isOpenDepositModal, onOpen: onOpenDepositModal, onClose: onCloseDepositModal } = useDisclosure();

    const { isOpen: isOpenWithdrawModal, onOpen: onOpenWithdrawModal, onClose: onCloseWithdrawModal } = useDisclosure();

    useEffect(() => {
        getEthUSD().then((response) => {
            setEthUsd(response.data.data);
        });
        getBitcloutUSD().then((response) => {
            setCloutUsd(response.data.data);
        });
        getTransactions().then((response) => {
            setTransactions(response.data.data);
        });
    }, []);
    useEffect(() => {
        if (transactions.length > 0) {
            let temp = 0;
            transactions.map((transaction) => {
                if (transaction.transactionType == "withdraw") {
                    temp += transaction.usdValueAtTime;
                }
            });
            setWithdrawRemaining(globalVars.UNVERIFIED_WITHDRAW_LIMIT - temp);
        }
    }, [transactions]);
    useEffect(() => {
        console.log(user);
    }, [user]);
    useEffect(() => {
        if (selectedCurrency.type === globalVars.BITCLOUT) {
            getMaxBitclout().then((max) => {
                if (user?.tier == 0) {
                    console.log(cloutUsd);
                    if (cloutUsd && withdrawRemaining / cloutUsd < max) {
                        setSelectedCurrency({
                            type: globalVars.BITCLOUT,
                            maxWithdraw: withdrawRemaining / cloutUsd,
                        });
                    } else {
                        setSelectedCurrency({
                            type: globalVars.BITCLOUT,
                            maxWithdraw: max,
                        });
                    }
                } else {
                    setSelectedCurrency({
                        type: globalVars.BITCLOUT,
                        maxWithdraw: max,
                    });
                }
            });
        } else {
            getMaxEth().then((max) => {
                if (user?.tier == 0) {
                    console.log(ethUsd);
                    if (ethUsd && withdrawRemaining / ethUsd < max) {
                        setSelectedCurrency({
                            type: globalVars.ETHER,
                            maxWithdraw: withdrawRemaining / ethUsd,
                        });
                    } else {
                        setSelectedCurrency({
                            type: globalVars.ETHER,
                            maxWithdraw: max,
                        });
                    }
                } else {
                    setSelectedCurrency({
                        type: globalVars.ETHER,
                        maxWithdraw: max,
                    });
                }
            });
        }
        setBCLT({
            amount: user2?.balance.bitclout,
            usdValue: cloutUsd ? cloutUsd * user2?.balance.bitclout : null,
        });
        setETH({
            amount: user2?.balance.ether,
            usdValue: ethUsd ? ethUsd * user2?.balance.ether : null,
        });
        if (user) {
            setUserEmail(user.email);
            setUserName(user.name);
        }
    }, [withdrawRemaining, user, ethUsd, cloutUsd, selectedCurrency.type]);
    useEffect(() => {
        if (!regEmail.test(userEmail)) {
            setEmailErr(true);
        } else {
            setEmailErr(false);
        }
    }, [userEmail]);

    //make it into an est. gas fees field
    const getMaxBitclout = async (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            if (user2?.balance.bitclout > 0) {
                withdrawBitcloutPreflightTxn(user2.balance.bitclout)
                    .then((response) => {
                        resolve(user2.balance.bitclout - response.data.data.FeeNanos / 1e9);
                    })
                    .catch((error) => {
                        console.error(error);
                        resolve(0);
                    });
            } else {
                resolve(0);
            }
        });
    };

    const getMaxEth = (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            if (user2?.balance.ether > 0) {
                resolve(user2.balance.ether);
            } else {
                resolve(0);
            }
        });
    };

    const handleCurrencyChange = (type: string) => {
        console.log(type, selectedCurrency.type);
        if (type === globalVars.BITCLOUT) {
            getMaxBitclout().then((max) => {
                setSelectedCurrency({
                    type: globalVars.BITCLOUT,
                    maxWithdraw: max,
                });
            });
        } else {
            getMaxEth().then((max) => {
                setSelectedCurrency({
                    type: globalVars.ETHER,
                    maxWithdraw: max,
                });
            });
        }
    };

    const openTransactionModal = (transaction: TransactionSchema) => {
        setCurrentTransaction(transaction);
        onOpenTransactionModal();
    };
    const emailInputHandler = (e: any) => {
        setUserEmail(e.target.value);
    };

    const nameInputHandler = (e: any) => {
        setUserName(e.target.value);
    };

    const resendEmailVerification = () => {
        onEmailVerificationOpen();
        resendVerificationEmail();
    };

    const updateEmailFunc = () => {
        setLoading(true);
        updateEmail(userEmail)
            .then(() => {
                setLoading(false);
                window.location.reload();
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    const updateNameFunc = () => {
        setLoading(true);
        updateName(userName)
            .then(() => {
                setLoading(false);
                window.location.reload();
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    const createClient = () => {
        const client = new Client({
            language: "en",
            templateId: "tmpl_pSp6SHUWLXufK4PRnvDW9ov1",
            accountId: user?.verification.personaAccountId ? user.verification.personaAccountId : "",
            environment: globalVars.isTest ? "sandbox" : "production",
            onLoad: (error) => {
                if (error) {
                    console.error(`Failed with code: ${error.code} and message ${error.message}`);
                }

                client.open();
            },
            onStart: (inquiryId) => {
                console.log(`Started inquiry ${inquiryId}`);
            },
            onComplete: (inquiryId) => {
                console.log(`Sending finished inquiry ${inquiryId} to backend`);
                window.location.reload();
            },
            onEvent: (name, meta) => {
                switch (name) {
                    case "start":
                        console.log(`Received event: start`);
                        break;
                    default:
                        console.log(`Received event: ${name} with meta: ${JSON.stringify(meta)}`);
                }
            },
        });
        embeddedClientRef.current = client;
        setStartedVerification(true);

        window.exit = (force) => (client ? client.exit(force) : alert("Initialize client first"));
    };
    const profilePage = user ? (
        <>
            <>
                <Modal isOpen={isEmailVerificationOpen} onClose={onEmailVerificationClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Verification Email Sent</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>An email was sent to {user.email} for verification. Check your spam folder if you cannot find the email.</ModalBody>

                        <ModalFooter>
                            <BlueButton text={`   Close   `} onClick={onEmailVerificationClose} mr="3" />
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal isOpen={isTierOpen} onClose={onTierClose} isCentered size="sm">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalBody>
                            <Flex flexDir="column" alignItems="center" mt="6" mb="8">
                                <Text fontSize="2xl" fontWeight="700">
                                    BitSwap Tiers
                                </Text>
                                <Text fontSize="md" fontWeight="500" color={user.tier == 0 ? "#7F7F7F" : "#F6B100"}>
                                    @{user.bitclout.username ? user.bitclout.username : user.bitclout.publicKey} - {user.tier == 0 ? "Silver" : "Gold"} Tier
                                </Text>
                                <Flex mt="6" flexDir="column" alignItems="center">
                                    <Text fontSize="lg" fontWeight="600" border="2px solid #C4C4C4" pl="2" pr="2" borderRadius="5px" color="#7F7F7F ">
                                        Silver Tier
                                    </Text>
                                    <UnorderedList mt="2" display="flex" flexDir="column" alignItems="center">
                                        <ListItem fontWeight="500">$2000 Withdraw Limit</ListItem>
                                        {/* <ListItem fontWeight="500">Market Orders Only</ListItem> */}
                                    </UnorderedList>
                                </Flex>
                                <FiArrowDown size={50} color="#C4C4C4" style={{ marginTop: 20 }} />
                                <Flex mt="6" flexDir="column" alignItems="center">
                                    <Text fontWeight="600" textAlign="center" width="200px">
                                        {user.tier == 0
                                            ? "Verify your identity to advance to the next tier."
                                            : "You have already verified your identity and are a Gold Tier user"}
                                    </Text>
                                    <Text
                                        fontSize="lg"
                                        fontWeight="500"
                                        border="2px solid #F6B100"
                                        pl="2"
                                        pr="2"
                                        borderRadius="5px"
                                        color="white"
                                        mt="4"
                                        bgColor="#F6B100"
                                    >
                                        Gold Tier
                                    </Text>
                                    <UnorderedList mt="2" display="flex" flexDir="column" alignItems="center">
                                        <ListItem fontWeight="500">Unlimited Trading</ListItem>
                                        <ListItem fontWeight="500">Market and Limit Orders</ListItem>
                                    </UnorderedList>
                                </Flex>
                            </Flex>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <TransactionModal
                    disclosure={{
                        isOpen: isOpenTransactionModal,
                        onOpen: onOpenTransactionModal,
                        onClose: onCloseTransactionModal,
                    }}
                    transaction={currentTransaction}
                />
                {selectedCurrency.type == globalVars.BITCLOUT ? (
                    <>
                        <BitcloutDepositModal
                            disclosure={{
                                isOpen: isOpenDepositModal,
                                onOpen: onOpenDepositModal,
                                onClose: onCloseDepositModal,
                            }}
                        />
                        <BitcloutWithdrawModal
                            withdrawRemaining={user.tier == 0 ? withdrawRemaining : null}
                            maxWithdraw={selectedCurrency.maxWithdraw}
                            disclosure={{
                                isOpen: isOpenWithdrawModal,
                                onOpen: onOpenWithdrawModal,
                                onClose: onCloseWithdrawModal,
                            }}
                        />
                    </>
                ) : (
                    <>
                        <EthDepositModal
                            disclosure={{
                                isOpen: isOpenDepositModal,
                                onOpen: onOpenDepositModal,
                                onClose: onCloseDepositModal,
                            }}
                        />
                        <EthWithdrawModal
                            withdrawRemaining={user.tier == 0 ? withdrawRemaining : null}
                            maxWithdraw={selectedCurrency.maxWithdraw}
                            disclosure={{
                                isOpen: isOpenWithdrawModal,
                                onOpen: onOpenWithdrawModal,
                                onClose: onCloseWithdrawModal,
                            }}
                        />
                    </>
                )}
            </>
            <Flex flexDirection={{ base: "column", md: "row" }} w="full" p={4} justify={{ base: "start", md: "space-between" }} mt={4}>
                <Flex flexDirection="column" w={{ base: "100%", md: "55%" }} m={6} ml={{ base: 0, md: 10 }}>
                    <VStack spacing={6} align={{ base: "flex-start", md: "flex-start" }} w="full">
                        <HStack align="start" mb="2" spacing={4}>
                            <Image
                                src={`https://bitclout.com/api/v0/get-single-profile-picture/${user.bitclout.publicKey}`}
                                boxSize={{ base: "100px" }}
                                borderStyle="solid"
                                borderColor={user ? tiers[user.tier].color : "white"}
                                borderWidth="6px"
                                fallbackSrc="https://bitclout.com/assets/img/default_profile_pic.png"
                                fit="cover"
                                borderRadius="full"
                            />
                            {/* </Box> */}
                            <VStack align="start" spacing={2} alignSelf="center">
                                <Link
                                    isExternal
                                    href={`https://bitclout.com/u/${user.bitclout.username ? user.bitclout.username : "anonymous"}`}
                                    color="black"
                                    fontWeight="700"
                                    fontSize="20"
                                >
                                    @{user.bitclout.username ? user.bitclout.username : user.bitclout.publicKey}
                                </Link>
                                <Text color="#5B5B5B" fontWeight="400" fontSize="16" mt="1">
                                    {user.bitclout.bio}
                                </Text>
                                {!nameEdit ? (
                                    <HStack onDoubleClick={() => setNameEdit(true)}>
                                        <Text color="#5B5B5B" fontWeight="500" fontSize="16">
                                            {user.name !== "" ? user.name : "Please add your name"}
                                        </Text>
                                        <FiEdit3 onClick={() => setNameEdit(true)} color="#5B5B5B" size="18" cursor="pointer" />
                                    </HStack>
                                ) : (
                                    <HStack spacing="2" justify="flex-start">
                                        <Input
                                            isInvalid={userName.length <= 1}
                                            errorBorderColor="red.300"
                                            variant="outline"
                                            size="md"
                                            p="2"
                                            value={userName}
                                            onChange={nameInputHandler}
                                            w="50%"
                                        />
                                        <Button
                                            bg="gray.400"
                                            w="25%"
                                            p="10px 0"
                                            color="white"
                                            fontWeight="600"
                                            fontSize="sm"
                                            borderRadius="6"
                                            boxShadow="0px 2px 6px 0px #00000030"
                                            h="35px"
                                            onClick={() => setNameEdit(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <BlueButton
                                            isDisabled={userName.length <= 1}
                                            text={`Update`}
                                            w="25%"
                                            fontSize="sm"
                                            h="35px"
                                            onClick={updateNameFunc}
                                            loading={loading}
                                        />
                                    </HStack>
                                )}
                            </VStack>
                        </HStack>
                        <Flex
                            w={{ base: "full", md: "full" }}
                            flexDir={{ base: "column", md: "row" }}
                            p="6"
                            borderRadius="8"
                            borderColor="#DDE2E5"
                            borderWidth="1px"
                        >
                            <Flex flex="0.65" align={{ base: "center", md: "flex-start" }} justify="center" flexDir="column">
                                <HStack>
                                    <Text color="#44423D" fontWeight="700" fontSize="18">
                                        Tier
                                    </Text>
                                    <FaCircle color={user.tier == 0 ? "#C4C4C4" : "#FFC634"} size="16" />
                                </HStack>

                                <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                    You are a <span style={{ fontWeight: 600 }}>{user.tier == 0 ? "Silver" : "Gold"} Tier</span> BitSwap user.
                                    <br />
                                    {user.tier == 0 && `$${withdrawRemaining.toFixed(2)} USD withdrawal remaining.`}
                                    <br />
                                    {user.tier == 0 ? "Verify your identity to advance to the next tier." : "Enjoy unlimited trading on BitSwap!"}
                                </Text>
                            </Flex>
                            <Flex flex="0.35" justify={{ base: "center", md: "flex-end" }} align="center" mt={{ base: "15px", md: "0" }}>
                                <BlueButton text={`   View   `} w={{ base: "45%", md: "90%" }} fontSize="sm" onClick={onTierOpen} />
                            </Flex>
                        </Flex>
                        <Flex
                            w={{ base: "full", md: "full" }}
                            flexDir={{ base: "column", md: "row" }}
                            p="6"
                            borderRadius="8"
                            borderColor="#DDE2E5"
                            borderWidth="1px"
                        >
                            <Flex flex="0.65" align={{ base: "center", md: "flex-start" }} justify="center" flexDir="column">
                                <HStack>
                                    <Text color="#44423D" fontWeight="700" fontSize="18">
                                        Email
                                    </Text>
                                    {user.verification.email ? (
                                        <HiBadgeCheck style={{ display: "inline" }} color="#5388fe" size="20" />
                                    ) : (
                                        <HiExclamationCircle style={{ display: "inline" }} color="#EE0004" size="20" />
                                    )}
                                </HStack>

                                {user.verification.email ? (
                                    <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                        Your email is verified.
                                        <br />
                                        Important updates will be sent to this address.
                                    </Text>
                                ) : (
                                    <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                        Check your inbox for verification.
                                        <br />
                                        Important updates will be sent to this address.
                                    </Text>
                                )}

                                {!emailEdit ? (
                                    <Text color="#44423D" fontWeight="500" fontSize="md" mt="12px" onDoubleClick={() => setEmailEdit(true)}>
                                        {user.email}
                                    </Text>
                                ) : (
                                    <Input
                                        isInvalid={emailErr}
                                        errorBorderColor="red.300"
                                        variant="outline"
                                        size="md"
                                        p="5"
                                        mt="3"
                                        value={userEmail}
                                        onChange={emailInputHandler}
                                        w={{ base: "70%", md: "90%" }}
                                    />
                                )}
                            </Flex>
                            <Flex
                                flex="0.35"
                                justify={{ base: "center", md: "space-between" }}
                                align={{ base: "center", md: "flex-end" }}
                                flexDir={{ base: "row", md: "column" }}
                                mt={{ base: "15px", md: "0" }}
                            >
                                {!emailEdit ? (
                                    <>
                                        <BlueButton text={`   Edit   `} w={{ base: "45%", md: "90%" }} fontSize="sm" onClick={() => setEmailEdit(true)} />
                                        {user.verification.email ? null : (
                                            <BlueButton
                                                text={`   Resend Verification   `}
                                                w={{ base: "45%", md: "90%" }}
                                                fontSize="sm"
                                                onClick={resendEmailVerification}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Flex
                                            flexDir={{ base: "row", md: "column" }}
                                            align="center"
                                            justify="space-evenly"
                                            w={{ base: "45%", md: "90%" }}
                                            h="80%"
                                        >
                                            <Button
                                                bg="gray.400"
                                                w={{ base: "45%", md: "90%" }}
                                                p="10px 0"
                                                color="white"
                                                fontWeight="600"
                                                fontSize="sm"
                                                borderRadius="6"
                                                boxShadow="0px 2px 6px 0px #00000030"
                                                onClick={() => setEmailEdit(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Spacer />
                                            <BlueButton
                                                isDisabled={emailErr}
                                                text={`   Update   `}
                                                w={{ base: "45%", md: "90%" }}
                                                fontSize="sm"
                                                onClick={updateEmailFunc}
                                                loading={loading}
                                            />
                                        </Flex>
                                    </>
                                )}
                            </Flex>
                        </Flex>
                        <Flex
                            mt="20px"
                            w={{ base: "full", md: "full" }}
                            flexDir={{ base: "column", md: "row" }}
                            p="6"
                            borderRadius="8"
                            borderColor="#DDE2E5"
                            borderWidth="1px"
                        >
                            <Flex flex={"0.65"} align={{ base: "center", md: "flex-start" }} justify="center" flexDir="column">
                                <HStack>
                                    <Text color="#44423D" fontWeight="700" fontSize="18" isTruncated>
                                        Identity Verification
                                    </Text>
                                    {user.verification.personaVerified ? (
                                        <HiBadgeCheck style={{ display: "inline" }} color="#5388fe" size="20" />
                                    ) : (
                                        <HiExclamationCircle style={{ display: "inline" }} color="#EE0004" size="20" />
                                    )}
                                </HStack>
                                {user.verification.personaVerified ? (
                                    <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                        Your identity is verified. Enjoy full access to the platform.
                                    </Text>
                                ) : (
                                    <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                        Complete your identity verification to unlock full access.
                                    </Text>
                                )}
                            </Flex>
                            {/* {!user.verification.personaVerified && ( */}
                            <Flex
                                flex="0.35"
                                justify={{ base: "center" }}
                                align={{ base: "center", md: "flex-end" }}
                                flexDir={{ base: "row", md: "column" }}
                                mt={{ base: "15px", md: "0" }}
                            >
                                {startedVerification ? (
                                    <BlueButton
                                        onClick={() => (embeddedClientRef.current ? embeddedClientRef.current.open() : createClient())}
                                        fontSize="sm"
                                        text={`  Resume Verification   `}
                                        w={{ base: "45%", md: "90%" }}
                                        disabled={user.verification.personaVerified}
                                    />
                                ) : (
                                    <BlueButton
                                        fontSize="sm"
                                        onClick={createClient}
                                        text={`  Start Verification   `}
                                        w={{ base: "45%", md: "90%" }}
                                        disabled={user.verification.personaVerified}
                                    />
                                )}
                            </Flex>
                            {/* )} */}
                        </Flex>
                    </VStack>
                </Flex>

                {/* WALLET SECTION */}
                <Flex
                    justify={{ base: "space-between", xl: "start" }}
                    flexDirection="column"
                    w={{ base: "full", md: "45%" }}
                    m={{ base: 0, md: 6 }}
                    mr={{ base: 0, md: 10 }}
                >
                    <Flex flexDir="column" alignItems="center" w="full">
                        <Flex direction="column" bg="white" w="full">
                            <VStack>
                                <Flex flexDir={{ base: "column", md: "row" }} spacing={2} w="full" justify="space-between" mb="4">
                                    <Box onClick={() => handleCurrencyChange(globalVars.BITCLOUT)} w={{ base: "full", md: "49%" }}>
                                        <CryptoCard
                                            active={selectedCurrency.type == globalVars.BITCLOUT}
                                            imageUrl={globalVars.BITCLOUT_LOGO}
                                            currency={globalVars.BITCLOUT}
                                            amount={BCLT.amount}
                                            border={true}
                                        />
                                    </Box>
                                    <Box onClick={() => handleCurrencyChange(globalVars.ETHER)} w={{ base: "full", md: "49%" }} mt={{ base: "4", md: "0" }}>
                                        <CryptoCard
                                            active={selectedCurrency.type == globalVars.ETHER}
                                            imageUrl={globalVars.ETHER_LOGO}
                                            currency={globalVars.ETHER}
                                            amount={ETH.amount}
                                            border={true}
                                        />
                                    </Box>
                                </Flex>
                                <BalanceCard
                                    openWithdrawModal={onOpenWithdrawModal}
                                    openDepositModal={onOpenDepositModal}
                                    imageUrl={selectedCurrency.type == globalVars.BITCLOUT ? globalVars.BITCLOUT_LOGO : globalVars.ETHER_LOGO}
                                    currency={selectedCurrency.type == globalVars.BITCLOUT ? globalVars.BITCLOUT : globalVars.ETHER}
                                    amount={selectedCurrency.type == globalVars.BITCLOUT ? BCLT.amount : ETH.amount}
                                    usdValue={
                                        selectedCurrency.type == globalVars.BITCLOUT ? (BCLT.usdValue ? BCLT.usdValue : 0) : ETH.usdValue ? ETH.usdValue : 0
                                    }
                                />
                            </VStack>
                        </Flex>

                        <Table
                            w="full"
                            maxH="400px"
                            maxW="full"
                            variant="simple"
                            colorScheme="blackAlpha"
                            bg="white"
                            overflowY="auto"
                            overflowX="auto"
                            borderRadius="8"
                            borderColor="#DDE2E5"
                            borderWidth="1px"
                            as={Box}
                            size="md"
                            m="6"
                        >
                            <Thead position="sticky" top="0" zIndex="5" bgColor="white" pb="4">
                                <Tr>
                                    <Th color="gray.700" pt="5">
                                        Asset
                                    </Th>
                                    <Th color="gray.700" pt="5">
                                        Type
                                    </Th>
                                    <Th color="gray.700" pt="5">
                                        Value
                                    </Th>
                                    <Th color="gray.700" pt="5">
                                        Status
                                    </Th>
                                    <Th color="gray.700" pt="5">
                                        Timestamp
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {transactions.length > 0 ? (
                                    transactions
                                        .sort((a, b) => {
                                            return new Date(b.completionDate ?? b.created).getTime() - new Date(a.completionDate ?? a.created).getTime();
                                        })
                                        .map((transaction) => (
                                            <Tr onClick={() => openTransactionModal(transaction)} cursor="pointer" key={transaction._id}>
                                                <Td>
                                                    {transaction.assetType === "BCLT" ? (
                                                        <Image src={globalVars.BITCLOUT_LOGO} boxSize="32px" />
                                                    ) : (
                                                        <Image src={globalVars.ETHER_LOGO} boxSize="32px" />
                                                    )}
                                                </Td>
                                                <Td color="#ACB5BD" fontSize="14" textTransform="capitalize">
                                                    {transaction.transactionType}
                                                </Td>
                                                <Td color="gray.500" fontSize="14" textTransform="capitalize">
                                                    <HStack justify="flex-start" spacing={1}>
                                                        {transaction.transactionType === "withdraw" ? (
                                                            <VscTriangleDown color="#8692A6" size="14px" />
                                                        ) : (
                                                            <VscTriangleUp color="#407BFF" size="14px" />
                                                        )}
                                                        <Text fontSize="12px" whiteSpace="nowrap" color="#8692A6">
                                                            {transaction.value
                                                                ? `${globalVars.formatBalanceSmall(transaction.value)} ${transaction.assetType}`
                                                                : "N/A"}
                                                        </Text>
                                                    </HStack>
                                                </Td>
                                                <Td fontSize="14" textTransform="capitalize" color="#ACB5BD">
                                                    {transaction.state}
                                                </Td>
                                                <Td color="#ACB5BD" fontSize="14" textTransform="none">
                                                    {globalVars.timeSince(
                                                        new Date(transaction.completionDate ? transaction.completionDate : transaction.created)
                                                    )}
                                                </Td>
                                            </Tr>
                                        ))
                                ) : (
                                    <Tr>
                                        <Td pt="3" pb="3" color="#ACB5BD">
                                            No transactions yet...
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                        {/* </Box> */}
                        {/* </VStack> */}
                    </Flex>
                </Flex>
            </Flex>
        </>
    ) : null;

    return profilePage ? profilePage : <></>;
}
