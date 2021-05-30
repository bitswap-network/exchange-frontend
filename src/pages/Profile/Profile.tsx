import React, { useEffect, useState } from "react"
import {
    HiExclamationCircle,
    HiBadgeCheck,
    HiChevronLeft,
} from "react-icons/hi"
import {
    Flex,
    Button,
    Input,
    Text,
    Link,
    VStack,
    Image,
    InputRightElement,
    InputGroup,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { userState } from "../../store"
import { BlueButton } from "../../components/BlueButton/BlueButton"
import { verifyBitclout, updateProfile } from "../../services/user"
import { logout } from "../../helpers/persistence"

const regEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/

export function Profile(): React.ReactElement {
    const user = useRecoilValue(userState)

    let BitcloutCode: any = null
    const [emailEdit, setEmailEdit] = useState(false)
    const [nameEdit, setNameEdit] = useState(false)
    const [emailErr, setEmailErr] = useState(false)
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [currentPage, setCurrentPage] = useState("profile")
    const [textCopied, setTextCopied] = useState("copy")
    const [verificationErrText, setVerificationErrText] = useState("")
    const [loading, setLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const emailInputHandler = (e: any) => {
        setUserEmail(e.target.value)
    }

    const nameInputHandler = (e: any) => {
        setUserName(e.target.value)
    }

    useEffect(() => {
        if (!regEmail.test(userEmail)) {
            setEmailErr(true)
        } else {
            setEmailErr(false)
        }
    }, [userEmail])

    useEffect(() => {
        setUserEmail(user.email)
        setUserName(user.name)
    }, [user])

    const handleLogout = () => {
        logout()
        window.location.assign("/login")
    }

    const resendEmailVerification = () => {
        onOpen()
    }

    const updateUser = (email: string, name: string) => {
        setLoading(true)
        updateProfile(email, name)
            .then(() => {
                setLoading(false)
                window.location.reload()
            })
            .catch((error) => {
                setLoading(false)
                console.error(error)
            })
    }

    const checkBitcloutVerification = () => {
        setLoading(true)
        verifyBitclout()
            .then(() => {
                setLoading(false)
                setVerificationErrText("")
                setCurrentPage("complete")
            })
            .catch(() => {
                setLoading(false)
                setVerificationErrText("Unable to verify profile.")
            })
    }

    const copyToClipboard = (e: any) => {
        BitcloutCode.select()
        document.execCommand("copy")
        setTextCopied("copied")
        setTimeout(function () {
            setTextCopied("copy")
        }, 3000)
        e.target.focus()
    }

    const profilePage = (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Verification Email Sent</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        An email was sent to {user.email} for verification.
                        Check your spam folder if you cannot find the email.
                    </ModalBody>

                    <ModalFooter>
                        <BlueButton
                            text={`   Close   `}
                            onClick={onClose}
                            mr="3"
                        />
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Flex
                minH="100%"
                align="center"
                justify="center"
                flexDirection="column"
            >
                <Image
                    src={user.bitclout.profilePicture}
                    w="80px"
                    h="80px"
                    borderRadius="80px"
                />
                <Link
                    isExternal
                    href={`https://bitclout.com/u/${user.bitclout.username}`}
                    color="black"
                    fontWeight="700"
                    fontSize="20"
                    mt="3"
                >
                    @{user.bitclout.username}
                </Link>
                <Text color="gray.700" fontWeight="400" fontSize="16" mt="2">
                    {user.bitclout.bio}
                </Text>
                <Flex
                    mt="20px"
                    w={{ sm: "80%", md: "650px" }}
                    p="20px"
                    flexDir={{ sm: "column", md: "row" }}
                    borderRadius="10"
                    boxShadow="1px 4px 6px 0px #00000040"
                >
                    <Flex
                        flex="0.65"
                        align="flex-start"
                        justify="center"
                        flexDir="column"
                    >
                        <Text color="#44423D" fontWeight="700" fontSize="18">
                            Name{" "}
                        </Text>

                        {!nameEdit ? (
                            <Text
                                color="#44423D"
                                fontWeight="500"
                                fontSize="md"
                                mt="12px"
                            >
                                {user.name}
                            </Text>
                        ) : (
                            <Input
                                isInvalid={userName.length <= 1}
                                errorBorderColor="red.300"
                                variant="outline"
                                size="md"
                                p="5"
                                mt="3"
                                value={userName}
                                onChange={nameInputHandler}
                            />
                        )}
                    </Flex>
                    <Flex
                        flex="0.35"
                        align="flex-end"
                        justify="space-between"
                        flexDir={{ sm: "row", md: "column" }}
                        mt={{ sm: "15px", md: "0" }}
                    >
                        {!nameEdit ? (
                            <BlueButton
                                text={`   Edit   `}
                                width={{ sm: "45%", md: "90%" }}
                                onClick={() => setNameEdit(true)}
                            />
                        ) : (
                            <>
                                <Button
                                    bg="gray.400"
                                    w={{ sm: "45%", md: "90%" }}
                                    p="10px 0"
                                    color="white"
                                    fontWeight="600"
                                    fontSize="16"
                                    borderRadius="6"
                                    boxShadow="0px 2px 6px 0px #00000030"
                                    onClick={() => setNameEdit(false)}
                                >
                                    Cancel
                                </Button>
                                <BlueButton
                                    mt="4"
                                    isDisabled={userName.length <= 1}
                                    text={`   Update   `}
                                    width={{ sm: "45%", md: "90%" }}
                                    onClick={() =>
                                        updateUser(user.email, user.name)
                                    }
                                    loading={loading}
                                />
                            </>
                        )}
                    </Flex>
                </Flex>
                <Flex
                    mt="20px"
                    w={{ sm: "80%", md: "650px" }}
                    p="20px"
                    flexDir={{ sm: "column", md: "row" }}
                    borderRadius="10"
                    boxShadow="1px 4px 6px 0px #00000040"
                >
                    <Flex
                        flex="0.65"
                        align="flex-start"
                        justify="center"
                        flexDir="column"
                    >
                        <Text color="#44423D" fontWeight="700" fontSize="18">
                            Email{" "}
                            {user.verification.email ? (
                                <HiBadgeCheck
                                    style={{ display: "inline" }}
                                    color="#5388fe"
                                    size="20"
                                />
                            ) : (
                                <HiExclamationCircle
                                    style={{ display: "inline" }}
                                    color="#EE0004"
                                    size="20"
                                />
                            )}
                        </Text>
                        {user.verification.email ? (
                            <Text
                                color="#44423D"
                                fontWeight="300"
                                fontSize="15"
                                mt="12px"
                            >
                                Your email is already verified.
                                <br />
                                Important updates will be sent to this address.
                            </Text>
                        ) : (
                            <Text
                                color="#44423D"
                                fontWeight="300"
                                fontSize="15"
                                mt="12px"
                            >
                                Check your inbox for verification, or resend
                                verification.
                                <br />
                                Important updates will be sent to this address.
                            </Text>
                        )}

                        {!emailEdit ? (
                            <Text
                                color="#44423D"
                                fontWeight="500"
                                fontSize="md"
                                mt="12px"
                            >
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
                    <Flex
                        flex="0.35"
                        align="flex-end"
                        justify="space-between"
                        flexDir={{ sm: "row", md: "column" }}
                        mt={{ sm: "15px", md: "0" }}
                    >
                        {!emailEdit ? (
                            <>
                                <BlueButton
                                    text={`   Edit   `}
                                    width={{ sm: "45%", md: "90%" }}
                                    onClick={() => setEmailEdit(true)}
                                />
                                {user.verification.email ? null : (
                                    <BlueButton
                                        text={`   Resend Verification   `}
                                        width={{ sm: "45%", md: "90%" }}
                                        onClick={resendEmailVerification}
                                    />
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
                                    fontSize="16"
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
                                    onClick={() =>
                                        updateUser(userEmail, user.name)
                                    }
                                    loading={loading}
                                />
                            </>
                        )}
                    </Flex>
                </Flex>

                {user.verification.status === "verified" ? (
                    <Flex
                        mt="50px"
                        w={{ sm: "80%", md: "650px" }}
                        p="20px"
                        flexDir="column"
                        align="flex-start"
                        justify="center"
                        borderRadius="10"
                        boxShadow="1px 4px 6px 0px #00000040"
                        mb={{ sm: "50px", md: "0" }}
                    >
                        <Text color="#44423D" fontWeight="700" fontSize="18">
                            BitClout Verification{" "}
                            <HiBadgeCheck
                                style={{ display: "inline" }}
                                color="#5388fe"
                                size="20"
                            />
                        </Text>
                        <Text
                            color="#44423D"
                            fontWeight="300"
                            fontSize="15"
                            mt="12px"
                        >
                            You have already made your BitClout verification
                            post.
                            <br />
                            Enjoy full access to the platform.
                        </Text>
                    </Flex>
                ) : (
                    <Flex
                        mt="50px"
                        w={{ sm: "80%", md: "650px" }}
                        p="20px"
                        flexDir={{ sm: "column", md: "row" }}
                        borderRadius="10"
                        boxShadow="1px 4px 6px 0px #00000040"
                        mb={{ sm: "50px", md: "0" }}
                    >
                        <Flex
                            flex="0.65"
                            align="flex-start"
                            justify="center"
                            flexDir="column"
                        >
                            <Text
                                color="#44423D"
                                fontWeight="700"
                                fontSize="18"
                            >
                                BitClout Verification{" "}
                                <HiExclamationCircle
                                    style={{ display: "inline" }}
                                    color="#EE0004"
                                    size="20"
                                />
                            </Text>
                            <Text
                                color="#44423D"
                                fontWeight="300"
                                fontSize="15"
                                mt="12px"
                            >
                                You must make a BitClout post to verify your
                                account before making any exchanges.
                            </Text>
                        </Flex>
                        <Flex
                            flex="0.35"
                            align="flex-end"
                            justify={{ sm: "center", md: "space-between" }}
                            flexDir={{ sm: "row", md: "column" }}
                            mt={{ sm: "15px", md: "0" }}
                        >
                            <BlueButton
                                text={`   Verify   `}
                                width="90%"
                                onClick={() => setCurrentPage("verify")}
                            />
                        </Flex>
                    </Flex>
                )}

                <Flex
                    mt="50px"
                    w={{ sm: "80%", md: "600px" }}
                    flexDir="column"
                    alignItems="center"
                >
                    <Button
                        bg="red.500"
                        w="125px"
                        p="10px 0"
                        color="white"
                        fontWeight="600"
                        fontSize="16"
                        borderRadius="6"
                        boxShadow="0px 2px 6px 0px #00000030"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Flex>
            </Flex>
        </>
    )

    const VerifyBitclout = (
        <Flex h="70vh" alignItems="center" justifyContent="center">
            <VStack spacing={8} align="flex-start" maxW="450px">
                <Button
                    color="gray.600"
                    fontWeight="500"
                    fontSize="16"
                    p="0"
                    onClick={() => setCurrentPage("profile")}
                >
                    <HiChevronLeft
                        style={{ display: "inline" }}
                        color="gray.600"
                        size="24"
                    />{" "}
                    Back
                </Button>
                <Text fontSize="xx-large" fontWeight="bold">
                    BitClout Verification
                </Text>
                <Text fontSize="md" color="gray.600">
                    Please post the following on BitClout with your verification
                    code (given below).
                </Text>
                <InputGroup size="md">
                    <Input
                        pr="4.5rem"
                        ref={(input) => {
                            BitcloutCode = input
                        }}
                        type="text"
                        isReadOnly={true}
                        value={user.verification.bitcloutString}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={copyToClipboard}>
                            {textCopied}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Image src="./bitclout_verification.png" />
                <Flex w="full" align="center" flexDir="column">
                    <Text fontSize="md" color="red.300" mb="4">
                        {verificationErrText}
                    </Text>
                    <BlueButton
                        text={`   Verify   `}
                        width="350px"
                        onClick={checkBitcloutVerification}
                        loading={loading}
                    />
                </Flex>
            </VStack>
        </Flex>
    )

    const VerificationComplete = (
        <Flex h="70vh" alignItems="center" justifyContent="center">
            <VStack spacing={8} align="flex-start" maxW="450px">
                <Text fontSize="xx-large" fontWeight="bold">
                    Verification Complete
                </Text>
                <Text fontSize="md" color="gray.600">
                    Welcome to BitSwap! Click the button below to return to your
                    account.
                </Text>
                <BlueButton
                    text={`   Return To Profile   `}
                    width="350px"
                    onClick={() => setCurrentPage("profile")}
                />
            </VStack>
        </Flex>
    )

    return currentPage == "profile"
        ? profilePage
        : currentPage == "verify"
        ? VerifyBitclout
        : VerificationComplete
}
