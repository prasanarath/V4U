document.addEventListener("DOMContentLoaded", function() {
    // Example Volunteer Data
    const volunteerData = {
        name: "xyz",
        mobile: "+91 9876543210",
        aadhar: "1234-5678-9012",
        address: "123, MG Road, Bangalore, India",
        age: 25,
        gender: "Male",
        tasksAssigned: 50,
        tasksCompleted: 45,
        rating: 4.8,
        reviews: [
            "Excellent work ethic!",
            "Very reliable and punctual.",
            "Great team player.",
            "Highly recommended!"
        ],
        profilePhoto: "images/profile1.jpg"
    };

    // Update HTML elements with volunteer data
    document.getElementById("name").innerText = "Name: " + volunteerData.name;
    document.getElementById("mobile").innerText = "Mobile: " + volunteerData.mobile;
    document.getElementById("aadhar").innerText = "Aadhar No: " + volunteerData.aadhar;
    document.getElementById("address").innerText = "Address: " + volunteerData.address;
    document.getElementById("age").innerText = "Age: " + volunteerData.age;
    document.getElementById("gender").innerText = "Gender: " + volunteerData.gender;
    document.getElementById("tasksAssigned").innerText = "Tasks Assigned: " + volunteerData.tasksAssigned;
    document.getElementById("tasksCompleted").innerText = "Tasks Completed: " + volunteerData.tasksCompleted;
    document.getElementById("rating").innerText = "Rating: " + volunteerData.rating + " ⭐";
    document.getElementById("reviews").innerText = "Reviews: " + volunteerData.reviews.join(" | ");
    document.getElementById("profilePhoto").src = volunteerData.profilePhoto;

    // Profile Photo Selection
    document.getElementById("photoSelector").addEventListener("change", function() {
        document.getElementById("profilePhoto").src = this.value;
    });
});
