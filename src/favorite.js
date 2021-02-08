export class Favorite {
    static add(currency) {
        return fetch('https://test-ndv-default-rtdb.firebaseio.com/favorite.json', {
            method: 'POST',
            body: JSON.stringify(currency),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => console.log(response))
    }
}