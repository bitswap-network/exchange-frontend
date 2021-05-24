import React, { ReactElement, useState } from 'react'
import {
    VStack,
    Box,
    Text,
    Image,
    Input,
    Flex,
    Checkbox,
    Link,
    HStack,
} from '@chakra-ui/react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { HiExclamationCircle } from 'react-icons/hi'

import { BlueButton } from '../../components/BlueButton/BlueButton'
import { launch, jwt } from '../../services/identity'
import { login, fetchBitcloutProfile, register } from '../../services/auth'
import { BitcloutProfile } from '../../interfaces/bitclout/Profile'

import { setIdentityUsers, saveData } from '../../helpers/persistence'
import { userState } from '../../store'

interface CreateUserObj {
    publicKey: string
    email: string
    name: string
}
const regEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/

export function Login(): ReactElement {
    const [createProfile, setCreateProfile] = useState<CreateUserObj>({
        publicKey: '',
        email: '',
        name: '',
    })
    const [newUser, setNewUser] = useState(false)
    const [loading, setLoading] = useState(false)
    const [emailErr, setEmailErr] = useState(false)
    const [nameErr, setNameErr] = useState(false)
    const [termsErr, setTermsErr] = useState(false)
    const [registrationSuccess, setRegistrationSuccess] = useState(false)
    const [errText, setErrText] = useState('')
    const [checked, setChecked] = useState(false)

    const registerHandler = () => {
        setLoading(true)
        if (validate()) {
            register(
                createProfile.publicKey,
                createProfile.email,
                createProfile.name
            )
                .then(() => {
                    setErrText('')
                    setLoading(false)
                    setRegistrationSuccess(true)
                })
                .catch((error: any) => {
                    console.log(error)
                    error.response.data
                        ? setErrText(error.response.data)
                        : setErrText('Something went wrong, try again later.')
                })
        } else {
            setLoading(false)
        }
    }

    const validate = () => {
        if (
            regEmail.test(createProfile.email) &&
            createProfile.name.length > 1 &&
            checked &&
            createProfile.publicKey.length == 55
        ) {
            setEmailErr(false)
            setNameErr(false)
            return true
        } else {
            setEmailErr(!regEmail.test(createProfile.email))
            setNameErr(createProfile.name.length <= 1)
            setTermsErr(!checked)
            return false
        }
    }

    const loginHandler = () => {
        launch('/log-in').subscribe((res) => {
            console.log(res)
            setIdentityUsers(res.users)
            const payload = {
                accessLevel: res.users[res.publicKeyAdded].accessLevel,
                accessLevelHmac: res.users[res.publicKeyAdded].accessLevelHmac,
                encryptedSeedHex:
                    res.users[res.publicKeyAdded].encryptedSeedHex,
            }
            jwt(payload).subscribe((token) => {
                login(res.publicKeyAdded, token.jwt)
                    .then(() => {
                        window.location.assign('/')
                    })
                    .catch((error: any) => {
                        //TODO: revise response status codes
                        if (error.response.status === 406) {
                            setNewUser(true)
                            setCreateProfile({
                                ...createProfile,
                                publicKey: res.publicKeyAdded,
                            })
                        } else {
                            console.log(error)
                        }
                    })
            })
        })
    }

    const emailInputHandler = (e: any) => {
        setCreateProfile({
            ...createProfile,
            email: e.target.value,
        })
    }

    const nameInputHandler = (e: any) => {
        setCreateProfile({
            ...createProfile,
            name: e.target.value,
        })
    }

    const loginView = (
        <VStack spacing={4}>
            {/* 📌TODO: Change to BitSwap 3D thing with white background */}
            <Image src="./bitswapLogo.png" />
            <Text fontSize="xx-large" fontWeight="bold">
                Welcome to BitSwap
            </Text>
            <Box as="span" ml="2" color="gray.600" fontSize="md">
                To continue, please login to BitClout
            </Box>
            <BlueButton
                text={`   Login with BitClout   `}
                width="350px"
                onClick={loginHandler}
            />
        </VStack>
    )

    const newUserView = (
        <VStack spacing={5} align="flex-start" maxW="400px">
            {/* 📌TODO: Change to BitSwap 3D thing with white background */}
            <Text fontSize="xx-large" fontWeight="bold">
                New Account
            </Text>
            <Text fontSize="sm" color="gray.600">
                Public key being imported:<i> {createProfile.publicKey}</i>
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
                    {nameErr ? (
                        <HiExclamationCircle
                            style={{ display: 'inline' }}
                            color="#EE0004"
                            size="24"
                        />
                    ) : null}
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
                    {emailErr ? (
                        <HiExclamationCircle
                            style={{ display: 'inline' }}
                            color="#EE0004"
                            size="24"
                        />
                    ) : null}
                </HStack>
                {emailErr ? (
                    <Text fontSize="md" color="red.300">
                        Please provide a valid email address.
                    </Text>
                ) : null}
            </VStack>
            <Checkbox
                isChecked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                isInvalid={termsErr}
            >
                <Text fontSize="sm" color="gray.600" maxW="400px">
                    I agree to BitSwap’s{' '}
                    <Link
                        isExternal
                        href="https://bitswap.network/terms-and-conditions"
                        fontWeight="medium"
                        color="brand.100"
                    >
                        Terms of Service and Privacy Policy
                    </Link>
                </Text>
            </Checkbox>
            <Text fontSize="md" color="red.300">
                {errText}
            </Text>
            <Flex w="full" justify="center">
                <BlueButton
                    text={`   Create Account   `}
                    width="350px"
                    onClick={registerHandler}
                    disabled={!checked}
                />
            </Flex>
        </VStack>
    )

    const accountCreated = (
        <VStack spacing={8} align="flex-start" maxW="450px">
            <Text fontSize="xx-large" fontWeight="bold">
                Your account has been created 🚀
            </Text>
            <Text fontSize="md" color="gray.600">
                Please check your inbox for intructions on how to verify your
                account.
            </Text>
            <BlueButton
                text={`   Login   `}
                width="350px"
                onClick={loginHandler}
            />
        </VStack>
    )

    return (
        <>
            <Flex minH="70vh" align="center" justify="center">
                {newUser
                    ? registrationSuccess
                        ? accountCreated
                        : newUserView
                    : loginView}
            </Flex>
        </>
    )
}
