import axios from "axios";
import { showMessage } from 'react-native-flash-message';
import { GoogleAPIKey, GoogleMapsAPIBaseURL, BaseURL } from "./constants";
import { SharedData } from "./SharedData";

export const mapPointsList = async (
    setPointsList: any,
    setLoader: any
) => {
    setLoader(true)
    await axios.get(BaseURL + `/user/map-points/list`, {
        headers: {
            Authorization: `Bearer ${SharedData.UserToken}`,
        }
    })
        .then(function (response) {
            setLoader(false)
            if (response.data.success === true) {
                setPointsList(response.data.data)
                if (response.data.data.length === 0) {
                    // showMessage({
                    //     message: "No map point for your municipality",
                    //     type: 'info',
                    //     icon: 'success',
                    // });
                }
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

export const getPlaceDetails = (
    id: string,
    setDetails: any,
    setLoader: any,
) => {
    axios
        .get(GoogleMapsAPIBaseURL + `/place/details/json`, {
            params: { key: GoogleAPIKey, place_id: id },
        }
        )
        .then(function (response) {
            if (response.data.status === "OK") {
                setDetails(response.data.result);
                setLoader(false)
            }
        })
        .catch(function (error) {
            console.log(error);
        });

};

