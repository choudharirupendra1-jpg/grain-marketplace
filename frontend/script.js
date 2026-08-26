// =====================================================
// GRAIN MARKETPLACE - FINAL SCRIPT.JS
// =====================================================


// =====================================================
// CURRENT USER
// =====================================================

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );

}


// =====================================================
// BUY GRAIN - OLD / LOCAL
// =====================================================

function buyGrain(grainName, price, quantityId) {

    const quantityInput =
        document.getElementById(quantityId);

    if (!quantityInput) {

        alert("Quantity field not found.");
        return;

    }

    const quantity =
        Number(quantityInput.value);

    if (!quantity || quantity <= 0) {

        alert("Please enter a valid quantity.");
        return;

    }

    const total =
        quantity * Number(price);

    fetch("http://localhost:3000/api/orders", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            grainName: grainName,

            quantity: quantity,

            price: Number(price),

            total: total,

            buyer:
                getCurrentUser()?.name || "",

            buyerEmail:
                getCurrentUser()?.email || ""

        })

    })

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (data.success && data.order) {

            localStorage.setItem(
                "order",
                JSON.stringify(data.order)
            );

            window.location.href =
                "order.html";

        } else {

            alert(
                data.message ||
                "Order could not be created."
            );

        }

    })

    .catch(function (error) {

        console.log("Order Error:", error);

        alert(
            "Backend connection failed."
        );

    });

}


// =====================================================
// SELL GRAIN
// =====================================================

const sellForm =
    document.getElementById("sellForm");

if (sellForm) {

    sellForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const currentUser =
                getCurrentUser();

            const grainName =
                document
                    .getElementById("grainName")
                    .value
                    .trim();

            const quantity =
                Number(
                    document
                        .getElementById("quantity")
                        .value
                );

            const price =
                Number(
                    document
                        .getElementById("price")
                        .value
                );

            let sellerName =
                document
                    .getElementById("sellerName")
                    .value
                    .trim();


            // If logged-in user exists,
            // use their name automatically.

            if (currentUser) {

                sellerName =
                    currentUser.name;

                document
                    .getElementById("sellerName")
                    .value =
                    currentUser.name;

            }


            if (
                !grainName ||
                quantity <= 0 ||
                price <= 0 ||
                !sellerName
            ) {

                alert(
                    "Please enter valid grain details."
                );

                return;

            }


            const grain = {

                name: grainName,

                quantity: quantity,

                price: price,

                seller: sellerName,

                sellerEmail:
                    currentUser
                        ? currentUser.email
                        : ""

            };


            fetch(
                "http://localhost:3000/api/grains",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(grain)

                }
            )

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                if (data.success) {

                    alert(
                        "Grain Listed Successfully! 🌾"
                    );

                    sellForm.reset();

                    window.location.href =
                        "my-listings.html";

                } else {

                    alert(
                        data.message ||
                        "Failed to list grain."
                    );

                }

            })

            .catch(function (error) {

                console.log(
                    "Sell Error:",
                    error
                );

                alert(
                    "Backend connection failed."
                );

            });

        }
    );

}


// =====================================================
// LOGIN
// =====================================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;


            fetch(
                "http://localhost:3000/api/login",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })

                }
            )

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                alert(data.message);

                if (
                    data.success &&
                    data.user
                ) {

                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(data.user)
                    );

                    window.location.href =
                        "index.html";

                }

            })

            .catch(function (error) {

                console.log(
                    "Login Error:",
                    error
                );

                alert(
                    "Backend connection failed."
                );

            });

        }
    );

}


// =====================================================
// REGISTER
// =====================================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            fetch(
                "http://localhost:3000/api/register",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        password: password

                    })

                }
            )

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                alert(data.message);

                if (data.success) {

                    window.location.href =
                        "login.html";

                }

            })

            .catch(function (error) {

                console.log(
                    "Register Error:",
                    error
                );

                alert(
                    "Backend connection failed."
                );

            });

        }
    );

}


// =====================================================
// BACKEND GRAINS - BUY PAGE
// =====================================================

const backendGrains =
    document.getElementById(
        "backendGrains"
    );

