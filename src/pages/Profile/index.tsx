/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { HiExclamationCircle } from 'react-icons/hi'
import { NavBar } from '../../components/NavBar'
import { BlueButton } from '../../components/BlueButton/BlueButton'

export function Profile() {
    return (
        <div>
            <NavBar />
            <Flex
                minH="100%"
                align="center"
                justify="center"
                style={{ marginTop: 20, flexDirection: 'column' }}
            >
                <div
                    style={{
                        background: 'blue',
                        width: 80,
                        height: 80,
                        borderRadius: 80,
                    }}
                ></div>
                <h3 style={{ marginTop: 15, fontWeight: 700, fontSize: 20 }}>
                    @elonmusk
                </h3>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.5,
                            justifyContent: 'flex-end',
                            paddingRight: 10,
                        }}
                    >
                        <h3
                            style={{
                                color: '#5B5B5B',
                                marginTop: 15,
                                fontWeight: 500,
                                fontSize: 16,
                            }}
                        >
                            <span style={{ fontWeight: 700 }}>15839 </span>
                            Followers
                        </h3>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.5,
                            justifyContent: 'flex-start',
                            paddingLeft: 10,
                        }}
                    >
                        <h3
                            style={{
                                color: '#5B5B5B',
                                marginTop: 15,
                                fontWeight: 500,
                                fontSize: 16,
                            }}
                        >
                            <span style={{ fontWeight: 700 }}>~$69,420 </span>
                            Coin Price
                        </h3>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: 50,
                        width: 600,
                        borderRadius: 10,
                        padding: 20,
                        boxShadow: '1px 4px 6px 0px #00000040',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.65,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <h2
                            style={{
                                color: '#44423D',
                                fontWeight: 700,
                                fontSize: 18,
                            }}
                        >
                            Email
                        </h2>
                        <p
                            style={{
                                color: '#44423D',
                                fontWeight: 300,
                                fontSize: 15,
                                marginTop: 15,
                            }}
                        >
                            Important updates will be sent to this address.
                        </p>
                        <p
                            style={{
                                color: '#44423D',
                                fontWeight: 500,
                                fontSize: 18,
                                marginTop: 15,
                            }}
                        >
                            elonmusk@gmail.com
                        </p>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.35,
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            flexDirection: 'column',
                        }}
                    >
                        <button
                            style={{
                                background: '#407BFF',
                                width: '90%',
                                padding: '10px 0',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 16,
                                borderRadius: 6,
                            }}
                            onClick={() => console.log('hello')}
                        >
                            Edit
                        </button>
                        <button
                            style={{
                                background: '#407BFF',
                                width: '90%',
                                padding: '10px 0',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 16,
                                borderRadius: 6,
                            }}
                            onClick={() => console.log('hello')}
                        >
                            Verify
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: 50,
                        width: 600,
                        borderRadius: 10,
                        padding: 20,
                        boxShadow: '1px 4px 6px 0px #00000040',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.65,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <h2
                            style={{
                                color: '#44423D',
                                fontWeight: 700,
                                fontSize: 18,
                            }}
                        >
                            BitClout Verification{' '}
                            <HiExclamationCircle
                                style={{ display: 'inline' }}
                                color="#EE0004"
                                size="20"
                            />
                        </h2>
                        <p
                            style={{
                                color: '#44423D',
                                fontWeight: 300,
                                fontSize: 15,
                                marginTop: 15,
                            }}
                        >
                            You must make a BitClout post to verify your account
                            before making any exchanges.
                        </p>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flex: 0.35,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <button
                            style={{
                                background: '#407BFF',
                                width: '90%',
                                padding: '10px 0',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 16,
                                borderRadius: 6,
                            }}
                            onClick={() => console.log('hello')}
                        >
                            Verify
                        </button>
                    </div>
                </div>
            </Flex>
        </div>
    )
}
