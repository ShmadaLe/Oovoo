import firebase from "firebase/compat/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { arrayUnion, arrayRemove, getFirestore, updateDoc, doc, collection, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const auth = getAuth(app);
const db = getFirestore(app);


const writeUserDataToFirestore = async (collection, data) => {
  currentUser = getAuth().currentUser;
  try {
    const userRef = doc(db, collection, currentUser.uid);
    setDoc(userRef, data, { merge: true });
  } catch (error) {
    return error;
  }
}

const writeCommunityCreateDataToFirestore = async (data) => {
  try {
    const communityRef = doc(db, "communities", data["community_handle"]);
    setDoc(communityRef, data, { merge: true });
  } catch (error) {
    return error;
  }
}

const writeCommunityUserToFirestore = async (communityHandle) => {
  currentUser = getAuth().currentUser
  try {
    console.log("Trying to write User " + currentUser.displayName + " to Community " + communityHandle)

    communityRef = doc(db, "communities", communityHandle)
    communitySnapshot = await getDoc(communityRef)
    communityData = communitySnapshot.data()

    await updateDoc(communityRef, {
      num_members: (communityData.members || []).length + 1,
      members: arrayUnion(currentUser.displayName),
    })

    console.log("User successfully written to Community")
  } catch (error) {
    console.log("Error writing user to Community: ", error)
    throw (error)
  }
}

const writeTripDataToFirestore = async (data) => {
  try {
    documentId = data["community_handle"] + "_" + data["source"] + "_" + data["destination"] + "_" + data["date"].toString()
    const tripRef = doc(db, "trips", documentId);

    console.log("Trying to write Trip " + documentId)

    setDoc(tripRef, data, { merge: true });

    console.log("Trip successfully written to database")
  } catch (error) {
    console.log("Error writing Trip: ", error)
    return error;
  }
}

const writeVehicleDataToFirestore = async (data) => {
  currentUser = getAuth().currentUser
  console.log(currentUser.uid)
  try {
    console.log("Trying to write Vehicle data to firestore")
    console.log(data)
    const vehicleRef = doc(db, "vehicles", data["car_id"])
    setDoc(vehicleRef, data, { merge: true })
  } catch (error) {
    return error
  }
}

const writeTripVehicleToFirestore = async (tripDocId, tripVehicle) => {
  try {
    console.log('Trying to write Vehicle ' + tripVehicle + ' to Trip ' + tripDocId)

    currentUser = getAuth().currentUser
    tripRef = doc(db, "trips", tripDocId)

    await updateDoc(tripRef, {
      trip_cars: arrayUnion(tripVehicle)
    })

    await updateDoc(tripRef, {
      trip_members: arrayUnion(currentUser.displayName)
    })

    console.log('Vehicle successfully written to Trip')
  } catch (error) {
    console.log('Error writing vehicle to trip: ', error)
    throw(error)
  }
}

const writePassengerToFirestore = async (tripDocId, tripVehicle) => {
  currentUser = getAuth().currentUser
  try {
    const tripDocRef = doc(db, "trips", tripDocId)
    const tripDocSnap = await getDoc(tripDocRef)

    if (tripDocSnap.exists()){
      const tripData = tripDocSnap.data()
      const updateObj = {...tripData}
  
      for (let i = 0; i < tripData.trip_cars.length; i++) {
        let car = tripData.trip_cars[i]
        if (car.car_id == tripVehicle.car_id) {
          updateObj.trip_cars[i].passengers = [...updateObj.trip_cars[i].passengers, currentUser.uid]
          if (!updateObj.trip_members.includes(currentUser.displayName)) {
            updateObj.trip_members.push(currentUser.displayName)  // add to trip_members if not already in there
          }
          break;  // we can break here because we've found the trip to modify
        }
      }

      await setDoc(tripDocRef, updateObj)
    }
  } catch (error) {
    console.error('Error writing passenger data to firestore', error)
  }
}

const writeRemovePassengerToFirestore = async (tripDocId, tripVehicle) => {
  currentUser = getAuth().currentUser
  try {
    const tripDocRef = doc(db, "trips", tripDocId)
    const tripDocSnap = await getDoc(tripDocRef)

    if (tripDocSnap.exists()){
      const tripData = tripDocSnap.data()
      const updateObj = {...tripData}
  
      for (let i = 0; i < tripData.trip_cars.length; i++) {
        let car = tripData.trip_cars[i]
        if (car.car_id == tripVehicle.car_id) {
          const index = updateObj.trip_cars[i].passengers.indexOf(currentUser.uid)
          updateObj.trip_cars[i].passengers.splice(index, 1)
          if (updateObj.trip_members.includes(currentUser.displayName)) {
            const nameIndex = updateObj.trip_members.indexOf(currentUser.displayName)
            updateObj.trip_members.splice(nameIndex, 1)
          }
          break;  // we can break here because we've found the trip to modify
        }
      }

      await setDoc(tripDocRef, updateObj)
    }
  } catch (error) {
    console.error('Error writing remove passenger data to firestore', error)
  }
}

