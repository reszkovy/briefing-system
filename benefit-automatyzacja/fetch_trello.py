import json, os, urllib.request, urllib.parse, datetime, sys

ENV = "/Users/reszek/Desktop/Claude_zadania/Narzedzie do briefowania/briefsync/.env"
creds = {}
for line in open(ENV):
    if "=" in line:
        k, v = line.strip().split("=", 1)
        creds[k] = v
KEY, TOKEN = creds["TRELLO_KEY"], creds["TRELLO_TOKEN"]
OUT = os.path.dirname(os.path.abspath(__file__))

def api(path, **params):
    params.update(key=KEY, token=TOKEN)
    url = "https://api.trello.com/1/" + path + "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url) as r:
        return json.load(r)

boards = {"obsluga": "664c4a37c17667a4c9907f7f", "otwarcia": "YddwrLqb"}
data = {}
for label, bid in boards.items():
    b = api(f"boards/{bid}", fields="name,shortLink,id")
    lists = api(f"boards/{bid}/lists", fields="name,id", filter="all")
    cards = api(f"boards/{bid}/cards", fields="name,idList,dateLastActivity,labels,closed",
                customFieldItems="true", filter="all")
    cf = api(f"boards/{bid}/customFields")
    data[label] = {"board": b, "lists": lists, "cards": cards, "customFields": cf}
    print(label, b["name"], "lists:", len(lists), "cards:", len(cards))

json.dump(data, open(os.path.join(OUT, "raw.json"), "w"), ensure_ascii=False)
print("saved ->", os.path.join(OUT, "raw.json"))
