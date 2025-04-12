import TextArea from './text-area'
import UserAvatar from "./user-avatar"
import FormActions from './form-actions'
import { toast } from 'react-toastify';
import { addDoc,collection, serverTimestamp } from 'firebase/firestore';
import {db} from "../../firebase";
import { useRef, useState } from 'react';
import Preview from './preview';
import uploadToStorage from '../../firebase/uploadToStorage';

const PostForm = ({user}) => {
// resim yüklenmeden önceki önizlemesi
const [isLoading, setIsLoading] = useState(false);
const [preview, setPreview] = useState(null);
const fileRef = useRef();

// resmin önizle url'inin oluşturan fonksiyon
const onImageChange = (e) => {
if (e.target.files && e.target.files[0]) {
    setPreview(URL.createObjectURL(e.target.files[0]));
}
};

// önizlenen resmi iptal eden fonk
const clearImage = () => {
    // önizleme statesini sıfırla
    setPreview(null);

    // file inputun valuesunu temizle
    if(fileRef.current) {
        fileRef.current.value = "";
    }
};

// form gönderilince
    const handleSubmit = async (e) => {

        // form gönderilince
        e.preventDefault();

        // inputtaki verileri al
        const text = e.target.text.value;
        const file = e.target.image.files[0];

        // veri yoksa bildirim at
        if (!text.trim() && !file) return toast.warning("Lütfen içeriğini belirleyiniz")
    
            // twit kolleksiyonuna ekle
    try {
        setIsLoading(true);
        // resim varsa resmi storeage a yukle ve url ini al
      const url = await uploadToStorage(file);

        //tweets kolleksiyonunun referenasını al
        const collectionRef = collection(db, "tweets");

        // yeni tweet belgesine kolleksiyona ekle
        await addDoc(collectionRef, {
            content: {text, image: url},
            isEdited: false,
            likes: [],
            createAt: serverTimestamp(),
            user: {
                id: user.uid,
                name: user.displayName,
                photo: user.photoURL,
            },
        });

        // formu temizle
        e.target.reset();
        setPreview(null);
    } catch (error) {
        toast.error("Bir sorun oluştu");
    } finally {
        setIsLoading(false);
    }
        };

  return (
    <div className=' border-b border-tw-gray p-4 flex gap-3'>
       <UserAvatar photo={user.photoURL} name={user.displayName} />
       
       <form onSubmit={handleSubmit} className='w-full pt-1'>
       <TextArea/>
      
      <Preview isLoading={isLoading} src={preview} clearImage={clearImage}/>

       <FormActions isLoading={isLoading} fileRef={fileRef} onImageChange={onImageChange} />
       </form>
    </div>
  );
};

export default PostForm
