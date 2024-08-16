from dotenv import load_dotenv
import os
load_dotenv()

# Fetch sensitive data from environment variables
url = os.getenv('PROTECTED_ROUTE_URL')
login_url = os.getenv('LOGIN_URL')
credentials = {
    'username': os.getenv('USERNAME'),  # Username from environment variable
    'password': os.getenv('PASSWORD')   # Password from environment variabl
}

# If you have a token directly:
token = os.getenv('JWT_TOKEN')  # JWT token from environment variable
