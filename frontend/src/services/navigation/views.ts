import Login from "../../components/views/Login";
import Home from "../../components/views/Tchat";
import { View } from "../../shared/interfaces";

const Views: View[] = [
    {
        path: "/",
        component: Login
    },
    {
        path: "/test",
        component: Home,
    }
]

export default Views;