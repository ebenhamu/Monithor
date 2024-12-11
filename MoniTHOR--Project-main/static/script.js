document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript is loaded.');

    // Login form submission
    const logform = document.getElementById('login-form');
    if (logform) {
        logform.addEventListener('submit', async function (event) {
            console.log('login-form is submitted!');
            event.preventDefault();

            const UserName = document.getElementById('username').value;
            const Password = document.getElementById('password').value;
            console.log(`username=${UserName}&password=${Password} Login!`);

            try {
                const response = await fetch(`/login?username=${UserName}&password=${Password}`);
                const data = await response.text();
                console.log(data);

                if (data.includes("Login Successful")) {
                    console.log("Logged In Successfully");
                    window.location.href = '/dashboard'; // Redirect after successful login
                } else {
                    alert('Invalid username or password!');
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        });
    } else {
        console.warn('Login form not found.');
    }

    // Single-monitor form submission
    const monitorForm = document.getElementById('single-monitor-form');
    if (monitorForm) {
        monitorForm.addEventListener('submit', async function (event) {
            console.log('single-monitor-form is submitted!');
            event.preventDefault();
            const title = document.getElementById('Dashboard').innerText;
            const domainInput = document.getElementById('single').value.trim();
            const errorMessage = document.getElementById('error-message');
            
            let username=title.replace("\'s Dashboard","")
            console.log(domainInput);
            console.log(username);

            const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;

            if (!domainRegex.test(domainInput)) {
                errorMessage.style.display = "block"; // Display error as block
                errorMessage.textContent = "Please enter a valid domain name.";
            } else {
                errorMessage.style.display = "none"; // Hide the error message
                try {
                    const response = await fetch(`/add_domain/${domainInput}`);
                    const data = await response.text();
                    console.log(data);
                    console.log('Domain is monitored');
                } catch (error) {
                    console.error('Error adding domain:', error);
                }

                try {
                    console.log("Trying")
                    const response2 = await fetch(`check/${username}`);
                    const checkResponse = await response2.text();                    
                    console.log(checkResponse);
                    alert('Check Is Finished') 
                    setTimeout(() => {
                        window.location.href = '/results';
                    }, 1000); // 1000 milliseconds = 1 seconds
                } catch (error) {
                    console.error('Error runing check:', error);
                }
            }
        });
    } else {
        console.warn('Single-monitor form not found.');
    }


    // Bulk-monitor form submission
    const bulkForm = document.getElementById('bulk-monitor-form');
    if (bulkForm) {
        bulkForm.addEventListener('submit', async function (event) {
            console.log('bulk-monitor-form is submitted!');
            event.preventDefault();

            const title = document.getElementById('Dashboard').innerText;  
            const bulkFileInput = document.getElementById('bulk').value.trim();         
            const errorMessage = document.getElementById('error-message');
            let username=title.replace("\'s Dashboard","")
            var actionValue = document.activeElement.value;
            console.log(actionValue)

            console.log(username)
            console.log(bulkFileInput);            
            let fileName =bulkFileInput.replaceAll("/","%5C")
            fileName = fileName.replaceAll("\\","%5C")
            alert(fileName);            
            if (actionValue === "upload-check") {
            try {
                ileInfo = document.getElementById('bulk').value.split("\\")
fileToUpload=fileInfo[fileInfo.length - 1]
//
var fileInput = document.getElementById('bulk');
var file = fileInput.files[0];  // Get the selected file
alert(fileToUpload)
// Create a FormData object to send the file
var formData = new FormData();
formData.append('file', file);

try {
    // Use Fetch API to send the file to the server
    let response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });

    let result = await response.text();
    console.log('Success:', result);
} catch (error) {
    console.error('Error:', error);
}
//


            const title = document.getElementById('Dashboard').innerText;  
            const bulkFileInput = document.getElementById('bulk').value.trim();         
            const errorMessage = document.getElementById('error-message');
            let username=title.replace("\'s Dashboard","")
            var actionValue = document.activeElement.value;
            console.log(actionValue)













                alert("upload-check")
                    const response1 = await fetch(`bulk_upload/${fileName}`);
                    const uploadData = await response1.text();
                    if (uploadData=="File Not Exist")
                        {alert(uploadData);}
                    else 
                        {console.log('Bulk upload');}
                } catch (error) {
                    console.error('Error adding domain:');
                }

            }
                try {
                    const response2 = await fetch(`check/${username}`);
                    const checkResponse = await response2.text();
                    console.log(checkResponse);
                    alert('Check Is Finished')                    
                    setTimeout(() => {
                        window.location.href = '/results';
                    }, 1000); // 1000 milliseconds = 1 seconds
                } catch (error) {
                    console.error('Error runing check:', error);
                }
            
            }
        );
    }else {
        console.error('Bulk-monitor form not found.');
    }

        // Schedule-monitoring Form Submission
        document.getElementById('schedule-monitoring-form').addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission behavior
        
            // Gather form data
            const formData = new FormData(this);
        
            try {
                // Send a POST request with form data
                const response = await fetch('/schedule_bulk_monitoring', {
                    method: 'POST',
                    body: formData, // Use FormData directly for form-encoded submission
                });
        
                if (response.ok) {
                    const data = await response.json(); // Parse the JSON response
                    alert(data.message); // Show the success message
                    window.location.href = '/dashboard'; // Redirect to the dashboard
                } else {
                    alert('Failed to schedule monitoring. Please check your input and try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An unexpected error occurred. Please try again later.');
            }
        });
    
});

    // Delete domain function
    function removeDomain(buttonElement) {
        console.log("Remove button clicked.");
        const listItem = buttonElement.closest("li");
        if (!listItem) {
            console.log("Could not find the parent list item.");
            return;
        }
    
        // Extract the domain name and clean it
        let domainName = listItem.firstChild.textContent.trim();
        console.log(`Extracted domain name (raw): ${domainName}`);
    
        // Remove unnecessary parts (e.g., "Remove" from text if it's being included)
        domainName = domainName.replace("Remove", "").trim();
        console.log(`Cleaned domain name: ${domainName}`);
        
    
        fetch(`/remove_domain/${encodeURIComponent(domainName)}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                console.log("Server response:", data);
                if (data.message === "Domain successfully removed") {
                    listItem.remove();
                    alert(data.message);
                    location.reload();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error("Error:", error));
    }
    
    // Cancel Schedule Job Function
    function cancelJob(jobId) {
        fetch(`/cancel_job/${jobId}`, {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                alert('Job canceled successfully!');
                location.reload();
            } else {
                alert('Failed to cancel the job.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred.');
        });
    }

    // Define status-code with class for styleing
    document.addEventListener("DOMContentLoaded", () => {
        function styleStatusCells() {
            const statusCells = document.querySelectorAll('#resultsBody .status-code');
            statusCells.forEach(cell => {
                const status = cell.textContent.trim();
                if (status === "OK") {
                    cell.classList.add('status-ok');
                } else if (status === "FAILED") {
                    cell.classList.add('status-failed');
                }
            });
        }
        styleStatusCells();
    });
    