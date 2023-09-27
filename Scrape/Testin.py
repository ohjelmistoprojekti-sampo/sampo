from urllib.request import urlopen


if __name__ == "__main__":
    url = "https://www.huuto.net/"

    page = urlopen(url)

    page

    html_bytes = page.read()
    html = html_bytes.decode("utf-8")

    print(html)