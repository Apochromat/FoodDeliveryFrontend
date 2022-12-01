export async function getProfileDetails() {
    let token = localStorage.getItem("jwt");
    if (!token) return;
    let response = await fetch(`${api_url}/account/profile`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`
        }
    });
    let json = await response.json();
    return json;
}

export async function changeProfile(name, birth, gender, address, phone) {
    let token = localStorage.getItem("jwt");
    let user = localStorage.getItem("user");
    if (!token) return false;

    try {
        let response = await fetch(`${api_url}/account/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                "fullName": name,
                "birthDate": `${birth}T00:00:00.000Z`,
                "gender": gender,
                "address": address,
                "phoneNumber": phone
            })
        });
        return response.ok;
    } 
    catch {
        return false;
    }
}
