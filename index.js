const GITHUB_API_USERINFO = "https://api.github.com/users/";

const full_name = document.getElementById("full_name");
const Following_count = document.getElementById("Following_count");
const Follower_count = document.getElementById("Follower_count");
const user_image = document.getElementById("user_image");
const user_email = document.getElementById("user_email");
const user_bio = document.getElementById("user_bio");
const twitter_username = document.getElementById("twitter_username");
const github_link = document.getElementById("github_link");
const searchInput = document.getElementById("searchInput")
const searchButton = document.querySelector(".searchButton");
const resultDiv = document.getElementById("resultDiv");
const need_to_search = document.getElementById("need_to_search")
// const validateUser=(userName)=>{
//     fetch(GITHUB_API_USERINFO + userName).then((res)=>{
//         if(res.status===200){
//             return true;
//         }
//         else
//         return false
//     })
// }
searchButton.addEventListener("click", (e) => {


    console.log("hey");
    const searchValue = searchInput.value;
    const userName = searchValue;
    fetch(GITHUB_API_USERINFO + userName)
        .then(response => response.json())
        .then(data => {
            resultDiv.style.display = "block";
            need_to_search.style.display = "none"

            // Update HTML elements with user information
            full_name.textContent = data.name || "N/A";
            Following_count.textContent = data.following || "N/A";
            Follower_count.textContent = data.followers || "N/A";
            user_image.src = data.avatar_url || "default_user.jpg";

            // Additional Information
            user_email.textContent = data.email || "N/A";
            user_bio.textContent = data.bio || "N/A";
            twitter_username.textContent = data.twitter_username || "N/A";
            github_link.href = data.html_url;
            github_link.textContent = "link"


        })
        .catch(error => console.error("Error:", error));
    e.preventDefault();

}
)
