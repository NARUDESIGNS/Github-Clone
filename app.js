//Resources






// GRAPHQL API REQUESTS AND PROCESSES

const userDetails = {
    'username': 'narudesigns',
    'token' : "4a260f693fb4ca0934b59d06827b43b59c2ffde1"
}

const url = `https://api.github.com/graphql`;

const profileQuery = {
    query: `{
        user(login: "${userDetails['username']}") {
            name
            avatarUrl(size: 400)
            bio
            status {
                message
            }
        }
    }`
}

const repoQuery = {
    query: `{
        user(login: "${userDetails['username']}") {
            repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
                nodes{
                    name
                    description
                    repositoryTopics(first: 10) {
                        nodes {
                            topic {
                                name
                            }
                            url
                        }
                    }

                    languages(orderBy: {direction: DESC, field: SIZE}, first: 1) {
                        nodes {
                            name
                            color
                        }
                    }

                    stargazerCount
                    forkCount
                    updatedAt
                    url
                    viewerHasStarred
                }
            }
        }
      }`
}




//Fetch API function
function getData(query){
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${userDetails['token']}`
        },
        body: JSON.stringify(query)
    })
    .then(response => response.json())
    .then(data => console.log(data.data.user))
    .catch(error => {
        console.log(error.message); 
    })
} 

x = `query { 
    user (login: "narudesigns"){
        name
    }
}`
getData(repoQuery);   
//JSON.stringify(query) 
