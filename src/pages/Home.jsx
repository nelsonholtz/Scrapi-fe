import SignUp from "../components/LoginComponents/SignUp";
import SignIn from "../components/LoginComponents/SignIn";
import LogOut from "../components/LoginComponents/LogOut";

const Home = () => {
    return (
        <>
            <SignIn />
            <LogOut />
            <SignUp />
        </>
    );
};
export default Home;
