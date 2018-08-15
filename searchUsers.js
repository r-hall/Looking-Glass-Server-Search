let searchUsers = (client, query) => {
	return new Promise( async (resolve, reject) => {
        try {
            let endpoint = 'users/search'; 
            let params = {
                'q': query,
                'count': 20
            };
            let users = await client.get(endpoint, params);
            resolve(JSON.stringify(users));
        } catch(err) {
            console.log('ERROR in searchUsers', err);
            reject(err);
        }
	})
}

module.exports = searchUsers;