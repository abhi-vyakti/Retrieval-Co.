import urllib.request, urllib.parse, json, re

def search_ddg(query):
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    return re.findall(r'src=\"//external-content\.duckduckgo\.com/iu/\?u=([^&]+)&', html)

urls = search_ddg('Casio fx-991ES PLUS 2nd edition product')
print('Casio:', urllib.parse.unquote(urls[0]) if urls else 'none')

urls2 = search_ddg('OnePlus Buds white')
print('OnePlus:', urllib.parse.unquote(urls2[0]) if urls2 else 'none')
