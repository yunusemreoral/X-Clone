import {ref,uploadBytes,getDownloadURL} from "firebase/storage";
import { toast } from "react-toastify";
import { storage } from ".";
import { v4 } from "uuid";


const uploadToStorage = async (file) => {
    //dosya yoksa veya dosya resim değilse fonk durdur
if (!file || !file.type.startsWith("image")) return null;


// dosya boyutu 2mb'i aşarsa hata fırlat
if (file.size > 5000000) {
    toast.error("Lütfen 2mb'ın altında bir medya yükleyiniz");
    throw new Error("Medya içeriği sınırı aşıyor");
}
    
// dosyanın yükleneceği konumun refenerasını al
const imageRef = ref(storage, v4() + file.name);

// referenasını oluşturdugum konuma dosyayı yüklr
await uploadBytes(imageRef, file);
//storage'a yüklenen dosyanın url'ini al ve döndür
const url = await getDownloadURL(imageRef);

return url;
};

export default uploadToStorage