import React, { useState } from 'react';
import 'firebase/storage'
import { db, storage, auth } from '../lib/firebaseclient'; 
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/Navbar';
const CreateCharity = () => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const allInputs = {imgUrl: ''}
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState(allInputs)
  
  const { user } = useAuth();
  if (!user) return (
      <div>Sorry! It seems you are not authorized</div>
  )
  console.log(user.uid + " << user id");
  console.log(auth.currentUser.uid + " << firestore id");

  console.log(imageAsFile)
    const handleImageAsFile = (e) => {
      const image = e.target.files[0]
      setImageAsFile(imageFile => (image))
  }

  const handleFireBaseUpload = e => {
    e.preventDefault()
  console.log('start of upload')
  // async magic goes here...
    if(imageAsFile === '' ) {
      console.error(`not an image, the image file is a ${typeof(imageAsFile)}`);
    }
    console.log("startinguploadtask");
    const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
    uploadTask.on('state_changed', 
    (snapShot) => {
      //takes a snap shot of the process as it is happening
      console.log(snapShot)
    }, (err) => {
      //catches the errors
      console.log(err)
    }, () => {
      // gets the functions from storage refences the image storage in firebase by the children
      // gets the download url then sets the image from firebase as the value for the imgUrl key:
      storage.ref('images').child(imageAsFile.name).getDownloadURL()
       .then(fireBaseUrl => {
         console.log(fireBaseUrl);
         setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
       })
    })
  }
  
  const handleSubmit = (event) => {
    console.log("submitting!");
    event.preventDefault();
    const data = {
      name: title,
      description: description,
      photourl: imageAsUrl,
      creatorid: auth.currentUser.uid
    }
    db
      .collection('charities')
      .doc(title).set(data);
    setTimeout(() => {
        console.log("complete?");  
    }, 2000)
    //TODO figure this shit out
    .catch(async e => {
      throw new Error(e.message)
    })
  }
  return (
    <div>
      <Navbar />
      <h2>Create charity</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Title<br />
          <input type="text" value={title} 
           onChange={({target}) => setTitle(target.value)} />
        </div>
        <div>
          Description<br />
          <textarea value={description} 
           onChange={({target}) => setDescription(target.value)} />
        </div>
        <button type="submit">Save</button>
      </form>
        
      <form onSubmit={handleFireBaseUpload}>
        <input 
          type="file"
          onChange={handleImageAsFile}
        />
        <button>upload to firebase</button>
      </form>
      <img src={imageAsUrl.imgUrl} alt="image tag" />
    </div>
  )
}
export default CreateCharity;