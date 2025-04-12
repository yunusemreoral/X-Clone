import AuthToggle from "./auth-toggle"
import EmailInput from './email-input'
import PasswordInput from './password-input'
import ForgotPassword from './forgot-password'
import Button from "./button"
import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,sendEmailVerification } from "firebase/auth"
import {auth} from "../../firebase"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const navigate = useNavigate();

  // kaydolma modundamıyız?
  const [isSign, setIsSign] = useState(false);

// form gönderildiğinde
  const handleSubmit = async (e) => {
    e.preventDefault();

    // inputtaki verileri al
    const formData = new FormData(e.target);
    const {email, password} = Object.fromEntries(formData.entries());

    try{
    if (isSign) {
      //kaydırma modunda yeni hesap oluştur
     const res = await createUserWithEmailAndPassword(auth,email,password)

      // dogrulama epsotası gönder
      await sendEmailVerification(res.user);

      // giriş yap moduna geç
      setIsSign(false);

      // bildiirim gönder
      toast.info("Malinize doğrulama epostası gönderildi")
    } else {
      // giriş modundaysa oturum aç
      const res = await signInWithEmailAndPassword(auth,email,password)

      // mail dogrulanmadı ise bildirim gonder
      if (!res.user.emailVerified) {
        return toast.info("Lütfen mailinizi doğrulayın");
      }

      // bildirim gönder ve anasayfaya yönlendir
      navigate("/feed")
      toast.info("Hesaba giriş yapılmadı")
    }

    // formu temizle
    e.target.reset();

  } catch (error) {
    // hatayı bildiirm oalrak gönder
    toast.error("Hata: " + error.code);
  }
    
  };

  return (
   <form className="flex flex-col" onSubmit={handleSubmit}>
    <EmailInput/>

    <PasswordInput/>

    <ForgotPassword show={!isSign} />

    <Button isSign={isSign} />

    <AuthToggle isSign={isSign} setIsSign={setIsSign}/>
   </form>
  );
};

export default LoginForm
