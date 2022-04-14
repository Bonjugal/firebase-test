import FirebaseAuthService from './FirebaseAuthService';
import firebase from './FirebaseConfig';

const firestore = firebase.firestore();


const createDocument = (collection, document) => {
    return firestore.collection(collection).add(document);
}

const readDocuments = async ({collection, queries, orderByField, orderByDirection, perPage, cursorId}) => {
    let collectionRef = firestore.collection(collection);
    //console.log(queries);
    //console.log(orderByDirection, orderByField);
    if (queries && queries.length > 0) {
        for (const q of queries) {
            collectionRef = collectionRef.where(q.field, q.condition, q.value);
        }
    }

    if (orderByField && orderByDirection) {
        collectionRef = collectionRef.orderBy(orderByField,orderByDirection);
    }

    if(perPage) {
        collectionRef = collectionRef.limit(perPage);
    }

    if(cursorId) {
        const document = await firestore.collection(collection).doc(cursorId).get();
        collectionRef = collectionRef.startAfter(document);
    }

    //console.log(collectionRef.get());
    return collectionRef.get();
}

const updateDocument = (collection, id, document) => {
    return firestore.collection(collection).doc(id).update(document);
}

const deleteDocument = (collection, id) => {
    return firestore.collection(collection).doc(id).delete();
}

const FirebaseFirestoreService = {
    createDocument,
    readDocuments,
    updateDocument,
    deleteDocument
}

export default FirebaseFirestoreService