import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import {db} from "../../firebase";
import Loader from "../../components/loader";
import Post from "../../components/post";

const List = () => {
  const [tweets, setTweets] = useState(null);

  useEffect(() => {

    // kolleksiyon refereansını al
    const collectionRef = collection(db, "tweets");

    // sorgu ayarlarını yap
    const q = query(collectionRef, orderBy("createAt", "desc"));
  
  // kolleksoyona abone ol
  const unsub = onSnapshot(q, (docs) => {
    const temp = [];

    docs.forEach((doc) => temp.push({id: doc.id, ...doc.data() }));
  
  setTweets(temp);
  });

  // aboneliği durdur
  return () => unsub();
  
  }, []);

  return !tweets ? <Loader designs="!size-6 my-40"/> : tweets.map((tweet) => <Post key={tweet.id} tweet={tweet} />); 
};

export default List
