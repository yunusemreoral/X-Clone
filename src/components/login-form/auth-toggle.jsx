

const AuthToggle = ({isSign,setIsSign}) => {
  return (
    <p className='mt-5 select-none'>
      <span className='text-gray-500'>{isSign ? "Hesabınız varsa" : "Hesabınız yoksa"} </span>
      <span onClick={() => setIsSign(!isSign)} className='cursor-pointer ms-2 text-blue-500 hover:underline'>
        {isSign ? "Giriş Yapın" : "Kaydolun"} </span>
    </p>
  )
}

export default AuthToggle
