import requests
import time
import sys

def check_api():
    url = "http://localhost:8000/"
    max_retries = 5
    for i in range(max_retries):
        try:
            print(f"Attempt {i+1}: Checking API status at {url}...")
            response = requests.get(url)
            if response.status_code == 200:
                print(f"✅ API is working! Status Code: {response.status_code}")
                print(f"Response: {response.json()}")
                return True
            else:
                print(f"⚠️ API returned status code: {response.status_code}")
        except requests.exceptions.ConnectionError:
            print("❌ Connection refused. Server might still be starting...")
        
        time.sleep(2)
    
    print("❌ API check failed after multiple attempts.")
    return False

if __name__ == "__main__":
    if check_api():
        sys.exit(0)
    else:
        sys.exit(1)
