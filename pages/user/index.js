import { auth } from "../../lib/firebaseclient";

import { useRouter } from 'next/router';
import useSWR from 'swr';

function User() {
    console.log('user index page')
    const router = useRouter();
    console.log('--------------current user id: ' + auth.currentUser.uid + ' --------------')
    if (!auth.currentUser) {
        return 'You are not authenticated';
    }
    router.push('/user/' + auth.currentUser.uid)
    return <p>Redirecting...</p>
}

export default User;