# Asynchronous Operations in JavaScript

## What are Asynchronous Operations?
Asynchronous operations are tasks that start now but finish later, without blocking the rest of the program.

Start first, finish later — and don’t wait.

Synchronous: wait → then continue

Asynchronous: continue → result comes later

---

## What is a Promise in JavaScript?
A Promise is an object that represents a future value — the result of an asynchronous operation that will arrive later.

A Promise does NOT contain the value immediately.

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
                reject("Error: Failed to fetch data");
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
If ANY step fails → jump directly to `.catch()`

---

## Why async and await?
`.then()` chains can become hard to read.

`async/await` is cleaner syntax for working with Promises.

---

## Key Rule
An `async` function ALWAYS returns a Promise.

---

## Example Using async / await
```javascript
const shouldSucceed = true;

// Same Promise-based function
function fetchData() {
    return new Promise((resolve, reject) => {

        setTimeout(() => {

            if (shouldSucceed) {
                resolve("Fetched data");
            } else {
                reject("Error: Failed to fetch data");
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

`await` pauses execution until Promise resolves

async/await = cleaner syntax for Promises
