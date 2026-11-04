# Asynchronous Code

Asynchronous lines, like:

    setTimeout()

    fetch()

    async

    Promise.then()

    event listeners

…are not executed immediately in the same step. Instead, they’re deferred, often pushed to:

    The microtask queue (e.g., .then(), await)

    The macrotask queue (e.g., setTimeout, I/O)

These deferred tasks only run after the synchronous code and the current call stack is empty.

```javascript
function run() {
  console.log("1"); // sync

  setTimeout(() => console.log("2"), 0); // async (macrotask)

  Promise.resolve().then(() => console.log("3")); // async (microtask)

  console.log("4"); // sync
}

run();
```

What will the output be?

Asynchronous lines are deferred, so they don’t block the synchronous ones — but how they're deferred (microtask vs. macrotask) affects when they run afterward.

Want a quick memory trick?

"Sync first, microtask next, macrotask last."
