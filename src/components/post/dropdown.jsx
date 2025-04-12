import { useRef, useState } from "react";
import {auth,db} from "../../firebase";
import { MdDelete, MdEdit } from "react-icons/md";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import EditModal from "../modal/edit-modal";

const Dropdown = ({tweet}) => {
  const [isOpen,setIsOpen] = useState(false);
  const checkboxRef = useRef();

  // tweet i gönderen kişi ile şuan oturumu açık olan kişinin ıd'si aynı mı?

  const isOwn = tweet.user.id === auth.currentUser.uid;
  


  // dökümanı sil
  const handleDelete = () => {
    // kullanıcıdan onay al
if (!confirm("Tweeti silmek istediğinizden eminmisiniz?")) return;

// silinecek dökümanın referansını al
const docRef = doc(db, "tweets", tweet.id);

// dökümanı sil
deleteDoc(docRef).then(() => toast.info("Tweet başarıyla silindi"));
  };

  return (
  isOwn && (
    <>
      <label className="popup">
        <input ref={checkboxRef} type="checkbox" />
        <div className="burger" tabIndex="0">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className="popup-window">
          <legend>Seçenekler</legend>
          <ul>
            <li>
              <button
                onClick={() => {
                  setIsOpen(true);
                  checkboxRef.current.checked = false;
                }}
              >
                <MdEdit className="text-blue-500 text-base" />
                <span>Düzenle</span>
              </button>
            </li>
            <hr />
            <li>
              <button onClick={handleDelete}>
                <MdDelete className="text-red-500 text-base" />
                <span>Sil</span>
              </button>
            </li>
          </ul>
        </nav>
      </label>

      <EditModal isOpen={isOpen} tweet={tweet} close={() => setIsOpen(false)} />
      </>
  )
);
};

export default Dropdown