// remove user from a community
const writeRemoveUserFromCommunity = async (community_handle) => {
  try {
    currentUser = getAuth().currentUser;
    const communityRef = doc(db, "communities", community_handle);

    await updateDoc(communityRef, {
      members: arrayRemove(currentUser.displayName)
    });
  } catch (error) {
    console.log("Error removing user from community: ", error)
    throw error
  }
}


// This returns all vehicles attached to the current user, excluding rideshare options
const getUserVehiclesFromFirestore = async () => {
  try {
    currentUser = getAuth().currentUser
    const q = query(collection(db, "vehicles"), where('user_id', '==', currentUser.uid), where('vehicle_model', 'not-in', ['Uber', 'UberXL']))
    data = []

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      data.push(doc.data())
    })

    console.log("Retrieving Vehicle data for user " + currentUser.uid)
    console.log(data)

    return data
  } catch (error) {
    console.log("Error retrieving user vehicles: ", error)
    throw error
  }
}

const getVehicleFromFirestore = async (carDocId) => {
  try {
    const carRef = doc (db, "vehicles", carDocId)
    const carSnapshot = await getDoc(carRef)
    const carData = carSnapshot.data()

    return carData
  } catch (error) {
    console.error('Error getting vehicle', error)
  }
}

const getTripVehiclesFromFirestore = async (tripDocId) => {
  try {
    const tripRef = doc(db, "trips", tripDocId)
    const tripSnapshot = await getDoc(tripRef)
    const tripData = tripSnapshot.data()
    let tripVehicles = []

    await Promise.all(tripData.trip_cars.map(async (vehicle) => {
      try {
        let vehicleData = await getVehicleFromFirestore(vehicle["car_id"])
        let userRef = doc(db, "users", vehicleData.user_id)
        let userSnapshot = await getDoc(userRef)
        let userData = userSnapshot.data()
        tripVehicles.push({...vehicleData, ...vehicle, ...userData})
      } catch (error) {
        console.error('Error fetching vehicle data for carId', carId)
      }
    }))

    return tripVehicles
  } catch (error) {
    console.error('Error getting vehicles for Trip', tripDocId)
  }
}

const getDocFromFirestore = async (collection, docID) => {
  const docRef = doc(db, collection, docID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log("No such document!");
    return {}
  }
}

const getCommunitiesFromFirestore = async () => {
  currentUser = getAuth().currentUser;
  const q = query(collection(db, "communities"), where("members", "array-contains", currentUser.displayName));
  data = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });

  console.log("Retrieving Community data for user " + currentUser.displayName)
  console.log(data)

  return data;
}

const getAllDocuments = async (collection_name) => {
  data = [];

  const querySnapshot = await getDocs(collection(db, collection_name));
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });

  return data;
}

const getTripsFromFirestore = async (collection_name) => {
  currentUser = getAuth().currentUser;
  const q = query(collection(db, collection_name), where("trip_members", "array-contains", currentUser.displayName));
  data = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });

  return data;
}

const getAllTripsForCommunityFromFirestore = async (community_handle) => {
  console.log('Attempting to retrieve all trips for community', community_handle)
  trips = []
  const querySnapshot = await getDocs(collection(db, "trips"))
  querySnapshot.forEach((doc) => {
    console.log('docs', doc)
    if (doc.data().community_handle == community_handle) {
      trips.push(doc.data())
    }
  })

  return trips
}

// get all trips of all of the communities that a user is in
const getAllTripsFromFirestore = async () => {
  currentUser = getAuth().currentUser;

  // get all communities the user is part of, list of community handles
  communitiesData = await getCommunitiesFromFirestore();
  communities = [];
  communitiesData.forEach((com) => {
    communities.push(com.community_handle);
  });

  // go through all trips, select ones that the user should be able to see
  trips = [];
  const querySnapshot = await getDocs(collection(db, "trips"));
  querySnapshot.forEach((doc) => {
    if (communities.includes(doc.data().community_handle)) {
      trips.push(doc.data());
    }
  });

  return trips;
}

export {
  auth,
  writeUserDataToFirestore,
  writeCommunityUserToFirestore,
  writePassengerToFirestore,
  writeRemovePassengerToFirestore,
  writeVehicleDataToFirestore,
  getDocFromFirestore,
  getTripsFromFirestore,
  getTripVehiclesFromFirestore,
  getCommunitiesFromFirestore,
  getAllDocuments,
  getAllTripsFromFirestore,
  getAllTripsForCommunityFromFirestore,
  getUserVehiclesFromFirestore,
  writeCommunityCreateDataToFirestore,
  writeTripDataToFirestore,
  writeTripVehicleToFirestore,
  writeRemoveUserFromCommunity
};

