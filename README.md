## Drag-n-drop calendar test

After some experimentation, I decided against using Redux for this version. I already had a state management system that tracked data via a simple javascript object.  It prevented behind-the-scenes Redux methods that metastasised into more disturbances than controlled logic.  

#### Functions yet-to-be added:

• push up/push down indicator -- dragging an event to an occupied time cell can push the existing events up or down, depending on screen position of the "dragger" object.  This is not clear to the user; a small arrow indicator that pops up when entering a new cell should be helpful.

• save-and-upload -- store calendar modifications to backend Rails-managed database (once linked with existing master project)

• undo/redo functionality -- allow for time-travel functionality
