# My Shortener

url shortener, to short urls.

My Shortener on repl.it:

[`My Repl.it Shortener`](https://repl.it/)

## post route:

### '/api/shorturl/new'

    creates a short url for the url sent in the body.
    The body should include a json with url property. The url must be available and valid url:
    {"url": "http://www.besturlever.com"}

## get routes:

### "/"

      gets the website.

### "/:shortUrl"

      redirects to the url registered with this shorturl:
      "/993a82e" will redirect you to "http://www.besturlever.com".

### '/api/statistic/:shorturl-id'

      gets a json with the statistics of the url including creation time, original url, shortened url, and a counter for shortened url use.
