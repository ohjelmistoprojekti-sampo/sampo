import requests
from bs4 import BeautifulSoup
import re



def kunto(linkki):
    url = linkki
    print(linkki)

    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')

    kunto_value = None

    # Find the "Kunto:" topic and its value in the table
    topic_elem = soup.find('td', class_='topic', string='Kunto:')
    if topic_elem:
        value_elem = topic_elem.find_next('td', class_='value')
        if value_elem:
            kunto_value = value_elem.get_text().strip()
    print(kunto_value)

    return(kunto_value)
    

if __name__ == "__main__":
    search_term = input("Tuotteen nimi: ")

    # Construct the URL with the user's input
    url = f'https://www.tori.fi/koko_suomi?q={search_term}&cg=0&w=3'
    page = requests.get(url)

    # Check if the request was successful
    if page.status_code == 200:
        # Parse the HTML content of the page
        soup = BeautifulSoup(page.content, 'html.parser')
    else:
        print(f"Failed to retrieve the page. Status code: {page.status_code}")
        exit()

    results = soup.find(id="blocket")
    results2 = soup.find(class_="list_mode_thumb")

    hinta = results.find_all("p", class_="list_price ineuros")
    nimi = results.find_all("div", class_="li-title")
    linkki = results2.find_all("a", href=True)  # Find all anchor elements with href attribute

    href_match = re.findall(r'href="([^"]+)"', str(linkki))

    data_list = []

    for hinta_elem, nimi_elem, linkki_elem in zip(hinta, nimi, href_match):
        hinta_str = hinta_elem.get_text().replace(" ", "").replace("\n", "")
        nimi_str = nimi_elem.get_text().strip()
        linkki_str = linkki_elem.strip()
        print(linkki_str)

        kuntoS=kunto(linkki_str)

        item_data = {
                "Nimi": nimi_str,
                "Hinta": hinta_str,
                "Kunto": kuntoS
            }

        data_list.append(item_data)

       

    print(data_list)


