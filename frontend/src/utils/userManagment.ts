import axios from "axios";

const devUrl = "http://localhost:3000";

export const register = async (email: String, password: String) => {
    try {
        const {data, status} = await axios.post<any>(
            devUrl + "/login/register",
            {"email": email, "password": password},
        );
        alert(data.token + status);
        return {data, status};
    } catch (err) {
        console.log(err);
    }
}

export const login = async (email: String, password: String) => {
    console.log("fait moi un bisou");
    try {
        const {data, status} = await axios.get<any>(
            devUrl + "/login/signin/" + email,
            {
                headers: {
                    "Authorization": "Basic " + password
                }
            }
        );
        alert(data.token + " | status => " + status);
        return {data, status};
    } catch (err) {
        console.log(err);
    }
}