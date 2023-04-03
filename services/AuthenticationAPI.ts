import axios from "axios";
import { BaseURL } from "./constants";
import { showMessage } from 'react-native-flash-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SharedData } from './SharedData';


export const phone = (
    phoneNo: any,
    navigation: any,
    setLoader: any,
    setCounter?: any,
    disableSMS?: any,
) => {
    axios
        .post(BaseURL + '/public/auth/send-verification-code', {
            phone_no: phoneNo,
            disable_sms: disableSMS
        })
        .then(function (response) {
            if (response.data.success === true) {
                setLoader(false);
                if (response.data.data.step === 1) {
                    navigation.navigate('SignUp', { token: response.data.data.token })
                } else if (response.data.data.step === 4) {
                    navigation.navigate('SignIn', { phoneNo: phoneNo })
                } else if (response.data.data.step === 2) {
                    navigation.navigate('SignUpTwo', { token: response.data.data.token })
                } else if (response.data.data.step === 3) {
                    navigation.navigate('SignUpThree', { token: response.data.data.token })
                }
                else {
                    if (setCounter) {
                        setCounter(60)
                        // showMessage({
                        //     message: 'Your OTP is: ' + response.data.data,
                        //     type: 'info',
                        //     icon: 'success',
                        // });
                    }
                    else {
                        navigation.navigate('OtpCode', { code: response.data.data, phoneNo: phoneNo })
                    }
                }
            }
            else {
                showMessage({
                    message:
                        'Number of tries exceeded please make sure you are using the correct phone number and try again in 24 hours',
                    type: 'warning',
                    icon: 'warning',
                });
                setLoader(false)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

export const verifyCode = (
    code: any,
    phone_no: string,
    navigation: any,
    setLoader: any,
) => {
    axios
        .post(BaseURL + '/public/auth/verify-code', {
            phone_no: phone_no,
            code: code,
        })
        .then(function (response) {
            if (response.data.success === true) {
                setLoader(false);
                navigation.navigate('SignUp', { token: response.data.data.token })
                showMessage({
                    message: 'Phone No Verified',
                    type: 'info',
                    icon: 'success',
                });
            }
            else {
                setLoader(false);
                showMessage({
                    message: response.data.message,
                    type: 'warning',
                    icon: 'danger',
                });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

export const ForgetPassword = (
    email: any,
    setLoader: any,
    navigation: any

) => {
    setLoader(true)
    axios
        .post(BaseURL + '/public/auth/forgot-password', {
            email: email,
        })
        .then(function (response) {
            if (response.data.success === true) {
                setLoader(false);
                navigation.navigate('ResetPassword')
                showMessage({
                    message: response.data.message,
                    type: 'info',
                    icon: 'success',
                });
            }
            else {
                setLoader(false);
                showMessage({
                    message: response.data.message,
                    type: 'warning',
                    icon: 'danger',
                });

            }
        })
        .catch(function (error) {
            console.log(error);
        });
};



export const ResetPassword = (
    code: any,
    password: any,
    setLoader: any,
    navigation: any

) => {
    axios
        .post(BaseURL + '/public/auth/reset-password', {
            reset_code: code,
            password: password,
        })
        .then(function (response) {
            if (response.data.success === true) {
                setLoader(false);
                navigation.navigate('SignIn')
                showMessage({
                    message: response.data.message,
                    type: 'info',
                    icon: 'success',
                });
            }
            else {
                setLoader(false);
                showMessage({
                    message: response.data.message,
                    type: 'warning',
                    icon: 'danger',
                });

            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

export const SignIn = (
    email: any,
    password: any,
    setLoader: any,
    navigation: any,
    storeUserToken: any,
    storeUserInfo: any,
    setInfo: any,
    setToken: any,
    fcmToken: any,
    checkLanguage: any
) => {
    axios
        .post(BaseURL + '/public/auth/login', {
            email: email,
            password: password,
            fcm_token: fcmToken,
        })
        .then(function (response) {
            if (response.data.success === true) {
                SharedData.UserToken = response.data.data.token;
                checkLanguage(response.data.data.municipality.country?.nativeLanguage?.code)
                storeUserToken(response.data.data.token);
                setToken(response.data.data.token)
                let user = response.data.data
                delete user.token
                SharedData.UserInfo = user;
                storeUserInfo(user);
                setInfo(user)
                setLoader(false);
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Dashboard',
                        },
                    ],
                });
                showMessage({
                    message: response.data.message,
                    type: 'info',
                    icon: 'success',
                });
            }
            else {
                setLoader(false);
                showMessage({
                    message: response.data.message,
                    type: 'warning',
                    icon: 'danger',
                });

            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

export const CheckSignIn = async (
    fcmToken: any,
    navigation: any,
) => {
    try {
        axios
            .post(BaseURL + '/user/auth/check-login', {
                fcm_token: fcmToken
            }, {
                headers: {
                    Authorization: `Bearer ${SharedData.UserToken}`,
                }
            })
            .then(async (response) => {
                if (response.data.success === true) {
                }
                else {
                    showMessage({
                        message: response.data.message,
                        type: 'warning',
                        icon: 'danger',
                    });
                    await AsyncStorage.removeItem('usertoken');
                    await AsyncStorage.removeItem('userinfo');
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Welcome',
                            },
                        ],
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    } catch (error) {
        console.log('error store', error);
    }
};


export const getCountry = async (
    languageCode: string,
    setCountry: any
) => {
    axios.get(BaseURL + '/public/country/list')
        .then(function (response) {
            if (response.data.success === true) {
                let countries: any = []
                response.data.data.forEach((e: any) => {
                    countries.push({ label: languageCode === 'en' ? e.nameEN : e.nameAL, value: e._id })
                });
                setCountry([...countries])
            }

        })
}



export const getMuniciplity = async (
    languageCode: string,
    setMunciplity: any,
    id: any
) => {
    axios.get(BaseURL + `/public/municipality/list/${id}`)
        .then(function (response) {
            if (response.data.success === true) {
                let munciplity: any = []
                response.data.data.forEach((e: any) => {
                    munciplity.push({ label: languageCode === 'en' ? e.nameEN : e.nameAL, value: e._id })
                });
                setMunciplity([...munciplity])
            }

        })
}

export const logOut = async (
    navigation: any,
    setLanguage: any,
) => {
    try {
        axios
            .post(BaseURL + '/user/auth/logout', {
            }, {
                headers: {
                    Authorization: `Bearer ${SharedData.UserToken}`,
                }
            })
            .then(function (response) {
                if (response.data.success === true) {
                }
                else {
                    showMessage({
                        message: response.data.message,
                        type: 'warning',
                        icon: 'danger',
                    });

                }
            })
            .catch(function (error) {
                console.log(error);
            });

        await AsyncStorage.removeItem('usertoken');
        await AsyncStorage.removeItem('userinfo');
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'Welcome',
                },
            ],
        });
        // setLanguage("en")
    } catch (error) {
        console.log('error store', error);
    }
};