if (backendGrains) {

    fetch(
        "http://localhost:3000/api/grains"
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (grains) {

        backendGrains.innerHTML = "";

        if (!Array.isArray(grains)) {

            backendGrains.innerHTML =
                "<p>Unable to load marketplace.</p>";

            return;

        }


        if (grains.length === 0) {

            backendGrains.innerHTML =
                "<p>No grains listed yet.</p>";

            return;

        }


        grains.forEach(
            function (grain, index) {

                backendGrains.innerHTML += `

                    <div class="grain-card">

                        <h2>${grain.name}</h2>

                        <p>
                            Quantity Available:
                            ${grain.quantity} kg
                        </p>

                        <p>
                            Price:
                            ₹${grain.price} / kg
                        </p>

                        <p>
                            Seller:
                            ${grain.seller}
                        </p>

                        <input
                            type="number"
                            id="backendQuantity${index}"
                            placeholder="Quantity (kg)"
                            min="1"
                            max="${grain.quantity}"
                        >

                        <button
                            onclick="buyBackendGrain(
                                '${grain._id}',
                                '${grain.name}',
                                ${grain.price},
                                'backendQuantity${index}'
                            )"
                        >
                            Buy Now
                        </button>

                    </div>

                `;

            }
        );

    })

    .catch(function (error) {

        console.log(
            "Marketplace Error:",
            error
        );

        backendGrains.innerHTML =
            "<p>Failed to load marketplace.</p>";

    });

}


// =====================================================
// BUY BACKEND GRAIN
// =====================================================

function buyBackendGrain(
    grainId,
    grainName,
    price,
    quantityId
) {

    const quantityInput =
        document.getElementById(
            quantityId
        );

    if (!quantityInput) {

        alert("Quantity field not found.");
        return;

    }

    const quantity =
        Number(quantityInput.value);

    if (!quantity || quantity <= 0) {

        alert(
            "Please enter a valid quantity."
        );

        return;

    }


    const total =
        quantity * Number(price);

    const currentUser =
        getCurrentUser();


    fetch(
        "http://localhost:3000/api/orders",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                grainId:
                    grainId,

                grainName:
                    grainName,

                quantity:
                    quantity,

                price:
                    Number(price),

                total:
                    total,

                buyer:
                    currentUser
                        ? currentUser.name
                        : "",

                buyerEmail:
                    currentUser
                        ? currentUser.email
                        : ""

            })

        }
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (
            data.success &&
            data.order
        ) {

            localStorage.setItem(
                "order",
                JSON.stringify(data.order)
            );

            window.location.href =
                "order.html";

        } else {

            alert(
                data.message ||
                "Order could not be created."
            );

        }

    })

    .catch(function (error) {

        console.log(
            "Buy Error:",
            error
        );

        alert(
            "Backend connection failed."
        );

    });

}


// =====================================================
// SEARCH GRAINS
// =====================================================

const searchGrain =
    document.getElementById(
        "searchGrain"
    );

if (searchGrain) {

    searchGrain.addEventListener(
        "input",
        function () {

            const searchText =
                searchGrain.value
                    .trim()
                    .toLowerCase();


            const grainCards =
                document.querySelectorAll(
                    "#backendGrains .grain-card"
                );


            grainCards.forEach(
                function (card) {

                    const heading =
                        card.querySelector("h2");

                    if (!heading) {
                        return;
                    }

                    const grainName =
                        heading.innerText
                            .trim()
                            .toLowerCase();


                    if (
                        grainName.includes(
                            searchText
                        )
                    ) {

                        card.style.display =
                            "";

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


// =====================================================
// MY LISTED GRAINS
// =====================================================

const myListings =
    document.getElementById(
        "myListings"
    );

if (myListings) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        myListings.innerHTML = `

            <p>
                Please login to see your listings.
            </p>

        `;

    } else {

        fetch(
            "http://localhost:3000/api/grains/my?sellerEmail="
            +
            encodeURIComponent(
                currentUser.email
            )
        )

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            myListings.innerHTML = "";

            if (
                !data.success ||
                !Array.isArray(data.grains)
            ) {

                myListings.innerHTML =
                    "<p>Failed to load listings.</p>";

                return;

            }


            if (data.grains.length === 0) {

                myListings.innerHTML =
                    "<p>You have no listings yet.</p>";

                return;

            }


            data.grains.forEach(
                function (grain) {

                    myListings.innerHTML += `

                        <div class="grain-card">

                            <h2>
                                ${grain.name}
                            </h2>

                            <p>
                                Quantity:
                                ${grain.quantity} kg
                            </p>

                            <p>
                                Price:
                                ₹${grain.price} / kg
                            </p>

                            <p>
                                Seller:
                                ${grain.seller}
                            </p>

                            <button
                                onclick="editBackendGrain(
                                    '${grain._id}',
                                    ${grain.quantity},
                                    ${grain.price}
                                )"
                            >
                                Edit Listing
                            </button>

                            <button
                                onclick="deleteBackendGrain(
                                    '${grain._id}'
                                )"
                            >
                                Delete Listing
                            </button>

                        </div>

                    `;

                }
            );

        })

        .catch(function (error) {

            console.log(
                "My Listings Error:",
                error
            );

            myListings.innerHTML =
                "<p>Failed to load listings.</p>";

        });

    }

}


// =====================================================
// DELETE BACKEND GRAIN
// =====================================================

function deleteBackendGrain(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this grain?"
        );

    if (!confirmDelete) {
        return;
    }


    fetch(
        `http://localhost:3000/api/grains/${id}`,
        {
            method: "DELETE"
        }
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (data.success) {

            alert(
                "Grain deleted successfully! 🗑️"
            );

            location.reload();

        } else {

            alert(
                data.message ||
                "Failed to delete grain."
            );

        }

    })

    .catch(function (error) {

        console.log(
            "Delete Error:",
            error
        );

        alert(
            "Backend connection failed."
        );

    });

}


