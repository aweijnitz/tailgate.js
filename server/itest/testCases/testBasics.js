casper.test.begin('Client can tail a file', 2, function suite(test) {
    casper.start("http://localhost:3001/test0.html", function() {
        test.assertTitle("Test-0", "Page title is the one expected");
        test.assertExists('form[id="fileName"]', "fileName form is found");
        this.fillSelectors('form[id="fileName"]', {
            'input#tailFile': 'casperjs'
        }, true);
    });

    casper.then(function() {
        /*
        test.assertTitle("casperjs - Recherche Google", "google title is ok");
        test.assertUrlMatch(/q=casperjs/, "search term has been submitted");
        test.assertEval(function() {
            return __utils__.findAll("h3.r").length >= 10;
        }, "google search for \"casperjs\" retrieves 10 or more results");
        */
    });

    casper.run(function() {
        test.done();
    });
});