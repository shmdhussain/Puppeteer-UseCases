var selectorsToTest = [{
        // refSelector:  ".image-list .sna-content-list-block .sna-content-list-block-item .sna-content-list-block-item-long .h5",
        pageIndex: 31, //videolist page
        refSelector: ".image-list .sna-content-list:first-child .sna-content-list-item:first-child .h5",
        refDevices: ["mobile"],
        testSelector: ".image-list .sna-content-list:first-child .first-group-right .sna-content-list-item:first-child .h5",
        testDevices: ["mobile"],
        propertiesToTest: [
            "font-size",
            "margin-top",
            "margin-bottom",
            "margin-left",
            "margin-right",
            "padding-top",
            "padding-bottom",
            "padding-left",
            "padding-right",
            "height",
            "width"
        ]
    }

];

exports.selectorsToTest = selectorsToTest;