// =====================================================
// EDIT BACKEND GRAIN
// =====================================================

function editBackendGrain(
    id,
    currentQuantity,
    currentPrice
) {

    let newQuantity =
        prompt(
            "Enter new quantity (kg):",
            currentQuantity
        );

    if (newQuantity === null) {
        return;
    }


    let newPrice =
        prompt(
            "Enter new price per kg:",
            currentPrice
        );

    if (newPrice === null) {
        return;
    }


    newQuantity =
        Number(newQuantity);

    newPrice =
        Number(newPrice);


    if (
        newQuantity <= 0 ||
        newPrice <= 0
    ) {

        alert(
            "Please enter valid quantity and price."
        );

        return;

    }


    fetch(
        `http://localhost:3000/api/grains/${id}`,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                quantity:
                    newQuantity,

                price:
                    newPrice

            })

        }
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (data.success) {

            alert(
                "Grain updated successfully! ✏️"
            );

            location.reload();

        } else {

            alert(
                data.message ||
                "Failed to update grain."
            );

        }

    })

    .catch(function (error) {

        console.log(
            "Edit Error:",
            error
        );

        alert(
            "Backend connection failed."
        );

    });

}


// =====================================================
// ORDER PAGE
// =====================================================

const orderGrain =
    document.getElementById(
        "orderGrain"
    );

if (orderGrain) {

    const order =
        JSON.parse(
            localStorage.getItem("order")
        );


    if (order) {

        document.getElementById(
            "orderGrain"
        ).innerText =
            "🌾 " +
            order.grainName;


        document.getElementById(
            "orderQuantity"
        ).innerText =
            "📦 Quantity: " +
            order.quantity +
            " kg";


        document.getElementById(
            "orderPrice"
        ).innerText =
            "💰 Price: ₹" +
            order.price +
            " / kg";


        document.getElementById(
            "orderTotal"
        ).innerText =
            "Total Amount: ₹" +
            order.total;

    } else {

        orderGrain.innerText =
            "No order found.";

    }

}


// =====================================================
// CONFIRM ORDER
// =====================================================

function confirmOrder() {

    const order =
        JSON.parse(
            localStorage.getItem("order")
        );


    if (!order) {

        alert("No order found.");

        return;

    }


    fetch(
        `http://localhost:3000/api/orders/${order._id}/confirm`,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            }

        }
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (data.success) {

            alert(data.message);

            localStorage.removeItem(
                "order"
            );

            window.location.href =
                "index.html";

        } else {

            alert(
                data.message ||
                "Failed to confirm order."
            );

        }

    })

    .catch(function (error) {

        console.log(
            "Confirm Error:",
            error
        );

        alert(
            "Backend connection failed."
        );

    });

}


// =====================================================
// CANCEL ORDER
// =====================================================

