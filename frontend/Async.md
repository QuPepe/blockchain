# Asynchronous Operations in JavaScript

## Synchronous vs. Asynchronous Operations

**Synchronous operations** execute in sequence. Each operation must finish before the next one can begin.

**Asynchronous operations** allow a program to start a task and continue executing other code while waiting for the task to complete. Once the task finishes, its result can be handled.

For example, when fetching data from a server, the program does not need to stop and wait for the response. It can continue executing other code and process the fetched data when it becomes available.

**Key difference:**

- **Synchronous:** Start a task → Wait for it to finish → Continue executing code.
- **Asynchronous:** Start a task → Continue executing other code → Handle the result when it is ready.

In JavaScript, asynchronous operations are commonly handled using **Promises** and **async/await**.

---
## What is a Promise in JavaScript?
A Promise is an object that represents a future value — the result of an asynchronous operation that will arrive later.

A Promise may be pending at first; its result becomes available when it settles.

---

## States of a Promise
A Promise can be in one of three states:

- `Pending`: still running
- `Fulfilled`: succeeded
- `Rejected`: failed

---
## Creating a Promise
```javascript
// Create a Promise object
let myPromise = new Promise((resolve, reject) => {
  // Simulate async task (e.g., API call)
  setTimeout(() => {

    const success = true; // Change to false to test failure

    if (success) {
      // ✅ Task succeeded → resolve with value
      resolve("Operation succeeded!");
    } else {
      // ❌ Task failed → reject with error
      reject("Operation failed!");
    }

  }, 3000); // Delay 3 seconds
});
```

---
## Consuming a Promise
```javascript
myPromise
  .then(result => {
    // Runs when Promise is fulfilled
    console.log(result); // "Operation succeeded!"
  })
  .catch(error => {
    // Runs when Promise is rejected
    console.log(error); // "Operation failed!"
  });
```

---
## Promise Chaining
```javascript
const shouldSucceed = true;

// Function that returns a Promise
function fetchData() {
    return new Promise((resolve, reject) => {

        // Simulate async operation
        setTimeout(() => {

            if (shouldSucceed) {
                // ✅ Resolve with data
                resolve("Fetched data");
            } else {
                // ❌ Reject with error
                reject("Failed to fetch data");
            }

        }, 3000);
    });
}

// Normal (synchronous) function
function processFetchedData(data) {
    return `${data} - Processed`;
}

// Chain multiple steps
fetchData()
    .then(fetchedData => {
        // Step 1: Handle fetched data
        console.log(fetchedData);

        // The returned value is passed to the next .then()
        return processFetchedData(fetchedData);
    })
    .then(processedData => {
        // Step 2: Receive processed data
        console.log(processedData);
    })
    .catch(error => {
        // If ANY step fails → jump here
        console.error("Error:", error);
    });
```

👉 Rule:
If a Promise is rejected or a step throws an error → the chain goes to `.catch()`.

---
## Why async and await?
`.then()` chains can become hard to read.

`async/await` is cleaner syntax for working with Promises.

---

## Key Rules
- An `async` function **always returns a Promise**, even if it returns a regular value.
- If you use `await` **inside a function**, that function must be declared `async`. (Exception: `await` can also be used at the top level of a JavaScript module.)

---
## Async / Await
```javascript
const shouldSucceed = true;

// Same Promise-based function
function fetchData() {
    return new Promise((resolve, reject) => {

        setTimeout(() => {

            if (shouldSucceed) {
                resolve("Fetched data");
            } else {
                reject("Failed to fetch data");
            }

        }, 3000);
    });
}

// Synchronous processing function
function processFetchedData(data) {
    return `${data} - Processed`;
}
// async function ALWAYS returns a Promise
async function fetchDataAndProcess() {
    try {
        // ⏳ Wait for Promise to resolve
        const fetchedData = await fetchData();
        console.log(fetchedData);

        // Continue like normal synchronous code
        const processedData = processFetchedData(fetchedData);
        console.log(processedData);

    } catch (error) {
        // Handle error (same as .catch())
        console.error("Error:", error);
    }
}

// Run the async function
fetchDataAndProcess();
```

---
## Summary

Promise = object representing a future value

States:
- Pending
- Fulfilled
- Rejected

`.then()` → handle success

`.catch()` → handle error

`async` always returns a Promise

A function using `await` must be `async` (except top-level `await` in modules)

`await` pauses the current async function until the Promise settles

async/await = cleaner syntax for Promises

---

## References
+ [JavaScript: Promise](https://javascript.info/promise-basics)
+ [JavaScript: Async/await](https://javascript.info/async-await)
