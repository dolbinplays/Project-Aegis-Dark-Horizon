# Objective-Based Team Distance Sorting

Build: v0.26.09.24.0001_OBJECTIVE_TEAM_DISTANCE_SORT_PATCH

Selecting an objective card on the assignment board sorts teams nearest-first using direct hex distance from each active leader, falling back to the first positioned active member. Equal distances preserve original order; teams without a valid position appear last. The selected card is highlighted and exposes aria-pressed. Cards are native buttons for mouse, touch and keyboard use. Team distances and a reset button appear above/in the list. Sorting does not change assignment choices, assist ownership or VIP Priority Lock. A new board prompt clears the selection; removed objectives revert to original order.

Four new tests cover stable/non-mutating sorting, leader/fallback positions, missing coordinates, actual rendered card callbacks and assignment callbacks after reorder, reset/reopen/removal, and refreshed positions. These plus optional soldier recovery and civilian emergency aid tests pass: 28 total. Packaged runtime identity, build seams, embedded JavaScript syntax and whitespace checks pass. Live desktop/mobile visual acceptance remains pending. The full historical suite was not rerun for this presentation change.

The prior medical release commit omitted canonical source and tests while including its packaged runtime. Recovered source from the old E: project folder matched the committed release SHA-256 exactly: 51ac2790724041bf1697b82c4f6acf05500d1efbab087954718b1d8ae47cb57a. Its source, manifest and tests were restored before applying sorting, preserving the previously shipped medical features.
