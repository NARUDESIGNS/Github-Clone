

class Developer {
    constructor(url, userLogin, token){
        if(!url || !userLogin || !token){
            throw new error('Please provide all 3 details required');
        }
        this.url = url;
        this.userLogin = userLogin;
        this.token = token;

        //DOM ELEMENTS
        this.nav = document.getElementById('nav'),

        this.menuBtn = document.getElementById('menu-btn'),
        this.mobileMenu = document.getElementById('mobile-nav-menu'),

        this.navNewBtn = document.getElementById('nav-new-btn'),
        this.newBtnDropdown = document.getElementById('new-btn-modal'),

        this.navAvatarBtn = document.getElementById('nav-avatar-btn'),
        this.navAvatarBtnDropdown = document.getElementById('avatar-btn-modal'),

        this.mainNavAvatar = document.getElementById('main-nav-avatar'),
        this.mainNav = document.getElementById('main-nav'),

        this.profilePhotoStatus = document.getElementById('profile-photo-status'),

        this.findRepoInput = document.getElementById('find-repo-input'),

        this.overallReposContainer = document.getElementById('main-body-repos'),

        this.totalReposCount = document.getElementById('no-of-repos');

        //--------------------------- Repo UI Elements for topics, stars, forks ---------------------------
        this.repo = document.getElementsByClassName('repo');
        this.topicsContainer = document.getElementsByClassName('topics-container');
        this.starGazers = document.getElementsByClassName('repo-info__stargazers');
        this.forks = document.getElementsByClassName('repo-info__forks');

        //BIO DOM ELEMENTS
        this.avatars = document.querySelectorAll('.avatar'),
        this.usernames = document.querySelectorAll('.username'),
        this.statuses = document.querySelectorAll('.status'),

        this.profileName = document.getElementById('profile-name'),
        this.profileBio = document.getElementById('profile-bio'),
        this.followersCount = document.getElementById('followers-count'),
        this.followingCount = document.getElementById('following-count'),
        this.totalStarCount = document.getElementById('total-star-count'),
        this.websiteLink = document.getElementById('website-link'),
        this.twitterUsername = document.getElementById('twitter-username')
    }

    getQuery(){
        return {
            query: `{
                user(login: "${this.userLogin}") {
                    avatarUrl(size: 400)
                    status {
                      message
                      emojiHTML
                    }
                    login
                    name
                    bio
                    followers {
                      totalCount
                    }
                    following {
                      totalCount
                    }
                    starredRepositories {
                      totalCount
                    }
                    websiteUrl
                    twitterUsername
        
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
                                    color
                                    name
                                }
                            }
                            isFork
                            stargazerCount
                            forkCount
                            updatedAt
                            url
                            viewerHasStarred
                        }
                        totalCount
                    }
                }
            }`
        } 
    }

