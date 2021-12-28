import firebase from '../../../lib/firebase';

export default (req, res) => {
    console.log('getting stripe customer with id ' + req.query.id)
    if (req.query.id == 'nope') {
        console.log('nope')
        res.json('nope')
    }
    if (!req.query.id) {
        console.log('What the fuck did you just fucking say about me, you little bitch? Ill have you know I graduated top of my class in the Navy Seals, and Ive been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills.')
    }
    firebase
        .collection('stripe_customers')
        .doc(req.query.id)
        .get()
        .then((doc) => {
            console.log('returning ' + JSON.stringify(doc.data()) + ' from firebase client  - stripe data');
            res.json(doc.data());
        })
        .catch((error) => {
            console.log('returning shit' + error + ' from firebase client  - stripe data');
            res.json({ error });
        });

};
