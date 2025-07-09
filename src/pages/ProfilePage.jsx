import CalendarComponent from "../components/CalendarComponent";
import { useUser } from "../contexts/UserContext";

const ProfilePage = () => {
    const { user } = useUser();
    return (
        <>
            <CalendarComponent user={user} />
        </>
    );
};

export default ProfilePage;
