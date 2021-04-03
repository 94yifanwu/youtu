const auth = firebase.auth()

const whenSignedIn = document.getElementById("whenSignedIn")
const whenSignedOut = document.getElementById("whenSignedOut")
const signInButton = document.getElementById("signInButton")
const signOutButton = document.getElementById("signOutButton")

const userDetails = document.getElementById("userDetails")

const provider = new firebase.auth.GoogleAuthProvider()
signInButton.onclick = () => auth.signInWithPopup(provider)
signOutButton.onclick = () => auth.signOut()

const db = firebase.firestore();
const createThing = document.getElementById('createThing')
const createButton = document.getElementById('createButton');
const thingList = document.getElementById('thingsList')
let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if (user){
        //signed in
        createButton.hidden = false;
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = ` 
            <h3> Hello ${user.displayName}!</h3>
            <p> User ID: ${user.uid}</p>
            <p> User ID: ${user.email}</p>  ` 
            
        thingsRef = db.collection('things')
        createThing.onclick = () => {
            const { serverTimestamp} = firebase.firestore.FieldValue;
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            })
        }
        
        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return `<li>${ doc.data().name }</li>`
                });

            thingList.innerHTML = items.join('');

            });

    } else {
        // not sign in
        createButton.hidden = true;
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = '';
        //unsubscribe && unsubscribe();
    }
})


