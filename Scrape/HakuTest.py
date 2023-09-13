import mechanicalsoup



if __name__ == "__main__":
# 1
    browser = mechanicalsoup.Browser()
    url = "https://www.huuto.net/"
    front_page = browser.get(url)
    frontpage_html = front_page.soup

# 2
    form = frontpage_html.select("form")[0]
    form.select("input")[0]["value"] = "tuoli"


# 3
    profiles_page = browser.submit(form, front_page.url)