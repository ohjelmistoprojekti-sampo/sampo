
from bs4 import BeautifulSoup
   
    
if __name__ == "__main__":
    URL_INPUT= 'https://www.huuto.net/'
    bs=BeautifulSoup(show_html(URL_INPUT),'html.parse')
    search = bs.find_all('input')
    for result in search: 
        print(result, '\n')
        input_value=result.get('value')
        print(input_value, '\n')






