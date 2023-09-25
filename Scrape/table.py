import requests
from bs4 import BeautifulSoup

if __name__ == "__main__":
    url = 'https://www.tori.fi/pohjois-pohjanmaa/Iittala_Aalto_maljakko__Kupari_160cm_118575806.htm?ca=18&w=3'

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
