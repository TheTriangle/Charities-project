
import admin from 'firebase-admin';

var serviceAccount = require("../secret/donapp-d2378-firebase-adminsdk-zxd1d-ff67a4ae0f.json");
import firestore from '../lib/firebase'
export async function getAllCharitiesIds() {
  console.log('-------------------------------2')
  const charitiesReferences = await firestore
        .collection('charities')
        .listDocuments();

  console.log('-------------------------------2a')
  const charityIds = charitiesReferences.map(it => it.id)
  console.log('-------------------------------2b' + charityIds)

  return charityIds.map(documentId => {
    return {
      params: {
        id: documentId
      }
    }
  })
}

//export async function getCharityData(id) {
//  const charityref = await firestore.collection('charities').doc(id).get();
//  const charitydata = charityref.data();
//  console.log('!!!!!!!!' + charitydata + '11111111');
//  return charitydata;
//}