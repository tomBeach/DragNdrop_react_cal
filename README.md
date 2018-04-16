## Drag-n-drop calendar test

This is a test app for drag-n-drop functionailty -- a proof-of-concept demo for the ForestSAT abstract submission tool developed for NASA/UMD.  Instructions and user feedback when dragging are missing at this point.  (For example, session events must be selected by clicking, then dragged with a second click-n-drag.  Also, dragged events can be positioned "above" or "below" targeted timeslots, depending on the entry point at the target cell.  This is not obvious without the feedback tooltip.   

Also, after some experimentation I decided against using Redux for this version. I already had a state management system that tracked data via a simple javascript object.  It prevented behind-the-scenes Redux methods that metastasized into more disturbances than controlled logic.  

#### Functions yet-to-be added:

• push up/push down indicator -- dragging an event to an occupied time cell can push the existing events up or down, depending on screen position of the "dragger" object.  This is not clear to the user; a small arrow indicator that pops up when entering a new cell should be helpful.

• save-and-upload -- store calendar modifications to backend Rails-managed database (once linked with existing master project)

• undo/redo functionality -- allow for time-travel functionality
