# Understanding Gradescope Feedback CSSE2002

When you have submitted your assignment to Gradescope, you will receive
feedback on you work. If you submit before the due date you will receive
some "pre-checks" on you assigment. Full feedback will be available at the time of grade release.

## Before Due Date
Before the due date of the assignment, submitting your assignment to Gradescope
will allow you to receive "pre-checks" on your submitted code.

![](../_static/images/gradescope-student-precheck-view.png)   

These checks are:  
* Compilation - checks if your program compiles, if not, give the compilation
  error output explaining why your code failed to compile.  
    ![](../_static/images/gradescope-student-precheck-compilation.png)  
    
    
* Conformance - checks if your program conforms to the provided specification.  
    ![](../_static/images/gradescope-student-precheck-conformance.png)


* Functionality - a small number of selected functionality tests may be provided
  for you to see the functionality of your program. These tests are a subset
  of the full suite of tests used to mark your assignment's functionality.
    ![](../_static/images/gradescope-student-precheck-functionality.png)


* JUnit Test Compilation - checks if your provided JUnit tests compile with our solution.
  If your tests do not compile with our solution then you will receive 0 marks for 
  the JUnit section of the assignment  
    ![](../_static/images/gradescope-student-precheck-junit.png)


* Style - automatically checks your program for style violations. These violations will be 
  deducted from your total style marks.
    ![](../_static/images/gradescope-student-precheck-style.png)



## Assignment Feedback
When the assignment grades are published you will be able to view you final grades and feedback.
The screen will be similar to the feedback explained above, except there will be three main differences.

![](../_static/images/gradescope-student-final-view.png)

* Full Functionality - You will be able to see the results from all the functionality tests for the assignment
and whether you passed or failed each test.


* JUnit Results - You will be able to see the results from your tests. Your tests are run against the solution to
the assignment and a number of faulty solutions. Your mark is determined by the number of faulty solutions 
that pass **fewer** of your tests than are passed by the actual solution. The name
in parentheses tells you which of your test classes that faulty solution was accessing,
along with a brief identifier for the faulty solution.
    ![](../_static/images/gradescope-student-final-junit.png) 
    
    
* Style Feedback - You can view your full style feedback by navigating to the "Code"
tab on the results page.  
    ![](../_static/images/gradescope-student-final-navigation.png)  
    This will show you your manual style grade. To see detailed feedback, click on the question name in green
    (in this case, "Manual Style") which will expand to show the grading rubric and deductions.
    Files with comments will have a speech box containing the number of comments in that file. To view the
    comments, click on the file name to expand it.
    ![](../_static/images/gradescope-student-final-style.png)
    