import firebase from './FirebaseConfig';

const auth = firebase.auth();

const registerUser = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
}


const loginUser = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
}

const logoutUser = () => {
    return auth.signOut();
}

const passwordResetMail = (email) => {
    return auth.sendPasswordResetEmail(email);
}

const loginGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider;
    return auth.signInWithPopup(provider);
}

const subscribeAuthChanges = (handleAuthChange) => {
    auth.onAuthStateChanged((user) => {
        handleAuthChange(user);
    });
}

const FirebaseAuthService = {
    registerUser, 
    loginUser, 
    logoutUser, 
    passwordResetMail, 
    loginGoogle, 
    subscribeAuthChanges
}

export default FirebaseAuthService;
