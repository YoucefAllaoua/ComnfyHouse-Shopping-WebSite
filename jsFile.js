// #####################################
// #####################################
// #####################################
// #####################################
// #####################################
//  declaration part
const products_container = document.querySelector(".products-box");
const navBarBtn = document.querySelector(".container  .nav-bar i ");
const navBar = document.querySelector(".nav-bar ul");
const cartPrductsContainer = document.querySelector(".cart-content .elements");
const cartBtns = [...document.querySelectorAll(".carte-btn")];
const cartBtn = document.querySelector(".carte-btnIcon");

const cartContainer = document.querySelector(".cart-container");
const cartContent = document.querySelector(".cart-content");

const exitCart = document.querySelector(".exit");
const header = document.querySelector("header");
const shopBtn = document.querySelector(".shop");
let totalPrice = document.querySelector(".total-price");
// products cart that contains the ids of products in the cart
let card = [];

// #####################################
// #####################################
// #####################################
// #####################################
// #####################################

// #####################################
// #####################################
// #####################################
// #####################################
// #####################################
// set the carsContent from the local storage
cartPrductsContainer.innerHTML = localStorage.getItem("cardContent") || "";
// set the card content from the local storage
if (localStorage.getItem("card")) {
	card = JSON.parse(localStorage.getItem("card")).map((ele) => {
		return +ele;
	});
}
// set the notification content from the local storage
cartBtn.setAttribute("data-before", localStorage.getItem("notification") || "0");
// set the total price from the local storage
totalPrice.innerText = localStorage.getItem("total") || 0;
// fonctionality part

// navbar part
navBarBtn.addEventListener("click", (e) => {
	e.preventDefault();
	navBar.classList.toggle("shown");
	header.classList.add("clicked");
});

// get products class
class products {
	async getProducts() {
		try {
			let result = await fetch("/products.json");

			// get the json data

			let data = await result.json();

			// json file items are really complicated so let`s make measy items

			let products = data.items;
			products = products.map((ele) => {
				// get the variabls by distruction

				const { title, price } = ele.fields;
				const { id } = ele.sys;
				const { url: image } = ele.fields.image.fields.file;
				return { title, price, image, id };
			});
			return products;
		} catch (error) {
			console.log(error);
		}
	}
}

// class to maddd the elements to domContent

class ui {
	async getProducts(products) {
		let result = ``;
		// add the html content of each element to the result
		products.forEach((ele) => {
			result += ` <div class="product">
                <div class="image">
                    <img src=${ele.image} alt="">

                    <div class="side" id=${ele.id}>
                        <span>Add to Cart</span>
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>
                </div>
                <div class="infos">
                    <h3 class="name">${ele.title}</h3>
                    <span class="price">
					${ele.price} $
                    </span>
                </div>
            </div>`;
		});
		// add the nw html code to the products code
		products_container.innerHTML = result;
	}
	// method to get the all btns
	static getAllBtnsFunction() {
		let btns = document.querySelectorAll(".side");

		// btns onclick function
		btns.forEach((ele) => {
			ele.addEventListener("click", () => {
				// check if the element is already in the cart
				let exist = false;
				let id = card.find((element) => element == ele.getAttribute("id"));
				if (!id) {
					// change the btn text content
					updateBtnText(ele, "In Cart");
					card.push(ele.getAttribute("id"));
					// add the card idies content to the local storage
					localStorage.setItem("card", JSON.stringify(card));
				} else {
					exist = true;
				}

				if (!exist) {
					// get the parent of the product
					let id = ele.getAttribute("id");
					let elements = new products();
					elements.getProducts().then((items) => {
						// return  the clicked element
						let clickedElement = items.find((ele) => {
							return ele.id == id;
							// add the element to the cart
						});
						let currentCardsElements = cartPrductsContainer.innerHTML;
						currentCardsElements += `<div class="element" data-id=${ele.getAttribute("id")}>
                    <div class="infos">
                        <img src=${clickedElement.image} alt="">
                        <div class="content">
                            <h3 class="name">${clickedElement.title}</h3>
                            <span class="price">$ ${clickedElement.price}</span>
                            <small class="remove">remove</small>
                        </div>
                    </div>
                    <div class="counter">
                      <i class="fa-solid fa-angle-up fa-2x "></i>
                      <span class="number">1</span>
                      <i class="fa-solid fa-angle-down fa-2x "></i>
                    </div>
                </div>`;
						cartPrductsContainer.innerHTML = currentCardsElements;
						updateTotal();
						// save the cart content in the local storage
						localStorage.setItem("cardContent", currentCardsElements);
						// change the notification number
						let notificationContent = cartBtn.getAttribute("data-before");
						notificationContent++;
						cartBtn.setAttribute("data-before", notificationContent);
						// save the notification content in the local storage
						localStorage.setItem("notification", notificationContent);
					});
				}
				updateTotal();
			});

			// check if the btn is already clicked to change the content to in Cart
			if (card.find((id) => id == ele.getAttribute("id"))) {
				updateBtnText(ele, "In Cart");
			}
		});
	}
}

