import mechanicalsoup

if __name__ == "__main__":
    
    browser = mechanicalsoup.Browser()
    url = "https://www.huuto.net/"
    page = browser.get(url)
    page_html = page.soup
    
    form = page_html.select("input")[0]
    form.select("input")[0] = "tuoli"
    
    search_page = browser.submit(form, page_html.url)