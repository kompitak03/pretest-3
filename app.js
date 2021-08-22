const http = require("http");
const cheerio = require("cheerio");

var myArgs = process.argv.slice(2);

const options = {
  host: "codequiz.azurewebsites.net",
  headers: { Cookie: "hasCookie=true" },
};

http.get(options, function (http_res) {
  // initialize the container for our data
  var data = "";

  // this event fires many times, each time collecting another piece of the response
  http_res.on("data", function (chunk) {
    // append this chunk to our growing `data` var
    data += chunk;
  });

  // this event fires *one* time, after all the `data` events/chunks have been gathered
  http_res.on("end", function () {
    // you can use res.send instead of console.log to output via express
    mock = [];
    const $ = cheerio.load(data);
    $("body > table > tbody > tr").each((index, element) => {
      if (index === 0) return true;
      const tds = $(element).find("td");
      const fundName = $(tds[0]).text().trim();
      const nav = $(tds[1]).text().trim();
      const bid = $(tds[2]).text().trim();
      const offer = $(tds[3]).text().trim();
      const change = $(tds[3]).text().trim();
      const tableRow = { fundName, nav, bid, offer, change };
      mock.push(tableRow);
    });
    let findData = mock.find((res) => res.fundName === myArgs[0]);
    if (findData) {
      console.log(findData.nav);
    }
  });
});
