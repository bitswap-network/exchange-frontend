import React, { ReactElement, useState } from 'react'
import { VStack, Box, Text, Image } from '@chakra-ui/react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { BlueButton } from '../../components/BlueButton/BlueButton'
import { launch, jwt } from '../../services/identity'
import { login } from '../../services/auth'
import { setIdentityUsers, saveData } from '../../helpers/persistence'
import { userState } from '../../store'

export function Login(): ReactElement {
    const setUser = useSetRecoilState(userState)
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
                    .then((response) => {
                        if (response.status === 200) {
                            saveData('user', JSON.stringify(response.data))
                            setUser(response.data)
                            window.location.assign('/')
                        }
                    })
                    .catch((error: any) => {
                        //TODO: revise response status codes
                        if (error.response.status === 301) {
                            window.location.assign(
                                `/register/${res.publicKeyAdded}`
                            )
                        } else {
                            console.log(error)
                        }
                    })
            })
        })
    }
    return (
        <>
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
        </>
    )
}