function cancelOrder() {

    const order =
        JSON.parse(
            localStorage.getItem("order")
        );


    if (!order) {

        alert("No order found.");

        return;

    }


    fetch(
        `http://localhost:3000/api/orders/${order._id}/cancel`,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            }

        }
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (data.success) {

            alert(data.message);

            localStorage.removeItem(
                "order"
            );

            window.location.href =
                "buy.html";

        } else {

            alert(
                data.message ||
                "Failed to cancel order."
            );

        }

    })

    .catch(function (error) {

        console.log(
            "Cancel Error:",
            error
        );

        alert(
            "Backend connection failed."
        );

    });

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    localStorage.removeItem(
        "order"
    );

    alert(
        "Logged out successfully!"
    );

    window.location.href =
        "index.html";

}


// =====================================================
// SHOW CURRENT USER
// =====================================================

const currentUserName =
    document.getElementById(
        "currentUserName"
    );

if (currentUserName) {

    const currentUser =
        getCurrentUser();

    if (currentUser) {

        currentUserName.innerText =
            currentUser.name;

    }

}


// =====================================================
// BUYER ORDER HISTORY
// =====================================================

const buyerOrders =
    document.getElementById(
        "buyerOrders"
    );

if (buyerOrders) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        buyerOrders.innerHTML =
            "<p>Please login first.</p>";

    } else {

        fetch(
            "http://localhost:3000/api/orders/buyer/"
            +
            encodeURIComponent(
                currentUser.email
            )
        )

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            buyerOrders.innerHTML = "";


            if (
                !data.success ||
                !Array.isArray(data.orders)
            ) {

                buyerOrders.innerHTML =
                    "<p>Failed to load orders.</p>";

                return;

            }


            if (data.orders.length === 0) {

                buyerOrders.innerHTML =
                    "<p>No orders found.</p>";

                return;

            }


            data.orders.forEach(
                function (order) {

                    buyerOrders.innerHTML += `

                        <div class="grain-card">

                            <h2>
                                🌾 ${order.grainName}
                            </h2>

                            <p>
                                Quantity:
                                ${order.quantity} kg
                            </p>

                            <p>
                                Price:
                                ₹${order.price} / kg
                            </p>

                            <p>
                                Total:
                                ₹${order.total}
                            </p>

                            <p>
                                Seller:
                                ${order.seller || "N/A"}
                            </p>

                            <p>
                                Status:
                                ${order.status}
                            </p>

                        </div>

                    `;

                }
            );

        })

        .catch(function (error) {

            console.log(
                "Buyer Orders Error:",
                error
            );

            buyerOrders.innerHTML =
                "<p>Failed to load orders.</p>";

        });

    }

}


// =====================================================
// SELLER ORDER LIST
// =====================================================

const sellerOrders =
    document.getElementById(
        "sellerOrders"
    );

if (sellerOrders) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        sellerOrders.innerHTML =
            "<p>Please login first.</p>";

    } else {

        fetch(
            "http://localhost:3000/api/orders/seller/"
            +
            encodeURIComponent(
                currentUser.email
            )
        )

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            sellerOrders.innerHTML = "";


            if (
                !data.success ||
                !Array.isArray(data.orders)
            ) {

                sellerOrders.innerHTML =
                    "<p>Failed to load seller orders.</p>";

                return;

            }


            if (data.orders.length === 0) {

                sellerOrders.innerHTML =
                    "<p>No orders received yet.</p>";

                return;

            }


            data.orders.forEach(
                function (order) {

                    sellerOrders.innerHTML += `

                        <div class="grain-card">

                            <h2>
                                🌾 ${order.grainName}
                            </h2>

                            <p>
                                Quantity Sold:
                                ${order.quantity} kg
                            </p>

                            <p>
                                Price:
                                ₹${order.price} / kg
                            </p>

                            <p>
                                Total:
                                ₹${order.total}
                            </p>

                            <p>
                                Buyer:
                                ${order.buyer || "N/A"}
                            </p>

                            <p>
                                Buyer Email:
                                ${order.buyerEmail || "N/A"}
                            </p>

                            <p>
                                Status:
                                ${order.status}
                            </p>

                        </div>

                    `;

                }
            );

        })

        .catch(function (error) {

            console.log(
                "Seller Orders Error:",
                error
            );

            sellerOrders.innerHTML =
                "<p>Failed to load seller orders.</p>";

        });

    }

}