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
const paginationContainer = document.querySelector(".pagination");

const reposPerPage = 10;
let currentPage = 1;

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
            fetchRepositories(userName, currentPage);
        })
        .catch(error => console.error("Error:", error));

    e.preventDefault();
});

function updatePaginationLinks(linkHeader) {
    paginationContainer.innerHTML = ""; // Clear existing pagination links

    const links = parseLinkHeader(linkHeader);

    // Create and append pagination links
    links.forEach(link => {
        const pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.textContent = link.page;
        if (link.active) {
            pageLink.classList.add("active");
        }

        pageLink.addEventListener("click", () => {
            currentPage = link.page;
            fetchRepositories(searchInput.value, currentPage);
        });

        paginationContainer.appendChild(pageLink);
    });
}

function parseLinkHeader(linkHeader) {
    if (!linkHeader) {
        return [];
    }

    const links = linkHeader.split(", ");
    const result = [];

    links.forEach(link => {
        const [url, rel] = link.split("; ");
        const pageMatch = url.match(/page=(\d+)/);
        const page = pageMatch ? parseInt(pageMatch[1]) : null;
        const active = rel.includes("rel=\"next\"") || rel.includes("rel=\"prev\"") ? false : true;

        result.push({ page, active });
    });

    return result;
}
function fetchRepositories(userName, page = 1) {
    fetch(`${GITHUB_API_USERINFO}${userName}/repos?page=${page}&per_page=${reposPerPage}`)
        .then(response => {
            const linkHeader = response.headers.get('link');
            updatePaginationLinks(linkHeader);

            return response.json();
        })
        .then(repositories => {
            repositoriesContainer.innerHTML = ""; // Clear existing repositories in the container

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
        })
        .catch(error => console.error("Error fetching repositories:", error));
}

