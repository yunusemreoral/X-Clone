import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom"
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import PageLoader from "../loader/page-loader";

const  Protected = () => {
    const [user,setUser] = useState(undefined);

    //kullanıcı oturum verileri al
    useEffect(() => {
        // kullanıcı oturum verisine abone ol
        const unsub = onAuthStateChanged(auth, (active_user) => setUser(active_user));

        // kullanıcı sayfadan ayrılınca aboneliği durdur
        return () => unsub();
    }, []);

    // oturum verileri gelene kadar yükelniyor bas
    if (user === undefined) return <PageLoader/>;

    // kullamıcının oturum kapalıysa logine yonlendir
    if (user === null || user?.emailVerified === false) {
        if (user?.emailVerified === false) toast.info("Mailinizi doğrulayın");

        return <Navigate to="/" replace/>;
    }

      // alt route'un element'ini ekrana bas
  return <Outlet context={user}/>;
};

export default Protected;
