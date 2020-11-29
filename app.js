//DOM Elements
const nav = document.getElementById('nav');

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-nav-menu');

const navNewBtn = document.getElementById('nav-new-btn');
const newBtnDropdown = document.getElementById('new-btn-modal');

const navAvatarBtn = document.getElementById('nav-avatar-btn');
const navAvatarBtnDropdown = document.getElementById('avatar-btn-modal');

const mainNavAvatar = document.getElementById('main-nav-avatar');
const mainNav = document.getElementById('main-nav');

const profilePhotoStatus = document.getElementById('profile-photo-status');

const findRepoInput = document.getElementById('find-repo-input');

const overallReposContainer = document.getElementById('main-body-repos'); 


//------------------------------------------- UI PROCESSING -------------------------------------------
//Nav menu is clicked
menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
}) 

//New Btn '+' symbol is clicked - close other visible modals and show new btn modal
navNewBtn.addEventListener('click', () => {
    newBtnDropdown.classList.toggle('show');
    navAvatarBtnDropdown.classList.remove('show');
})

//Avatart Btn is clicked - close other visible modals and show avatar btn modal
navAvatarBtn.addEventListener('click', () => {
    navAvatarBtnDropdown.classList.toggle('show');
    newBtnDropdown.classList.remove('show');
})

//Close all modals and dropdowns when user clicks on the page
document.querySelector('.main-body').addEventListener('click', () => {
    newBtnDropdown.classList.contains('show') ? newBtnDropdown.classList.remove('show') : '';
    navAvatarBtnDropdown.classList.contains('show') ? navAvatarBtnDropdown.classList.remove('show') : '';
})

//display main nav avatar on a particular scroll height
window.addEventListener('scroll', (e) => {
    window.scrollY > 340 ? mainNavAvatar.classList.add('visible') : mainNavAvatar.classList.remove('visible');
})

//readjust main nav for non-desktop screens
if(window.outerWidth > 801){
    nav.insertAdjacentElement('afterend', mainNav);
}
else if(window.outerWidth < 801) {
    findRepoInput.insertAdjacentElement('beforebegin', mainNav);
}

//adjust profile photo status input
function profileStatusHover(){
    let userStatus = profilePhotoStatus.innerText;
    profilePhotoStatus.innerText = profilePhotoStatus.innerText.split(' ')[0];
    profilePhotoStatus.addEventListener('mouseover', () => {
        profilePhotoStatus.innerText = userStatus;
    })
    profilePhotoStatus.addEventListener('mouseleave', () => {
        profilePhotoStatus.innerText = profilePhotoStatus.innerText.split(' ')[0];
    })
}
profileStatusHover();



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
    .then(data => {
        console.log(data.data.user);
        return data;
    })
    .catch(error => {
        console.log(error.message); 
    })
} 

getData(repoQuery);
