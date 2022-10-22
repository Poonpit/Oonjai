import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav/Nav";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style.css";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import store from "../store/store";
import Head from "next/head";

const fullPagePaths = [
    "/login",
    "/register",
    "/questions/create",
    "/topics",
    "/notifications",
    "/search",
    "/questions/my-questions",
    "/blogs/my-blogs",
    "/profile",
    "/doctor/profile",
    "/doctor/topics",
    "/admin/doctors",
    "/assessment/mental-health",
    "/assessment/covid",
    "/assessment/history",
    "/admin/dashboard",
    "/doctor/home"
];

const conditions = (path) => {
    return /\/topics\/(.*?)/.test(path) || /\/questions\/(.*?)/.test(path) || /\/blogs\/(.*?)/.test(path);
};

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <>
            <Head>
                <style>
                    @import url(https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap);
                </style>
            </Head>
            <Provider store={store}>
                <div
                    className={`bg-dark ${
                        (fullPagePaths.includes(router.pathname) || conditions(router.pathname)) && "vh-100"
                    }`}
                >
                    <NextNProgress
                        color="#0D6EFD"
                        startPosition={0.2}
                        stopDelayMs={500}
                        height={4}
                        showOnShallow={true}
                    />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    <Nav />
                    <Component {...pageProps} />
                </div>
            </Provider>
        </>
    );
}

export default MyApp;
