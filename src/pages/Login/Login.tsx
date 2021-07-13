import React, { ReactElement, useState } from "react";
import { VStack, Text, Input, Flex, Checkbox, Link, HStack } from "@chakra-ui/react";
import { HiExclamationCircle } from "react-icons/hi";
import { BlueButton } from "../../components/BlueButton/BlueButton";
import { launch, jwt } from "../../services/identity";
import { login, fetchBitcloutProfile, register } from "../../services/auth";
import { BitcloutProfile } from "../../interfaces/bitclout/Profile";

import { setIdentityUsers } from "../../helpers/persistence";

interface CreateUserObj {
    publicKey: string;
    email: string;
    name: string;
}
const regEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function Login(): ReactElement {
    const [bitcloutProfile, setBitcloutProfile] = useState<BitcloutProfile | null>(null);

    const [createProfile, setCreateProfile] = useState<CreateUserObj>({
        publicKey: "",
        email: "",
        name: "",
    });
    const [newUser, setNewUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [nameErr, setNameErr] = useState(false);
    const [termsErr, setTermsErr] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [errText, setErrText] = useState("");
    const [checked, setChecked] = useState(false);

    const registerHandler = () => {
        setLoading(true);
        if (validate()) {
            register(createProfile.publicKey, createProfile.email, createProfile.name)
                .then(() => {
                    setErrText("");
                    setLoading(false);
                    setRegistrationSuccess(true);
                })
                .catch((error: any) => {
                    error.response.data
                        ? error.response.data.message
                            ? setErrText(error.response.data.message)
                            : setErrText(error.response.data)
                        : setErrText("Something went wrong, try again later.");
                });
        } else {
            setLoading(false);
        }
    };

    const validate = () => {
        if (regEmail.test(createProfile.email) && createProfile.name.length > 1 && checked && createProfile.publicKey.length == 55) {
            setEmailErr(false);
            setNameErr(false);
            return true;
        } else {
            setEmailErr(!regEmail.test(createProfile.email));
            setNameErr(createProfile.name.length <= 1);
            setTermsErr(!checked);
            return false;
        }
    };

    const loginHandler = () => {
        setLoading(true);
        launch("/log-in").subscribe((res) => {
            setErrText("");
            setIdentityUsers(res.users);
            const payload = {
                accessLevel: res.users[res.publicKeyAdded].accessLevel,
                accessLevelHmac: res.users[res.publicKeyAdded].accessLevelHmac,
                encryptedSeedHex: res.users[res.publicKeyAdded].encryptedSeedHex,
            };
            jwt(payload).subscribe((token) => {
                token.jwt
                    ? login(res.publicKeyAdded, token.jwt)
                          .then(() => {
                              setLoading(false);
                              window.location.assign("/");
                          })
                          .catch((error: any) => {
                              setLoading(false);
                              //TODO: revise response status codes
                              if (error.response) {
                                  if (error.response.status === 406) {
                                      fetchBitcloutProfile(res.publicKeyAdded, "")
                                          .then((response) => {
                                              setBitcloutProfile(response.data);
                                              setNewUser(true);
                                              setCreateProfile({
                                                  ...createProfile,
                                                  publicKey: res.publicKeyAdded,
                                              });
                                          })
                                          .catch((error) => {
                                              setNewUser(true);
                                              setCreateProfile({
                                                  ...createProfile,
                                                  publicKey: res.publicKeyAdded,
                                              });
                                              error.response.data.message && setErrText("Warning: Importing anonymous Bitclout account.");
                                          });
                                  }
                              } else {
                                  console.log(error);
                              }
                          })
                    : setErrText("Error logging in with identity.");
            });
        });
    };

    const emailInputHandler = (e: any) => {
        setCreateProfile({
            ...createProfile,
            email: e.target.value,
        });
    };

    const nameInputHandler = (e: any) => {
        setCreateProfile({
            ...createProfile,
            name: e.target.value,
        });
    };

    const loginView = (
        <VStack spacing={6} align="flex-start" maxW="450px">
            <Text fontSize="xx-large" fontWeight="bold">
                Welcome to Bitswap 🚀
            </Text>
            <Text fontSize="md" color="gray.600" w="350px">
                To continue to your account on the platform, login using your BitClout account
            </Text>
            <BlueButton text={`   Login with Bitclout  `} width="350px" onClick={loginHandler} loading={loading} />
            <Text fontSize="md" color="red.300">
                {errText}
            </Text>
        </VStack>
    );

    const newUserView = (
        <VStack spacing={5} align="flex-start" maxW="400px">
            {/* 📌TODO: Change to BitSwap 3D thing with white background */}
            <Text fontSize="xx-large" fontWeight="bold">
                New Account
            </Text>
            <Text fontSize="sm" color="gray.600">
                Account being imported:
                <Link
                    isExternal
                    href={`https://bitclout.com/u/${bitcloutProfile?.Username ? bitcloutProfile?.Username : "anonymous"}`}
                    fontWeight="bold"
                    color="brand.100"
                >
                    {" "}
                    {bitcloutProfile?.Username ? bitcloutProfile?.Username : createProfile.publicKey}
                </Link>
            </Text>
            <Text fontSize="md" color="gray.600">
                Let’s get you started with BitSwap!
            </Text>
            <Text fontSize="md" fontWeight="bold">
                Name
            </Text>
            <VStack w="full">
                <HStack spacing={4} w="full">
                    <Input
                        isInvalid={nameErr}
                        errorBorderColor="red.300"
                        variant="outline"
                        placeholder="Mike Wazowski"
                        size="md"
                        p="7"
                        value={createProfile.name}
                        onChange={nameInputHandler}
                    />
                    {nameErr ? <HiExclamationCircle style={{ display: "inline" }} color="#EE0004" size="24" /> : null}
                </HStack>
                {nameErr ? (
                    <Text fontSize="md" color="red.300">
                        Please provide a valid name.
                    </Text>
                ) : null}
            </VStack>
            <Text fontSize="md" fontWeight="bold">
                Email Address
            </Text>
            <VStack w="full">
                <HStack spacing={4} w="full">
                    <Input
                        isInvalid={emailErr}
                        errorBorderColor="red.300"
                        variant="outline"
                        placeholder="mikewazowski@bitswap.network"
                        size="md"
                        p="7"
                        value={createProfile.email}
                        onChange={emailInputHandler}
                    />
                    {emailErr ? <HiExclamationCircle style={{ display: "inline" }} color="#EE0004" size="24" /> : null}
                </HStack>
                {emailErr ? (
                    <Text fontSize="md" color="red.300">
                        Please provide a valid email address.
                    </Text>
                ) : null}
            </VStack>
            <Checkbox isChecked={checked} onChange={(e) => setChecked(e.target.checked)} isInvalid={termsErr}>
                <Text fontSize="sm" color="gray.600" maxW="400px">
                    I agree to BitSwap’s{" "}
                    <Link isExternal href="https://bitswap.network/terms-and-conditions" fontWeight="medium" color="brand.100">
                        Terms of Service and Privacy Policy
                    </Link>
                </Text>
            </Checkbox>
            <Text fontSize="md" color="red.300">
                {errText}
            </Text>
            <Flex w="full" justify="center">
                <BlueButton text={`   Create Account   `} width="350px" onClick={registerHandler} disabled={!checked} />
            </Flex>
        </VStack>
    );

    const accountCreated = (
        <VStack spacing={8} align="center" maxW="450px">
            <Text fontSize="xx-large" fontWeight="bold" textAlign="center">
                Your account has been created 🚀
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
                We sent an email to {createProfile.email}. Please check your inbox for instructions on how to verify your account. If you made a typo or would
                like to change your email{" "}
                <Link href={"/profile"} color="brand.100">
                    click here.
                </Link>
            </Text>
            <BlueButton text={`   Login   `} width="350px" onClick={loginHandler} />
        </VStack>
    );

    return (
        <>
            <Flex minH="70vh" align="center" justify="center">
                {newUser ? (registrationSuccess ? accountCreated : newUserView) : loginView}
            </Flex>
        </>
    );
}