// intense for the products class

let product = new products();
let uiIntense = new ui();
document.addEventListener("DOMContentLoaded", () => {
	product
		.getProducts()
		.then((products) => {
			uiIntense.getProducts(products);
			ui.getAllBtnsFunction();
		})
		.catch((products_container.innerHTML = "Ooops !"));
});

// cart show and hide

//  // show it

cartBtns.forEach((ele) => {
	ele.addEventListener("click", (event) => {
		event.preventDefault();
		// hide the navbar when the cart is shown
		navBar.classList.remove("shown");
		cartContainer.classList.add("shown");
		header.classList.add("clicked");
	});
});

//  // hide it

exitCart.addEventListener("click", (event) => {
	event.preventDefault();
	// that setTimeout function is just for ux stuff(good ux experiance)
	setTimeout(function () {
		header.classList.remove("clicked");
	}, 500);
	cartContainer.classList.remove("shown");
});

// increase and decrease the elements number by clicking the btns

cartContent.addEventListener("click", (e) => {
	// change the notification number

	if (e.target.classList.contains("fa-angle-up")) {
		e.target.parentNode.querySelector(".number").innerText++;
		updateNotification("+", 1);
	} else if (e.target.classList.contains("fa-angle-down") && e.target.parentNode.querySelector(".number").innerText != 1) {
		e.target.parentNode.querySelector(".number").innerText--;
		updateNotification("-", 1);
	}

	// save the cart content in the local storage
	localStorage.setItem("cardContent", cartPrductsContainer.innerHTML);
	// update the total
	updateTotal();
});

// remove elements from the cart

cartContent.addEventListener("click", (e) => {
	if (e.target.classList.contains("remove")) {
		const parentElement = e.target.parentNode.parentNode.parentNode;
		// remove the element from the card idies content
		let id = parentElement.getAttribute("data-id");
		card.splice(card.indexOf(id), 1);
		// add the card idies content to the local storage
		localStorage.setItem("card", JSON.stringify(card));
		// remove the element from the dom
		parentElement.remove();
		// update the notification content
		let updateNumber = +parentElement.querySelector(".number").innerText;
		updateNotification("-", updateNumber);
		// update the card cotent in the local storage
		localStorage.setItem("cardContent", cartPrductsContainer.innerHTML);
		// update the Btn cintent to add To cart
		let btn = document.getElementById(`${id}`);
		updateBtnText(
			btn,
			`<span>Add to Cart</span>
                        <i class="fa-solid fa-cart-shopping"></i>`
		);
	}
	updateTotal();
});

// clear the card function

cartContent.addEventListener("click", (e) => {
	if (e.target.classList.contains("clear-cart")) {
		cartPrductsContainer.innerHTML = "";
		// change the card content in the local storage
		localStorage.setItem("cardContent", cartPrductsContainer.innerHTML);
		// change the card table
		card = [];
		// change the card table in the local storage
		localStorage.setItem("card", JSON.stringify([]));
		// change the notification
		updateNotification("reset", 1);
		// update the value of the all values
		let btns = [...document.querySelectorAll(".side")];
		btns.forEach((ele) => {
			updateBtnText(
				ele,
				`<span>Add to Cart</span>
                        <i class="fa-solid fa-cart-shopping"></i>`
			);
		});
		updateTotal();
	}
});

// #####################################
// #####################################
// #####################################
// #####################################
// #####################################

// #####################################
// #####################################
// #####################################
// #####################################
// #####################################

// functions part

// update btn function

function updateBtnText(btn, message) {
	btn.innerHTML = message;
}

// function to update the notification content

function updateNotification(operation, number) {
	let notificationContent = cartBtn.getAttribute("data-before");
	for (let i = 0; i < number; i++) {
		if (operation == "+") {
			notificationContent++;
		} else if (operation == "-") {
			notificationContent--;
		} else {
			notificationContent = 0;
		}
	}
	cartBtn.setAttribute("data-before", notificationContent);
	// save the notification content in the local storage
	localStorage.setItem("notification", notificationContent);
}

// function to update the total value of the bill

function updateTotal() {
	let total = 0;
	let elementsInCart = [...cartContainer.querySelectorAll(".element")];
	if (elementsInCart) {
		total += elementsInCart.reduce((acc, current) => {
			let numberOfProducts = +current.querySelector(".number").innerText;
			let elementPrice = +current.querySelector(".price").innerText.slice(2);
			return acc + numberOfProducts * elementPrice;
		}, 0);
	}
	totalPrice.innerText = total.toFixed(2);
	// save the total in the local storage
	localStorage.setItem("total", total);
}

// #####################################
// #####################################
// #####################################
// #####################################
// #####################################
