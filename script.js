const apiUrl = "api.php";


// 1. LOGIN PAGE part

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    login();
  });
}

function login() {
  const nicValue = document.getElementById("nic").value; 
  const passwordValue = document.getElementById("password").value;

  fetch(apiUrl, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      action: 'login', 
      nic: nicValue, 
      password: passwordValue 
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      window.location.href = data.redirect; 
    } else {
      alert(data.message || "Invalid credentials.");
    }
  })
  .catch(err => console.error("Error:", err));
}


// 2. SIGNUP PAGE LOGIC

const signUpForm = document.getElementById("SignUpForm");
if (signUpForm) {
  signUpForm.addEventListener("submit", function(event) {
    event.preventDefault();
    signup();
  });
}

function signup() {
  const userNameValue = document.getElementById("userName").value;
  const nicValue = document.getElementById("nic").value;
  const passwordValue = document.getElementById("password").value;
  const confirmValue = document.getElementById("confirm").value;
  
  const nameError = document.getElementById("nameError");
  const nicError = document.getElementById("nicError");
  const confirmError = document.getElementById("confirmError");

  nameError.style.display = "none";
  nicError.style.display = "none";
  confirmError.style.display = "none";

  if (userNameValue.trim() === "") {
    nameError.style.display = "block";
    return;
  }
  if (nicValue.trim() === "") {
    nicError.style.display = "block";
    return;
  }
  if (passwordValue !== confirmValue) {
    confirmError.style.display = "block";
    return;
  }

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: 'signup', 
      userName: userNameValue, 
      nic: nicValue,
      password: passwordValue
    }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(data.message); 
      window.location.href = data.redirect; 
    } else {
      alert(data.message); 
    }
  })
  .catch(err => console.error("Error:", err));
}


// 3. DASHBOARD PAGE LOGIC

const displayNameElement = document.getElementById('displayName');
let currentUserName = "";
let currentNic = ""; 

if (displayNameElement) {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get('userName');
  const nic = urlParams.get('nic'); 

  if (userName && nic) {
    displayNameElement.textContent = userName;
    currentUserName = userName; 
    currentNic = nic; 
    
    const avatar = document.getElementById('nav-avatar');
    if(avatar) avatar.textContent = userName.charAt(0).toUpperCase();


    loadMyRequests();

  } else {
    alert("Unauthorized access. Please log in.");
    window.location.href = "main.html"; 
  }
}

function logout() {
  window.location.href = "main.html";
}


// 4. REQUEST MANAGEMENT


// Open Modal
function openNewRequest() {
  const modal = document.getElementById('request-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.getElementById('request-form').reset();
  }
}

// Close Modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Toast Notification System
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-msg">${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- Load Requests Function ---
function loadMyRequests() {
  const listContainer = document.getElementById('requests-list');
  if (!listContainer) return;
  
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: 'get_my_requests', nic: currentNic })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      if (data.data.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; color: var(--text-muted);">
              
              <p>You haven't submitted any relief requests yet.</p>
          </div>`;
      } else {
        listContainer.innerHTML = ''; 
        
        data.data.forEach(req => {
          const card = document.createElement('div');
          
          card.style.cssText = `
            background: var(--bg-card); 
            padding: 20px; 
            border-radius: var(--radius); 
            margin-bottom: 15px; 
            box-shadow: var(--shadow); 
            border-left: 5px solid var(--primary);
            display: flex;
            flex-direction: column;
            gap: 8px;
          `;
          
          //  Adding Delete Button right next to the Request ID Badge
          card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: var(--primary-dark); margin: 0;">${req.relief_type} Relief</h3>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="background: var(--bg); padding: 5px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; color: var(--primary);">Req ID: #${req.relief_ID}</span>
                    <button onclick="deleteRequest(${req.relief_ID})" style="background: var(--danger); color: white; border: none; padding: 5px 12px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem; font-weight: 600;">Cancel Request</button>
                </div>
            </div>
            <div style="font-size: 0.9rem; color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;">
                <span><strong>📍 Location:</strong> ${req.district}, ${req.GN_division}</span>
                <span><strong>👥 Family Members:</strong> ${req.no_familly_mem}</span>
                <span><strong>⚠️ Severity:</strong> ${req.security_level}</span>
                <span><strong>📞 Contact:</strong> ${req.contact_name} (0${req.contact_number})</span>
            </div>
          `;
          listContainer.appendChild(card);
        });
      }
    } else {
      listContainer.innerHTML = `<p style="color: var(--danger);">Error loading requests.</p>`;
    }
  })
  .catch(err => {
    console.error("Error fetching requests:", err);
    listContainer.innerHTML = `<p style="color: var(--danger);">Failed to connect to the server.</p>`;
  });
}

//  Submit New Request Function
const requestForm = document.getElementById('request-form');
if (requestForm) {
  requestForm.addEventListener('submit', function(event) {
    event.preventDefault();
    submitRequest();
  });
}

