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
} from "@chakra-ui/react";
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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const embeddedClientRef = useRef<Client | null>(null);
    const [startedVerification, setStartedVerification] = useState(false);

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
        onOpen();
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
            <SimpleGrid columns={2} bgColor="white" spacing={10} mt="6">
                <Flex height="full" bgColor="white">
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Verification Email Sent</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>An email was sent to {user.email} for verification. Check your spam folder if you cannot find the email.</ModalBody>

                            <ModalFooter>
                                <BlueButton text={`   Close   `} onClick={onClose} mr="3" />
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <VStack align="self-start" spacing={8}>
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
                            w={{ sm: "80%", md: "550px" }}
                            p="20px"
                            flexDir={{ sm: "column", md: "row" }}
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
                            <Flex flex="0.35" align="flex-end" justify="space-between" flexDir={{ sm: "row", md: "column" }} mt={{ sm: "15px", md: "0" }}>
                                <BlueButton text={`   View   `} width={{ sm: "45%", md: "90%" }} fontSize="sm" onClick={() => setNameEdit(true)} />
                            </Flex>
                        </Flex>
                        <Flex
                            mt="20px"
                            w={{ sm: "80%", md: "550px" }}
                            p="20px"
                            flexDir={{ sm: "column", md: "row" }}
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
                            <Flex flex="0.35" align="flex-end" justify="space-between" flexDir={{ sm: "row", md: "column" }} mt={{ sm: "15px", md: "0" }}>
                                {!emailEdit ? (
                                    <>
                                        <BlueButton text={`   Edit   `} width={{ sm: "45%", md: "90%" }} fontSize="sm" onClick={() => setEmailEdit(true)} />
                                        {user.verification.email ? null : (
                                            <BlueButton text={`   Resend Verification   `} width={{ sm: "45%", md: "90%" }} fontSize="sm" onClick={resendEmailVerification} />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            bg="gray.400"
                                            w={{ sm: "45%", md: "90%" }}
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
                                            width={{ sm: "45%", md: "90%" }}
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
                            w={{ sm: "80%", md: "550px" }}
                            p="20px"
                            flexDir={{ sm: "column", md: "row" }}
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
                                        Your identity is verified.<br/>enjoy full access to the platform.
                                    </Text>
                                ) : (
                                    <Text color="#44423D" fontWeight="300" fontSize="sm" mt="12px">
                                        Complete your identity verification to unlock full access.
                                    </Text>
                                )}
                            </Flex>
                            {!user.verification.personaVerified && (
                                <Flex flex="0.35" align="flex-end" justify="space-between" flexDir={{ sm: "row", md: "column" }} mt={{ sm: "15px", md: "0" }}>
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
            </SimpleGrid>
        </>
    ) : null;

    return profilePage;
}
