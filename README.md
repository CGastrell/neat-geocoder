Neat Geocoder

----------------

## The Setup
You'll need `yarn` installed and working. Obviously this requires a `node`
version (at the time of this README) 8+, Google can help you getting up and
running with these two.

A little knowledge on React is also a must.

## The instructions

Clone the repo, run it locally:
```
git clone https://github.com/cgastrell/neat-geocoder
cd neat-geocoder
yarn install
yarn start
```

By default the app should be running on http://localhost:3000

Use the _redish_ cloud button to open an Excel file. The app will:
  1. read only the first sheet of your workbook (xls[x])
  2. use the first row as column names
  3. look for an `address` column
  4. add (if not existing) 2 columns: `lat` and `lon`
  5. show a table with columns:
     1. numbered row starting at 1 (column header's row doesn't count)
     2. original `address` column
     3. empty/existing `lat` column
     4. empty/existing `lon` column

If everything goes well you should be able to click on each row _location_ icon
to perform a geocoding request.

**Note:** if geocoding request succeeds, only the first result is used.

If you want to perform a bulk geocode (geocode all the entries in the table)
you'll need to provide a valid Google Maps API key on the app bar and save it
using the _disk_ icon. Once you do this the app will store the API key on
you localStorage and will pick it up every time it is ran. Save an empty key to
_delete_ it the stored key.

Finally you can export the resulting table back to a .xlsx file. Just click on
_save_ icon on top of the table. The file will be saved with a `_geocoded` suffix.

Have fun.

### Custom region

The app is defaulted to work on Argentina (AR) region, to use a different one
just edit `index.js`:
```
// add region prop
ReactDOM.render(<App region="us" />, document.getElementById('root'));
```

### Test on the cloud
You'll use whatever method you choose, I usually use AWS S3 service or [now][7]
for quick deployments.

Anyway, you'll need to build the project:
```
yarn build
```

And upload/deploy the resulting app:
```
# I can't recall the aws-cli command,
# you can use the AWS web interface for this
# or use now:
yarn build
cd build
now --static --public
```

**Note**: if `now` rejects the deploy because of large file sizes,
delete the `.map` files on both `build/static/js` and `build/static/css`
and try again.

### Preview
![image](https://user-images.githubusercontent.com/157240/43226534-8c8966ae-9032-11e8-9580-79381b0202e7.png)

## The Story
No matter your seniority, nor the seniority of your project manager, if you
are in any project where you have some sort of:

  - geodb
  - geographic coordinates
  - a map
  - anything mapable

the client will, eventually, reveal the necessity of a geocoding process.
Because, you know, life sucks, all the users/partners/employees use
excel sheets for that.

The request will seem vaguely easy at first glance. However, you'll start
to notice some pesky little details on the client request, something like:

> Well our _databases_ are full of addresses which we need to place on a map.

translates to some user story:

> The user needs to _geolocate_ database addresses.

## The Lie
After the first iteration with the client ends, the request looks more like this:

> Our employees have a bunch of .xls/.xlsx/.csv files with addresses, they don't
even know what a database is, but as Excel shows rows and columns they call it
a _database_.

finally translating into a whole new _user story_:

> The user uses an app which can **open** an Excel file, use the
**address** column to **geolocate** against a service, append/fill 2 new/existing
**lat** & **lon** columns, show a map for visual verification and **export** the
result to a new **xlsx file**.

## The Truth
I won't give you a _fit all solution_, but this will work as a starting point,
a PoC you can quickly deliver after that enlightening first iteration.

The app is built upon [Create React App][1], it is **the most basic** geocoding
app I could think of. It doesn't even use Redux, it is a cascaded props layout
based on [Material-UI][2], uses [Leaflet][5] with [OpenStreetMap][6] for mapping
via [react-leaflet][4]. [SheetJS][3] is used for Excel file manipulations.

With the new Google Maps API fee increase no one will be able to do geocoding
for free anymore, at least not as bulky as before. You'll find an input on the
app top bar to enter an API key for bulk purposes, but you can request individual
key-less geocoding for your entries, keep an eye on the console for Google
rejections.

Geocoding region is defaulted to Argentina (AR), buy you can tweak it to your needs.

The overall _responsiveness_ could be improved, it doesn't play well under 900px wide.

------------------

Any instruction on the original readme is applicable here:

> This project was bootstrapped with [Create React App][1].

[1]: https://github.com/facebookincubator/create-react-app
[2]: https://material-ui.com
[3]: https://github.com/SheetJS/js-xlsx
[4]: https://github.com/PaulLeCam/react-leaflet
[5]: https://leafletjs.com/
[6]: https://www.openstreetmap.org/#map=4/-40.44/-63.59
[7]: https://zeit.co/now
