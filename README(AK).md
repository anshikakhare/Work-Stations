How to run project:
-Ensure all project files are in the same directory.
-Copy file path for index.html and paste into web browser or use the command line to open the file using the command 
'open //insert-file-path'
-As long as the server is running fine, the data should populate on the webpage

Takeaways:
-This project was pretty interesting because it was calling data from multiple API's but it had a common id, to bridge the data, reminiscent to a SQL Join. 
-Creating the logic for merging the data between the APIs at the common UUID was fairly simple, but where I ran into difficulty was actually formatting the data onto the webpage, where I needed to create different divs to be able to format the CSS. 
-Another issue I ran into was getting the progress bar to show the elapsed time with the limit being the Cycle Time. My issue was coming more from the CSS side of things, where it wa displaying two bars above each other rather than the bar filling in the elapsed time in the Cycle Time. 

-An issue I was encountering was when parsing the data into the boxes, based on the common ID between the two APIs, because the code would break when there was no image available for Assembly C since there was no currentProduct. To resolve this, in the merge function I matched on ID, and if there was no matching ID(no product), to parse only the Name. This allowed me to still populate the box with the header 'Assembly C'. When actually parsing the data into the boxes, if there was no ID, then it would write No product to the box, rather than trying to parse null data.
-I also found it interesting how the time was given in milliseconds, so there were Math functions that needed to be done, to turn the time into 12 hr format. 
