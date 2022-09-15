import Test from "../../screens/Test";
import Test1 from "../../screens/Test1";
import { Screen } from "../../shared/interfaces";

const Screens: Screen[] = [
    {
        path: "/",
        component: Test
    },
    {
        path: "/test",
        component: Test1,
    }
]

export default Screens;