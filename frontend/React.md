# React Hooks

## What is a Functional Component?

A functional component is a JavaScript function that returns JSX describing the UI.

```javascript
function Hello() {
  return <h1>Hello React</h1>;
}
```

👉 When React runs this function, it returns JSX, which React uses to update the screen.

---

## What are Hooks?

Hooks are special React functions that let functional components use features such as state and side effects.

---

## useState

### Purpose

`useState` lets you store and update state inside a functional component.

### Syntax

```javascript
const [state, setState] = useState(initialValue);
```

- state → current state value
- setState → state setter function used to update the state value

### Example

```javascript
import { useState } from 'react';

function Count() {
  // Create a state variable
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>

      {/*
        Clicking this button:
        → calls setCount
        → schedules a state update (may be batched)
        → triggers a re-render
      */}
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}

export default Count;
```

---

## useEffect

### Purpose

`useEffect` is used for side effects (something that happens outside rendering), for example:

- Logging
- API calls
- Timers
- Event listeners

---

## Dependency Array

```javascript
useEffect(() => {
  // effect logic
}, [dependencies]);
```

- [] → runs once after mount
- [count] → runs when count changes
- no array → runs after every render

---

## Example: Side Effect Triggered by State Change

```javascript
import { useState, useEffect } from 'react';

function LogCountChange() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ✅ Runs AFTER re-render → sees UPDATED value
    console.log("After re-render (new value):", count);
  }, [count]);

  return (
    <div>
      <p>{count}</p>

      <button
        onClick={() => {
          // 👇 Current render value
          console.log("Before update:", count);

          // 👇 Schedule state update (NOT immediate)
          setCount(count + 1);

          // ⚠️ Still old value (same render)
          console.log("Still old (same render):", count);
        }}
      >
        Increase
      </button>
    </div>
  );
}

export default LogCountChange;
```

---

## React Update Flow

Calling a state setter (e.g., `setState` or `setCount`) does NOT immediately update the UI.

React will:

1. schedule state updates (may be batched)
2. re-render the component (state is updated here)
3. then `useEffect` runs

Multiple state updates may be batched together, resulting in a single re-render.

State is updated when React re-renders the component, not when `setState` is called.

👉 `setState` → schedule state updates (may be batched) → re-render (state is updated here) → then `useEffect` runs

---

## Summary

| Hook        | Purpose             |
|-------------|---------------------|
| `useState`    | Manage state        |
| `useEffect`   | Handle side effects |

With Hooks, functional components can manage state and side effects.
