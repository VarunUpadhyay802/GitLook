// const GITHUB_API_USERINFO = "https://api.github.com/users/";

// const full_name = document.getElementById("full_name");
// const user_image = document.getElementById("user_image");
// const user_email = document.getElementById("user_email");
// const user_bio = document.getElementById("user_bio");
// const twitter_username = document.getElementById("twitter_username");
// const github_link = document.getElementById("github_link");
// const searchInput = document.getElementById("searchInput");
// const searchButton = document.querySelector(".searchButton");
// const resultDiv = document.getElementById("resultDiv");
// const repositoriesContainer = document.getElementById("repositoriesContainer");
// const need_to_search = document.getElementById("need_to_search")
// const loading = document.getElementById("loading");
// searchButton.addEventListener("click", (e) => {
//     const searchValue = searchInput.value;
//     const userName = searchValue;
//     loading.style.display = "block"
//     fetch(GITHUB_API_USERINFO + userName)
//         .then(response => response.json())
//         .then(data => {
            
//             loading.style.display = "none"
//             resultDiv.style.display = "block";
//             resultDiv.style.display = "block";
//             need_to_search.style.display = "none";

//             // Update HTML elements with user information
//             full_name.textContent = data.name || "N/A";
//             user_image.src = data.avatar_url || "default_user.jpg";
//             user_email.textContent = data.email || "N/A";
//             user_bio.textContent = data.bio || "N/A";
//             twitter_username.textContent = data.twitter_username || "N/A";
//             github_link.href = data.html_url;

//             // Fetch user repositories
//             fetch(GITHUB_API_USERINFO + userName + "/repos")
//                 .then(response => response.json())
//                 .then(repositories => {
//                     // Clear existing repositories in the container
//                     repositoriesContainer.innerHTML = "";

//                     // Iterate over each repository and append to the container
//                     repositories.forEach(repository => {

//                         //created div elements for repoCard, repoCardHeader, and repoCardBody.
//                         const repoCard = document.createElement("div");
//                         repoCard.className = "repo-card";

//                         const repoCardHeader = document.createElement("div");
//                         repoCardHeader.className = "repo-card-header";

//                         const repoName = document.createElement("h3");
//                         repoName.textContent = repository.name;

//                         repoCardHeader.appendChild(repoName);
//                         repoCard.appendChild(repoCardHeader);

//                         const repoCardBody = document.createElement("div");
//                         repoCardBody.className = "repo-card-body";
//                         repoCardBody.innerHTML = `
//                             <p>${repository.description || "No description available."}</p>
//                             <a href="${repository.html_url}" target="_blank"> <img src="/link.png" alt="User Image" class="link-icon" ></a>
//                         `;

//                         repoCard.appendChild(repoCardBody);
//                         repositoriesContainer.appendChild(repoCard);
//                     });
//                 });
//         })
//         .catch(error => console.error("Error:", error));

//     e.preventDefault();
// });
const GITHUB_API_USERINFO = "https://api.github.com/users/";

const full_name = document.getElementById("full_name");
const user_image = document.getElementById("user_image");
const user_email = document.getElementById("user_email");
const user_bio = document.getElementById("user_bio");
const twitter_username = document.getElementById("twitter_username");
const github_link = document.getElementById("github_link");
const searchInput = document.getElementById("searchInput");
const searchButton = document.querySelector(".searchButton");
const resultDiv = document.getElementById("resultDiv");
const repositoriesContainer = document.getElementById("repositoriesContainer");
const need_to_search = document.getElementById("need_to_search");
const loading = document.getElementById("loading");

searchButton.addEventListener("click", (e) => {
    const searchValue = searchInput.value;
    const userName = searchValue;
    loading.style.display = "block";

    // Fetch user information
    fetch(GITHUB_API_USERINFO + userName)
        .then(response => response.json())
        .then(data => {
            loading.style.display = "none";
            resultDiv.style.display = "block";
            need_to_search.style.display = "none";

            // Update HTML elements with user information
            full_name.textContent = data.name || "N/A";
            user_image.src = data.avatar_url || "default_user.jpg";
            user_email.textContent = data.email || "N/A";
            user_bio.textContent = data.bio || "N/A";
            twitter_username.textContent = data.twitter_username || "N/A";
            github_link.href = data.html_url;

            // Fetch user repositories with pagination
            fetchRepositories(userName);
        })
        .catch(error => console.error("Error:", error));

    e.preventDefault();
});

function fetchRepositories(userName, page = 1) {
    fetch(`${GITHUB_API_USERINFO}${userName}/repos?page=${page}&per_page=10`)
        .then(response => {
            const linkHeader = response.headers.get('link');
            const hasNextPage = linkHeader && linkHeader.includes('rel="next"');

            return response.json().then(repositories => ({ repositories, hasNextPage }));
        })
        .then(({ repositories, hasNextPage }) => {
            // Clear existing repositories in the container
            repositoriesContainer.innerHTML = "";

            // Iterate over each repository and append to the container
           // Iterate over each repository and append to the container
repositories.forEach(repository => {
    const repoCard = document.createElement("div");
    repoCard.className = "repo-card";

    const repoCardHeader = document.createElement("div");
    repoCardHeader.className = "repo-card-header";

    const repoName = document.createElement("h3");
    repoName.textContent = repository.name;

    repoCardHeader.appendChild(repoName);
    repoCard.appendChild(repoCardHeader);

    const repoCardBody = document.createElement("div");
    repoCardBody.className = "repo-card-body";
    repoCardBody.innerHTML = `
        <p>${repository.description || "No description available."}</p>
        <a href="${repository.html_url}" target="_blank"> <img src="/link.png" alt="User Image" class="link-icon" ></a>
    `;

    repoCard.appendChild(repoCardBody);
    repositoriesContainer.appendChild(repoCard);
});


            // If there is a next page, recursively fetch the next page of repositories
            if (hasNextPage) {
                fetchRepositories(userName, page + 1);
            }
        })
        .catch(error => console.error("Error fetching repositories:", error));
}