import { db } from '../../../lib/firebaseclient';

export default (req, res) => {
    db
        .collection('users')
        .doc(req.query.name)
        .get()
        .then((doc) => {
            console.log('returning ' + doc.data() + ' from firebase client  - user data');
            res.json(doc.data());
        })
        .catch((error) => {
            res.json({ error });
        });

};
