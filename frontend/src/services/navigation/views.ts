import Test from "../../components/views/Test";
import Test1 from "../../components/views/Test1";
import { View } from "../../shared/interfaces";

const Views: View[] = [
    {
        path: "/",
        component: Test
    },
    {
        path: "/test",
        component: Test1,
    }
]

export default Views;