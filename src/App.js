import firebase from "firebase/app";
import "firebase/auth";
import './App.css';
import firebaseConfig from "./File/FileConfig";
import {useState} from 'react';

firebase.initializeApp(firebaseConfig)

function App() {
  const[newUser, setNewUser] =useState(false)
  const [user, setUser] = useState({
    IsSignIn: false,
    Name: " ",
    email: " ",
    photo : " "

  })
  const provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () =>{

    firebase.auth().signInWithPopup(provider)
  .then(res => {
    const {email,photoURL,displayName} = res.user;
    const SignInUser = {
      IsSignIn: true,
    Name: displayName,
    email: email ,
    photo : photoURL 
    }
    setUser(SignInUser);
    })
    
    .catch(err => {
      console.log(err)
    })
  }

  const handleSignOut = ()=>{
    firebase.auth().signOut().then(() => {
      const SignOutUser = {
        IsSignIn: false,
      Name: " ",
      email: " " ,
      photo : " " ,
      password : " ",
      error: " ",
      success: false,
      
      }
      setUser(SignOutUser);
    }).catch((error) => {
      console.log(error)
    });
  }
 const handleChange = (e) => {
  let isValied = true;
if(e.target.name==='email'){
 
   isValied = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e.target.value);
 
  }
if(e.target.name=== 'password'){
  const targetPassword = e.target.value.length >6;
  const TargetPassword = /\d{1}/.test(e.target.value);
  isValied = targetPassword && TargetPassword;
}
if(isValied){
  const newUserInfo = {...user}
  newUserInfo[e.target.name]= e.target.value;
  setUser(newUserInfo)
}

 }    
const handleSubmit = (e) =>{
  
  if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      const newUserInfo = {...user}
     newUserInfo.error = ' ';
     newUserInfo.success = true
     setUser(newUserInfo);
     updateUserInfo(user.name)
    })
    .catch((error) => {
     const newUserInfo = {...user}
     newUserInfo.error = error.message;
     newUserInfo.success = false
     setUser(newUserInfo);
    });

  }
if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res=>{
    const newUserInfo = {...user}
   newUserInfo.error = ' ';
   newUserInfo.success = true
   setUser(newUserInfo);
   console.log("user info",res.user)
  })
  .catch((error) => {
    const newUserInfo = {...user}
    newUserInfo.error = error.message;
    newUserInfo.success = false
    setUser(newUserInfo);
   });
}

  e.preventDefault();
  }
  
const updateUserInfo= (name) =>{
  var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name,
  
}).then(function() {
  console.log("user name updated successfully")
}).catch(function(error) {
  console.log(error)
});
}

const handleFbSignIn = ()=>{
  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log('facebook user',user)

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });

  
}
  return (
    <div className="App">
     { user.IsSignIn?


       <button onClick={handleSignOut}>sign out</button>:
       <button onClick={handleSignIn}>sign in</button>

       }
       <br/>
    <button onClick={handleFbSignIn}>sign in with fb</button>
    
    {
       user.IsSignIn && <div>
       <p>welcome: {user.Name}</p>
       <img src={user.photo} alt=""/></div>
     }
     <h3>Authentication form</h3>
     <input  onChange={()=>setNewUser(!newUser)}  type='checkbox' name='newUser'/>
     <label html for = 'newUser'>new user sign in</label>
<form onSubmit = {handleSubmit}>
{newUser && <input onBlur={handleChange} name='name' type='text' placeholder='your name' required/>}<br/>
<input onBlur={handleChange} name='email' type='text' placeholder='your email address' required/><br/>
     <input onBlur={handleChange} name='password' type ='password' placeholder='password' required/><br/>
     <input type='submit' value={newUser?'sign up' : 'log in'}/>

</form>
    <p style={{color:'red'}}>{user.error}</p>
    {
      user.success && <p style={{color: 'green'}}>user {newUser? 'sign in' : "log in"} accepted</p>
    }
    </div>
  );
}

export default App;
