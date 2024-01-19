const GITHUB_API_USERINFO = "https://api.github.com/users/";
const userName = "VarunUpadhyay802";
const full_name = document.getElementById("full_name")
const Following_count = document.getElementById("Following_count")


fetch(GITHUB_API_USERINFO + userName).then(response => response.json()).then(data => {

    full_name.textContent = data.name
    Following_count.textContent = data.following
    console.log(data);
    console.log("ID:", data.id);
    console.log("Username:", data.login);
    console.log("Public Repositories:", data.public_repos);
}).catch(error => console.error("Error:", error))
