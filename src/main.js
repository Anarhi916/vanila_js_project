/**
 * Accepts an array of stores from the server
 */
let Stores;
/**
 * Accepts an array of goods of current store from the server
 */
let choosenStore;
/**
 * Accepts an array of goods after filtering
 */
let filteredGoodsForSort;
/**
 * Accepts an array of goods, that now is showed in goods list
 */
let actualArrayOfGoods;
/**
 * Shows, is sorting of goods active now and it condition
 */
let switchSort = 0;
/**
 * Accepts an actual currency
 */
let currency = "USD";
/**
 * Accepts which kind of sorting is active now
 */
let activeSort = null;
/**
 * Shows, is filtering of goods active now
 */
let isActiveFilter = false;
/**
 * Shows id of current store
 */
let currentStoreId;
/**
 * Shows, is input fields relevant now
 */
let isOk = true;
/**
 * Shows, is editing of goods active now
 */
let editGoods = false;
/**
 * Accepts url to edit goods
 */
let urlEditGoods;

/**
 * Model class. Knows everything about API endpoint and data structure. Can format/map data to any structure.
 *
 * @constructor
 */
function Model() {
    /**
     * Accepts url to get stores from server
     */
    let urlStoresList = "http://localhost:3000/api/Stores";

    /**
     *Load array of stores from server
     *
     * @returns {Promise} the promise object will be resolved once the Stores object gets loaded.
     * @public
     */
    this.getStoresFromServer = () => {
        return new Promise((resolve, reject) => {
            this.fetchGetData(urlStoresList, "getStores").then(() => resolve());
        });
    };

    /**
     *Fetch the data about stores and goods by url and writes it in variables depending on the mode
     *
     * @param {string} url url of server
     * @param {string} mode string, indicates  expecting data
     * @returns  {Promise} the promise object will be resolved once the data gets loaded.
     *
     * @privat
     */
    this.fetchGetData = (url, mode) => {
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (mode === "getStores") {
                    Stores = data;
                } else if (mode === "getGoods") {
                    choosenStore = data;
                    actualArrayOfGoods = choosenStore;
                }
            })
            .catch((error) => {
                throw new Error("Catch error: " + error);
            });
    };

    /**
     *Load array of goods by id from server
     *
     * @returns {Promise} the promise object will be resolved once the goods gets loaded.
     *
     * @param {string} id id of current store
     *
     * @public
     */
    this.getGoodsFromServer = (id) => {
        return new Promise((resolve) => {
            let url = `http://localhost:3000/api/Stores/${id}/rel_Products`;
            this.fetchGetData(url, "getGoods").then(() => resolve());
        });
    };

    /**
     * Sorting goods list
     * @param {HTMLElement} sortButton HTML element of sort button
     * @param {Object} filteredData object with filtered list of goods
     *
     * @returns Array of filtered goods
     *
     * @public
     */
    this.sortGoodsList = (sortButton, filteredData) => {
        let sortedGoods = actualArrayOfGoods.map((item) => item);
        if (filteredData) {
            sortedGoods = filteredData;
        }
        if (isActiveFilter) {
            sortedGoods = filteredGoodsForSort;
        }

        if (sortButton.className.search("name") != -1) {
            sortedGoods.sort(function (a, b) {
                let nameA = a.Name.toLowerCase();
                let nameB = b.Name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            activeSort = "name";
        } else if (sortButton.className.search("price") != -1) {
            sortedGoods.sort(function (a, b) {
                let nameA = a.Price;
                let nameB = b.Price;
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            activeSort = "price";
        } else if (sortButton.className.search("specs") != -1) {
            sortedGoods.sort(function (a, b) {
                let nameA = a.Specs.toLowerCase();
                let nameB = b.Specs.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            activeSort = "specs";
        } else if (sortButton.className.search("supplierinfo") != -1) {
            sortedGoods.sort(function (a, b) {
                let nameA = a.SupplierInfo.toLowerCase();
                let nameB = b.SupplierInfo.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            activeSort = "supplierinfo";
        } else if (sortButton.className.search("origin") != -1) {
            sortedGoods.sort(function (a, b) {
                let nameA = a.MadeIn.toLowerCase();
                let nameB = b.MadeIn.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            activeSort = "origin";
        } else if (sortButton.className.search("company") != -1) {
            sortedGoods.sort(function (a, b) {
                let nameA = a.ProductionCompanyName.toLowerCase();
                let nameB = b.ProductionCompanyName.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            activeSort = "company";
        } else if (sortButton.className.search("rating") != -1) {
            sortedGoods.sort(function (a, b) {
                let nameA = a.Rating;
                let nameB = b.Rating;
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            activeSort = "rating";
        }
        return sortedGoods;
    };

    /**
     * Does a searching in store list
     *
     * @param {String} input string from search input
     * @param {Object} data array of stores or goods
     * @param {String} mode string, indicating where need to search
     *
     * @returns {Object} Array of found stores
     *
     * @public
     */
    this.foundItem = (input, data, mode) => {
        let foundedItems;
        if (mode === "stores") {
            foundedItems = data.filter(
                (item) =>
                    item.FloorArea.toString().toLowerCase().search(input) !=
                        -1 ||
                    item.Name.toString().toLowerCase().search(input) != -1 ||
                    item.Address.toString().toLowerCase().search(input) != -1
            );
        } else if (mode === "goods") {
            foundedItems = data.filter(
                (goods) =>
                    goods.Name.toString().toLowerCase().search(input) != -1 ||
                    goods.Price.toString().toLowerCase().search(input) != -1 ||
                    goods.Specs.toString().toLowerCase().search(input) != -1 ||
                    goods.SupplierInfo.toString().toLowerCase().search(input) !=
                        -1 ||
                    goods.MadeIn.toString().toLowerCase().search(input) != -1 ||
                    goods.ProductionCompanyName.toString()
                        .toLowerCase()
                        .search(input) != -1
            );
            actualArrayOfGoods = foundedItems;
        }
        return foundedItems;
    };

    /**
     * Filter goods list depending on status in stock
     *
     * @param {HTMLElement} elem HTML element of clicked filter
     *
     * @returns {Object} array of filtered goods
     *
     * @public
     */
    this.filterGoods = (elem) => {
        let data;
        if (elem.className.search("js-is-in-stock") != -1) {
            data = actualArrayOfGoods.filter((goods) => {
                if (goods.Status === "OK") {
                    return true;
                }
            });
        } else if (elem.className.search("js-storage") != -1) {
            data = actualArrayOfGoods.filter((goods) => {
                if (goods.Status === "STORAGE") {
                    return true;
                }
            });
        } else if (elem.className.search("js-no-in-stock") != -1) {
            data = actualArrayOfGoods.filter((goods) => {
                if (goods.Status === "OUT_OF_STOCK") {
                    return true;
                }
            });
        }
        return data;
    };

    /**
     * Post a new store to the server
     *
     *
     * @param {Object} data object with new store info
     *
     * @returns {Promise} the promise object will be resolved once the new store gets posted.
     *
     * @public
     */
    this.postNewStore = (data) => {
        return new Promise((resolve, reject) => {
            this.fetchPostData(urlStoresList, data).then(() => resolve());
        });
    };

    /**
     * Post a new product to the server
     *
     *
     * @param {Object} data object with new product info
     *
     * @returns {Promise} the promise object will be resolved once the new product gets posted.
     *
     * @public
     */
    this.postNewGoods = (data) => {
        let url = `http://localhost:3000/api/Stores/${currentStoreId}/rel_Products`;
        return new Promise((resolve, reject) => {
            this.fetchPostData(url, data).then(() => resolve());
        });
    };

    /**
     * Post edition of product to the server
     *
     *
     * @param {Object} data object with edited info about product
     *
     * @returns {Promise} the promise object will be resolved once the product edition gets posted.
     *
     * @public
     */
    this.editGoods = (data) => {
        return new Promise((resolve, reject) => {
            this.fetchPutData(urlEditGoods, data).then(() => resolve());
        });
    };

    /**
     *Post the data about stores and goods to the server
     *
     * @param {String} url url of server
     * @param {Object} data object with posting data
     *
     * @returns  {Promise} the promise object will be resolved once the data gets posted.
     *
     * @private
     */
    this.fetchPostData = (url, data) => {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .catch((error) => {
                throw new Error("Catch error: " + error);
            });
    };

    /**
     *Post the data about editions in products to the server
     *
     * @param {String} url url of server
     * @param {Object} data object with posting data
     *
     * @returns  {Promise} the promise object will be resolved once the data gets posted.
     *
     * @private
     */
    this.fetchPutData = (url, data) => {
        return fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .catch((error) => {
                throw new Error("Catch error: " + error);
            });
    };

    /**
     *Delete the item from the server
     *
     * @param {String} url url of server
     *
     * @returns  {Promise} the promise object will be resolved once the item deleted from server
     *
     * @private
     */
    this.fetchDeleteItem = (url) => {
        return fetch(url, {
            method: "DELETE",
        }).catch((error) => {
            throw new Error("Catch error: " + error);
        });
    };

    /**
     * Gets a data of current product by id of product
     *
     * @param {String} id product id
     *
     * @returns {Object} a data of current product in current store
     */
    this.getProductInfo = (id) => {
        let product = choosenStore.find(
            (goods) => goods.id.toString().search(id) !== -1
        );
        return product;
    };
}

/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
function View() {
    /**
     * Class name of the store item DOM element'
     * @constant
     * @type {string}
     */
    this.storeItemClassName = "stores__item";

    /**
     * Class name of "sort" button DOM element'
     * @constant
     * @type {string}
     */
    this.sortButtonClassName = "goods__button-filter";
    /**
     * Contein a HTML element of table denomination with goods
     *
     * @type {HTMLElement}
     */
    this.goodsDenomination = document.getElementById("tableHeading");
    /**
     * Contein a HTML element of button "search among stores"
     *
     * @type {HTMLElement}
     */
    this.buttonSearch = document.getElementById("buttonSearch");

    /**
     * Contein a HTML element of button reset "search among stores"
     *
     * @type {HTMLElement}
     */
    this.buttonResetSearch = document.getElementById("buttonResetSearch");
    /**
     * Contein a HTML element of button "search among goods"
     *
     * @type {HTMLElement}
     */
    this.buttonGoodsSearch = document.getElementById("buttonGoodsSearch");

    /**
     * Contein a HTML element of button reset "search among goods"
     *
     * @type {HTMLElement}
     */
    this.buttonGoodsResetSearch = document.getElementById(
        "buttonGoodsResetSearch"
    );

    /**
     * Contein a HTML element of button in left footer "create new store"
     *
     * @type {HTMLElement}
     */
    this.buttonCreateStore = document.getElementById("buttonCreateStore");

    /**
     * Contein a HTML element of button in right footer "create new product"
     *
     * @type {HTMLElement}
     */
    this.buttonCreateGoods = document.getElementById("buttonCreateGoods");

    /**
     * Contein a HTML element of button in right footer "delete current store"
     *
     * @type {HTMLElement}
     */
    this.buttonDeleteStore = document.getElementById("buttonDeleteStore");

    /**
     * Contein a HTML element of button  "cancel" from form creating new store
     *
     * @type {HTMLElement}
     */
    this.buttonCancelFormStore = document.getElementById(
        "buttonCancelFormStore"
    );

    /**
     * Contein a HTML element of button  "cancel" from form creating new product
     *
     * @type {HTMLElement}
     */
    this.buttonCancelFormGoods = document.getElementById(
        "buttonCancelFormGoods"
    );

    /**
     * Contein a HTML element of button  "create" in form creating new store
     *
     * @type {HTMLElement}
     */
    this.buttonSubmitFormStore = document.getElementById(
        "buttonSubmitFormStore"
    );

    /**
     * Contein a HTML element of button  "create" in form creating new product
     *
     * @type {HTMLElement}
     */
    this.buttonSubmitFormGoods = document.getElementById(
        "buttonSubmitFormGoods"
    );

    /**
     * Contein a HTML element of section with filters in goods
     *
     * @type {HTMLElement}
     */
    this.infoBar = document.getElementById("infoBar");

    /**
     * Contein a HTMLCollection of filter items in goods
     *
     * @type {HTMLCollection}
     */
    this.filterUnderline = document.getElementsByClassName("info-bar__item");

    /**
     * Contein a HTML element of section with form creating new store
     *
     * @type {HTMLElement}
     */
    this.formStore = document.getElementById("formStore");

    /**
     * Contein a HTML element of section with form creating new product
     *
     * @type {HTMLElement}
     */
    this.formGoods = document.getElementById("formGoods");

    /**
     * Contein a HTML element of heading form creating new product
     *
     * @type {HTMLElement}
     */
    this.headingFormGoods = document.getElementById("headerFormGoods");

    /**
     * Contein a HTMLFormElement of form creating new store
     *
     * @type {HTMLFormElement}
     */
    this.formStoreBlanck = document.getElementById("formStoreBlanck");

    /**
     * Contein a HTMLFormElement of form creating new product
     *
     * @type {HTMLFormElement}
     */
    this.formGoodsBlanck = document.getElementById("formGoodsBlanck");

    /**
     * Contein a HTML element of dark mask to hide elements under the forms
     *
     * @type {HTMLElement}
     */
    this.darkMasck = document.getElementById("darkMasck");

    /**
     * Contein a HTML element of input searching among store
     *
     * @type {HTMLElement}
     */
    this.inputSearchStore = document.getElementById("inputSearchStore");

    /**
     * Contein a HTML element of input searching among goods
     *
     * @type {HTMLElement}
     */
    this.inputSearchGoods = document.getElementById("inputSearchGoods");

    /**
     * Contein a HTML element of input field name in form creating new store
     *
     * @type {HTMLElement}
     */
    this.inputStoresFormName = document.getElementById("inputStoresFormName");

    /**
     * Contein a HTML element of input field email in form creating new store
     *
     * @type {HTMLElement}
     */
    this.inputStoresFormEmail = document.getElementById("inputStoresFormEmail");

    /**
     * Contein a HTML element of input field phone in form creating new store
     *
     * @type {HTMLElement}
     */
    this.inputStoresFormPhone = document.getElementById("inputStoresFormPhone");

    /**
     * Contein a HTML element of input field address in form creating new store
     *
     * @type {HTMLElement}
     */
    this.inputStoresFormAddress = document.getElementById(
        "inputStoresFormAddress"
    );

    /**
     * Contein a HTML element of input field established date in form creating new store
     *
     * @type {HTMLElement}
     */
    this.inputStoresFormDate = document.getElementById("inputStoresFormDate");

    /**
     * Contein a HTML element of input field floor area in form creating new store
     *
     * @type {HTMLElement}
     */
    this.inputStoresFormArea = document.getElementById("inputStoresFormArea");

    /**
     * Contein a HTML element of input field name in form creating new product
     *
     * @type {HTMLElement}
     */
    this.inputGoodsFormName = document.getElementById("inputGoodsFormName");

    /**
     * Contein a HTML element of input field price in form creating new product
     *
     * @type {HTMLElement}
     */
    this.inputGoodsFormPrice = document.getElementById("inputGoodsFormPrice");

    /**
     * Contein a HTML element of input field specs in form creating new product
     *
     * @type {HTMLElement}
     */
    this.inputGoodsFormSpecs = document.getElementById("inputGoodsFormSpecs");

    /**
     * Contein a HTML element of input field rating in form creating new product
     *
     * @type {HTMLElement}
     */
    this.inputGoodsFormRating = document.getElementById("inputGoodsFormRating");

    /**
     * Contein a HTML element of input field supplier info in form creating new product
     *
     * @type {HTMLElement}
     */
    this.inputGoodsFormSupplier = document.getElementById(
        "inputGoodsFormSupplier"
    );

    /**
     * Contein a HTML element of input field "made in" in form creating new product
     *
     * @type {HTMLElement}
     */
    this.inputGoodsFormOrigin = document.getElementById("inputGoodsFormOrigin");

    /**
     * Contein a HTML element of input field product company in form creating new product
     *
     * @type {HTMLElement}
     */
    this.inputGoodsFormCompany = document.getElementById(
        "inputGoodsFormCompany"
    );

    /**
     * Contein a HTML element of input field status in form creating new product
     *
     * @type {HTMLElement}
     */
    this.inputGoodsFormStatus = document.getElementById("inputGoodsFormStatus");

    /**
     * Contein a HTML element of table with goods
     *
     * @type {HTMLElement}
     */
    this.goodsTable = document.getElementById("goodsTable");

    /**
     * Contein a HTML element of emty goods part
     *
     * @type {HTMLElement}
     */
    let emptyList = document.getElementById("emptyGoodsList");

    /**
     * Contein a HTML element of section wiht goods table and header with filters and contact info
     *
     * @type {HTMLElement}
     */
    let filledList = document.getElementById("filledGoodsList");

    /**
     * Contein a HTML element of right footer
     *
     * @type {HTMLElement}
     */
    let rightFooter = document.getElementById("rightFooter");

    /**
     * Get a HTML element loader spin in section with stores list
     *
     * @returns {HTMLElement} with loader
     */
    this.getLoaderSpinStores = function () {
        return document.getElementById("loaderStores");
    };

    /**
     * Get a HTML element loader spin in section with goods list
     *
     * @returns {HTMLElement} HTMLElement with loader
     */
    this.getLoaderSpinGoods = function () {
        return document.getElementById("loaderGoods");
    };

    /**
     * Get a HTML element wrapper of stores list
     *
     * @returns {HTMLElement} HTMLElement with wrapper of stores list
     */
    this.getStoreList = () => {
        return document.getElementById("storesWrapper");
    };

    /**
     * Get a HTML collection with sort buttons
     * @returns {HTMLCollection} HTML collection with sort buttons
     */
    this.getSortButtons = () => {
        return document.querySelectorAll(".goods__button-filter");
    };

    /**
     * Shows hiden elem on page
     * @param {HTMLElement} elem HTML element which need to show
     *
     * @public
     */
    this.showElem = function (elem) {
        elem.style.display = "block";
    };

    /**
     * Hide elem on page
     * @param {HTMLElement} elem HTML element which need to hide
     *
     * @public
     */
    this.hideElem = function (elem) {
        elem.style.display = "none";
    };

    /**
     * Render list of stores on page and change background of a specific store by id, if specified
     *
     * @param {Object} storesArray array of stores
     * @param {String} selectionId id of selected store
     *
     * @public
     */
    this.createStoresList = (storesArray, selectionId) => {
        storesArray.forEach((item) => {
            let storeItem = document.createElement("div");
            storeItem.className = "stores__item";
            storeItem.dataset.id = item["id"];
            if (selectionId == item["id"]) {
                storeItem.style.backgroundColor = "#ebebeb";
            }
            this.getStoreList().append(storeItem);
            storeItem.innerHTML = `<div class="stores__column-left">
                <p class="stores__name">${item.Name}</p>
                <p class="stores__adress">${item.Address}</p>
            </div>
            <div class="stores__column-right">
                <p class="stores__area">${item.FloorArea}</p>
                <p class="stores__unit">sq.m</p>
            </div>`;
        });
    };

    /**
     * Delete from page list of goods, shows right footer, and clear background of stores items if it specified in param
     *
     * @param {String} forWhat sting indicated of needing to clear background of store items
     *
     * @public
     */
    this.clearGoodsList = (forWhat) => {
        let goodsAmount = this.goodsTable.querySelectorAll("tr").length;
        while (goodsAmount > 1) {
            this.goodsTable.removeChild(this.goodsTable.lastChild);
            goodsAmount--;
        }
        if (forWhat === "clear background") {
            let storeItem = document.getElementsByClassName("stores__item");
            for (let i = 0; i < storeItem.length; i++) {
                storeItem[i].style.background = "none";
            }
        }

        this.showRightPanel();
    };

    /**
     * Highlight last selected store item after search among stores and reseting search by id, ant set contact info
     *
     * @param {String} id id of store
     * @param {HTMLElement} currentStore HTML element, which need to hightlight
     */
    this.highlightElemAndSetInfo = (id, currentStore) => {
        if (currentStore) {
            currentStore.style.backgroundColor = "#ebebeb";
            this.setContactInfo(id);
        }
    };

    /**
     * Render goods list and set filter info, if it specified in param
     *
     * @param {Object} choosenStore array with goods
     * @param {String} mode string indicated of needing to set filter info
     *
     * @public
     */
    this.renderGoodsList = (choosenStore, mode) => {
        let outOfStock = 0;
        let inStock = 0;
        let inStorage = 0;
        let goodsArray = choosenStore;

        goodsArray.forEach((item) => {
            if (item.Status === "OUT_OF_STOCK") {
                outOfStock++;
            } else if (item.Status === "OK") {
                inStock++;
            } else if (item.Status === "STORAGE") {
                inStorage++;
            }

            let goodsItem = document.createElement("tr");
            goodsItem.className = "goods__list";
            this.goodsTable.append(goodsItem);

            goodsItem.innerHTML = `<td class="goods__item goods__column-name">${item.Name}</td>
            <td class="goods__item goods__column-price">
                <strong>${item.Price}</strong> ${currency}
            </td>
            <td title="${item.Specs}" class="goods__item goods__column-specs text-collaps">
                ${item.Specs}
            </td>
            <td
                title="${item.SupplierInfo}"
                class="goods__item goods__column-supplierinfo text-collaps"
            >
                ${item.SupplierInfo}
            </td>
            <td
                title="${item.MadeIn}"
                class="goods__item goods__column-origin text-collaps"
            >
                ${item.MadeIn}
            </td>
            <td
                title="${item.ProductionCompanyName}"
                class="goods__item goods__column-company text-collaps"
            >
                ${item.ProductionCompanyName}
            </td>
            <td class="goods__item goods__column-rating">
                <div class="goods__raiting-conteiner stars-${item.Rating}"></div>
            </td>
            <td data-id="${item["id"]}" class="goods__item goods__column-delete">&#8855;</td>
            <td data-id="${item["id"]}" class="goods__item goods__column-edit">&#9998;</td>
            <td class="goods__item goods__column-arrow">></td>`;
        });

        if (mode !== "filter") {
            this.setFilterInfo(inStock, inStorage, outOfStock);
        }
    };

    /**
     * Set contact info of store by id
     * @param {String} id store id
     *
     * @private
     */
    this.setContactInfo = (id) => {
        let choosenStore = Stores.filter((store) => {
            if (store.id == id) {
                return true;
            }
        });
        document.getElementById(
            "contactsEmail"
        ).innerHTML = `<strong>Email:</strong> ${choosenStore[0].Email}`;

        document.getElementById(
            "contactsPhone"
        ).innerHTML = `<strong>Phone Number:</strong> ${choosenStore[0].PhoneNumber}`;

        document.getElementById(
            "contactsAddress"
        ).innerHTML = `<strong>Address:</strong> ${choosenStore[0].Address}`;

        document.getElementById(
            "contactsDate"
        ).innerHTML = `<strong>Esteblished Date:</strong> ${choosenStore[0].Established}`;

        document.getElementById(
            "contactsArea"
        ).innerHTML = `<strong>Floor Area:</strong> ${choosenStore[0].FloorArea}`;
    };

    /**
     * Set filter info
     *
     * @param {Number} inStock amount goods in stock
     * @param {Number} inStorage amount goods in storage
     * @param {Number} outOfStock amount goods out of stock
     *
     *@private
     */
    this.setFilterInfo = (inStock, inStorage, outOfStock) => {
        document.getElementById(
            "infoAmount"
        ).innerHTML = `${choosenStore.length}`;

        document.getElementById("infoInStock").innerHTML = `${inStock}`;

        document.getElementById("infoInStrege").innerHTML = `${inStorage}`;

        document.getElementById("outOfStock").innerHTML = `${outOfStock}`;
    };

    /**
     * Show hiden right panel
     *
     * @private
     */
    this.showRightPanel = () => {
        emptyList.style.display = "none";
        filledList.style.display = "block";
        rightFooter.style.display = "block";
    };

    /**
     * Set icons of sort buttons to default
     *
     * @public
     */
    this.resetSearchButtons = () => {
        const sortButtons = this.getSortButtons();
        for (let i = 0; i < sortButtons.length; i++) {
            sortButtons[i].innerHTML = "&#9746;";
        }
        switchSort = 0;
    };

    /**
     * Set icon of current sort buttons in position ascending
     *
     * @public
     */
    this.getSortButtonUp = (elem) => {
        elem.innerHTML = "&#8593;";
    };

    /**
     * Set icon of current sort buttons in position descending
     *
     * @public
     */
    this.getSortButtonDown = (elem) => {
        elem.innerHTML = "&#8595;";
    };

    /**
     * Set icon of current sort buttons in position default
     *
     * @public
     */
    this.getSortButtonDefault = (elem) => {
        elem.innerHTML = "&#9746;";
    };

    /**
     * Clear list of stores in page
     *
     * @public
     */
    this.clearStoreList = () => {
        this.getStoreList().innerHTML = "";
    };

    /**
     * Clear searching store input
     *
     * @public
     */
    this.clearSearchInputStores = () => {
        inputSearchStore.value = "";
    };

    /**
     * Clear searching goods input
     *
     * @public
     */
    this.clearSearchInputGoods = () => {
        inputSearchGoods.value = "";
    };

    /**
     * Show alert window if entered less then 2 simbols in search input
     *
     * @public
     */
    this.inputErrorAlert = () => {
        alert("Для поиска введите 2 и более символа");
    };

    /**
     * Move line under active filter
     *
     * @param {HTMLElement} filter
     *
     * @public
     */
    this.changeFilterActivLine = (filter) => {
        for (let i = 0; i < this.filterUnderline.length; i++) {
            this.filterUnderline[i].classList.remove("filter-active");
        }
        filter.classList.add("filter-active");
    };

    /**
     * Get active sort button
     * @param {String} param condition of sorting from global variable
     * @returns {HTMLElement} HTML element of active sort button
     */
    this.getActiveSortButton = (param) => {
        let sortButtons = Array.from(
            document.querySelectorAll(".goods__button-filter")
        );
        result = sortButtons.filter((item) => {
            if (item.className.search(param) != -1) {
                return true;
            }
        });
        return result[0];
    };

    /**
     * Show form of creating store on page
     *
     * @listens click
     *
     * @param {Event} e the DOM event object
     *
     * @public
     */
    this.showFormCreateStore = (e) => {
        e.preventDefault();
        this.formStore.style.display = "block";
        this.darkMasck.style.display = "block";
    };

    /**
     * Show form of creating new product or edit product, if it speciefied in param, on page
     *
     * @listens click
     *
     * @param {Event} e the DOM event object
     * @param {String} mode
     *
     * @public
     */
    this.showFormCreateGoods = (e, mode) => {
        if (e) {
            e.preventDefault();
        }
        if (mode === "edit") {
            this.headingFormGoods.innerHTML = "Edit product";
        }

        this.formGoods.style.display = "block";
        this.darkMasck.style.display = "block";
    };

    /**
     * Reset and hide forms
     *
     * @listens click
     *
     * @param {Event} e the DOM event object
     *
     * @public
     */
    this.clearForm = (e) => {
        if (e) {
            e.preventDefault();
        }
        editGoods = false;
        this.headingFormGoods.innerHTML = "Create new product";
        this.formStore.style.display = "none";
        this.formStoreBlanck.reset();
        this.darkMasck.style.display = "none";
        this.formGoods.style.display = "none";
        this.formGoodsBlanck.reset();
        let validateList = document.querySelectorAll(".form-store__validate");

        for (let i = 0; i < validateList.length; i++) {
            validateList[i].innerHTML = "";
        }

        let inputForm = document.querySelectorAll(".form-store__input");
        for (let i = 0; i < inputForm.length; i++) {
            inputForm[i].style.border = "1px solid rgb(95, 91, 91)";
        }
    };

    /**
     * Validate form of creating new store
     *
     * @public
     */
    this.validateStoreForm = () => {
        let badName = document.querySelector(".form-store__validate-name");
        let badEmail = document.querySelector(".form-store__validate-email");
        let badPhone = document.querySelector(".form-store__validate-phone");
        let badAddress = document.querySelector(
            ".form-store__validate-address"
        );
        let badEsteblishedDate = document.querySelector(
            ".form-store__validate-date"
        );
        let badFloorArea = document.querySelector(".form-store__validate-area");
        let isGoodName,
            isGoodEmail,
            isGoodPhone,
            isGoodAddress,
            isGoodEsteblishedDate,
            isGoodFloorArea;

        let regExpEmail =
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        let regExpNumbers = /\D/;

        if (!this.inputStoresFormName.value.length) {
            this.inputStoresFormName.style.border = "2px solid red";
            badName.innerHTML = "Enter name";
            isGoodName = false;
        } else {
            this.inputStoresFormName.style.border = "1px solid rgb(95, 91, 91)";
            badName.innerHTML = "";
            isGoodName = true;
        }
        if (!this.inputStoresFormEmail.value.length) {
            this.inputStoresFormEmail.style.border = "2px solid red";
            badEmail.innerHTML = "Enter email";
            isGoodEmail = false;
        } else if (
            !regExpEmail.test(
                String(this.inputStoresFormEmail.value).toLowerCase()
            )
        ) {
            badEmail.innerHTML = "Enter valid email";
            this.inputStoresFormEmail.style.border = "2px solid red";
            isGoodEmail = false;
        } else {
            this.inputStoresFormEmail.style.border =
                "1px solid rgb(95, 91, 91)";
            badEmail.innerHTML = "";
            isGoodEmail = true;
        }
        if (!this.inputStoresFormPhone.value.length) {
            this.inputStoresFormPhone.style.border = "2px solid red";
            badPhone.innerHTML = "Enter phone";
            isGoodPhone = false;
        } else if (regExpNumbers.test(this.inputStoresFormPhone.value)) {
            this.inputStoresFormPhone.style.border = "2px solid red";
            badPhone.innerHTML = "Enter number value";
            isGoodPhone = false;
        } else {
            this.inputStoresFormPhone.style.border =
                "1px solid rgb(95, 91, 91)";
            badPhone.innerHTML = "";
            isGoodPhone = true;
        }
        if (!this.inputStoresFormAddress.value.length) {
            this.inputStoresFormAddress.style.border = "2px solid red";
            badAddress.innerHTML = "Enter address";
            isGoodAddress = false;
        } else {
            this.inputStoresFormAddress.style.border =
                "1px solid rgb(95, 91, 91)";
            badAddress.innerHTML = "";
            isGoodAddress = true;
        }
        if (!this.inputStoresFormDate.value.length) {
            this.inputStoresFormDate.style.border = "2px solid red";
            badEsteblishedDate.innerHTML = "Enter date";
            isGoodEsteblishedDate = false;
        } else {
            this.inputStoresFormDate.style.border = "1px solid rgb(95, 91, 91)";
            badEsteblishedDate.innerHTML = "";
            isGoodEsteblishedDate = true;
        }
        if (!this.inputStoresFormArea.value.length) {
            this.inputStoresFormArea.style.border = "2px solid red";
            badFloorArea.innerHTML = "Enter floor area";
            isGoodFloorArea = false;
        } else if (regExpNumbers.test(this.inputStoresFormArea.value)) {
            this.inputStoresFormArea.style.border = "2px solid red";
            badFloorArea.innerHTML = "Enter number value";
            isGoodFloorArea = false;
        } else {
            this.inputStoresFormArea.style.border = "1px solid rgb(95, 91, 91)";
            badFloorArea.innerHTML = "";
            isGoodFloorArea = true;
        }

        if (
            isGoodName &&
            isGoodEmail &&
            isGoodPhone &&
            isGoodAddress &&
            isGoodEsteblishedDate &&
            isGoodFloorArea
        ) {
            isOk = true;
        } else {
            isOk = false;
        }
    };

    /**
     * Validate form of creating new product
     *
     * @public
     */
    this.validateGoodsForm = () => {
        let badName = document.querySelector(".form-goods__validate-name");
        let badPrice = document.querySelector(".form-goods__validate-price");
        let badSpecs = document.querySelector(".form-goods__validate-specs");
        let badRating = document.querySelector(".form-goods__validate-rating");
        let badSupplierInfo = document.querySelector(
            ".form-goods__validate-supplier"
        );
        let badOrigin = document.querySelector(".form-goods__validate-origin");
        let badCompany = document.querySelector(
            ".form-goods__validate-company"
        );
        let badStatus = document.querySelector(".form-goods__validate-status");

        let isGoodName,
            isGoodPrice,
            isGoodSpecs,
            isGoodRating,
            isGoodSupplierInfo,
            isGoodOrigin,
            isGoodCompany,
            isGoodStatus;

        let regExpNumbers = /\D/;

        if (!this.inputGoodsFormName.value.length) {
            this.inputGoodsFormName.style.border = "2px solid red";
            badName.innerHTML = "Enter name";
            isGoodName = false;
        } else {
            this.inputGoodsFormName.style.border = "1px solid rgb(95, 91, 91)";
            badName.innerHTML = "";
            isGoodName = true;
        }
        if (!this.inputGoodsFormPrice.value.length) {
            this.inputGoodsFormPrice.style.border = "2px solid red";
            badPrice.innerHTML = "Enter price";
            isGoodPrice = false;
        } else if (regExpNumbers.test(this.inputGoodsFormPrice.value)) {
            badPrice.innerHTML = "Enter number value";
            this.inputGoodsFormPrice.style.border = "2px solid red";
            isGoodPrice = false;
        } else {
            this.inputGoodsFormPrice.style.border = "1px solid rgb(95, 91, 91)";
            badPrice.innerHTML = "";
            isGoodPrice = true;
        }
        if (!this.inputGoodsFormSpecs.value.length) {
            this.inputGoodsFormSpecs.style.border = "2px solid red";
            badSpecs.innerHTML = "Enter product specs";
            isGoodSpecs = false;
        } else {
            this.inputGoodsFormSpecs.style.border = "1px solid rgb(95, 91, 91)";
            badSpecs.innerHTML = "";
            isGoodSpecs = true;
        }
        if (!inputGoodsFormRating.value.length) {
            inputGoodsFormRating.style.border = "2px solid red";
            badRating.innerHTML = "Enter raiting";
            isGoodRating = false;
        } else if (regExpNumbers.test(inputGoodsFormRating.value)) {
            badRating.innerHTML = "Enter number value";
            inputGoodsFormRating.style.border = "2px solid red";
            isGoodRating = false;
        } else if (
            inputGoodsFormRating.value < 1 ||
            inputGoodsFormRating.value > 5
        ) {
            badRating.innerHTML = "Enter rating from 1 to 5";
            inputGoodsFormRating.style.border = "2px solid red";
            isGoodRating = false;
        } else {
            inputGoodsFormRating.style.border = "1px solid rgb(95, 91, 91)";
            badRating.innerHTML = "";
            isGoodRating = true;
        }
        if (!this.inputGoodsFormSupplier.value.length) {
            this.inputGoodsFormSupplier.style.border = "2px solid red";
            badSupplierInfo.innerHTML = "Enter supplier info";
            isGoodSupplierInfo = false;
        } else {
            this.inputGoodsFormSupplier.style.border =
                "1px solid rgb(95, 91, 91)";
            badSupplierInfo.innerHTML = "";
            isGoodSupplierInfo = true;
        }
        if (!this.inputGoodsFormOrigin.value.length) {
            this.inputGoodsFormOrigin.style.border = "2px solid red";
            badOrigin.innerHTML = "Enter company origin";
            isGoodOrigin = false;
        } else {
            this.inputGoodsFormOrigin.style.border =
                "1px solid rgb(95, 91, 91)";
            badOrigin.innerHTML = "";
            isGoodOrigin = true;
        }
        if (!this.inputGoodsFormCompany.value.length) {
            this.inputGoodsFormCompany.style.border = "2px solid red";
            badCompany.innerHTML = "Enter manufacturer name";
            isGoodCompany = false;
        } else {
            this.inputGoodsFormCompany.style.border =
                "1px solid rgb(95, 91, 91)";
            badCompany.innerHTML = "";
            isGoodCompany = true;
        }
        if (this.inputGoodsFormStatus.value == "Enter status") {
            this.inputGoodsFormStatus.style.border = "2px solid red";
            badStatus.innerHTML = "Enter status";
            isGoodStatus = false;
        } else {
            this.inputGoodsFormStatus.style.border =
                "1px solid rgb(95, 91, 91)";
            badStatus.innerHTML = "";
            isGoodStatus = true;
        }

        if (
            isGoodName &&
            isGoodPrice &&
            isGoodSpecs &&
            isGoodSupplierInfo &&
            isGoodRating &&
            isGoodOrigin &&
            isGoodCompany &&
            isGoodStatus
        ) {
            isOk = true;
        } else {
            isOk = false;
        }
    };

    /**
     * Get data from input fields from form of creating new store
     *
     * @returns {Object} object with data from form of creating new store
     *
     * @public
     */
    this.getDataFromInputFormStore = () => {
        let data = {
            Name: `${this.inputStoresFormName.value}`,
            Email: `${this.inputStoresFormEmail.value}`,
            PhoneNumber: `${this.inputStoresFormPhone.value}`,
            Address: `${this.inputStoresFormAddress.value}`,
            Established: `${this.inputStoresFormDate.value}`,
            FloorArea: `${this.inputStoresFormArea.value}`,
        };
        return data;
    };

    /**
     * Get data from input fields from form of creating new product
     *
     * @returns {Object} object with data from form of creating new product
     *
     * @public
     */
    this.getDataFromInputFormGoods = () => {
        let data = {
            Name: `${this.inputGoodsFormName.value}`,
            Price: `${this.inputGoodsFormPrice.value}`,
            Specs: `${this.inputGoodsFormSpecs.value}`,
            Rating: `${this.inputGoodsFormRating.value}`,
            SupplierInfo: `${this.inputGoodsFormSupplier.value}`,
            MadeIn: `${this.inputGoodsFormOrigin.value}`,
            ProductionCompanyName: `${this.inputGoodsFormCompany.value}`,
            Status: `${this.inputGoodsFormStatus.value}`,
            StoreId: `${currentStoreId}`,
        };
        return data;
    };

    /**
     *Fill input fields in form of edition product
     *
     * @param {Object} product object with info of editing product
     *
     * @public
     */
    this.fillFormCreateGoods = (product) => {
        this.inputGoodsFormName.value = product.Name;
        this.inputGoodsFormPrice.value = product.Price;
        this.inputGoodsFormSpecs.value = product.Specs;
        this.inputGoodsFormRating.value = product.Rating;
        this.inputGoodsFormSupplier.value = product.SupplierInfo;
        this.inputGoodsFormOrigin.value = product.MadeIn;
        this.inputGoodsFormCompany.value = product.ProductionCompanyName;
        this.inputGoodsFormStatus.value = product.Status;
    };

    /**
     * Asck user to confirm deleting item
     *
     * @param {String} target string with mode, what need to asck from user
     *
     * @returns {Boolean} true if user confirm deleting
     *
     * @public
     */
    this.confirmDelete = (target) => {
        let confirmDelete;
        if (target === "store") {
            confirmDelete = confirm("Do you want to delete current store?");
        } else if (target === "goods") {
            confirmDelete = confirm("Do you want to delete current product?");
        }
        return confirmDelete;
    };

    /**
     * Hide right panel and show epmty page if current store no longer exists
     *
     * @public
     */
    this.showEmptyList = () => {
        emptyList.style.display = "flex";
        filledList.style.display = "none";
        rightFooter.style.display = "none";
    };
}

/**
 * Controller class. Orchestrates the model and view objects. A "glue" between them.
 *
 * @param {View} view view instance.
 * @param {Model} model model instance.
 *
 * @constructor
 */
function Controller(view, model) {
    /**
     * Initialize controller.
     *
     * @public
     */
    this.init = () => {
        const storeList = view.getStoreList();
        const panelWithSortButtons = view.goodsDenomination;
        this.renderStores();
        storeList.addEventListener("click", this.processClickedStore);
        panelWithSortButtons.addEventListener(
            "click",
            this.processSortingGoodsList
        );
        view.buttonGoodsSearch.addEventListener(
            "click",
            this.processSearchingGoods
        );
        view.buttonGoodsResetSearch.addEventListener(
            "click",
            this.clearGoodsSearch
        );
        view.buttonSearch.addEventListener("click", this.processSearchingStore);
        view.buttonResetSearch.addEventListener("click", this.clearSearch);
        view.infoBar.addEventListener("click", this.processFilteringGoods);
        view.buttonCreateStore.addEventListener(
            "click",
            view.showFormCreateStore
        );
        view.buttonDeleteStore.addEventListener("click", this.deleteStore);
        view.buttonCancelFormStore.addEventListener("click", view.clearForm);
        view.buttonSubmitFormStore.addEventListener("click", this.createStore);
        view.buttonSubmitFormGoods.addEventListener("click", this.createGoods);
        view.buttonCancelFormGoods.addEventListener("click", view.clearForm);
        view.buttonCreateGoods.addEventListener(
            "click",
            view.showFormCreateGoods
        );
        view.goodsTable.addEventListener("click", this.deleteGoods);
        view.goodsTable.addEventListener("click", this.editGoods);
    };

    /**
     * Get store items from server and render it on page
     *
     * @private
     */
    this.renderStores = () => {
        let loaderSpin = view.getLoaderSpinStores();
        view.showElem(loaderSpin);
        model.getStoresFromServer().then(() => {
            view.createStoresList(Stores);
            view.hideElem(loaderSpin);
        });
    };

    /**
     * Process click the store item and render list of goods current store
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.processClickedStore = (e) => {
        filteredGoodsForSort = null;
        isActiveFilter = false;
        let storesItem = view.storeItemClassName;
        if (e.target.closest("." + storesItem)) {
            let currentStore = e.target.closest("." + storesItem);
            currentStoreId = currentStore.dataset.id;
            view.clearGoodsList("clear background");
            this.prepareGoodsList(currentStoreId, currentStore).then(() => {
                view.renderGoodsList(choosenStore);
                let loaderSpin = view.getLoaderSpinGoods();
                view.hideElem(loaderSpin);
                view.resetSearchButtons();
            });
        }
    };
    /**
     * Get list of goods from server for clicked store, highlight current store and set contact info
     * @param {String} id store id
     * @param {HTMLElement} currentStore HTML element of current store
     *
     * @returns {Promise} the promise object will be resolved once the goods gets loaded.
     *
     * @private
     */
    this.prepareGoodsList = (id, currentStore) => {
        return new Promise((resolve) => {
            const loaderSpin = view.getLoaderSpinGoods();
            view.showElem(loaderSpin);
            model.getGoodsFromServer(id).then(() => {
                view.highlightElemAndSetInfo(id, currentStore);
                resolve();
            });
        });
    };
    /**
     * Process event of clicking sorting button(sort goods and rerender it on page)
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     */
    this.processSortingGoodsList = (e) => {
        if (e.target.closest("." + view.sortButtonClassName)) {
            let sortButton = e.target.closest("." + view.sortButtonClassName);
            if (activeSort && sortButton.className.search(activeSort) === -1) {
                view.resetSearchButtons();
            }
            let result = model.sortGoodsList(sortButton);
            view.clearGoodsList();
            if (switchSort === 0) {
                view.renderGoodsList(result, "filter");
                view.getSortButtonUp(sortButton);
                switchSort++;
            } else if (switchSort === 1) {
                result.reverse();
                view.renderGoodsList(result, "filter");
                view.getSortButtonDown(sortButton);
                switchSort++;
            } else if (switchSort === 2) {
                view.renderGoodsList(actualArrayOfGoods, "filter");
                view.getSortButtonDefault(sortButton);
                switchSort = 0;
            }
        }
    };
    /**
     * Clear search stores input and rernder stores on page to default
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.clearSearch = (e) => {
        e.preventDefault();
        view.clearStoreList();

        view.createStoresList(Stores, currentStoreId);
        view.clearSearchInputStores();
    };

    /**
     * Search store event handler
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.processSearchingStore = (e) => {
        e.preventDefault();
        let input = view.inputSearchStore.value.toLowerCase();

        if (input.length < 2) {
            view.inputErrorAlert();
            return false;
        }
        let result = model.foundItem(input, Stores, "stores");
        view.clearStoreList();
        view.createStoresList(result, currentStoreId);
    };

    /**
     * Clear search goods input and rernder goods on page to default
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.clearGoodsSearch = (e) => {
        e.preventDefault();
        view.clearGoodsList();
        view.renderGoodsList(choosenStore);
        view.clearSearchInputGoods();
        actualArrayOfGoods = choosenStore;
        view.resetSearchButtons();
        filteredGoodsForSort = null;
        isActiveFilter = false;
    };

    /**
     * Search goods event handler
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.processSearchingGoods = (e) => {
        e.preventDefault();
        let input = view.inputSearchGoods.value.toLowerCase();

        if (input.length < 2) {
            view.inputErrorAlert();
            return false;
        }
        let result = model.foundItem(input, actualArrayOfGoods, "goods");
        if (switchSort !== 0) {
            let sortButton = view.getActiveSortButton(activeSort);
            result = model.sortGoodsList(sortButton);
            view.clearGoodsList();
            if (switchSort === 1) {
                view.renderGoodsList(result);
            } else if (switchSort === 2) {
                result.reverse();
                view.renderGoodsList(result);
            }
            return;
        }
        view.clearGoodsList();
        view.renderGoodsList(result);
        filteredGoodsForSort = null;
        isActiveFilter = false;
    };

    /**
     * Filter goods event handler
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.processFilteringGoods = (e) => {
        let choosenFilter;
        let filteredGoods;

        if (e.target.closest(".js-all-goods")) {
            choosenFilter = e.target.closest(".js-all-goods");
            view.changeFilterActivLine(choosenFilter);
            filteredGoods = choosenStore;
            actualArrayOfGoods = choosenStore;
            isActiveFilter = false;
            filteredGoodsForSort = null;
        } else if (e.target.closest(".js-is-in-stock")) {
            choosenFilter = e.target.closest(".js-is-in-stock");
            view.changeFilterActivLine(choosenFilter);
            filteredGoods = model.filterGoods(choosenFilter);
            isActiveFilter = true;
            filteredGoodsForSort = filteredGoods;
        } else if (e.target.closest(".js-storage")) {
            choosenFilter = e.target.closest(".js-storage");
            view.changeFilterActivLine(choosenFilter);
            filteredGoods = model.filterGoods(choosenFilter);
            isActiveFilter = true;
            filteredGoodsForSort = filteredGoods;
        } else if (e.target.closest(".js-no-in-stock")) {
            choosenFilter = e.target.closest(".js-no-in-stock");
            view.changeFilterActivLine(choosenFilter);
            filteredGoods = model.filterGoods(choosenFilter);
            isActiveFilter = true;
            filteredGoodsForSort = filteredGoods;
        }

        if (switchSort) {
            let sortButton = view.getActiveSortButton(activeSort);
            result = model.sortGoodsList(sortButton, filteredGoods);
            view.clearGoodsList();
            if (switchSort === 1) {
                view.renderGoodsList(result, "filter");
            } else if (switchSort === 2) {
                result.reverse();
                view.renderGoodsList(result, "filter");
            }
            return;
        }

        view.clearGoodsList();
        view.renderGoodsList(filteredGoods, "filter");
    };

    /**
     * Create new store event handler
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.createStore = (e) => {
        e.preventDefault();
        view.validateStoreForm();
        if (!isOk) {
            return false;
        }
        data = view.getDataFromInputFormStore();
        view.clearForm();
        model.postNewStore(data).then(() => {
            view.clearStoreList();
            this.renderStores();
        });
    };

    /**
     * Create new product event handler
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.createGoods = (e) => {
        if (e) {
            e.preventDefault();
        }

        view.validateGoodsForm();

        if (isOk === false) {
            return false;
        }

        data = view.getDataFromInputFormGoods();
        if (editGoods) {
            view.clearForm();
            model.editGoods(data).then(() => {
                view.clearGoodsList();
                const loaderSpin = view.getLoaderSpinGoods();
                view.showElem(loaderSpin);
                model.getGoodsFromServer(currentStoreId).then(() => {
                    view.renderGoodsList(choosenStore);
                    let loaderSpin = view.getLoaderSpinGoods();
                    view.hideElem(loaderSpin);
                    view.resetSearchButtons();
                });
            });
        } else {
            view.clearForm();
            model.postNewGoods(data).then(() => {
                view.clearGoodsList();
                const loaderSpin = view.getLoaderSpinGoods();
                view.showElem(loaderSpin);
                model.getGoodsFromServer(currentStoreId).then(() => {
                    view.renderGoodsList(choosenStore);
                    let loaderSpin = view.getLoaderSpinGoods();
                    view.hideElem(loaderSpin);
                    view.resetSearchButtons();
                });
            });
        }
    };

    /**
     * Edit goods event handler
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.editGoods = (e) => {
        e.preventDefault();
        if (e.target.closest(".goods__column-edit")) {
            let product = e.target.closest(".goods__column-edit");
            editGoods = true;
            urlEditGoods = `http://localhost:3000/api/Stores/${currentStoreId}/rel_Products/${product.dataset.id}`;
            let productInfo = model.getProductInfo(product.dataset.id);
            view.showFormCreateGoods(e, "edit");
            view.fillFormCreateGoods(productInfo);
        }
    };

    /**
     * Delete store event handler
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.deleteStore = (e) => {
        e.preventDefault();
        let isConfirmed = view.confirmDelete("store");
        if (isConfirmed) {
            let url = `http://localhost:3000/api/Stores/${currentStoreId}`;
            model.fetchDeleteItem(url).then(() => {
                view.clearStoreList();
                this.renderStores();
                view.showEmptyList();
            });
        }
    };

    /**
     * Delete product event handler
     *
     * @listens click
     *
     * @param {Event} e the DOM event object.
     *
     * @private
     */
    this.deleteGoods = (e) => {
        e.preventDefault();
        if (e.target.closest(".goods__column-delete")) {
            let confirmDelete = view.confirmDelete("goods");
            if (confirmDelete) {
                let url = `http://localhost:3000/api/Stores/${currentStoreId}/rel_Products/${e.target.dataset.id}`;
                model.fetchDeleteItem(url).then(() => {
                    view.clearGoodsList();
                    const loaderSpin = view.getLoaderSpinGoods();
                    view.showElem(loaderSpin);
                    model.getGoodsFromServer(currentStoreId).then(() => {
                        view.renderGoodsList(choosenStore);
                        view.clearForm();
                        let loaderSpin = view.getLoaderSpinGoods();
                        view.hideElem(loaderSpin);
                        view.resetSearchButtons();
                    });
                });
            }
        }
    };
}

new Controller(new View(), new Model()).init();
