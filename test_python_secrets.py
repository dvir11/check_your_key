#!/usr/bin/env python3
# Test file for Python security checking

# Using sensitive variables directly (security issues)
privateKey = "this-is-a-private-key"
apiKey = "this-is-an-api-key"
password = "super-secret-password"

class SecretManager:
    def __init__(self):
        # More sensitive variables
        self.secretKey = "this-is-a-secret-key"
        self.token = "this-is-a-token"
        self.debugMode = True
    
    def get_credentials(self):
        # Using sensitive variables
        return {
            "api_key": apiKey,
            "private_key": privateKey,
            "secret_key": self.secretKey,
            "token": self.token
        }

def connect_to_api():
    # Using sensitive variables in a function
    auth = {
        "password": password,
        "debug": debugMode
    }
    return auth

# This would be the secure way to do it:
# import os
# api_key = os.environ.get('API_KEY')
# private_key = os.environ.get('PRIVATE_KEY')

if __name__ == "__main__":
    manager = SecretManager()
    credentials = manager.get_credentials()
    print(f"Using API key: {apiKey}")
    print(f"Debug mode: {debugMode}") 