function submitRequest() {
  const relief_type    = document.getElementById('relief_type').value;
  const severity       = document.getElementById('severity').value;
  const district       = document.getElementById('district').value;
  const gn_division    = document.getElementById('gn_division').value;
  const contact_name   = document.getElementById('contact_name').value;
  const contact_number = document.getElementById('contact_number').value;
  const address        = document.getElementById('address').value;
  const family_members = document.getElementById('family_members').value;
  const description    = document.getElementById('description').value;

  if (!relief_type || !severity || !district || !gn_division || !contact_name || !contact_number || !address || !family_members) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: 'create_request',
      nic: currentNic,
      relief_type,
      severity,
      district,
      gn_division,
      contact_name,
      contact_number,
      address,
      family_members,
      description
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      closeModal('request-modal');
      showToast(data.message, "success");
      loadMyRequests();
    } else {
      showToast(data.message || "Failed to submit request.", "error");
    }
  })
  .catch(err => {
    console.error("Error submitting request:", err);
    showToast("Server connection failed.", "error");
  });
}

// Delete Request Function
function deleteRequest(reliefId) {
  
  if (!confirm("Are you sure you want to cancel this relief request? This action cannot be undone.")) {
    return;
  }

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      action: 'delete_request', 
      relief_id: reliefId,
      nic: currentNic 
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showToast(data.message, "success");

      // Automatically refresh the list so the deleted card disappears
      loadMyRequests(); 

    } else {
      showToast(data.message || "Failed to cancel request.", "error");
    }
  })
  .catch(err => {
    console.error("Error deleting request:", err);
    showToast("Server connection failed.", "error");
  });
}


// 5. ADMIN DASHBOARD part

const adminRequestsTableBody = document.getElementById('requests-table-body');
const adminUsersTableBody = document.getElementById('users-table-body');
let allRequestsData = [];

if (adminRequestsTableBody || adminUsersTableBody) {
  loadAdminData();
}

function loadAdminData() {
  // Load Registered Users Data
  if (adminUsersTableBody) {
    fetch(apiUrl, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: 'get_users' })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        adminUsersTableBody.innerHTML = ''; 
        
        // Update total users stat box
        const statUsers = document.getElementById('stat-users');
        if (statUsers) statUsers.textContent = data.data.length;

        data.data.forEach(user => {
          adminUsersTableBody.innerHTML += `
            <tr>
              <td><strong>${user.NIC}</strong></td>
              <td>${user.userName}</td>
              <td><span class="badge badge-low">User</span></td>
              <td>
                <button class="btn btn-sm btn-outline" onclick="alert('Viewing User: ${user.userName}\\nFurther details can be implemented here.')">View</button>
              </td>
            </tr>
          `;
        });
      }
    })
    .catch(err => console.error("Error loading users:", err));
  }

  // Load All Relief Requests Data
  if (adminRequestsTableBody) {
    fetch(apiUrl, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: 'get_all_requests' })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        allRequestsData = data.data; // Save to global variable for the filter feature
        updateOverviewStats(allRequestsData);
        renderRequestsTable(allRequestsData);
      }
    })
    .catch(err => console.error("Error loading requests:", err));
  }
}

// Render the Requests Table
function renderRequestsTable(data) {
  if (!adminRequestsTableBody) return;
  adminRequestsTableBody.innerHTML = '';

  if (data.length === 0) {
      adminRequestsTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted)">No requests found.</td></tr>';
      return;
  }

  data.forEach(req => {
    const typeClass = req.relief_type.toLowerCase();
    const sevClass = req.security_level.toLowerCase();

    adminRequestsTableBody.innerHTML += `
      <tr>
        <td><strong>${req.NIC}</strong></td>
        <td><span class="badge badge-${typeClass}">${req.relief_type}</span></td>
        <td>${req.district}</td>
        <td>${req.GN_division}</td>
        <td>${req.contact_name}<br><small style="color:var(--text-muted)">0${req.contact_number}</small></td>
        <td><span class="badge badge-${sevClass}">${req.security_level}</span></td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="adminDeleteRequest(${req.relief_ID}, '${req.NIC}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Update the Top System Overview Boxes
function updateOverviewStats(data) {
  const statRequests = document.getElementById('stat-requests');
  const statHigh = document.getElementById('stat-high');
  const statFood = document.getElementById('stat-food');

  if (statRequests) statRequests.textContent = data.length;

  let highCount = 0;
  let foodCount = 0;
  
  data.forEach(req => {
      if (req.security_level === 'High') highCount++;
      if (req.relief_type === 'Food') foodCount++;
  });

  if (statHigh) statHigh.textContent = highCount;
  if (statFood) statFood.textContent = foodCount;
}





// 7: ADMIN DELETE REQUEST LOGIC

function adminDeleteRequest(reliefId, userNic) {
  
  if (!confirm("Are you sure you want to permanently delete this request?")) {
    return;
  }


  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      action: 'delete_request', 
      relief_id: reliefId,
      nic: userNic 
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // Show success message and immediately refresh the tables/stats
      showToast("Request deleted successfully.", "success");
      loadAdminData(); 

    } else {
      showToast(data.message || "Failed to delete request.", "error");
    }
  })
  .catch(err => {
    console.error("Error deleting request:", err);
    showToast("Server connection failed.", "error");
  });
}


// 8. ADMIN LOGIN part (MAIN.HTML)


function openAdminModal() {
  const modal = document.getElementById('adminModal');
  if (modal) {
    
    modal.style.display = 'flex'; 
    
    document.getElementById('adminPasswordInput').value = ''; 
  }
}

function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function verifyAdmin() {
  const passwordInput = document.getElementById('adminPasswordInput').value;
  
  // Hardcoded password: "admin"
  if (passwordInput === 'Admin123') {
    
    window.location.href = 'admin_dashboard.html';
  } else {
    alert('Incorrect Admin Password!');
  }
}