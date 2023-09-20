import requests
from bs4 import BeautifulSoup
import json

if __name__ == "__main__":
    # Take user input for the search term
    search_term = input("Tuottee nimi: ")

    # Construct the URL with the user's input
    URL = f"https://www.huuto.net/haku/words/{search_term}"

    page = requests.get(URL)

    soup = BeautifulSoup(page.content, "html.parser")

    results = soup.find(id="search-container")

    hinta_lista = []
    nimi_lista = []
    kunto_lista = []

    job_elements = results.find_all("div", class_="item-card__title")
    hinta = results.find_all("div", class_="item-card__price item-card__price--buynow")
    nimi = results.find_all("div", class_="item-card__title")
    kunto = results.find_all("div", class_="item-card__condition")
    
    data_list = []  # Create a list to store dictionaries for each item

    for hinta_elem, nimi_elem, kunto_elem in zip(hinta, nimi, kunto):
        hinta_str = hinta_elem.get_text().replace(" ", "").replace("\n", "")
        nimi_str = nimi_elem.get_text().strip()
        kunto_str = kunto_elem.get_text().replace(" ", "").replace("\n", "")

        # Create a dictionary for each item
        item_data = {
            "Nimi": nimi_str,
            "Hinta": hinta_str,
            "Kunto": kunto_str
        }
        
        # Append the dictionary to the list
        data_list.append(item_data)

    # Convert the list of dictionaries to JSON format
    #json_data = json.dumps(data_list, indent=4)

    # Print the JSON data (you can also save it to a file if needed)
    print(data_list)
