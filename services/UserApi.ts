import axios from "axios";
import { showMessage } from "react-native-flash-message";
import { BaseURL } from "./constants";
import { SharedData } from "./SharedData";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from "i18next";



const storeUserToken = async (usertoken: string) => {
    try {
        await AsyncStorage.setItem('usertoken', usertoken);
    } catch (error) {
        console.log('error store');
    }
};

const storeUserInfo = async (userinfo: any) => {
    try {
        await AsyncStorage.setItem('userinfo', JSON.stringify(userinfo));
    } catch (error) {
        console.log('error store');
    }
};

export const storePermissionStatus = async (permission: string) => {
    try {
        await AsyncStorage.setItem("permission", permission);
    } catch (error) {
        console.log('error store');
    }
}

export const SignUpFirst = (
    token: any,
    email: any,
    name: any,
    password: any,
    setLoader: any,
    navigation: any
) => {
    axios
        .post(BaseURL + '/user/save-personal-details', {
            email: email.length === 0 ? null : email,
            name: name,
            password: password,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                navigation.navigate('SignUpTwo', { token })
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
};

export const ProfileImage = (
    image: any,
    token: any,
    setLoader: any,
    navigation: any
) => {
    setLoader(true)
    let data = new FormData();
    if (image) {
        data.append('image', image)
    }
    axios
        .post(BaseURL + '/user/upload-profile-image', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                navigation.navigate('SignUpThree', { token: token })
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
};

export const ProfileImageSkip = (
    token: any,
    navigation: any
) => {
    axios
        .post(BaseURL + '/user/upload-profile-image', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(function (response) {
            if (response.data.success === true) {
                navigation.navigate('SignUpThree', { token: token })
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
};

export const saveMunicipilityDetail = (
    token: any,
    category_id: any,
    municipality_id: any,
    navigation: any,
    storeUserToken: any,
    storeUserInfo: any,
    setLoader: any,
    setToken: any,
    setInfo: any,
    fcmToken: any,
    checkLanguage: any
) => {
    axios
        .post(BaseURL + '/user/save-municipal-details', {
            category_id: category_id,
            municipality_id: municipality_id,
            fcm_token: fcmToken
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(function (response) {
            setLoader(false);
            if (response.data.success === true) {
                SharedData.UserToken = response.data.data.token;
                checkLanguage(response.data.data.municipality.country?.nativeLanguage?.code)
                storeUserToken(response.data.data.token)
                setToken(response.data.data.token)
                let user = response.data.data
                delete user.token
                SharedData.UserInfo = user;
                storeUserInfo(user);
                setInfo(user)
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Dashboard',
                        },
                    ],
                });
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }

        })
        .catch(function (error) {
            console.log(error);
        });


};

export const MuniciplityList = async (
    setMunciplity: any,
    setLoader: any,
    setTempList: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/municipality/list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setMunciplity(response.data.data)
                setTempList(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const updateMunicipality = async (
    id: any,
    setToken: any,
    setInfo: any,
) => {
    await axios.post(BaseURL + `/user/municipality/update`, {
        _id: id
    }, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    }
    )
        .then(function (response) {
            if (response.data.success === true) {
                SharedData.UserToken = response.data.data.token;
                storeUserToken(response.data.data.token);
                setToken(response.data.data.token)
                let userData = response.data.data
                delete userData.token
                SharedData.UserInfo = userData;
                storeUserInfo(userData);
                setInfo(userData);
                showMessage({
                    message: response.data.message,
                    type: 'info',
                    icon: 'success',
                });
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const emergencyHomeContactList = async (
    setEmergencyContacts: any,
    setLoader: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/emergency-contacts/list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setEmergencyContacts(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const NewsList = async (
    setNews: any,
    setLoader: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/news/list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setNews(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const Guides = async (
    setGuide: any,
    setLoader: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/guide-articles/list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setGuide(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const ContactList = async (
    setContact: any,
    setLoader: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/personal-contacts/list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setContact(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}


export const deleteContact = async (
    id: string,
    index: number,
    deleteItem: any
) => {
    await axios.post(BaseURL + `/user/personal-contacts/delete`, {
        _id: id
    },
        {
            headers: {
                Authorization: `Bearer ${SharedData.UserToken}`,
            }
        })
        .then(function (response) {
            if (response.data.success === true) {
                showMessage({
                    message: response.data.message,
                    type: 'info',
                    icon: 'success',
                });
                deleteItem(index)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const addPersonalContact = async (
    fname: string,
    phone: any,
    setLoader: any,
    addContact: any,
    setModalVisible: any,
) => {
    setLoader(true)
    await axios.post(BaseURL + `/user/personal-contacts/add`, {
        title: fname,
        contact: phone,
    }, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    }
    )
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                addContact(response.data.data)
                setModalVisible(false)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
            setLoader(false)
        });
}

export const editPersonalContact = async (
    id: any,
    fname: string,
    phone: any,
    setLoader: any,
    setModalVisible: any,
    editItem: any
) => {
    setLoader(true)
    await axios.post(BaseURL + `/user/personal-contacts/update`, {
        _id: id,
        title: fname,
        contact: phone,
    }, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    }
    )
        .then(function (response) {
            setLoader(false)
            setModalVisible(false)
            if (response.data.success === true) {
                editItem(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
            setLoader(false)
        });
}



export const usefulContactList = async (
    setUseFulContacts: any,
    setLoader: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/useful-contacts/categorized-list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setUseFulContacts(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}


export const updateProflie = async (
    fname: any,
    image: any,
    setLoader: any,
    setInfo: any,
    setImage: any,
    setImageUrl: any
) => {
    let data = new FormData();
    data.append('name', fname);
    if (image) {
        data.append('image', image)
    }
    await axios.post(BaseURL + `/user/update-profile-details`, data, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
            "Content-Type": "multipart/form-data"
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                SharedData.UserInfo = response.data.data;
                storeUserInfo(response.data.data);
                setInfo(response.data.data)
                setImage(null);
                setImageUrl({
                    uri:
                        BaseURL +
                        `/public/user/profile-image/${SharedData.UserInfo._id}` +
                        '?' +
                        new Date(),
                })
                showMessage({
                    message: response.data.message,
                    type: 'info',
                    icon: 'success',
                });
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'warning',
                    icon: 'warning',
                });

            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const updateUserData = async (
    info: any,
    setInfo: any,
) => {
    await axios.post(BaseURL + `/user/update-user-data`, { lastUpdated: info?.updatedAt ? info.updatedAt : 'null' }, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            if (response.data.success === true) {
                SharedData.UserInfo = response.data.data;
                storeUserInfo(response.data.data);
                setInfo(response.data.data)
            }

        }).catch(function (error) {
            console.log(error);
        });
}


export const sosCall = async (
    setLoader: any,
    setModalVisible: any,
    lat: any,
    lng: any,
    selectedLanguageCode: string,
    type: string
) => {
    setLoader(true)
    await axios.post(BaseURL + `/user/sos-alerts/send`, {
        lat: lat,
        lng: lng,
        type: type
    }, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            setModalVisible(false)
            if (response.data.success === true) {
                let message: any = {
                    message: response.data.message,
                    type: 'info',
                    icon: 'success',
                }
                if (selectedLanguageCode == 'al') {
                    message.message = 'SOS ALERT DERGUAR'
                } else if (selectedLanguageCode == 'el') {
                    message.message = 'Στάλθηκε SOS Συναγερμός'
                }
                else if (selectedLanguageCode == 'bg') {
                    message.message = 'SOS СИГНАЛ ИЗПРАЩЕН'
                }
                else if (selectedLanguageCode == 'mk') {
                    message.message = 'ИСПРАТЕНО ПРЕДУПРЕДУВАЊЕ СОС'
                }

                showMessage(message)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const notifications = async (
    setNotificationsList: any,
    setLoader: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/notifications/list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setNotificationsList(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}


export const notificationCount = async (
    setNotificationsCount: any,
) => {
    await axios.get(BaseURL + `/user/notifications/count`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            if (response.data.success === true) {
                setNotificationsCount(response.data.data > 0 ? true : false)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}


export const getUserCategoryList = async (
    setUserCategory: any,
    setLoader: any,
    setTempList: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/category/list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setUserCategory(response.data.data)
                setTempList(response.data.data)
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}

export const updateUserCategory = async (
    id: any,
    setToken: any,
    setInfo: any,
) => {
    await axios.post(BaseURL + `/user/category/update`, {
        _id: id
    }, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    }
    )
        .then(function (response) {
            if (response.data.success === true) {
                SharedData.UserToken = response.data.data.token;
                storeUserToken(response.data.data.token);
                setToken(response.data.data.token)
                let userData = response.data.data
                delete userData.token
                SharedData.UserInfo = userData;
                storeUserInfo(userData);
                setInfo(userData);
                showMessage({
                    message: response.data.message,
                    type: 'info',
                    icon: 'success',
                });
            }
            else {
                showMessage({
                    message: response.data.message,
                    type: 'danger',
                    icon: 'warning',
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
}


