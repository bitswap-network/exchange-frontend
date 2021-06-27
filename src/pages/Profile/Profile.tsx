import React, { useEffect, useState, useRef } from "react";
import { HiExclamationCircle, HiBadgeCheck } from "react-icons/hi";
import { MdModeEdit } from "react-icons/md";
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
    SimpleGrid,
    Box,
    Heading,
} from "@chakra-ui/react";
import { BalanceCard } from "../../components/BalanceCard";
import { CryptoCard } from "../../components/CryptoCard";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
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
import { logout } from "../../helpers/persistence";
import * as globalVars from "../../globalVars";

const regEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

export function Profile(): React.ReactElement {
    const user = useRecoilValue(userState);

    const [emailEdit, setEmailEdit] = useState(false);
    const [nameEdit, setNameEdit] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPfp, setUserPfp] = useState("https://bitclout.com/assets/img/default_profile_pic.png");
    const [currentPage, setCurrentPage] = useState("profile");
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
        if (selectedCurrency.type === globalVars.BITCLOUT) {
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
        setBCLT({
            amount: user2?.balance.bitclout,
            usdValue: cloutUsd ? cloutUsd * user2?.balance.bitclout : null,
        });
        setETH({
            amount: user2?.balance.ether,
            usdValue: ethUsd ? ethUsd * user2?.balance.ether : null,
        });
    }, [user, ethUsd, cloutUsd]);
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

    useEffect(() => {
        if (!regEmail.test(userEmail)) {
            setEmailErr(true);
        } else {
            setEmailErr(false);
        }
    }, [userEmail]);

    useEffect(() => {
        if (user) {
            setUserEmail(user.email);
            setUserName(user.name);
            setUserPfp(
                `https://bitclout.com/api/v0/get-single-profile-picture/${user.bitclout.publicKey}?fallback=https://bitclout.com/assets/img/default_profile_pic.png`
            );
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        window.location.assign("/");
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
            <SimpleGrid columns={{ base: 1, xl: 2 }} bgColor="white" spacing={10} mt="6">
                <Flex bgColor="white" justify={{ base: "center", xl: "start" }}>
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
                    <Modal isOpen={isTierOpen} onClose={onTierClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>BitSwap Tiers</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>Insert content here</ModalBody>
                            <ModalFooter>
                                <BlueButton text={`   Close   `} onClick={onTierClose} mr="3" />
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <VStack spacing={8} align={{ base: "center", xl: "self-start" }}>
                        <HStack align="start">
                            <Image src={userPfp} w="80px" fit="cover" alignSelf="center" borderRadius="80px" mr="4" />
                            <VStack align="start" spacing="0" alignSelf="center">
                                <Link
                                    isExternal
                                    href={`https://bitclout.com/u/${user.bitclout.username ? user.bitclout.username : "anonymous"}`}
                                    color="black"
                                    fontWeight="700"
                                    fontSize="20"
                                >
                                    @{user.bitclout.username ? user.bitclout.username : user.bitclout.publicKey}
                                </Link>
                                {!nameEdit ? (
                                    <Text color="gray.700" fontWeight="600" fontSize="16" mt="1" display="inline">
                                        {user.name !== "" ? user.name : "Please add your name"}{" "}
                                        <MdModeEdit style={{ display: "inline", marginTop: -4 }} onClick={() => setNameEdit(true)} />
                                    </Text>
                                ) : (
                                    <HStack spacing="1">
                                        <Input
                                            isInvalid={userName.length <= 1}
                                            errorBorderColor="red.300"
                                            variant="outline"
                                            size="sm"
                                            p="2"
                                            value={userName}
                                            onChange={nameInputHandler}
                                        />
                                        <Button
                                            bg="gray.400"
                                            w={250}
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
                                            w={250}
                                            fontSize="sm"
                                            h="35px"
                                            onClick={updateNameFunc}
                                            loading={loading}
                                        />
                                    </HStack>
                                )}
                                <Text color="gray.700" fontWeight="400" fontSize="16" mt="1">
                                    {user.bitclout.bio}
                                </Text>
                            </VStack>
                        </HStack>
                        <Flex
                            mt="20px"
                            w={{ base: "80%", md: "550px" }}
                            p="20px"
                            flexDir={{ base: "column", md: "row" }}
                            borderRadius="10"
                            boxShadow="1px 4px 6px 0px #00000040"
                            background="whiteAlpha.700"
                        >
                            <Flex flex="0.65" align="flex-start" justify="center" flexDir="column">
                                <Text color="#44423D" fontWeight="700" fontSize="18">
                                    Tier <HiBadgeCheck style={{ display: "inline" }} color="#FFC634" size="20" />
                                </Text>
                                <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                    You are a <span style={{ fontWeight: 600 }}>Gold Tier</span> BitSwap user.
                                    <br />
                                    Enjoy unlimited trading on BitSwap!
                                </Text>
                            </Flex>
                            <Flex flex="0.35" align="flex-end" justify="space-between" flexDir={{ base: "row", md: "column" }} mt={{ base: "15px", md: "0" }}>
                                <BlueButton text={`   View   `} w={{ base: "45%", md: "90%" }} fontSize="sm" onClick={onTierOpen} />
                            </Flex>
                        </Flex>
                        <Flex
                            mt="20px"
                            w={{ base: "80%", md: "550px" }}
                            p="20px"
                            flexDir={{ base: "column", md: "row" }}
                            borderRadius="10"
                            boxShadow="1px 4px 6px 0px #00000040"
                            background="whiteAlpha.700"
                        >
                            <Flex flex="0.65" align="flex-start" justify="center" flexDir="column">
                                <Text color="#44423D" fontWeight="700" fontSize="18">
                                    Email{" "}
                                    {user.verification.email ? (
                                        <HiBadgeCheck style={{ display: "inline" }} color="#5388fe" size="20" />
                                    ) : (
                                        <HiExclamationCircle style={{ display: "inline" }} color="#EE0004" size="20" />
                                    )}
                                </Text>
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
                                    <Text color="#44423D" fontWeight="500" fontSize="sm" mt="12px">
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
                                    />
                                )}
                            </Flex>
                            <Flex flex="0.35" align="flex-end" justify="space-between" flexDir={{ base: "row", md: "column" }} mt={{ base: "15px", md: "0" }}>
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
                                        <BlueButton
                                            isDisabled={emailErr}
                                            text={`   Update   `}
                                            w={{ base: "45%", md: "90%" }}
                                            fontSize="sm"
                                            onClick={updateEmailFunc}
                                            loading={loading}
                                        />
                                    </>
                                )}
                            </Flex>
                        </Flex>
                        <Flex
                            mt="20px"
                            w={{ base: "80%", md: "550px" }}
                            p="20px"
                            flexDir={{ base: "column", md: "row" }}
                            borderRadius="10"
                            boxShadow="1px 4px 6px 0px #00000040"
                            background="whiteAlpha.700"
                        >
                            <Flex flex={user.verification.personaVerified ? "1" : "0.65"} align="flex-start" justify="center" flexDir="column">
                                <Text color="#44423D" fontWeight="700" fontSize="18">
                                    Identity Verification{" "}
                                    {user.verification.personaVerified ? (
                                        <HiBadgeCheck style={{ display: "inline" }} color="#5388fe" size="20" />
                                    ) : (
                                        <HiExclamationCircle style={{ display: "inline" }} color="#EE0004" size="20" />
                                    )}
                                </Text>
                                {user.verification.personaVerified ? (
                                    <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                        Your identity is verified.
                                        <br />
                                        enjoy full access to the platform.
                                    </Text>
                                ) : (
                                    <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                        Complete your identity verification to unlock full access.
                                    </Text>
                                )}
                            </Flex>
                            {!user.verification.personaVerified && (
                                <Flex
                                    flex="0.35"
                                    align="flex-end"
                                    justify="space-between"
                                    flexDir={{ base: "row", md: "column" }}
                                    mt={{ base: "15px", md: "0" }}
                                >
                                    {startedVerification ? (
                                        <BlueButton
                                            onClick={() => (embeddedClientRef.current ? embeddedClientRef.current.open() : createClient())}
                                            fontSize="sm"
                                            text={`  Resume Verification   `}
                                        />
                                    ) : (
                                        <BlueButton fontSize="sm" onClick={createClient} text={`  Start Verification   `} />
                                    )}
                                </Flex>
                            )}
                        </Flex>
                    </VStack>
                </Flex>

                {/* WALLET SECTION */}
                <Flex bgColor="white" justify={{ base: "center", xl: "start" }}>
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
                                maxWithdraw={selectedCurrency.maxWithdraw}
                                disclosure={{
                                    isOpen: isOpenWithdrawModal,
                                    onOpen: onOpenWithdrawModal,
                                    onClose: onCloseWithdrawModal,
                                }}
                            />
                        </>
                    )}
                    <Flex flexDir="column" alignItems="center" w="full">
                        <Flex direction="column" bg="background.primary" w="full">
                            <VStack>
                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={2} w="full">
                                    <Box onClick={() => handleCurrencyChange(globalVars.BITCLOUT)} w="full" maxW="sm">
                                        <CryptoCard
                                            active={selectedCurrency.type == globalVars.BITCLOUT}
                                            imageUrl={globalVars.BITCLOUT_LOGO}
                                            currency={globalVars.BITCLOUT}
                                            amount={BCLT.amount}
                                            border={true}
                                        />
                                    </Box>
                                    <Box onClick={() => handleCurrencyChange(globalVars.ETHER)} w="full" maxW="sm">
                                        <CryptoCard
                                            active={selectedCurrency.type == globalVars.ETHER}
                                            imageUrl={globalVars.ETHER_LOGO}
                                            currency={globalVars.ETHER}
                                            amount={ETH.amount}
                                            border={true}
                                        />
                                    </Box>
                                </SimpleGrid>
                                {selectedCurrency.type == globalVars.BITCLOUT ? (
                                    <BalanceCard
                                        openWithdrawModal={onOpenWithdrawModal}
                                        openDepositModal={onOpenDepositModal}
                                        imageUrl={globalVars.BITCLOUT_LOGO}
                                        currency={globalVars.BITCLOUT}
                                        amount={BCLT.amount}
                                        usdValue={BCLT.usdValue ? BCLT.usdValue : 0}
                                    />
                                ) : (
                                    <BalanceCard
                                        openWithdrawModal={onOpenWithdrawModal}
                                        openDepositModal={onOpenDepositModal}
                                        imageUrl={globalVars.ETHER_LOGO}
                                        currency={globalVars.ETHER}
                                        amount={ETH.amount}
                                        usdValue={ETH.usdValue ? ETH.usdValue : 0}
                                    />
                                )}
                            </VStack>
                        </Flex>
                        <VStack alignItems="flex-start" mt="8" spacing={5} w="full" mb="10">
                            <Heading as="h2" size="md" color="gray.700">
                                Transaction History
                            </Heading>
                            <Box bg="white" w="full" borderRadius="lg" boxShadow="md" maxH="400px" overflowY="auto">
                                <Table variant="simple" colorScheme="blackAlpha" w="full">
                                    <Thead position="sticky" top="0" zIndex="100" bgColor="whiteAlpha.900" pb="4">
                                        <Tr>
                                            <Th color="gray.700" pt="5">
                                                Transaction Type
                                            </Th>
                                            <Th color="gray.700" pt="5">
                                                Timestamp
                                            </Th>
                                            <Th color="gray.700" pt="5">
                                                Asset
                                            </Th>
                                            <Th color="gray.700" pt="5">
                                                Value
                                            </Th>
                                            <Th color="gray.700" pt="5">
                                                Status
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {transactions.filter((transaction) => {
                                            if (selectedCurrency.type === globalVars.BITCLOUT) {
                                                return transaction.assetType === "BCLT";
                                            } else {
                                                return transaction.assetType === "ETH";
                                            }
                                        }).length > 0 ? (
                                            transactions
                                                .filter((transaction) => {
                                                    if (selectedCurrency.type === globalVars.BITCLOUT) {
                                                        return transaction.assetType === "BCLT";
                                                    } else {
                                                        return transaction.assetType === "ETH";
                                                    }
                                                })
                                                .sort((a, b) => {
                                                    return (
                                                        new Date(b.completionDate ?? b.created).getTime() - new Date(a.completionDate ?? a.created).getTime()
                                                    );
                                                })
                                                .map((transaction) => (
                                                    <Tr onClick={() => openTransactionModal(transaction)} cursor="pointer" key={transaction._id}>
                                                        <Td color="gray.500" fontSize="14" textTransform="capitalize">
                                                            {transaction.transactionType}
                                                        </Td>
                                                        <Td color="gray.500" fontSize="14" textTransform="capitalize">
                                                            {globalVars.timeSince(
                                                                new Date(transaction.completionDate ? transaction.completionDate : transaction.created)
                                                            )}
                                                        </Td>
                                                        <Td color="gray.500" fontSize="14" textTransform="capitalize">
                                                            {transaction.assetType}
                                                        </Td>
                                                        <Td color="gray.500" fontSize="14">
                                                            {transaction.value
                                                                ? `${globalVars.formatBalanceSmall(transaction.value)} ${transaction.assetType}`
                                                                : "N/A"}
                                                        </Td>
                                                        <Td color="gray.500" fontSize="14" textTransform="capitalize">
                                                            {transaction.state}
                                                        </Td>
                                                    </Tr>
                                                ))
                                        ) : (
                                            <Tr>
                                                <Td pt="3" pb="3" color="gray.500">
                                                    No transactions yet...
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </Box>
                        </VStack>
                    </Flex>
                </Flex>
            </SimpleGrid>
        </>
    ) : null;

    return profilePage;
}
