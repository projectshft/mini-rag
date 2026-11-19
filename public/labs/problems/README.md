# Interview problems

One folder per pattern. Each problem is one file with a function to fill in,
and a test file next to it with a few tests you can see.

- `frequency/`            counting with an object or a Set
- `two-pointers/`         one pointer at each end
- `sliding-window/`       a window that grows and shrinks
- `stack/`                last in, first out
- `recursion/`            functions that call themselves
- `binary-search/`        halving a sorted list
- `linked-lists/`         chains of nodes
- `trees/`                nodes with a left and a right
- `intervals/`            start and end pairs
- `backtracking/`         try a choice, undo it, try the next
- `greedy/`               the best move right now
- `graphs/`               breadth-first and depth-first search
- `dynamic-programming/`  remember answers to smaller questions

Work on one folder when its lesson comes up. Inside a folder:

    node --test

runs every test there. `node --test same-letters.test.js` runs one file.

Write these by hand. No agent. Our hidden tests check empty input, one item,
repeats, negative numbers and very large inputs, so the slow answer will not
pass.
