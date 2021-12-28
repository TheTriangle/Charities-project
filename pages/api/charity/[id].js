import firebase from '../../../lib/firebase';

export default (req, res) => {
    console.log('fucking fuck')
    firebase
        .collection('charities')
        .doc(req.query.id)
        .get()
        .then((doc) => {
            console.log('fucking getting fucking charity data ' + doc.data())
            res.json(doc.data());
        })
        .catch((error) => {
            console.log('fucking getting fucking charity data error' + error)
            res.json({ error });
        });

        //somehow it fetches the data for the unauthenticated user even though the rules prohibit it :  server-side code? admin?
};