    //API request
    async getData(query){
        await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(query)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.data.user);
            this.processRepoData(data.data.user); 
            this.processProfileData(data.data.user);
        })
        .catch(error => {
            document.querySelector('.main-body').style.visibility = "hidden";
            console.log(error); 
            alert('failed to fetch user data!, please check your internet connection');
        })
    } 

    //Process proile data from API
    processProfileData(data){
        //render all avatars | usernames | status values
        this.avatars.forEach(avatar => {
            avatar.src = data.avatarUrl;
        })
        this.usernames.forEach(username => {
            username.innerText = data.login;
        })
        this.statuses.forEach(post => {
            post.innerHTML = data.status.emojiHTML;
            post.innerText += `  ${data.status.message}`;
        })
    
        //adjust profile photo status input on hover
        if(window.innerWidth > 790){
            this.profilePhotoStatus.innerHTML = data.status.emojiHTML;
            this.profilePhotoStatus.addEventListener('mouseover', () => {
                this.profilePhotoStatus.innerText += `  ${data.status.message}`;
            })
            this.profilePhotoStatus.addEventListener('mouseleave', () => {
                this.profilePhotoStatus.innerHTML = data.status.emojiHTML;
            })       
        }
    
        //render profile data
        this.profileName.innerText = data.name;
        this.profileBio.innerText = data.bio;
        this.followersCount.innerText = data.followers.totalCount;
        this.followingCount.innerText = data.following.totalCount;
        this.totalStarCount.innerText = data.starredRepositories.totalCount;
        this.websiteLink.innerText = data.websiteUrl;
        this.twitterUsername.innerText = `@${data.twitterUsername}`;
    }

    //process repo data from API
    processRepoData(data){
        this.totalReposCount.innerText = data.repositories.totalCount;
        data = data.repositories.nodes;
        for(let i = 0; i < data.length; i++){
            this.overallReposContainer.innerHTML += `
                <div class="repo-container">
                    <section class="repo">
                        <h3><a class="repo__name" href="${data[i].url}">${data[i].name}</a></h3>
                        <p class="repo__desc">${data[i].description}</p>
                        <div class="topics-container">
                            
                        </div>

                        <div class="repo-info">
                            <span class="repo-info__language">
                                <span class="repo-info__language-color" style="background-color: ${data[i].languages.nodes[0].color}"></span>             
                                <p class="repo-info__language-name">${data[i].languages.nodes[0].name}</p>
                            </span>

                            <span class="repo-info__stargazers">
                            </span>

                            <span class="repo-info__forks">    
                            </span>

                            <span class="repo-info__update">        
                                <p>Updated</p>
                                <p class="repo-info__update-date">${formatDate(data[i].updatedAt)}</p>
                            </span>
                        </div>
                    </section>

                    <button class="repo-container__btn">
                        <span class="repo-info__stargazers-icon iconify" data-icon="octicon:star-16" data-inline="false"></span> 
                        Star
                    </button>
                </div>
            `;
            //render all topics
            let allTopics = data[i].repositoryTopics.nodes;
            for(let j = 0; j < allTopics.length; j++){
                this.topicsContainer[i].innerHTML += `
                    <span class="topics-container__topics">
                        <p class="topics-container__topics-title">${allTopics[j].topic.name}</p>
                    </span>
                `;
            }

            //--------------------------- Repo UI Process for topics, stars, forks to display or not ---------------------------
            //display star icon if repo is starred else hide it
            if(data[i].stargazerCount > 0){
                this.starGazers[i].innerHTML += `
                    <span class="repo-info__stargazers-icon iconify" data-icon="octicon:star-16" data-inline="false"></span>      
                    <p class="repo-info__stargazers-count">${data[i].stargazerCount}</p>
                `;
            }
            else {
                this.starGazers[i].style.display = "none";
            }

            //display fork icon if repo is forked else hide it
            if(data[i].forkCount > 0){
                this.forks[i].innerHTML += `
                    <span class="repo-info__forks-icon iconify" data-icon="octicon:repo-forked-16" data-inline="false"></span>      
                    <p class="repo-info__forks-count">${data[i].forkCount}</p>
                `;
            }
            else {
                this.forks[i].style.display = "none";
            }
        }

        //Date Formater
        function formatDate(date){
            let monthOfUpdate = new Date(date).getMonth();
            let currentMonth = new Date().getMonth();
            if(monthOfUpdate === currentMonth){
                let dateOfUpdate = new Date(date).getDate();
                let currentDate = new Date().getDate();
                return ` ${currentDate - dateOfUpdate} days ago`;
            }
            else{
                date = new Date(date).toDateString().split(' ');
                date.shift(), date.pop();
                return ` on ${date.join(" ")}`;            
            }
        }

    }

    //render all data
    renderData(){
        //call the API function
        this.getData(this.getQuery());

        //------------------------------------------- UI PROCESSING -------------------------------------------
        //Nav menu is clicked
        this.menuBtn.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('show');
        }) 

        //New Btn '+' symbol is clicked - close other visible modals and show new btn modal
        this.navNewBtn.addEventListener('click', () => {
            this.newBtnDropdown.classList.toggle('show');
            this.navAvatarBtnDropdown.classList.remove('show');
        })

        //Avatart Btn is clicked - close other visible modals and show avatar btn modal
        this.navAvatarBtn.addEventListener('click', () => {
            this.navAvatarBtnDropdown.classList.toggle('show');
            this.newBtnDropdown.classList.remove('show');
        })

        //Close all modals and dropdowns when user clicks on the page
        document.querySelector('.main-body').addEventListener('click', () => {
            this.newBtnDropdown.classList.contains('show') ? this.newBtnDropdown.classList.remove('show') : '';
            this.navAvatarBtnDropdown.classList.contains('show') ? this.navAvatarBtnDropdown.classList.remove('show') : '';
        })

        //display main nav avatar on a particular scroll height
        window.addEventListener('scroll', (e) => {
            window.scrollY > 360 ? this.mainNavAvatar.classList.add('visible') : this.mainNavAvatar.classList.remove('visible');
        })

        //readjust main nav for non-desktop screens
        if(window.innerWidth > 801){
            this.nav.insertAdjacentElement('afterend', this.mainNav);
        }
        else if(window.innerWidth < 801) {
            this.findRepoInput.insertAdjacentElement('beforebegin', this.mainNav);
        }
    }
}


//create new Developer and render data
//this token is a sample token, replace with your own token
const token = "xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx";
const narudesigns = new Developer(`https://api.github.com/graphql`, 'narudesigns', token);
narudesigns.renderData();