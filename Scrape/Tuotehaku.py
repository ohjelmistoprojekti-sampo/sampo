import requests
from bs4 import BeautifulSoup



if __name__ == "__main__":
    
    # Take user input for the search term
    search_term = input("Tuottee nimi: ")

    # Construct the URL with the user's input
    URL = f"https://www.huuto.net/haku?words={search_term}&area="

    page = requests.get(URL)

    soup = BeautifulSoup(page.content, "html.parser")


    results = soup.find(id="search-container")

   
    hinta_lista = []
    nimi_lista = []
    kunto_lista = []

    job_elements = results.find_all("div", class_="item-card__title")
    hinta = results.find_all("div", class_="item-card__price item-card__price--buynow")
    nimi = results.find_all("div",class_="item-card__title")
    kunto = results.find_all("div", class_="item-card__condition")
    pairs = []

# Assuming you have parsed the HTML and have BeautifulSoup objects hinta and nimi
for hinta_elem, nimi_elem, kunto_elem in zip(hinta, nimi, kunto):
    hinta_str = hinta_elem.get_text().replace(" ", "").replace("\n", "")
    nimi_str = nimi_elem.get_text().strip()
    kunto_str = kunto_elem.get_text().replace(" ", "").replace("\n", "")

    
    # Create a pair and append it to the list
    pair = [nimi_str, hinta_str, kunto_str]
    pairs.append(pair)

# Print the list of pairs
for pair in pairs:
    print("Nimi:", pair[0])
    print("Hinta:", pair[1])
    print("Kunto", pair[2])
    print()

print("")
    