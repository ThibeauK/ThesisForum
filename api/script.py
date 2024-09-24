from dotenv import load_dotenv
import os
import requests

# Load environment variables from the .env file
load_dotenv()

# Fetch URLs and credentials from environment variables
login_url = os.getenv('LOGIN_URL')
protected_route_url = os.getenv('PROTECTED_ROUTE_URL')
username = os.getenv('USERNAME')
password = os.getenv('PASSWORD')

if not login_url or not protected_route_url:
    print("Error: Login URL or Protected Route URL is missing from environment variables.")
    exit()

if not username or not password:
    print("Error: Username or Password is missing from environment variables.")
    exit()

# Step 1: Get the JWT token by logging in
login_data = {
    'username': username,
    'password': password
}

try:
    # Make a POST request to the login endpoint to get the JWT token
    login_response = requests.post(login_url, json=login_data)
    
    if login_response.status_code == 200:
        token = login_response.json().get('token')
        if token:
            print(f"Successfully logged in. JWT Token: {token}")
        else:
            print("Error: JWT token not found in login response.")
            exit()
    else:
        print(f"Login failed with status code: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        exit()

except requests.exceptions.RequestException as e:
    print(f"An error occurred during login: {e}")
    exit()

# Step 2: Use the token to access the protected route
headers = {
    'Authorization': f'Bearer {token}'
}

try:
    response = requests.get(protected_route_url, headers=headers)
    
    if response.status_code == 200:
        print(f"Protected route response: {response.json()}")
    else:
        print(f"Failed to access protected route. Status code: {response.status_code}")
        print(f"Response: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"An error occurred while accessing the protected route: {e}")
