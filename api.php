<?php
header("Content-Type: application/json");
include "connection.php"; 

if ($_SERVER["REQUEST_METHOD"] == "POST") { 
    $data = json_decode(file_get_contents("php://input"), true);
    
    $action = $data['action'] ?? '';
    
    $nic = $data['nic'] ?? '';
    $password = $data['password'] ?? '';
    $userName = $data['userName'] ?? ''; 


    // LOGIN part

    if ($action === 'login') {
       
        $result = $conn->query("SELECT NIC, password, userName FROM login WHERE NIC = '$nic'");

        if ($row = $result->fetch_assoc()) {
            
            if ($password === $row['password']) {
                echo json_encode([
                    "success" => true, 
                    "redirect" => "user_dashboard.html?userName=" . urlencode($row['userName']) . "&nic=" . urlencode($row['NIC'])
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Incorrect password"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
    } 
    
    // SIGNUP part
    
    elseif ($action === 'signup') {
        $checkResult = $conn->query("SELECT NIC FROM login WHERE NIC = '$nic'");

        if ($checkResult->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "This NIC is already registered. Please log in."]);
        } else {
            
            if ($conn->query("INSERT INTO login (NIC, password, userName) VALUES ('$nic', '$password', '$userName')")) {
                echo json_encode([
                    "success" => true, 
                    "message" => "Sign up successful! You can now log in.",
                    "redirect" => "main.html"
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Database error during registration."]);
            }
        }
    } 
    
    // CREATE REQUEST part
    
    elseif ($action === 'create_request') {
        $req_nic = $data['nic'] ?? '';
        $relief_type = $data['relief_type'] ?? '';
        $severity = $data['severity'] ?? ''; 
        $district = $data['district'] ?? '';
        $gn_division = $data['gn_division'] ?? '';
        $contact_name = $data['contact_name'] ?? '';
        $contact_number = $data['contact_number'] ?? '';
        $address = $data['address'] ?? '';
        $family_members = $data['family_members'] ?? '';
        $description = $data['description'] ?? '';

        if ($conn->query("INSERT INTO relief_request (NIC, relief_type, district, GN_division, contact_name, contact_number, address, no_familly_mem, security_level, description) VALUES ('$req_nic', '$relief_type', '$district', '$gn_division', '$contact_name', '$contact_number', '$address', '$family_members', '$severity', '$description')")) {
            echo json_encode(["success" => true, "message" => "Relief request submitted successfully!"]);
        } else {
            if ($conn->errno === 1062) {
                echo json_encode(["success" => false, "message" => "You have already submitted a relief request."]);
            } else {
                echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
            }
        }
    } 
    
    // DELETE REQUEST part
    
    elseif ($action === 'delete_request') {
        $relief_id = $data['relief_id'] ?? '';
        $req_nic = $data['nic'] ?? ''; 

        $result = $conn->query("DELETE FROM relief_request WHERE relief_ID = $relief_id AND NIC = '$req_nic'");
        
        if ($result) {
            if ($conn->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Request cancelled successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Request not found or unauthorized."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Database error."]);
        }
    }
    
    // GET MY REQUESTS LOGIC
    
    elseif ($action === 'get_my_requests') {
        $req_nic = $data['nic'] ?? '';
        
        $result = $conn->query("SELECT * FROM relief_request WHERE NIC = '$req_nic' ORDER BY relief_ID DESC");
        
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        
        echo json_encode(["success" => true, "data" => $requests]);
    } 


    // ADMIN DASHBOARD part
    
    
    // 1. Get Dashboard Statistics
    elseif ($action === 'get_admin_stats') {
        $stats = ['total_users' => 0, 'total_requests' => 0, 'pending_requests' => 0];

        // Count total registered users
        $res = $conn->query("SELECT COUNT(*) as c FROM login");
        if($row = $res->fetch_assoc()) $stats['total_users'] = $row['c'];

        // Count total relief requests
        $res = $conn->query("SELECT COUNT(*) as c FROM relief_request");
        if($row = $res->fetch_assoc()) $stats['total_requests'] = $row['c'];

        echo json_encode(["success" => true, "data" => $stats]);
    }
    
    // 2. Get All Users for the Users Table
    elseif ($action === 'get_users') {
        $result = $conn->query("SELECT NIC, userName FROM login");
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        echo json_encode(["success" => true, "data" => $users]);
    }
    
    // 3. Get All Requests from Everyone for the Requests Table
    elseif ($action === 'get_all_requests') {
        $result = $conn->query("SELECT * FROM relief_request ORDER BY relief_ID DESC");
        
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $requests[] = $row;
        }
        
        echo json_encode(["success" => true, "data" => $requests]);
    }

    else {
        echo json_encode(["success" => false, "message" => "Invalid action requested."]);
    }
    
    exit;
}
?>