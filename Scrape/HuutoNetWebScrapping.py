import requests
from bs4 import BeautifulSoup

# Function to perform a search on www.huuto.net
def huuto_net_search(search_query):
    # Define the URL of the website
    base_url = "https://www.huuto.net/"

    # Send a GET request to the website
    response = requests.get(base_url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content of the page
        soup = BeautifulSoup(response.content, "html.parser")

        # Find the search input field by name
        search_input = soup.find("input", {"name": "words"})

        # Check if the search input field was found
        if search_input:
            # Set the value of the search input field to the search query
            search_input["value"] = search_query

            # Find the search form and submit it
            search_form = soup.find("form", {"id": "search-form"})
            if search_form:
                response = requests.post(base_url, data=search_form.serialize())

                # Check if the search was successful
                if response.status_code == 200:
                    print("Search was successful.")
                else:
                    print("Search failed.")
            else:
                print("Search form not found.")
        else:
            print("Search input field not found.")
    else:
        print("Failed to access www.huuto.net")

if __name__ == "__main__":
    search_query = input("Enter your search query: ")
    huuto_net_search(search_query)
