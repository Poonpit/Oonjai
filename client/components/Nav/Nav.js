import UnauthorizedNav from "./UnauthorizedNav";
import AuthorizedNav from "./AuthorizedNav";
import AdminNav from "./AdminNav";
import DoctorNav from "./DoctorNav";
import AssessmentButton from "../Assessment/AssessmentButton";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import useEffectOnce from "../../hooks/use-effect-once";
import { profileActions } from "../../store/store";

const ASSESSMENT_URLS = ["/assessment/mental-health", "/assessment/covid"];

const Nav = () => {
    const dispatch = useDispatch()
    const { role } = useSelector((state) => state.profileSlice);
    const router = useRouter();

    useEffectOnce(() => {
        const user = window.localStorage.getItem("user");
        if(user) {
            dispatch(profileActions.setInitialProfile(JSON.parse(user)));
        }
    })

    if (role === "ADMIN") {
        return <AdminNav />;
    }

    if (role === "DOCTOR") {
        return <DoctorNav />;
    }

    if (role === "PATIENT") {
        return (
            <>
                <AuthorizedNav />
                {!ASSESSMENT_URLS.includes(router.pathname) && <AssessmentButton />}
            </>
        );
    }

    return <UnauthorizedNav />;
};

export default Nav;
